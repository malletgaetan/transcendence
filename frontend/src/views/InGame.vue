<template>
    <section ref="inGamePage">
        <MenuSide />
        <div class="interface__game" ref="interfaceGame">
            <div id="scoreBoard" ref="scoreBoard">
                <span class="score__title">{{ $t('score') }}</span>
                <span ref="scoreContent" class="score__value">0 - 0</span>
            </div>
            <div id="giveUpWrapper">
                <ButtonInterface :name="$t('quit')" @click="processGivUp" />
            </div>
        </div>
        <section ref="localGameStartInterface" v-if="localGameStart" id="localGameStart" class="d-flex align-items-center justify-content-center">
            <ButtonInterface :name="$t('start')" @click="StartLocalGame"/>
        </section>
    </section>

    <section v-if="tournamentRegister" ref="tournamentInterface" id="tournamentInterface"
        class="d-flex flex-column align-items-center justify-content-center">
        <li v-for="(field, label) in fields" :key="label"
            class="d-flex flex-nowrap align-items-center justify-content-center">
            <label :for="label">{{ field.label }}</label>
            <input v-model="user[label]" :type="field.type" :id="label" :name="label" />
        </li>
        <ButtonInterface :name="$t('start')" @click="processStartTournament" />
    </section>
    <section id="tournamentWrapperTarget" ref="tournamentTarget" class="d-flex align-items-center justify-content-center ">
    </section>
    <PopUp v-if="popupTournamentError" :alertTitle="$t('alert_title_tournament')" :alertInfo="$t('alert_tournament_register')"
        @click="closePopup" />
</template>

<script setup>
/* vue + gsap */
import { ref, onMounted, watch, onUpdated } from 'vue';
import router from '../router';
import gsap from 'gsap'
import { useI18n } from 'vue-i18n';

/* components */
import MenuSide from '../components/MenuSide.vue';
import ButtonInterface from '../components/childs/ButtonInterface.vue';

/* composables */
import { TransparencyValues } from '../composables/scene/TransparencyValues.js';
import { startLocalGame, startMultiLocal, startOnlineGame, startTournament } from '../composables/game/startGame.js'
import { endGame } from '../composables/game/endGame.js'
import { onBeforeRouteLeave } from 'vue-router';
import PopUp from "../components/childs/PopUp.vue";
import { quitHome } from '../composables/views/quitViews';
import { socket } from '../Experience/Game/OnlineGame.js';

const exp = window.experience
const inGamePage = ref(null)
const interfaceGame = ref(null)
const tournamentRegister = ref(false)
const scoreContent = ref(null)
const tournamentInterface = ref(null)
const localGameStart = ref(false)
const localGameStartInterface = ref(null)
const { t } = useI18n();
const fields = {
    player_1: { label: t('player1'), type: "text" },
    player_2: { label: t('player2'), type: "text" },
    player_3: { label: t('player3'), type: "text" },
    player_4: { label: t('player4'), type: "text" },
    player_5: { label: t('player5'), type: "text" },
    player_6: { label: t('player6'), type: "text" },
    player_7: { label: t('player7'), type: "text" },
    player_8: { label: t('player8'), type: "text" },
};

const user = ref({
    player_1: "",
    player_2: "",
    player_3: "",
    player_4: "",
    player_5: "",
    player_6: "",
    player_7: "",
    player_8: "",
});

function cleaningOldPlayers() {
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('player'))
            localStorage.removeItem(key);
    }
}

function storePlayersInExperience() {
    const players = window.experience.localGame.players;
    let index = 0;
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('player')) {
            players[index].alias = localStorage.getItem('player_' + (index + 1));
            index++;
        }
    }
}

const popupTournamentError = ref(false)
const tournamentTarget = ref(null)

function closePopup(event) {
    const popup = document.getElementById('popupWrapper')
    gsap.to(popup, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
            popupTournamentError.value = false;
        }
    })
}

function processStartTournament(event) {

    cleaningOldPlayers()

    for (const [key, value] of Object.entries(user.value)) {
        if (value === "") {
            popupTournamentError.value = true
            return;
        }
        else
            localStorage.setItem(key, value);
    }

    storePlayersInExperience();
    
    gsap.to(tournamentInterface.value, {
        autoAlpha:0,
        duration:1.3,
        ease:"expo.inOut",
        onComplete: () => {
            tournamentRegister.value = false;
        }
    })
    
    setTimeout(() => {
        window.experience.localGame.initTournament()
    }, 1000);
}

function processGivUp(event) {
    if (window.experience.chooseMatchmaking && socket != null)
        socket.close();
    if (window.experience.chooseTournament) {
        if (tournamentInterface.value) {
            gsap.to(tournamentInterface.value, {
                opacity: 0,
                duration: 0.7,
                ease: "expo.inOut"
            })
        }

        if(localGameStart.value == true) {
            const wrapper = document.getElementById('localGameStart')
            gsap.to(wrapper.value, {
                opacity: 0,
                duration: 0.7,
                ease: "expo.inOut"
            })
        }
    
        gsap.to(tournamentTarget.value, {
            opacity: 0,
            duration: 0.7,
            ease: "expo.inOut",
            onComplete: () => {
                // endGame();
                router.push('/game')
            }
        })
    } else {
        // endGame();
        router.push('/game')
    }
}

