<template>
  <main>
    <section id="start__menuprincipal" ref="menuPage">
        <div class="window d-flex align-items-center justify-content-center" ref="menu__global" v-if="menuGlobal">
          <Title />
          <ButtonInterface :name="$t('play')" @click="menuToPlay"/>
          <ButtonInterface :name="$t('language')" @click="menuToLanguage"/>
          <ButtonInterface :name="$t('graphics')" @click="menuToGraphic"/>
          <ButtonInterface :name="$t('customize')" @click="menuToCustomize"/>
          <ButtonInterface :name="$t('logout')" @click="processLogout"/>
        </div>
        <div class="window d-flex align-items-center justify-content-center" ref="menu__play" v-if="menuPlay">
          <Title />
          <ButtonInterface :name="$t('sololocal')" @click="menuToSoloLocal(overlay, menuPage)"/>
          <ButtonInterface :name="$t('multilocal')" @click="menuToMultiLocal(overlay, menuPage)"/>
          <ButtonInterface :name="$t('matchmaking')" @click="waitingMatch" />
          <ButtonInterface :name="$t('tournament')" @click="menuToTournament(overlay, menuPage)"/>
          <ButtonInterface :name="$t('back')" @click="playToMenu"/>
        </div>
        <div class="window d-flex align-items-center justify-content-center" ref="menu__language" v-if="menuLanguage">
          <Title />
          <ButtonInterface ref="frenchButton" :name="$t('french')" @click="changeForFrench"/>
          <ButtonInterface ref="englishButton" :name="$t('english')" @click="changeForEnglish"/>
          <ButtonInterface ref="spanishButton" :name="$t('spanish')" @click="changeForSpanish"/>
          <ButtonInterface :name="$t('back')" @click="languageToMenu"/>
        </div>
        <div class="window d-flex align-items-center justify-content-center" ref="menu__graphic" v-if="menuGraphic">
          <Title />
          <ButtonInterface :name="$t('low')" @click="changeForLowGraphics"/>
          <ButtonInterface :name="$t('high')" @click="changeForHighGraphics" />
          <ButtonInterface :name="$t('back')" @click="graphicToMenu"/>
        </div>
        <div ref="menu__customize" v-if="menuCustomize" class="window d-flex align-items-center justify-content-center">
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
        <div class="window d-flex align-items-center justify-content-center waiting" ref="menu__waiting" v-if="menuWaiting">
          <h1 class="waiting__h1">{{ $t('matchmaking') }}</h1>
          <p class="waiting__p">{{ $t('matchmaking_message') }}</p>
          <span class="loader"></span>
          <ButtonInterface :name="$t('back')" @click="waitingToMenuPlay"/>
        </div>
      </section>
      <div ref="overlay" id="overlay"></div>
  </main>
</template>

<script setup>
/* vue + gsap */
import { ref, nextTick, onMounted, onUpdated, inject } from "vue";
import { useI18n } from 'vue-i18n';

import { onBeforeRouteLeave } from "vue-router";
import router from "../router";
import gsap from "gsap";

/* components */
import ButtonInterface from "../components/childs/ButtonInterface.vue"
import Title from "../components/childs/Title.vue";

/* composables */
import { menuToMultiLocal, menuToMatchmaking, menuToSoloLocal, menuToTournament } from '../composables/game/transitionGame.js'
import { entranceMenuPrincipal } from '../composables/views/entranceViews.js'
import { quitMenuPrincipal } from "../composables/views/quitViews.js"
import LocalGame from "../Experience/Game/LocalGame";

const menuPage = ref(null);
const overlay = ref(null);
const menu__global = ref(null);
const menu__play = ref(null);
const menu__language = ref(null);
const menu__graphic = ref(null);
const menu__customize = ref(null);
const menu__waiting = ref(null);
const menuGlobal = ref(true);
const menuPlay = ref(false);
const menuLanguage = ref(false);
const menuGraphic = ref(false);
const menuCustomize = ref(false);
const menuWaiting = ref(false);
const { locale } = useI18n();

let frenchButton, englishButton, spanishButton;
let websocket = null;

function processLogout(event) {
  localStorage.clear();
  router.push('/');
}

const waitingMatch = async () => {
	gsap.to(menu__play.value, {
		autoAlpha: 0,
		duration: 0.5,
		ease: "expo.inOut",
		onComplete: async () => {
		  menuPlay.value = false;
		  menuWaiting.value = true;

		  await nextTick();

		  gsap.set(menu__waiting.value, { autoAlpha: 0 });
		  gsap.to(menu__waiting.value, {
			autoAlpha: 1,
			duration: 0.5,
			ease: "expo.inOut",
		  });
		}
	});

	const token = localStorage.getItem("userToken") || "";
	websocket = new WebSocket(`${import.meta.env.VITE_BACKEND_WEBSOCKET}/matchmaking?token=${token}`)

	websocket.onopen = function(e) {
	}

	websocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		localStorage.setItem("gameId", data.game);
		websocket.close();
		menuToMatchmaking(overlay, menuPage);
	}
	websocket.onclose = function(e) {
	}
	websocket.onerror = function(e) {
		alert('Socket Error. You need to login again');
    localStorage.clear();
    router.push('/login');
	}
}

