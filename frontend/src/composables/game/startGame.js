import gsap from 'gsap'
import LocalGame from '../../Experience/Game/LocalGame'
import OnlineGame from '../../Experience/Game/OnlineGame'
import TournamentGame from '../../Experience/Game/TournamentGame'

export function startLocalGame(gameInterface) {
    gsap.from(gameInterface, {
        autoAlpha: 0,
        yPercent: -10,
        duration :1,
        delay: 0.5,
        ease: "expo.inOut"
    })

    gsap.from(window.experience.camera.instance.position, {
        x: 0,
        y : 100,
        z : window.experience.FIELD_LENGTH / 2 + 500,
        duration: 1.5,
        ease: "expo.inOut",
        onComplete : () => {
            window.experience.localGame = new LocalGame();
            window.experience.localGame.reset();
            window.experience.localGameStarted = true;
            window.experience.localGame.initLocalGame();
        }
    })
}

export function startOnlineGame(gameInterface) {
    gsap.from(gameInterface, {
        autoAlpha: 0,
        yPercent: -10,
        duration :1,
        delay: 0.5,
        ease: "expo.inOut"
    })

    gsap.from(window.experience.camera.instance.position, {
        x: 0,
        y : 100,
        z : window.experience.FIELD_LENGTH / 2 + 500,
        duration: 1.5,
        ease: "expo.inOut",
        onComplete : () => {
            window.experience.localGame = new OnlineGame();
            window.experience.localGame.reset();
            window.experience.onlineGameStarted = true;
        }
    })
}

export function startMultiLocal(gameInterface) {
    gsap.from(gameInterface, {
        autoAlpha: 0,
        yPercent: -10,
        duration :1.5,
        delay: 0.2,
        ease: "expo.inOut"
    })


    gsap.to(window.experience.camera.instance.position, {
        x: 1420,
        y: 1460,
        z: -40,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.camera.controls.target, {
        x: 0,
        y: 0.24878115039545,
        z: -30.91571729536368,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.field.fieldMaterial, {
        opacity: 0
    })

    gsap.to(window.experience.walls.wallLeft.position, {
        z: 0,
    })

    gsap.to(window.experience.walls.wallRight.position, {
        z: 0,
    })
    
    gsap.to(window.experience.world.model.model.position, {
        z: 1200,
        x: -200,
        delay : 1,
        onComplete : () => {
            setTimeout(() => {
                window.experience.localGame = new LocalGame(); 
                window.experience.localGame.reset();
                window.experience.localGameStarted = true;
                window.experience.localGame.initLocalGame()
            }, 1000);
        }
    })
}

export function startTournament(gameInterface) {
    gsap.from(gameInterface, {
        autoAlpha: 0,
        yPercent: -10,
        duration :1,
        delay: 0.5,
        ease: "expo.inOut"
    })


    gsap.to(window.experience.camera.instance.position, {
        x: 1420,
        y: 1460,
        z: -40,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.camera.controls.target, {
        x: 0,
        y: 0.24878115039545,
        z: -30.91571729536368,
        duration: 2,
        ease: "expo.inOut"
    })

    gsap.to(window.experience.field.fieldMaterial, {
        opacity: 0
    })

    gsap.to(window.experience.walls.wallLeft.position, {
        z: 0,
    })

    gsap.to(window.experience.walls.wallRight.position, {
        z: 0,
    })
    
    gsap.to(window.experience.world.model.model.position, {
        z: 1200,
        x: -200,
        delay : 1,
        onComplete : () => {
            setTimeout(() => {
                window.experience.localGame = new TournamentGame(); 
                window.experience.localGame.reset();
                window.experience.localGameStarted = true;
            }, 1000);
        }
    })
}