function StartLocalGame(event) {
    const menuButton = document.querySelector('.menu__button')

    gsap.to(localGameStartInterface.value, {
        autoAlpha: 0,
        duration: 0.7,
        ease:"expo.inOut",
        onComplete : () => {
            window.experience.localGamePaused = false
        }
    })

    gsap.to(menuButton, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "expo.inOut",
            onComplete: () => {
                menuButton.style.pointerEvents = 'auto'
            }
        })
}

onBeforeRouteLeave((to, from, next) => {
    quitHome(inGamePage.value, next)
    endGame();
})

onMounted(() => {
    const exp = window.experience;
    if (exp.chooseSoloLocal) {
        window.experience.localGamePaused = true

        localGameStart.value = true;

        const menuButton = document.querySelector('.menu__button')
        gsap.to(menuButton, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "expo.inOut",
            onComplete: () => {
                menuButton.style.pointerEvents = 'none'
            }
        })

        gsap.to(window.experience.walls.wallMaterial,
            { opacity: 0.1, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallLeft.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallRight.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        TransparencyValues(exp.ball, exp.paddle, exp.field, 1.0, 0.2)
        startLocalGame(interfaceGame.value);
    }
    else if (exp.chooseMultiLocal) {
        window.experience.localGamePaused = true
        localGameStart.value = true;
        
        const menuButton = document.querySelector('.menu__button')
        gsap.to(menuButton, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "expo.inOut",
            onComplete: () => {
                menuButton.style.pointerEvents = 'none'
            }
        })

        gsap.to(window.experience.walls.wallMaterial,
            { opacity: 0.1, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallLeft.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallRight.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        TransparencyValues(exp.ball, exp.paddle, exp.field, 1.0, 0.0)
        startMultiLocal(interfaceGame.value)
    }
    else if (exp.chooseMatchmaking) {
        window.experience.localGamePaused = false
        TransparencyValues(exp.ball, exp.paddle, exp.field, 1.0, 0.2)
        startOnlineGame(interfaceGame.value);
    }
    else if (exp.chooseTournament) {
        window.experience.localGamePaused = true
        tournamentRegister.value = true

        const menuButton = document.querySelector('.menu__button')
        gsap.to(menuButton, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "expo.inOut",
            onComplete: () => {
                menuButton.style.pointerEvents = 'none'
            }
        })

        gsap.to(tournamentTarget.value, {
            opacity: 1,
            duration: 1,
            ease: "expo.inOut",
            onComplete: () => {
                gsap.to(tournamentInterface.value, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "expo.inOut"
                })
            }
        })

        gsap.to(window.experience.walls.wallMaterial,
            { opacity: 0.1, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallLeft.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        gsap.from(window.experience.walls.wallRight.position,
            { y: 300, duration: 1, ease: "expo.inOut" })

        TransparencyValues(exp.ball, exp.paddle, exp.field, 1.0, 0.0)
        startTournament(interfaceGame.value);
    }
    else
        router.push('/game')
})
</script>

<style lang="scss" scoped>
#localGameStart {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.7);
    opacity: 0;
}

#tournamentInterface {
    opacity: 0;
    color: white;

    li {
        margin-bottom: 1rem;
        border-bottom: 1px solid #04D7F3;
    }

    label {
        font-size: 0.8rem;
        width: 5rem;
        font-size: 0.7rem;
        color: #04D7F3;
    }
    
    input {
        font-size: 0.8rem;
        outline: none;
        border: none;
        background: rgba(0, 0, 0, 0);
        padding: 0.5rem;
        color: #04D7F3;
        user-select: none;
    }

    padding: 3rem;
    // background-color: rgba($color: #000000, $alpha: 0.5);
    // border: 0.5px solid #04D7F3;
}

#tournamentInterface>div {
    margin-top: 2rem;
}

#tournamentWrapperTarget {
    z-index: 9;
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.7);
    color: white;
    opacity: 0;
    pointer-events: none;
}


#tournamentWrapper {
    position: absolute;
    width: 100vw;
    height: 100vh;
}

#tournamentInterface {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
}

#giveUpWrapper {
    padding-top: 2rem;
}

.interface__game {
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 100vw;
    height: 8rem;
    padding: 0rem 6rem 0rem 4rem;
    bottom: 0;
    padding-bottom: 2rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6293110994397759) 100%);

    .score__title {
        margin-right: 2rem;
    }

    #scoreBoard {
        padding-top: 4rem;
    }

    span {
        color: #04D7F3;
        font-size: 0.8rem;
        text-align: center;
        letter-spacing: 0.2rem;
    }
}</style>
