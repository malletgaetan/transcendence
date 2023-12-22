<template>
  <Header />
  <RouterView />
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/Header.vue"
import { ref, nextTick, onMounted, onUpdated } from "vue";
import Experience from "./Experience/Experience.js";

let socket = ref(null);
let experience = ref(null);
const canvas = ref(null);
const overlay = ref(null);

onMounted(() => {
  if (window.localStorage.length == 0)
  {
    localStorage.setItem('colorBall', '9175276');
    localStorage.setItem('colorRacket', '255');
    localStorage.setItem('colorField', '255');
    localStorage.setItem('postProcess', 'high');
  }
  experience = new Experience(canvas.value);
});
</script>
