<template>
    <section id="popupWrapper" ref="popupRef" class="d-flex align-items-center justify-content-center">
        <div class="pop__up d-flex flex-column align-items-center justify-content-space-between" ref="popUp">
        <div class="alerte__title align-items-center justify-content-center">
            <h1>{{ alertTitle }}</h1>
        </div>
            <div class="alerte__info align-items-center justify-content-center">
                <p class="alerte__content">{{ alertInfo }}</p>
            </div>
            <ButtonInterface :name="$t('close')"/>
        </div>
        <div ref="overlay" id="overlay"></div>
    </section>
</template>

<script setup>
import ButtonInterface from './ButtonInterface.vue';
import { onMounted, ref } from 'vue';
import gsap from 'gsap'

const popupRef = ref(null)

const props = defineProps({
  alertTitle: {
    type: String,
    required: true
  },
  alertInfo: {
    type: String,
    required: true
  }
});

onMounted(() => {
    gsap.from(popupRef.value, {
        autoAlpha: 0,
        duration:1,
        ease:"expo.inOut"
    })
})
</script>

<style lang="scss">

#popupWrapper {
    z-index: 999;
    width: 100vw;
    height: 100vh;
    position: absolute;
}

#overlay {
    background-color: rgba($color: #000000, $alpha: 0.5);
}
    .pop__up {
        z-index: 9;
        padding: 2rem;
        width: 30rem;
        position: absolute;
        top: 50;
        left: 50;
        border: 0.5px solid #04D7F3;
        background-color: rgba($color: #000000, $alpha: 0.9);
        // color: white;
        color: #04D7F3;
        .alerte__title {
            display: flex;
            
            h1 {
                margin: 0;
                font-size: 0.8rem;
            }
        }
        .alerte__info {
            font-size: 0.8rem;
            height: 8rem;
            display: flex;
            flex-direction: column;
        }

        p {
            margin-bottom: 0;
        }
    }
</style>