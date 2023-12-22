import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Ball {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.BALL_RADIUS = this.experience.BALL_RADIUS
        this.setBall()
    }

    setBall() {
        this.ballGeometry = new THREE.SphereGeometry(this.BALL_RADIUS, 12, 12)
        this.ballMaterial = new THREE.MeshBasicMaterial({ color: parseInt(localStorage.getItem('colorBall')) || 0xFF0000, wireframe: true, transparent: true, opacity: 0.0 })
        this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial)
        this.mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
        this.scene.add(this.mainLight);
        this.scene.add(this.ball)
        this.camera.lookAt(this.ball.position)
    }

    reset() {
        this.ball.position.set(0, 0, 0);
    }

    update() {
        this.ball.rotation.y += 0.007
        this.ball.rotation.x += 0.004
        this.ballMaterial.color.set(parseInt(localStorage.getItem('colorBall')) || 0xFF0000)
    }
}
