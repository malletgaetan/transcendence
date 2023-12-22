import gsap from 'gsap'

export function quitHome(homePage, next) {
    gsap.to(homePage, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete : () => {
          next()
        }
    });
}

export function quitMenuPrincipal(menuPage, overlay, next) {
    gsap.to(menuPage, {
      autoAlpha: 0,
      duration: 0.5,
      ease: "expo.inOut",
    });

    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.5,
      delay : 0.5,
      onComplete : () => {
        next()
      }
    });
}

export function quitGlobal(pageSelector, overlay, next) {
  gsap.to(pageSelector, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
  });

  gsap.to(overlay, {
    autoAlpha: 0,
    duration: 0.5,
    delay : 0.5,
    onComplete : () => {
      next()
    }
  });
}