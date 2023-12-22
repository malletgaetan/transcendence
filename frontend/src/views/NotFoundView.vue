<template>
  <section id="notFoundPage" ref="notFoundPage">
    <div class="middle__page__title">
      <h1 class="blue">Not Found</h1>
      <h2 class="pink">404</h2>
    </div>
    <div id="overlay" class="overlay"></div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap'
import { onBeforeRouteLeave } from 'vue-router';

const notFoundPage = ref(null)

onBeforeRouteLeave((to, from, next) => {
  gsap.to(notFoundPage.value, {
    autoAlpha: 0,
    duration: 1,
    ease: "expo.inOut",
    onComplete: () => {
      next();
    }
  })
})

onMounted(() => {
  gsap.from(notFoundPage.value, {
    autoAlpha: 0,
    duration: 1,
    ease: "expo.inOut"
  })
})
</script>

<style scoped lang="scss">
.middle__page__title {
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .overlay {
    position: absolute;
  }
}
</style>
