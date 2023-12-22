import Experience from "../Experience";
import * as THREE from 'three'

export default class Walls {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        
        this.FIELD_WIDTH = this.experience.FIELD_WIDTH
        this.FIELD_LENGTH = this.experience.FIELD_LENGTH

        this.setWallsRight()
        this.setWallsLeft()
    }

    setWallsRight(multiLocal) {
        this.wallGeometry = new THREE.BoxGeometry(10, 10, 3800, 5, 5, 500);
        this.wallMaterial = new THREE.MeshBasicMaterial({ color: 0x1f44ff, wireframe : true, transparent: true, opacity:0.0 })
        this.wallRight = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wallRight.position.set(450, 0, -550);
        this.scene.add(this.wallRight);
    }

    setWallsLeft() {
        this.wallLeft = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.wallLeft.position.set(-450, 0, -550);
        this.scene.add(this.wallLeft);
    }

    setWallBack() {
        this.wallGeometryBack = new THREE.BoxGeometry(20, 20, this.FIELD_WIDTH, 5, 8, 5);
        this.wallMaterialBack = new THREE.MeshBasicMaterial({ color: 0x1f44ff, wireframe : true, transparent: true, opacity:0.1 })
        this.wallBack = new THREE.Mesh(this.wallGeometryBack, this.wallMaterialBack);
        this.wallBack.position.z = (-this.FIELD_LENGTH / 2) - 600
        this.wallBack.rotation.y += Math.PI / 2
        this.scene.add(this.wallBack);
    }

    setWallFront() {
        this.wallFront = new THREE.Mesh(this.wallGeometryBack, this.wallMaterialBack);
        this.wallFront.position.z = (this.FIELD_LENGTH / 2) + 600
        this.wallFront.rotation.y += Math.PI / 2
        this.scene.add(this.wallFront);
    }

    update() {}
}