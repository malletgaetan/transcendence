import * as THREE from "three"
import Experience from '../Experience.js'

export default class CameraLerp {

    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene

        this.mouseX = 0
        this.mouseY = 0

        this.targetX = 0
        this.targetY = 0

        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.lerpActive = true

        this.setCameraLerp()
    }

    setCameraLerp() {
        window.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - this.windowHalfX)
            this.mouseY = (event.clientY - this.windowHalfY)
        })
    }

    update() {

        if (this.lerpActive) {
            this.targetX = this.mouseX * .3
            this.targetY = this.mouseY * .3

            this.scene.position.y += 0.05 * (this.targetY - this.scene.position.y);
            this.scene.position.x += 0.05 * (this.targetX - this.scene.position.x);
            // this.scene.position.z += 1.7 * (this.targetX - this.scene.position.x);
        }
    }
}