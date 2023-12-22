import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import { rawScorer, rawNextGame, rawNextGameFr, rawNextGameSp, rawFinished, rawFinishedFr, rawFinishedSp, rawfirstGame, rawTree, rawLauncher, rawLauncherFr, rawLauncherSp } from '../../composables/rawHTML/tournamentScore.js'
import router from '../../router'

export default class TournamentGame {

    constructor() {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.field = this.experience.field
        this.ball = this.experience.ball.ball
        this.paddleTwo = this.experience.paddle.paddleTwo
        this.paddleOne = this.experience.paddle.paddleOne
        this.scorePaddleOne = this.experience.scorePaddleOne;
        this.scorePaddleTwo = this.experience.scorePaddleTwo;
        this.localGamePaused = this.experience.localGamePaused;
		this.paddleTwoCollision = this.paddleTwo.position.z + (this.experience.PADDLE_HEIGHT / 2)
		this.paddleOneCollision = this.paddleOne.position.z - (this.experience.PADDLE_HEIGHT / 2)

        this.WIDTH = this.experience.WIDTH
        this.HEIGHT = this.experience.HEIGHT
        this.VIEW_ANGLE = this.experience.VIEW_ANGLE
        this.ASPECT = this.experience.WIDTH / this.experience.HEIGHT
        this.NEAR = this.experience.NEAR
        this.FAR = this.experience.FAR
        this.FIELD_WIDTH = this.experience.FIELD_WIDTH
        this.FIELD_LENGTH = this.experience.FIELD_LENGTH
        this.BALL_RADIUS = this.experience.BALL_RADIUS
        this.PADDLE_WIDTH = this.experience.PADDLE_WIDTH
        this.PADDLE_HEIGHT = this.experience.PADDLE_HEIGHT
        this.MAX_SCORE_TOURNAMENT = 5

        this.leftKeyPressed = false
        this.rightKeyPressed = false
        this.upKeyPressed = false
        this.downKeyPressed = false
        this.eKeyPressed = false
        this.dKeyPressed = false

		this.paused = false


        this.finishedGames = 0
        this.amountOfGames = 7
        this.scoreDivIndex = -1;
        this.players = [
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        { alias : "", wins : 0, score : 0, firstScore : false},
        ]

        this.isInGame = []

        document.addEventListener('keydown', (e) => {
			if (e.repeat)
				return
            if (e.key == 'd')
                this.dKeyPressed = true;
            else if (e.key == 'a')
                this.aKeyPressed = true;
            else if (e.key == 'ArrowUp')
                this.upKeyPressed = true
            else if (e.key == 'ArrowDown')
                this.downKeyPressed = true
            else if (e.key == 'w')
                this.wKeyPressed = true
            else if (e.key == 's')
                this.sKeyPressed = true
        });

        document.addEventListener('keyup', (e) => {
			if (e.repeat)
				return
            if (e.key == 'd')
                this.dKeyPressed = false;
            else if (e.key == 'a')
                this.aKeyPressed = false;
            else if (e.key == 'ArrowUp')
                this.upKeyPressed = false
            else if (e.key == 'ArrowDown')
                this.downKeyPressed = false
            else if (e.key == 'w')
                this.wKeyPressed = false
            else if (e.key == 's')
                this.sKeyPressed = false
        });
    }

