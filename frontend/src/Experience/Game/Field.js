import Experience from "../Experience";
import * as THREE from 'three'

export default class Field {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        
        this.FIELD_WIDTH = this.experience.FIELD_WIDTH
        this.FIELD_LENGTH = this.experience.FIELD_LENGTH

        this.setField()
    }

    setField() {
        this.fieldGeometry = new THREE.BoxGeometry(this.FIELD_WIDTH, 1500, 5000, 50, 50, 50);
        this.fieldMaterial = new THREE.MeshBasicMaterial({ color: parseInt(localStorage.getItem('colorField')) || 0x0000FF, wireframe : true, transparent: true, opacity:0.0 })
        this.field = new THREE.Mesh(this.fieldGeometry, this.fieldMaterial);
        this.field.position.set(0, -50, 0);
        this.scene.add(this.field);
    }

    update() {
        this.fieldMaterial.color.set(parseInt(localStorage.getItem('colorField')) || 0x0000FF)
    }
}