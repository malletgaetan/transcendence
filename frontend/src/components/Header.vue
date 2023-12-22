<template>
    <div class="header" ref="headerRef">
        <Logo @click="backToHome" />
    </div>
</template>

<script setup>
import Logo from "./childs/Logo.vue";
import router from "../router";
import { TransparencyValues } from "../composables/scene/TransparencyValues.js";
import { onMounted, ref } from "vue";
import gsap from 'gsap'
import { RouterLink } from "vue-router";

const headerRef = ref(null)

function backToHome() {
    const exp = window.experience
    TransparencyValues(exp.ball, exp.paddle, exp.field, 0.0, 0.0)
    exp.localGameStarted = false;
    router.push('/');
}

onMounted(() => {
    gsap.from(headerRef.value, {
        autoAlpha: 0,
        duration: 1,
        ease: "expo.inOut"
    })
})
</script>

<style lang="scss">
.header {
    width: 100vw;
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rem 4rem;
    padding-top: 2rem;
    position: absolute;
    z-index: 9;

    .diagonal-button {
        border: 2px solid #000;
        padding: 10px 20px;
        background-color: #fff;
        position: relative;
        overflow: hidden;

        transform: skew(-20deg);
    }

    .diagonal-button::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #fff;
        transform: skew(20deg);
        z-index: -1;
    }
}
</style>