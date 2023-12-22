<template>
  <section id="start__startgame" class="align-items-center justify-content-center">
    <!-- Menu Connect -->
    <div class="middle__page">
      <Title />
    </div>
    <div class="bottom__page align-items-center justify-content-center">
      <div class="button__login">
        <ButtonInterface :name="$t('login')" @click="eventLogin"/>
      </div>
      <div class="button__login__42">
        <ButtonInterface :name="$t('login') + ' 42'" @click="eventLogin42"/>
      </div>
      <div class="button__register">
        <ButtonInterface :name="$t('register')" @click="eventRegister"/>
      </div>
    </div>
  </section>
</template>

<script setup>
/* vue */
import router from "../router";

/* components */
import ButtonInterface from "./childs/ButtonInterface.vue";
import Title from "./childs/Title.vue";

const eventLogin = (event) => {
  // Process login
  router.push("/login");
};

const eventLogin42 = (event) => {
  // Process login 42
  window.location.replace(`https://api.intra.42.fr/oauth/authorize?client_id=${import.meta.env.VITE_42_OAUTH_CLIENT_UID}&redirect_uri=${import.meta.env.VITE_42_OAUTH_REDIRECT_URL}&response_type=code`);
};

const eventRegister = (event) => {
  // Process register
  router.push("/register");
};

const eventGuest = (event) => {
  // Process register
  router.push("/game");
};
</script>

<style lang="scss">
#start__startgame {
  z-index: 1;
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.middle__page {
  width: 100%;
  height: 13rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom__page {
  width: 100%;
  height: 17.188rem;
  display: flex;
  flex-direction: column;
}

.bottom__page>* {
  margin-bottom: 2rem;
}

.testing_api_button {
  width: 5rem;
  height: 5rem;
  display: block;
}
</style>
