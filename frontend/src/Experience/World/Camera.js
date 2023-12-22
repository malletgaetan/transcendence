import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
import Experience from '../Experience.js'

export default class Camera {

    constructor() {

        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.isPlayerTwo = this.experience.isPlayerTwo;

        this.WIDTH = this.experience.WIDTH
        this.HEIGHT = this.experience.HEIGHT
        this.VIEW_ANGLE = this.experience.VIEW_ANGLE
        this.ASPECT = this.experience.ASPECT
        this.NEAR = this.experience.NEAR
        this.FAR = this.experience.FAR
        this.FIELD_LENGTH = this.experience.FIELD_LENGTH

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance(isPlayerTwo) {
        this.instance = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.WIDTH / this.HEIGHT, this.NEAR, this.FAR)
        this.instance.position.set(0, 100, this.FIELD_LENGTH / 2 + 500);
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.target.set(0, 4.24878115039545, -16.91571729536368)
        this.controls.enabled = true
    }

    reset() {
        this.instance.position.set(0, 100, this.FIELD_LENGTH / 2 + 500);
        this.controls.target.set(0, 4.24878115039545, -16.91571729536368);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}
