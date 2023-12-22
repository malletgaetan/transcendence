import gsap from 'gsap'
import router from '../../router';
import { resetLocalValues } from './endGame.js';

export function menuToSoloLocal(overlay, menu) {
    gsap.to(overlay, {
        autoAlpha:0,
        duration: 1,
        ease: "expo.inOut",
        delay: 0.2
    })
      
    gsap.to(menu, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            resetLocalValues(window.experience);
            window.experience.chooseSoloLocal = true;
            router.push('/game/start');
        }
    })
}

export function menuToMatchmaking(overlay, menu) {
    gsap.to(overlay, {
        autoAlpha:0,
        duration: 1,
        ease: "expo.inOut",
        delay: 0.2
    })
      
    gsap.to(menu, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            resetLocalValues(window.experience);
            window.experience.chooseMatchmaking = true;
            router.push('/game/start');
        }
    })
}

export function menuToTournament(overlay, menu) {
    gsap.to(overlay, {
        autoAlpha:0,
        duration: 1,
        ease: "expo.inOut",
        delay: 0.2
    })
      
    gsap.to(menu, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            resetLocalValues(window.experience);
            window.experience.chooseTournament = true;
            router.push('/game/start');
        }
    })
}

export function menuToMultiLocal(overlay, menu) {
    gsap.to(overlay, {
        autoAlpha:0,
        duration: 1,
        ease: "expo.inOut",
        delay: 0.2
    })
      
    gsap.to(menu, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            resetLocalValues(window.experience);
            window.experience.chooseMultiLocal = true;
            router.push('/game/start');
        }
    })
}
