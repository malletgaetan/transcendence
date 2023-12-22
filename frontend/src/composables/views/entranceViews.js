import gsap from 'gsap'

export function entranceMenuPrincipal(overlay, menu) {
    gsap.from(overlay, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut"
      });
    
      gsap.from(menu, {
        autoAlpha: 0,
        yPercent: -1,
        duration: 1,
        delay: 0.5,
        ease: "expo.inOut",
      });
}

export function entranceHome(homePage) {
    gsap.from(homePage, {
        autoAlpha: 0,
        // yPercent: -10,
        duration: 1,
        ease: "expo.inOut"
      });
}

export function entranceGlobal(pageSelector, overlay) {
    gsap.from(overlay, {
      autoAlpha: 0,
      duration: 1,
      ease: "expo.inOut"
    });

    gsap.from(pageSelector, {
      autoAlpha: 0,
      yPercent: -1,
      duration: 1,
      delay: 0.5,
      ease: "expo.inOut",
    });
}