import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import router from '../../router';
import { popUpEndGame, rawFinished, rawFinishedFr, rawFinishedSp } from '../../composables/rawHTML/tournamentScore.js'

export let socket = null;

export default class OnlineGame {
    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.field = this.experience.field
        this.ball = this.experience.ball.ball
        this.paddleTwo = this.experience.paddle.paddleTwo
        this.paddleOne = this.experience.paddle.paddleOne
		this.dKey = false
		this.aKey = false

		const game_id = localStorage.getItem("gameId");
		localStorage.removeItem("gameId");
		const token = localStorage.getItem("userToken");
		const username = localStorage.getItem("userLogin");
		if (!game_id)
			router.push("/game")
        this.scorePaddleOne = 0;
        this.scorePaddleTwo = 0;

		fetch(`${import.meta.env.VITE_BACKEND_API}/game/${game_id}/`)
			.then((response) => response.json())
			.then((data) => {
				if (username == data.paddleTwo)
					this.isPlayerTwoCamera()
				socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WEBSOCKET}/game?${token ? `token=${token}` : ''}&game_id=${game_id}`)

				socket.onopen = (e) => {
				}

				socket.onclose = (e) => {
				}

				socket.onmessage = (e) => {
					const message = JSON.parse(e.data)
					switch (message.type) {
						case 'game_update':
							this.gameUpdate(message)
							break
						case 'game_score':
							this.gameScore(message)
							break
						case 'game_end':
							this.gameEnd(message)
							break
						default:
							console.log(`ignored websocket data ${message}`)
							break
					}
				}

				socket.onerror = function(e) {
					console.error(`websocket connection failed: ${e}`)
				}

				const sendDirection = () => {
					let direction = 'none'
					if (this.dKey && !this.aKey)
						direction = 'right'
					else if (this.aKey && !this.dKey)
						direction = 'left'
					socket.send(JSON.stringify({'direction': direction}))
				}

				window.addEventListener('keydown', (e) => {
					if (socket.readyState != WebSocket.OPEN || e.repeat)
						return
					if (e.key == 'd') {
						this.dKey = true
					} else if (e.key == 'a') {
						this.aKey = true
					}
					sendDirection()
				})

				window.addEventListener('keyup', (e) => {
					if (socket.readyState != WebSocket.OPEN)
						return
					if (e.key == 'd') {
						this.dKey = false
					} else if (e.key == 'a') {
						this.aKey = false
					}
					sendDirection()
				})	
			})
    }

	isPlayerTwoCamera() {
        this.experience.camera.instance.position.set(0, 100, -(this.experience.FIELD_LENGTH / 2 + 500));
	}

	gameScore(state) {
		const scoreBoard = document.querySelector('.score__value');
		scoreBoard.innerHTML = state["paddleOne"] + ' - ' + state["paddleTwo"];
	}

	gameEnd(state) {
		// TODO implem this
		console.log(`game ended ${state}`)
		
		const target = document.getElementById('tournamentWrapperTarget')
            target.innerHTML = popUpEndGame;
            const buttonTarget = document.getElementById('tournamentNextGame')
			if (localStorage.getItem('language') == 'fr')
				buttonTarget.innerHTML = rawFinishedFr;
			else if (localStorage.getItem('language') == 'sp')
				buttonTarget.innerHTML = rawFinishedSp;
			else
            	buttonTarget.innerHTML = rawFinished;
            gsap.to(target, {
                opacity: 1,
                duration: 1,
                ease:"expo.inOut",
                onComplete: () => {
                    target.style.pointerEvents = 'auto';
                }
            })
            const button = document.getElementById('tournamentButton')
            button.addEventListener('click', () => 
            {
                gsap.to(target, {
                    opacity: 0,
                    duration: 1,
                    ease:"expo.inOut",
                })
				if (socket != null)
					socket.close();
                router.push('/game');
            })
	}

    gameUpdate(state) {
		this.paddleOne.position.x = state["paddleOne"]["x"]
		this.paddleTwo.position.x = state["paddleTwo"]["x"]
		this.ball.position.x = state["ball"]["x"]
		this.ball.position.z = state["ball"]["y"]
		this.experience.update()
    }

    reset() {
        this.ball.position.x = 0
        this.ball.position.y = 0
        this.ball.position.z = 0
        if (this.experience.chooseSoloLocal)
            this.paddleTwo.position.x = 0
        this.ball.$velocity = null
    }
}

