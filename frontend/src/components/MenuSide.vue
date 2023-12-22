<template>
  <section ref="menuSide" :class="[etat, 'start__menuside']">
    <div class="menu__button">
      <div ref="menuButton">
        <ButtonMenu class="menu" name="Menu" @click="openMenu" />
      </div>
    </div>
    <div class="menu__button2" ref="closeButton">
      <ButtonMenu class="close" :name="$t('close')" @click="closeMenu"/>
    </div>
    <div v-if="menuGlobal" class="menu__side">
      <div class="window d-flex align-items-center justify-content-center" ref="menu__global">
          <Title />
          <ButtonInterface :name="$t('language')" @click="menuToLanguage"/>
          <ButtonInterface :name="$t('graphics')" @click="menuToGraphic"/>
          <ButtonInterface :name="$t('customize')" @click="menuToCustomize"/>
        </div>
      </div>
      <div v-if="menuLanguage" class="menu__side">
        <div class="window d-flex align-items-center justify-content-center" ref="menu__language">
              <Title />
              <ButtonInterface ref="frenchButton" :name="$t('french')" @click="changeForFrench"/>
              <ButtonInterface ref="englishButton" :name="$t('english')" @click="changeForEnglish"/>
              <ButtonInterface ref="spanishButton" :name="$t('spanish')" @click="changeForSpanish"/>
              <ButtonInterface :name="$t('back')" @click="languageToMenu"/>
        </div>
      </div>
      <div v-if="menuGraphic" class="menu__side">
        <div class="window d-flex align-items-center justify-content-center" ref="menu__graphic">
              <Title />
              <ButtonInterface :name="$t('low')" @click="changeForLowGraphics"/>
              <ButtonInterface :name="$t('high')" @click="changeForHighGraphics"/>
              <ButtonInterface :name="$t('back')" @click="graphicToMenu"/>
        </div>
      </div>
      <div ref="menu__customize" v-if="menuCustomize" class="menu__side">
        <div class="window d-flex align-items-center justify-content-center">
            <!-- <Title /> -->
            <h1 class="customize__h1">{{ $t('ball') }}</h1>
            <div class="d-flex div__customize">
              <ButtonInterface :name="$t('blue')" @click="changeForBlueBall"/>
              <ButtonInterface :name="$t('red')" @click="changeForRedBall"/>
              <ButtonInterface :name="$t('green')" @click="changeForGreenBall"/>
            </div>
            <h1 class="customize__h1">{{ $t('racket') }}</h1>
            <div class="d-flex div__customize">
              <ButtonInterface :name="$t('blue')" @click="changeForBlueRacket"/>
              <ButtonInterface :name="$t('red')" @click="changeForRedRacket"/>
              <ButtonInterface :name="$t('green')" @click="changeForGreenRacket"/>
            </div>
            <h1 class="customize__h1">{{ $t('map') }}</h1>
            <div class="d-flex div__customize">
              <ButtonInterface :name="$t('blue')" @click="changeForBlueField"/>
              <ButtonInterface :name="$t('red')" @click="changeForRedField"/>
              <ButtonInterface :name="$t('green')" @click="changeForGreenField"/>
            </div>
            <ButtonInterface :name="$t('back')" @click="customizeToMenu"/>
          </div>
        </div>
  </section>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import router from "../router";
import ButtonInterface from "./childs/ButtonInterface.vue";
import Title from "./childs/Title.vue";
import ButtonMenu from "./childs/ButtonMenu.vue";
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';




const menuSide = ref(null);
const emptyRef = ref(null);
const etat = ref('etat1');
const menuButton = ref(null);
const closeButton = ref(null);
const defaultState = ref(true);
const menu__global = ref(null);
const menu__language = ref(null);
const menu__graphic = ref(null);
const menu__customize = ref(null);
const menuGlobal = ref(true);
const menuLanguage = ref(false);
const menuGraphic = ref(false);
const frenchActive = ref(false);
const englishActive = ref(false);
const spanishActive = ref(false);
const menuCustomize = ref(false);
const { locale } = useI18n();

let frenchButton, englishButton, spanishButton;

