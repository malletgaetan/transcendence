import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import { popUpEndGame, rawFinished, rawFinishedFr, rawFinishedSp } from '../../composables/rawHTML/tournamentScore.js'
import router from '../../router'

export default class LocalGame {

    constructor() {
        this.experience = new Experience()
        this.time = this.experience.time
        this.ball = this.experience.ball.ball
        this.paddleTwo = this.experience.paddle.paddleTwo
		this.paddleTwoCollision = this.paddleTwo.position.z + (this.experience.PADDLE_HEIGHT / 2)
        this.paddleOne = this.experience.paddle.paddleOne
		this.paddleOneCollision = this.paddleOne.position.z - (this.experience.PADDLE_HEIGHT / 2)
		this.MAX_SOLO_SCORE = 5;
        this.aKeyPressed = false
        this.dKeyPressed = false
        this.upKeyPressed = false
        this.downKeyPressed = false
        this.wKeyPressed = false
        this.sKeyPressed = false
        this.scorePaddleOne = 0
        this.scorePaddleTwo = 0
		this.paused = false

        document.addEventListener('keydown', (e) => {
			if (e.repeat)
				return
            if (e.key == 'd')
                this.dKeyPressed = true;
            else if (e.key == 'a')
                this.aKeyPressed = true;
            else if (e.key == 'ArrowUp' && this.experience.chooseMultiLocal)
                this.upKeyPressed = true
            else if (e.key == 'ArrowDown' && this.experience.chooseMultiLocal)
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
            else if (e.key == 'ArrowUp' && this.experience.chooseMultiLocal)
                this.upKeyPressed = false
            else if (e.key == 'ArrowDown' && this.experience.chooseMultiLocal)
                this.downKeyPressed = false
            else if (e.key == 'w')
                this.wKeyPressed = false
            else if (e.key == 's')
                this.sKeyPressed = false
        });
    }

    initLocalGame() {
        const startGameInterface = document.getElementById('localGameStart')
        gsap.to(startGameInterface, {
            opacity: 1,
            duration: 0.7,
            ease: "expo.inOut",
        })
    }

    processCpuPaddle() {
        var ballPos = this.ball.position,
            cpuPos = this.paddleTwo.position;

        if(cpuPos.x - 10 > ballPos.x) {
			this.upKeyPressed = true;
        } else if (cpuPos.x + 10 < ballPos.x) {
			this.downKeyPressed = true;
		}
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

    scored(paddle) {
		this.paused = true
        gsap.to(this.ball.position, {
            x: 0,
            z: 0,
            y: 200,
            duration: 1,
            ease: "expo.inOut"
        })

		if (this.scorePaddleOne == this.MAX_SOLO_SCORE 
            || this.scorePaddleTwo == this.MAX_SOLO_SCORE)
        {
            this.paused = true;
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
                router.push('/game');
            })
        }
        else
        {
            setTimeout(() => {
                this.reset()
            }, 1000);
        }
    }

    reset() {
        if (this.scorePaddleOne !== 0 || this.scorePaddleTwo !== 0) {
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
        }
        if (this.experience.chooseSoloLocal)
            this.paddleTwo.position.x = 0
        this.ball.$velocity = null
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

    update() {
        const normalizedDelta = this.time.delta / 32;
		this.time.delta = this.time.delta /	1000;

		if (this.paused) {
			this.paddleOne.position.x = this.getNewPaddleOnePosition();
			this.paddleTwo.position.x = this.getNewPaddleTwoPosition();
			return ;
		}

        if (this.experience.chooseSoloLocal)
            this.processCpuPaddle();

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