    initTournament() {
        const target = document.getElementById('tournamentWrapperTarget')
        target.innerHTML = rawTree;
        const buttonTarget = document.getElementById('tournamentNextGame')
        const allFields = document.querySelectorAll('.name')
        
        if (localStorage.getItem('language') == 'fr')
            buttonTarget.innerHTML = rawLauncherFr
        else if (localStorage.getItem('language') == 'sp')
            buttonTarget.innerHTML = rawLauncherSp
        else
            buttonTarget.innerHTML = rawLauncher

        const button = document.getElementById('tournamentButton')
        button.style.pointerEvents = 'auto'
        
        allFields.forEach((element, index) => {
            if (this.players && this.players.length > index) {
                element.innerHTML = this.players[index].alias;
            }
        });
        const matchDivs = document.querySelectorAll('.match')
        matchDivs.forEach(element => {
            element.classList.remove('winner-top')
            element.classList.remove('winner-bottom')
        });
        matchDivs[this.finishedGames].classList.add('animatedBorder')
        
        const tree = document.querySelector('.theme')
        gsap.to(tree, {
            autoAlpha:1,
            duration:0.5,
            ease:"expo.inOut"
        })

        button.addEventListener('click', () => {
            gsap.to(target, {
                autoAlpha:0,
                duration:0.8,
                ease:"expo.inOut",
                onComplete: () => {
                    target.style.pointerEvents = 'none';
                    this.experience.localGamePaused = false;
                    const menuButton = document.querySelector('.menu__button')
                    gsap.to(menuButton, {
                        autoAlpha:1,
                        duration: 0.5,
                        ease:"expo.inOut"
                    })
                    menuButton.style.pointerEvents = 'auto';
                }
            })
        })
    }

    testPaddleOneCollision(ball) {
		if ((ball.z + this.experience.BALL_RADIUS) >= this.paddleOneCollision) {
			const ball_dist_from_col = (ball.z + this.experience.BALL_RADIUS) - this.paddleOneCollision;
			const executed_ratio = 1 - (ball_dist_from_col / (this.ball.$velocity.z * this.time.delta));
			const col_ball_pos = {
				x: this.ball.position.x + this.ball.$velocity.x * this.time.delta * executed_ratio,
				z: this.ball.position.z + this.ball.$velocity.z * this.time.delta * executed_ratio
			}

			const col_paddle_pos = {
				x: this.getNewPaddleOnePosition(executed_ratio)
			}

			if (this.isBallAlignedWithPaddle(col_paddle_pos)) {
				this.ball.position.x = col_ball_pos.x;
				this.ball.position.z = col_ball_pos.z;
				this.paddleOne.position.x = col_paddle_pos.x;
				this.paddleTwo.position.x = this.getNewPaddleTwoPosition(executed_ratio)
				this.time.delta *= (1 - executed_ratio);
				this.setNewBallDirection(this.paddleOne);
				return true;
			}
		}
		return false;
	}

	testPaddleTwoCollision(ball) {
		if ((ball.z - this.experience.BALL_RADIUS) <= this.paddleTwoCollision) {
			const ball_dist_from_col = (ball.z - this.experience.BALL_RADIUS) - this.paddleTwoCollision;
			const executed_ratio = 1 - (ball_dist_from_col / (this.ball.$velocity.z * this.time.delta));
			const col_ball_pos = {
				x: this.ball.position.x + this.ball.$velocity.x * this.time.delta * executed_ratio,
				z: this.ball.position.z + this.ball.$velocity.z * this.time.delta * executed_ratio
			}

			const col_paddle_pos = {
				x: this.getNewPaddleTwoPosition(executed_ratio)
			}

			if (this.isBallAlignedWithPaddle(col_paddle_pos)) {
				this.ball.position.x = col_ball_pos.x;
				this.ball.position.z = col_ball_pos.z;
				this.paddleTwo.position.x = col_paddle_pos.x;
				this.paddleOne.position.x = this.getNewPaddleOnePosition(executed_ratio)
				this.time.delta *= (1 - executed_ratio);
				this.setNewBallDirection(this.paddleTwo);
				return true;
			}
		}
		return false;
	}