const openMenu = () => {
  defaultState.value = true;
  menuGlobal.value = true;
  gsap.to(menuButton.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      gsap.to(closeButton.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
  etat.value = 'etat2';
  if (window.experience.chooseSoloLocal ||
    window.experience.chooseMultiLocal ||
    window.experience.chooseTournament) {
    window.experience.localGamePaused = true;
  }
}

const closeMenu = () => {
  gsap.to(closeButton.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      gsap.to(menuButton.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
  etat.value = 'etat1';
  defaultState.value = false;
  menuGraphic.value = false;
  menuLanguage.value = false;
  menuCustomize.value = false;
  setTimeout(() => {
    window.experience.localGamePaused = false
  }, 1000);
}

function processLogout(event) {
  localStorage.clear();
  router.push('/');
}

function menuToLanguage(event) {
  gsap.to(menu__global.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = false;
      menuLanguage.value = true;

      await nextTick();

      gsap.set(menu__language.value, { autoAlpha: 0 });
      gsap.to(menu__language.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
  setTimeout(() => {
    const targetAll = document.querySelectorAll('.button__inside')
    if (locale.value == 'fr') {
      targetAll[0].classList.add('active__language')
    }
    if (locale.value == 'en') {
      targetAll[1].classList.add('active__language')
    }
    if (locale.value == 'sp') {
      targetAll[2].classList.add('active__language')
    }
  }, 800);
}

function languageToMenu(event) {
  gsap.to(menu__language.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = true;
      menuLanguage.value = false;

      await nextTick();

      gsap.set(menu__global.value, { autoAlpha: 0 });
      gsap.to(menu__global.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
}

function menuToGraphic(event) {
  gsap.to(menu__global.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = false;
      menuGraphic.value = true;

      await nextTick();

      gsap.set(menu__graphic.value, { autoAlpha: 0 });
      gsap.to(menu__graphic.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });

  setTimeout(() => {
    const targetAll = document.querySelectorAll('.button__inside')
    if (localStorage.getItem('postProcess') == "low") {
      targetAll[0].classList.add('active__language')
    }
    if (localStorage.getItem('postProcess') == "high") {
      targetAll[1].classList.add('active__language')
    }
  }, 800);
}

function graphicToMenu(event) {
  gsap.to(menu__graphic.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = true;
      menuGraphic.value = false;

      await nextTick();

      gsap.set(menu__global.value, { autoAlpha: 0 });
      gsap.to(menu__global.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
}

function menuToCustomize(event) {
  gsap.to(menu__global.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = false;
      menuCustomize.value = true;

      await nextTick();

      gsap.set(menu__customize.value, { autoAlpha: 0 });
      gsap.to(menu__customize.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
  setTimeout(() => {
    const targetAll = document.querySelectorAll('.button__inside')
    if (parseInt(localStorage.getItem('colorBall')) == '0x0000FF') {
      targetAll[0].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorBall')) == '0x8C00EC') {
      targetAll[1].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorBall')) == '0x143E2F') {
      targetAll[2].classList.add('active__language')
    }


    if (parseInt(localStorage.getItem('colorRacket')) == '0x0000FF') {
      targetAll[3].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorRacket')) == '0x8C00EC') {
      targetAll[4].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorRacket')) == '0x143E2F') {
      targetAll[5].classList.add('active__language')
    }


    if (parseInt(localStorage.getItem('colorField')) == '0x0000FF') {
      targetAll[6].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorField')) == '0x8C00EC') {
      targetAll[7].classList.add('active__language')
    }
    if (parseInt(localStorage.getItem('colorField')) == '0x143E2F') {
      targetAll[8].classList.add('active__language')
    }
  }, 800);
}

function customizeToMenu(event) {
  gsap.to(menu__customize.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = true;
      menuCustomize.value = false;

      await nextTick();

      gsap.set(menu__global.value, { autoAlpha: 0 });
      gsap.to(menu__global.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
}

const changeForFrench = () => {
  localStorage.setItem("language", "fr");
  locale.value = 'fr';

  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.add('active__language')
  targetAll[1].classList.remove('active__language')
  targetAll[2].classList.remove('active__language')
};

const changeForEnglish = () => {
  localStorage.setItem("language", "en");
  locale.value = 'en';


  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.remove('active__language')
  targetAll[1].classList.add('active__language')
  targetAll[2].classList.remove('active__language')
};

const changeForSpanish = () => {
  localStorage.setItem("language", "sp");
  locale.value = 'sp';


  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.remove('active__language')
  targetAll[1].classList.remove('active__language')
  targetAll[2].classList.add('active__language')
};

const changeForBlueBall = () => {
  localStorage.setItem("colorBall", 0x0000FF);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.add('active__language')
  targetAll[1].classList.remove('active__language')
  targetAll[2].classList.remove('active__language')
}

const changeForRedBall = () => {
  localStorage.setItem("colorBall", 0x8C00EC);
  console.log(localStorage)
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.remove('active__language')
  targetAll[1].classList.add('active__language')
  targetAll[2].classList.remove('active__language')
}

const changeForGreenBall = () => {
  localStorage.setItem("colorBall", 0x143E2F);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.remove('active__language')
  targetAll[1].classList.remove('active__language')
  targetAll[2].classList.add('active__language')
}

const changeForBlueRacket = () => {
  localStorage.setItem("colorRacket", 0x0000FF);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[3].classList.add('active__language')
  targetAll[4].classList.remove('active__language')
  targetAll[5].classList.remove('active__language')
}

const changeForRedRacket = () => {
  localStorage.setItem("colorRacket", 0x8C00EC);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[3].classList.remove('active__language')
  targetAll[4].classList.add('active__language')
  targetAll[5].classList.remove('active__language')
}

const changeForGreenRacket = () => {
  localStorage.setItem("colorRacket", 0x143E2F);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[3].classList.remove('active__language')
  targetAll[4].classList.remove('active__language')
  targetAll[5].classList.add('active__language')
}

const changeForBlueField = () => {
  localStorage.setItem("colorField", 0x0000FF);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[6].classList.add('active__language')
  targetAll[7].classList.remove('active__language')
  targetAll[8].classList.remove('active__language')
}

const changeForRedField = () => {
  localStorage.setItem("colorField", 0x8C00EC);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[6].classList.remove('active__language')
  targetAll[7].classList.add('active__language')
  targetAll[8].classList.remove('active__language')
}

const changeForGreenField = () => {
  localStorage.setItem("colorField", 0x143E2F);
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[6].classList.remove('active__language')
  targetAll[7].classList.remove('active__language')
  targetAll[8].classList.add('active__language')
}

const changeForLowGraphics = () => {
  localStorage.setItem("postProcess", 'low');
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.add('active__language')
  targetAll[1].classList.remove('active__language')
}

const changeForHighGraphics = () => {
  localStorage.setItem("postProcess", 'high');
  const targetAll = document.querySelectorAll('.button__inside')
  targetAll[0].classList.remove('active__language')
  targetAll[1].classList.add('active__language')
}

onMounted(() => {
  gsap.from(menuButton.value, {
    autoAlpha: 0,
    duration: 1,
    yPercent: 20,
    ease: "expo.inOut"
  })
  gsap.set(closeButton.value, { autoAlpha: 0 });
})
</script>

<style lang="scss">
.start__menuside {
  position: absolute;
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: row;

  .menu__button,
  .menu__button2 {
    position: absolute;
    margin-top: 0.5rem;
    margin-right: 2rem;
    top: 2.5rem;
    right: 2.5rem;
    cursor: pointer;
    z-index: 10;
  }

  .empty {
    height: 100%;
    width: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu__side {
    margin: auto;

  }

  .menu__side>* {
    margin-bottom: 2rem;
  }
}

.etat1 {
  transition: all ease-in-out 0.3s;
  transition-delay: 250ms;
  background-color: rgba(0, 0, 0, 0);

  .empty {
    opacity: 0;
    pointer-events: none;
    transition: all ease-in-out 0.3s;
  }

  .menu__side {
    opacity: 0;
    pointer-events: none;
    transition: all ease-in-out 0.3s;
  }

  .menu__button {
    opacity: 1;
    pointer-events: all;
  }

  .menu__button2 {
    opacity: 0;
    pointer-events: none;
  }
}

.etat2 {
  transition: all ease-in-out 0.3s;
  background-color: #0000009c;

  .empty {
    opacity: 1;
    pointer-events: all;
    transition: all ease-in-out 0.3s;
    transition-delay: 250ms;
  }

  .menu__side {
    pointer-events: all;
    opacity: 1;
  }

  .menu__button {
    opacity: 0;
    pointer-events: none;
  }

  .menu__button2 {
    opacity: 1;
    pointer-events: all;
  }
}

.french__active {
  background: #04d7f350;
}
</style>