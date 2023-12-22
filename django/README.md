# Pong backend

## Example

```js
// create user
await fetch("http://localhost:8000/user/", {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
		"Accept": "application/json"
    },
    body: JSON.stringify({"username": "username123", "password": "password123"}),
})

// retrieve authentication token
const response = await fetch("http://localhost:8000/user/login/", {
	method: 'POST',
	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json"
	},
	body: JSON.stringify({"username": "username123", "password": "password123"}),
})

const data = await response;

// create game
await fetch("http://localhost:8000/game/", {
    method: 'POST',
    headers: {
		"Authorization": `Token ${data.token}`,
        "Content-Type": "application/json",
		"Accept": "application/json",
    },
    body: JSON.stringify({"player1": "username1234", "player2": "username123"}),
})

// list games
// can set only player1 or only player2, or both
// can set or not done to get finished games
await fetch("http://localhost:8000/game/games?player1=username123?player2=username1234&done")

// connect to websocket
let socket = new WebSocket(`ws://localhost:8000/game?token=${data.token}&game_id=1`)

socket.onopen = function(e) {
	console.log("ws connection successfull!")
	socket.send(JSON.stringify({"direction": "left"}))
}

socket.onmessage = function(e) {
	console.log(`received '${e.data}' from ws`)
}

socket.onclose = function(e) {
	console.log("connection closed!")
}

socket.onerror = function(e) {
	console.log("websocket error!")
}
```

## API Endpoints

### Data oriented

| path | method | usage | authentication | restrictions | payload | return values |
| ---- | ------ | ----- | -------------- | ------------ | ------- | ------------- |
| /user | GET | get user informations | optional | none | none | {"username" (string)}
| /user | POST | create user | optional | none | { "username": "...", "password": "..." } | none |
| /game | GET | get game informations | optional | none | none | {"paddleOne" (string), "paddleTwo" (string), "player1" (id), "player2" (id), "winner" (id)}
| /game | POST | create game | required | none | { "player1" (string), "player2" (string) } |
| /games?player1=..&player2=..&done | GET | get games with filter | optional | none | none |

### Websockets

| path | query attributes |
| ---- | ---------------- |
| /game | game_id and token(optional) |
| /matchmaking | token |

#### Game payloads

| mode | payload | usecase |
| ---- | ------- | ------- |
| client->server | {"direction": "left" or "right" or "none"} | change user paddle direction
| server->client | {"type": "game_score"} | game score data |
| server->client | {"type": "game_update", "paddleOne": {"y": 0}, "paddleTwo": {"y": 0}, "ball": {"x": 0, "y": 0}} | game state data |
| server->client | {"type": "game_end", "winner": "paddleOne"} | notify what paddle won the game |

#### Matchmaking payloads

| mode | payload | usecase |
| ---- | ------- | ------- |
| server->client | {"game_id": 0} | created game with opponent |

## Game Rules

The main purpose of this website is to play Pong versus other players.
- Therefore, users must have the ability to participate in a live Pong game against
another player directly on the website. Both players will use the same keyboard.
The Remote players module can enhance this functionality with remote players.
- A player must be able to play against another player, but it should also be possible
to propose a tournament. This tournament will consist of multiple players who
can take turns playing against each other. You have flexibility in how you implement
the tournament, but it must clearly display who is playing against whom and the
order of the players.
- A registration system is required: at the start of a tournament, each player
must input their alias name. The aliases will be reset when a new tournament
begins. However, this requirement can be modified using the Standard User
Management module.
- There must be a matchmaking system: the tournament system organize the
matchmaking of the participants, and announce the next fight.
- All players must adhere to the same rules, which includes having identical paddle
speed. This requirement also applies when using AI; the AI must exhibit the same
speed as a regular player.
- The game itself must be developed in accordance with the default frontend con-
straints (as outlined above), or you may choose to utilize the FrontEnd module,
or you have the option to override it with the Graphics module. While the visual
aesthetics can vary, it must still capture the essence of the original Pong (1972).