	// return true if had side collision with lower bound wall
	lowSideCollision(ball) {
		// lemma: ball isn't behind a paddle
		if (ball.x - this.experience.BALL_RADIUS <= -this.experience.FIELD_WIDTH / 2) {
			const ball_dist_from_col = ball.x - this.experience.BALL_RADIUS + (this.experience.FIELD_WIDTH / 2); // is negative
			const executed_ratio = 1 - (ball_dist_from_col / (this.ball.$velocity.x * this.time.delta));

			// set ball position to collision with wall
			this.ball.position.x = this.ball.position.x + this.ball.$velocity.x * this.time.delta * executed_ratio;
			this.ball.position.z = this.ball.position.z + this.ball.$velocity.z * this.time.delta * executed_ratio;

			// set paddles to new position (at time of ball collision with wall)
			this.paddleOne.position.x = this.getNewPaddleOnePosition(executed_ratio)
			this.paddleTwo.position.x = this.getNewPaddleTwoPosition(executed_ratio)
			this.time.delta *= (1 - executed_ratio);
			this.ball.$velocity.x = -this.ball.$velocity.x;
			return true;
		}
		return false;
	}

	// return true if had side collision with higher bound wall
	highSideCollision(ball) {
		// lemma: ball isn't behind a paddle
		if (ball.x + this.experience.BALL_RADIUS >= this.experience.FIELD_WIDTH / 2) {
			const ball_dist_from_col = (ball.x + this.experience.BALL_RADIUS) - this.experience.FIELD_WIDTH / 2;
			const executed_ratio = 1 - (ball_dist_from_col / (this.ball.$velocity.x * this.time.delta));

			// set ball position to collision with wall
			this.ball.position.x = this.ball.position.x + this.ball.$velocity.x * this.time.delta * executed_ratio;
			this.ball.position.z = this.ball.position.z + this.ball.$velocity.z * this.time.delta * executed_ratio;

			this.paddleOne.position.x = this.getNewPaddleOnePosition(executed_ratio)
			this.paddleTwo.position.x = this.getNewPaddleTwoPosition(executed_ratio)
			this.time.delta *= (1 - executed_ratio);
			this.ball.$velocity.x = -this.ball.$velocity.x;
			return true;
		}
		return false
	}

	processMovements() {
		// TODO: remove this if statement
        if (!this.ball.$velocity) {
			this.ball.$velocity = {
			  x: 0,
			  z: Math.random() > 0.5 ? -2600: 2600
			};
        }

		const next_ball_pos = {
			x: this.ball.position.x + this.ball.$velocity.x * this.time.delta,
			z: this.ball.position.z + this.ball.$velocity.z * this.time.delta
		}

		// use of epsilon
		while (this.time.delta > 0.0000001) {
			const had_paddle_collision = this.testPaddleOneCollision(next_ball_pos) || this.testPaddleTwoCollision(next_ball_pos);

			if (!had_paddle_collision
				&&
				((this.isPastPaddleOne(next_ball_pos) || this.isPastPaddleTwo(next_ball_pos)) 
					||
				!(this.lowSideCollision(next_ball_pos) || this.highSideCollision(next_ball_pos)))) {
				break ;
			}

			next_ball_pos.x = this.ball.position.x + this.ball.$velocity.x * this.time.delta;
			next_ball_pos.z = this.ball.position.z + this.ball.$velocity.z * this.time.delta;

		}
		this.ball.position.x = next_ball_pos.x;
		this.ball.position.z = next_ball_pos.z;

		// set paddles to finite position until next frame
		this.paddleOne.position.x = this.getNewPaddleOnePosition();
		this.paddleTwo.position.x = this.getNewPaddleTwoPosition();
	}

    setNewBallDirection(paddle) {
		this.ball.$velocity.x = -(paddle.position.x - this.ball.position.x) * 20;
        this.ball.$velocity.z *= -1;
    }

    isBallAlignedWithPaddle(paddle) {
        const isInLowerLimit = this.ball.position.x + this.experience.BALL_RADIUS >= (paddle.x - this.experience.PADDLE_WIDTH / 2)
        const isInUpperLimit = this.ball.position.x - this.experience.BALL_RADIUS <= (paddle.x + this.experience.PADDLE_WIDTH / 2)
        return (isInLowerLimit && isInUpperLimit)
    }

