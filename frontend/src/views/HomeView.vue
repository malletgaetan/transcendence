<template>
  <main>
    <section ref="homePage" id="homePage">
      <StartGame />
      <div ref="overlay" id="overlay"></div>
    </section>
  </main>
</template>

<script setup>
/* vue + gsap */
import { ref, nextTick, onMounted, onUpdated } from "vue";
import { onBeforeRouteLeave, useLink } from "vue-router";
import gsap from "gsap";

/* components */
import StartGame from "../components/StartGame.vue";

/* composables */
import { entranceHome } from "../composables/views/entranceViews.js";
import { quitHome } from "../composables/views/quitViews.js";
import router from "../router";

const homePage = ref(null);

onBeforeRouteLeave((to, from, next) => {
  quitHome(homePage.value, next);
});

onMounted(() => {
  for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('player'))
            localStorage.removeItem(key);
  }
  entranceHome(homePage.value);
  token = localStorage.getItem("userToken")
  username = localStorage.getItem("userLogin")
  if (token !== null && username !== null) {
    checkToken(token)
  }
})

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
let token = urlParams.get('token')
let username = urlParams.get('username')
if (token !== null && username !== null) {
  localStorage.clear()
	localStorage.setItem("userLogin", username)
	localStorage.setItem("userToken", token)
	router.push('/game')
}

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
      localStorage.clear()
    } else {
      router.push("/game")
    }
  } catch (error) {
    console.log("Error occurred wih Token Checking", error)
  }
}
</script>

<style lang="scss">
#header {
  z-index: 2;
  position: fixed;
  width: 100vw;
  height: 5rem;
}

#overlay {
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
</style>
