import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import gsap from 'gsap'

export default class Loaders extends EventEmitter {

    constructor(sources) {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {

        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
    }

    startLoading() {

        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file) {

        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
            // const loaderView = document.querySelector('.loading')
            // gsap.to(loaderView, { duration: 2, xPercent: -100, ease: 'expo.inOut', onComplete: () => { loaderView.style.visibility = 'hidden' } })
        }
    }
}