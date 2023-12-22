import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './World/Camera.js'
import Renderer from './Utils/Renderer.js'
import World from './World/World.js'
import Loaders from './Utils/Loaders.js'
import CameraLerp from './World/CameraLerp.js'
import sources from './Utils/sources.js'
import Field from './Game/Field.js'
import Paddle from './Game/Paddle.js'
import Ball from './Game/Ball.js'
import Walls from './Game/Walls.js'
import LocalGame from './Game/LocalGame.js'

let instance = null

export default class Experience {
    constructor(canvas) {

        if (instance) {
            return instance
        }

        /* Game constants */
        this.WIDTH = window.innerWidth
        this.HEIGHT = window.innerHeight
        this.VIEW_ANGLE = 55
        this.ASPECT = this.WIDTH / this.HEIGHT
        this.NEAR = 0.1
        this.FAR = 10000
        this.FIELD_WIDTH = 900
        this.FIELD_LENGTH = 3000
        this.BALL_RADIUS = 20
        this.PADDLE_WIDTH = 200
        this.PADDLE_HEIGHT = 30

        instance = this
        window.experience = this
        this.canvas = canvas

        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Loaders(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.cameraLerp = new CameraLerp()

        /* Game classes */
        this.field = new Field(this)
        this.paddle = new Paddle(this)
        this.ball = new Ball(this)
        this.walls = new Walls(this)
        // this.localGame = new LocalGame()

        /* Game type choice */
        this.chooseSoloLocal = false
        this.chooseMultiLocal = false
        this.chooseTournament = false
        this.chooseMatchmaking = false

        /* Game booleans */
        this.localGameStarted = false
        this.localGamePaused = false
        this.matchMakingStarted = false
        this.tournamentStarted = false
        this.userLogged = false

        this.scorePaddleOne = 0;
        this.scorePaddleTwo = 0;

        /* Camera booleans */
        this.isTopView = false
        this.isSideView = true

        /* Players state */

        // this.isPlayerOne = false;
        this.isPlayerTwo = false;

        /* Game utils */
        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            if (!this.chooseMatchmaking)
                this.update()
        })
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.cameraLerp.update()
        this.ball.update()
        this.field.update()
        this.paddle.update()
        if (this.localGame && (this.chooseSoloLocal 
            || this.chooseMultiLocal
            || this.chooseTournament)
            && !this.localGamePaused)
            this.localGame.update()
    }

    destroy() {

        this.sizes.off('resize')
        this.time.off('tick')

        this.scene.traverse((child) => {

            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
    }
}
