import Experience from '../Experience.js'

export default class Model {

    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resource = this.resources.items.model
        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(12, 12, 12)
        this.model.position.set(0, -350, 600)
        this.scene.add(this.model)
    }
    update() { }
}