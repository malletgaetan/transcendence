<template>
    <div class="button__outside">
      <div class="button__middle">
        <button class="button__inside" type="submit">
          <p class="button__inside__p">{{ name }}</p>
        </button>
      </div>
      <div class="button__middle__left"></div>
      <div class="button__middle__right"></div>
      <div class="button__middle__left__hover"></div>
      <div class="button__middle__right__hover"></div>
    </div>
  </template>
  <script setup>
  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });
  </script>