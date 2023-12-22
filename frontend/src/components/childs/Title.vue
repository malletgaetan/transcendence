<template>
  <div class="middle__page__title">
    <h1 class="blue">Transcendence</h1>
    <h2 class="pink">2042</h2>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.middle__page__title {
  transition: all ease-in-out 0.3s;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  h1 {
    margin: 0;
    transition: all ease-in-out 0.3s;
  }

  h2 {
    transition: all ease-in-out 0.3s;
  }

  .blue {
    z-index: 1;
    color: #04D7F3;
    font-size: 3.171rem;
    font-family: 'Cyberpunk';
    text-transform: uppercase;
  }

  .pink {
    z-index: 1;
    color: #EC008C;
    font-size: 1.2rem;
    letter-spacing: 2rem;
    margin-right: -1.25rem;
    margin-top: 1rem;
  }

}
</style>