    getNewPaddleOnePosition(dt = 1) {
		if (this.dKeyPressed || this.sKeyPressed) {
			return Math.min(this.paddleOne.position.x + (this.paddleOne.$velocity.x * this.time.delta * dt), (this.experience.FIELD_WIDTH / 2) - (this.experience.PADDLE_WIDTH / 2))
		} else if (this.aKeyPressed || this.wKeyPressed) {
			return Math.max(this.paddleOne.position.x - (this.paddleOne.$velocity.x * this.time.delta * dt), -(this.experience.FIELD_WIDTH / 2) + (this.experience.PADDLE_WIDTH / 2))
		}
		return this.paddleOne.position.x
	}

	getNewPaddleTwoPosition(dt = 1) {
		if (this.upKeyPressed) {
			return Math.max(this.paddleTwo.position.x - (this.paddleTwo.$velocity.x * this.time.delta * dt), -(this.experience.FIELD_WIDTH / 2) + (this.experience.PADDLE_WIDTH / 2))
		} else if (this.downKeyPressed) {
			return Math.min(this.paddleTwo.position.x + (this.paddleTwo.$velocity.x * this.time.delta * dt), (this.experience.FIELD_WIDTH / 2) - (this.experience.PADDLE_WIDTH / 2))
		}
		return this.paddleTwo.position.x
	}

	isPastPaddleOne(ball) {
		return ball.z + this.experience.BALL_RADIUS > this.paddleOneCollision
	}

	isPastPaddleTwo(ball) {
		return ball.z - this.experience.BALL_RADIUS < this.paddleTwoCollision
	}

    displayTree() {
        const target = document.getElementById('tournamentWrapperTarget')
        const buttonTarget = document.getElementById('tournamentNextGame')
        const menuButton = document.querySelector('.menu__button')
        gsap.to(menuButton, {
            autoAlpha:0,
            duration: 0.5,
            ease:"expo.inOut"
        })
        if (this.finishedGames < 7)
        {
            if (localStorage.getItem('language') == 'fr')
                buttonTarget.innerHTML = rawNextGameFr
            else if (localStorage.getItem('language') == 'sp')
                buttonTarget.innerHTML = rawNextGameSp
            else
                buttonTarget.innerHTML = rawNextGame
        }
        else {
            if (localStorage.getItem('language') == 'fr')
                buttonTarget.innerHTML = rawFinishedFr
            else if (localStorage.getItem('language') == 'sp')
                buttonTarget.innerHTML = rawFinishedSp
            else
                buttonTarget.innerHTML = rawFinished
            const button = document.getElementById('tournamentButton')
            
            button.addEventListener('click', () => {
                router.push('/game')
            })
        }

        const button = document.getElementById('tournamentButton')
        const matchDivs = document.querySelectorAll('.match')
        matchDivs.forEach(element => {
            element.classList.remove('animatedBorder')
        });
        if (this.finishedGames !== 7)
            matchDivs[this.finishedGames].classList.add('animatedBorder')

        gsap.to(target, {
            autoAlpha:1,
            duration:0.5,
            ease:"expo.inOut",
            onComplete : () => {
                target.style.pointerEvents = 'auto';
            }
        })

        button.addEventListener('click', () => {
            gsap.to(target, {
                autoAlpha:0,
                duration:0.8,
                ease:"expo.inOut",
                onComplete: () => {
                    target.style.pointerEvents = 'none';
                    this.experience.localGamePaused = false;
                    this.paused = false
                    const menuButton = document.querySelector('.menu__button')
                    gsap.to(menuButton, {
                        autoAlpha:1,
                        duration: 0.5,
                        ease:"expo.inOut"
                    })
                }
            })
        })
    }
    
