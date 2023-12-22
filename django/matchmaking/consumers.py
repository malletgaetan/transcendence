from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from urllib import parse
from game.models import Game
from user.models import User
import asyncio
import json
import time

# lol
lock = asyncio.Lock()
user_list = set()

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game = None
        self.qs = parse.parse_qs(self.scope['query_string'])
        self.user = await self.get_user()
        if self.user is None:
            await self.close()
            return

        await self.accept()

        self.channel_layer = get_channel_layer()
        self.group_name = f"matchmaking_{self.user.user_id}"

        async with lock:
            if len(user_list) != 0:
                opponent_id = user_list.pop()
                if opponent_id == self.user.user_id:
                    self.close()
                    user_list.add(opponent_id)
                    return
                try:
                    game = await self.create_game(self.user, opponent_id)
                except Exception as e:
                    game = None
                    await self.close()
                    return
                await self.channel_layer.group_send(f"matchmaking_{opponent_id}", {"type": "match_found", "game_id": game.id})
                await self.send(json.dumps({"game": game.id}))
                await self.close()

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            user_list.add(self.user.user_id)


    async def disconnect(self, close_code):
        async with lock:
            if self.user.user_id in user_list:
                user_list.remove(self.user.user_id)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def match_found(self, event):
        await self.send(json.dumps({"game": event["game_id"]}))
        await self.close()

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
    def create_game(self, user, opponent_id):
        player1 = user
        player2 = User.objects.get(pk=opponent_id)
        return Game.objects.create(player1=player1, player2=player2)