const menuToPlay = async () => {
  gsap.to(menu__global.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = false;
      menuPlay.value = true;

      await nextTick();

      gsap.set(menu__play.value, { autoAlpha: 0 });
      gsap.to(menu__play.value, {
        autoAlpha: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
    }
  });
}

const playToMenu = async () => {
  gsap.to(menu__play.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuGlobal.value = true;
      menuPlay.value = false;

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

const waitingToMenuPlay = async () => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  gsap.to(menu__waiting.value, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "expo.inOut",
    onComplete: async () => {
      menuPlay.value = true;
      menuWaiting.value = false;

      await nextTick();

      gsap.set(menu__play.value, { autoAlpha: 0 });
      gsap.to(menu__play.value, {
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


onBeforeRouteLeave((to, from, next) => {
  quitMenuPrincipal(menuPage.value, overlay.value, next);
})

onMounted((event) => {
  let token = localStorage.getItem("userToken");
  for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('player'))
            localStorage.removeItem(key);
  }

  if (localStorage.getItem('colorBall') === null) {
      localStorage.setItem('colorBall', '9175276');
  }
  if (localStorage.getItem('colorRacket') === null) {
      localStorage.setItem('colorRacket', '255');
  }
  if (localStorage.getItem('colorField') === null) {
      localStorage.setItem('colorField', '255');
  }
  if (localStorage.getItem('postProcess') === null) {
      localStorage.setItem('postProcess', 'high');
  }

  entranceMenuPrincipal(overlay.value, menuPage.value);
  if (token !== null) {
    checkToken(token);
  }
  else {
      localStorage.removeItem("userLogin");
      localStorage.removeItem("userToken");
      router.push('/');
  }
})

async function checkToken(token) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/token/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Token " + token
      }
    })

    if (response.status !== 200) {
      localStorage.clear()
      return
    }

    const text = await response.text()
    if (!text) {
			console.log("Empty response from the server")
			return
    }

    let data;
		try {
			data = JSON.parse(text)
		} catch (jsonError) {
			console.log("Error parsing JSON:", jsonError)
			return
		}

    if (data["username"] !== username) {
      localStorage.removeItem("userLogin");
      localStorage.removeItem("userToken");
      router.push('/');
    }
  } catch (error) {
    console.log("Error occurred wih Token Checking", error)
  }
}
</script>

<style lang="scss">
#menu__Play {
  opacity: 0;
  pointer-events: none;
}

#start__menuprincipal {
  z-index: 2;
  position: absolute;
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.window {
  box-sizing: content-box;
  flex-direction: column;
}

.window>* {
  margin-bottom: 2rem;
}

.customize__h1 {
  color: white;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.div__customize {
  margin-bottom: 3rem;
  .button__outside {
    width: 12rem;
  }
  .button__outside:not(:last-child) {
    margin-right: 2rem;
  }
}

.active__language {
  background: #04d7f350 !important;
}


.waiting {
  width: 40rem;
  height: 25rem;
  // color: white;
  color: #04D7F3;
  border-radius: 1rem;

  .waiting__h1 {
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 3rem;
  }

  .waiting__p {
    font-size: 0.8rem;
  }

  .loader {
    transform: rotateZ(45deg);
    perspective: 1000px;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    // color: #fff;
    color: #EC008C;
  }
    .loader:before,
    .loader:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: inherit;
      height: inherit;
      border-radius: 50%;
      transform: rotateX(70deg);
      animation: 1s spin linear infinite;
    }
    .loader:after {
      color: #04D7F3;
      transform: rotateY(70deg);
      animation-delay: .4s;
    }
  
  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotateZ(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotateZ(360deg);
    }
  }
  
  @keyframes rotateccw {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }
  
  @keyframes spin {
    0%,
    100% {
      box-shadow: .2em 0px 0 0px currentcolor;
    }
    12% {
      box-shadow: .2em .2em 0 0 currentcolor;
    }
    25% {
      box-shadow: 0 .2em 0 0px currentcolor;
    }
    37% {
      box-shadow: -.2em .2em 0 0 currentcolor;
    }
    50% {
      box-shadow: -.2em 0 0 0 currentcolor;
    }
    62% {
      box-shadow: -.2em -.2em 0 0 currentcolor;
    }
    75% {
      box-shadow: 0px -.2em 0 0 currentcolor;
    }
    87% {
      box-shadow: .2em -.2em 0 0 currentcolor;
    }
  }
}

   

</style>
