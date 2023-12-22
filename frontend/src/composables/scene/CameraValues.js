import gsap from 'gsap'

export function topView() {
    gsap.to(window.experience.camera.instance.position, {
        x: 2020,
        y: 2060,
        z: -40,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.camera.controls.target, {
        x: 0,
        y: 0.24878115039545,
        z: -11.91571729536368,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.field.fieldMaterial, {
        opacity: 0
    })

    gsap.to(window.experience.world.model.model.position, {
        z: 1200,
        x: -200,
    })

    gsap.to(window.experience.walls.wallLeft.position, {
        z: 0,
    })

    gsap.to(window.experience.walls.wallRight.position, {
        z: 0,
    })
}

export function backView() {
    gsap.to(window.experience.camera.instance.position, {
        x: 0,
        y: 100,
        z: 2000,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.camera.controls.target, {
        x: 0,
        y: 4.24878115039545,
        z: -16.91571729536368,
        duration: 2,
        ease: "expo.inOut"
    })

    if (window.experience.world.model) {
        gsap.to(window.experience.world.model.model.position, {
            x: 0,
            y: -350,
            z: 600,
            delay : 1
        })
    }
}