    scored(paddle) {
        let newWinner = ""
        if (this.scorePaddleTwo == this.MAX_SCORE_TOURNAMENT || this.scorePaddleOne == this.MAX_SCORE_TOURNAMENT) {
            this.experience.localGamePaused = true
            let scoreDiv = document.querySelectorAll('.score')
            scoreDiv[++this.scoreDivIndex].innerHTML = this.scorePaddleOne
            scoreDiv[++this.scoreDivIndex].innerHTML = this.scorePaddleTwo
            const matchDivs = document.querySelectorAll('.match')
            matchDivs[this.finishedGames].classList.add('finished-game')
            scoreDiv.forEach(element => {
                if ((element.closest('.match').classList.contains('finished-game'))) {
                    if (this.scorePaddleOne == this.MAX_SCORE_TOURNAMENT) {
                        element.closest('.match').classList.add('winner-top')
                        newWinner = element.closest('.winner-top').querySelectorAll('.name')[0].innerHTML
                    }
                    else if (this.scorePaddleTwo == this.MAX_SCORE_TOURNAMENT) {
                        element.closest('.match').classList.add('winner-bottom')
                        newWinner = element.closest('.winner-bottom').querySelectorAll('.name')[1].innerHTML;
                    }
                }
            });
            if (this.finishedGames < 4) {
                let columnTwo = document.getElementById('columnTwo')
                let matchDivsTwo = columnTwo.querySelectorAll('.name')
                for (let index = 0; index < matchDivsTwo.length; index++) {
                    const element = matchDivsTwo[index];
                    if (element.innerHTML == '???') {
                        element.innerHTML = newWinner;
                        break;
                    }
                }
            } else {
                let columnThree = document.getElementById('columnThree')
                let matchDivsThree = columnThree.querySelectorAll('.name')
                for (let index = 0; index < matchDivsThree.length; index++) {
                    const element = matchDivsThree[index];
                    if (element.innerHTML == '???') {
                        element.innerHTML = newWinner;
                        break;
                    }
                }
            }
            matchDivs.forEach(element => {
                element.classList.remove('finished-game')
            });
            this.finishedGames++;
            this.scorePaddleOne = 0;
            this.scorePaddleTwo = 0;
            this.displayTree()
            gsap.to(this.paddleOne.position, {
                x : 0,
                duration :1.5,
                ease:"expo.inOut"
            })
            gsap.to(this.paddleTwo.position, {
                x : 0,
                duration :1.5,
                ease:"expo.inOut"
            })
            const scoreBoard = document.querySelector('.score__value');
			scoreBoard.innerHTML = '0 - 0';
        }

        this.paused = true;
        gsap.to(this.ball.position, {
            x: 0,
            z : 0,
            y : 200,
            duration: 1,
            ease:"expo.inOut"
        })
        setTimeout(() => {
            this.reset()
        }, 1000);
    }
    stopBall(){ 
        this.ball.$stopped = true
    }

    reset() {
            gsap.to(this.ball.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1.5,
                ease: "expo.inOut",
                onComplete: () => {
                    this.paused = false
                }
            })
        if (this.experience.chooseSoloLocal)
            this.paddleTwo.position.x = 0
        this.ball.$velocity = null
    }

    update() {
        const normalizedDelta = this.time.delta / 32;
		this.time.delta = this.time.delta /	1000;

		if (this.paused) {
			this.paddleOne.position.x = this.getNewPaddleOnePosition();
			this.paddleTwo.position.x = this.getNewPaddleTwoPosition();
			return ;
		}

        this.processMovements();
    
        if (this.experience.chooseSoloLocal) {
			this.upKeyPressed = false;
			this.downKeyPressed = false;
		}

        if (this.isPastPaddleOne(this.ball.position)) {
            this.scorePaddleTwo++;
            const scoreBoard = document.querySelector('.score__value');
            scoreBoard.innerHTML = this.scorePaddleOne + ' - ' + this.scorePaddleTwo;
            this.scored('paddleTwo')
          }

		if(this.isPastPaddleTwo(this.ball.position)) {
			this.scorePaddleOne++;
			const scoreBoard = document.querySelector('.score__value');
			scoreBoard.innerHTML = this.scorePaddleOne + ' - ' + this.scorePaddleTwo;
			this.scored('paddleOne')
		}
    }
}

