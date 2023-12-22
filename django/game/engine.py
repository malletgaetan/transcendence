from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import threading
import time
import math
import random

usleep = lambda x: time.sleep(x/1_000_000_000)

MAP_SIZE_X = 900
MAP_SIZE_Y = 3000

class Ball:
    def __init__(self):
        self.radius = 20.0
        self.reset()

    def move(self, paddles, delta_time):
        self.x += self.dir[0] * delta_time
        if self.x >= MAP_SIZE_X:
            self.x -= self.x - MAP_SIZE_X
            self.dir[0] = -self.dir[0]
        elif self.x < 0:
            self.x += -(self.x)
            self.dir[0] = -(self.dir[0])

        self.y += self.dir[1] * delta_time

        for paddle in paddles:
            if paddle.collide_with_ball(self):
                self.dir[0] = -(paddle.x - self.x) * 20
                self.dir[1] = -(self.dir[1])
                return None

        if self.y >= paddles[0].y:
            return paddles[1]
        elif self.y < paddles[1].y:
            return paddles[0]
        return None

    def state(self):
        return {
            "x": self.x - (MAP_SIZE_X // 2),
            "y": self.y - (MAP_SIZE_Y // 2)
        }
    
    def reset(self):
        self.x = MAP_SIZE_X // 2
        self.y = MAP_SIZE_Y // 2
        self.dir = [0.0, random.choice([3000.0, -3000.0])]

class Paddle:
    SPEED = 800.0 # 10 something per second
    def __init__(self, up, name):
        self.name = name
        self.x = MAP_SIZE_X // 2
        self.width = 200
        self.height = 30
        if up:
            self.y = 0
            self.y_collision = self.height / 2
        else:
            self.y = MAP_SIZE_Y - 1
            self.y_collision = self.y - self.height / 2
        self.up = up
        self.direction = "none"
        self.speed = Paddle.SPEED

    def move_right(self, delta_time, redir = True):
        if self.up and redir:
            return self.move_left(delta_time, False)
        if (self.x + (self.width // 2) + (self.speed * delta_time)) > MAP_SIZE_X:
            self.x = MAP_SIZE_X - (self.width // 2)
        else:
            self.x += (self.speed * delta_time)

    def move_left(self, delta_time, redir = True):
        if self.up and redir:
            return self.move_right(delta_time, False)
        if (self.x - (self.width // 2) - (self.speed * delta_time)) < 0:
            self.x = self.width // 2
        else:
            self.x -= (self.speed * delta_time)

    def reset(self):
        self.x = MAP_SIZE_X // 2
        self.direction = "none"

    def collide_with_ball(self, ball):
        x1, y1 = (self.x - ((self.width + 40) / 2), self.y_collision)
        x2, y2 = (self.x + ((self.width + 40) / 2), self.y_collision)

        # line vector
        lv = (x2 - x1, y2 - y1)
        # circle to line start
        ctls = (ball.x - x1, ball.y - y1)

        line_length = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

        projection = (ctls[0] * lv[0] + ctls[1] * lv[1]) / line_length**2

        closest_point_x = x1 + projection * (x2 - x1)
        closest_point_y = y1 + projection * (y2 - y1)

        if 0 <= projection <= 1:
            return math.sqrt((ball.x - closest_point_x) **2 + (ball.y - closest_point_y)**2) <= ball.radius
        return False

    def state(self):
        return {
            "x": self.x - (MAP_SIZE_X // 2),
        }

class State:
    def __init__(self):
        self.scores = {}
        self.scores["paddleOne"] = 0
        self.scores["paddleTwo"] = 0
        self.paddles = {}
        self.paddles["paddleOne"] = Paddle(0, "paddleOne")
        self.paddles["paddleTwo"] = Paddle(1, "paddleTwo")
        self.directions = {}
        self.directions["paddleOne"] = "none"
        self.directions["paddleTwo"] = "none"
        self.direction_lock = threading.Lock()
        self.done = False
        self.ball = Ball()

    def update_direction(self, paddle, direction):
        self.direction_lock.acquire()
        self.directions[paddle] = direction
        self.direction_lock.release()

    def paused_step(self, delta_time):
        for paddle in self.paddles:
            if self.directions[paddle] == "left":
                self.paddles[paddle].move_left(delta_time)
            elif self.directions[paddle] == "right":
                self.paddles[paddle].move_right(delta_time)

    def step(self, delta_time):
        for paddle in self.paddles:
            if self.directions[paddle] == "left":
                self.paddles[paddle].move_left(delta_time)
            elif self.directions[paddle] == "right":
                self.paddles[paddle].move_right(delta_time)
        winner = self.ball.move([self.paddles["paddleOne"], self.paddles["paddleTwo"]], delta_time)
        if winner is None:
            return None
        self.scores[winner.name] += 1
        if self.scores[winner.name] >= 5:
            self.done = True
        return winner
    
    def reset(self):
        self.ball.reset()

    def get_score(self):
        return {
            "paddleOne": self.scores["paddleOne"],
            "paddleTwo": self.scores["paddleTwo"]
        }

    def state(self):
        return {
            "paddleOne": self.paddles["paddleOne"].state(),
            "paddleTwo": self.paddles["paddleTwo"].state(),
            "ball": self.ball.state()
        }

class GameEngine(threading.Thread):
    DT_NS = 1_000_000_000 / 60.0 # ns

    def __init__(self, group_name):
        super(GameEngine, self).__init__(daemon=True, name=f"GameEngine_{group_name}")
        self.state = State()
        self.channel_layer = get_channel_layer()
        self.group_name = group_name
        self.done = False
        self.tick_func = self.tick
        self._stop_event = threading.Event()

    def run(self):
        time_after_render = time.time_ns()
        while (not self.state.done) and (not self._stop_event.is_set()):
            time_before_render_ns = time.time_ns()
            self.tick_func()
            time_after_render_ns = time.time_ns()
            delta_time_ns = time_after_render_ns - time_before_render_ns
            usleep(max(0, GameEngine.DT_NS - delta_time_ns))
            self.broadcast()

    def broadcast(self):
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {"type": "game_update", **self.state.state()}
        )

    def paused_tick(self):
        if time.time() - self.pause_start > 1:
            self.tick_func = self.tick
            return
        self.state.paused_step(GameEngine.DT_NS / 1_000_000_000)

    def tick(self):
        paddle_winner = self.state.step(GameEngine.DT_NS / 1_000_000_000)
        if paddle_winner is None:
            return
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {"type": "game_score", **self.state.get_score()}
        )
        if self.state.done:
            async_to_sync(self.channel_layer.group_send)(
                self.group_name, {"type": "game_end", "winner": paddle_winner.name}
            )
            return
        self.tick_func = self.paused_tick
        self.pause_start = time.time()
        self.state.reset()

    def stop(self):
        self._stop_event.set()

    def set_player_direction(self, paddle, data):
        self.state.update_direction(paddle, data["direction"])

