<template>
  <div class="button__outside">
    <div class="button__middle">
      <button class="button__inside" type="button">
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

<style lang="scss">
.button__outside {
  cursor: pointer;
  width: 14.75rem;
  height: 2.375rem;
  position: relative;
  padding: 2px;
  transform: skew(-40deg);
  background-color: rgba(255, 255, 255, 0);
  transition-duration: 200ms;
  transition: all ease-in-out 0.5s;
  box-sizing: content-box;

  .button__middle {
    cursor: pointer;
    padding: 3px;
    width: 100%;
    height: 100%;
    border: 1.5px solid #04d7f350;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: content-box;

    .button__inside {
      cursor: pointer;
      width: 99%;
      height: 99%;
      border: 1.5px solid #04d7f39d;
      color: #04D7F3;
      background-color: rgba(255, 255, 255, 0);
      transition: all ease-in-out 0.2s;
      box-sizing: content-box;
    }

    .button__inside__p {
      cursor: pointer;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.2rem;
      transform: skew(40deg);
      margin: 0;
      box-sizing: content-box;
    }
  }

  .button__middle__left {
    width: 30%;
    height: 50%;
    position: absolute;
    left: -5px;
    top: -5px;
    border: 1px solid #04D7F3;
    border-bottom: none;
    border-right: none;
    opacity: 0;
    transition: all ease-in-out 0.2s;
    pointer-events: none;
  }


  .button__middle__right {
    width: 30%;
    height: 50%;
    position: absolute;
    right: -15px;
    bottom: -14px;
    border: 1px solid #04D7F3;
    border-top: none;
    border-left: none;
    opacity: 0;
    transition: all ease-in-out 0.2s;
    pointer-events: none;
  }

  .button__middle__left__hover {
    width: 70%;
    height: 50%;
    position: absolute;
    right: -15px;
    top: -5px;
    border: 0px solid #04D7F3;
    border-bottom: none;
    border-left: none;
    opacity: 0;
    pointer-events: none;
  }


  .button__middle__right__hover {
    width: 70%;
    height: 50%;
    position: absolute;
    left: -6px;
    bottom: -14px;
    border: 0px solid #04D7F3;
    border-top: none;
    border-right: none;
    opacity: 0;
    pointer-events: none;
  }

  .active__language {
    background: #04d7f350 !important;
  }

  &:hover {
    transition: all ease-in-out 0.2s;
    transition-duration: 200ms;

    .button__inside {
      background: #04d7f350;
      transition-duration: 200ms;
      transition: all ease-in-out 0.2s;

    }

    .button__inside__p {
      transition: all ease-in-out 0.2s;
      transition-duration: 200ms;
    }

    .button__middle__left__hover,
    .button__middle__right__hover {
      opacity: 0;
      transition: all ease-in-out 0.5s;
      pointer-events: none;
    }

    .button__middle__left,
    .button__middle__right {
      opacity: 1;
      transition: all ease-in-out 0.4s;
      pointer-events: none;
    }
  }
}
</style>