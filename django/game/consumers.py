from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from urllib import parse
from .models import Game
from .engine import GameEngine
import json

import time

games = {}

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game = None
        self.qs = parse.parse_qs(self.scope['query_string'])
        self.user = await self.get_user()
        self.channel_layer = get_channel_layer()
        self.game = await self.get_game()

        if self.game is None:
            await self.close()
            return

        self.player1 = await sync_to_async(lambda: self.game.player1)()
        self.player2 = await sync_to_async(lambda: self.game.player2)()

        self.player = None
        if self.user and self.user.user_id == self.player1.user_id:
            self.paddle = "paddleOne"
            self.opponentPaddle = "paddleTwo"
            self.player = self.player1
            self.opponent = self.player2
        elif self.user and self.user.user_id == self.player2.user_id:
            self.paddle = "paddleTwo"
            self.opponentPaddle = "paddleOne"
            self.player = self.player2
            self.opponent = self.player1

        if await sync_to_async(lambda: self.game.winner)():
            await self.close()
            return

        self.group_name = f"game_{self.game.id}"

        # subscribe to game group
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        if self.player is None:
            await self.accept()
            return

        if self.game.id not in games:
            games[self.game.id] = {
                "engine": GameEngine(self.group_name),
                "clients_nb": 1,
                "paddleOne": False,
                "paddleTwo": False,
            }
        else:
            games[self.game.id]["clients_nb"] += 1

        games[self.game.id][self.paddle] = True
        if games[self.game.id][self.paddle] and games[self.game.id][self.opponentPaddle]:
            games[self.game.id]["engine"].start()

        await self.accept()

    async def disconnect(self, close_code):
        if self.game is None:
            return
        if not (self.game.id in games):
            return

        await self.channel_layer.group_discard(self.group_name, self.channel_name)

        games[self.game.id]["clients_nb"] -= 1

        # if a player disconnect, his opponent win
        if self.player and not games[self.game.id]["engine"].done:
            games[self.game.id]["engine"].stop()
            await self.channel_layer.group_send(
                self.group_name, {"type": "game_end", "winner": self.opponentPaddle}
            )
            self.game.winner = self.opponent
            await database_sync_to_async(self.game.save)()

        if self.game.id in games and games[self.game.id]["clients_nb"] <= 0:
            del games[self.game.id]["engine"]
            games.pop(self.game.id)

    async def receive(self, text_data):
        if self.player is None:
            return
        try:
            games[self.game.id]["engine"].set_player_direction(self.paddle, json.loads(text_data))
        except:
            await self.close()

    async def game_end(self, event):
        await self.send(json.dumps(event))
        
        if not games[self.game.id]["engine"].done:
            games[self.game.id]["engine"].stop()

        if event["winner"] == self.paddle:
            self.game.winner = self.user
            await database_sync_to_async(self.game.save)()

    async def game_score(self, event):
        await self.send(json.dumps(event))

    async def game_update(self, event):
        if games[self.game.id]["engine"].done:
            return
        await self.send(json.dumps(event))

    @database_sync_to_async
    def get_user(self):
        try:
            if b'token' in self.qs:
                token = Token.objects.get(key=self.qs[b'token'][0].decode("utf-8"))
                return token.user
        except Token.DoesNotExist:
            return None
        return None

    @database_sync_to_async
    def get_game(self):
        if b'game_id' in self.qs:
            try:
                game = Game.objects.get(id=int(self.qs[b'game_id'][0].decode("utf-8")))
                return game
            except Game.DoesNotExist:
                return None
        return None

