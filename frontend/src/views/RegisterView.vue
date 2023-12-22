<template>
	<main>
		<section id="start__menuprincipal" ref="registerPage">
			<Title />
			<form @submit.prevent="processRegister" class="d-flex" id="register-form">
				<ul id="registerFields">
					<li v-for="(field, label) in fields" :key="label">
						<label :for="label">{{ field.label }}</label>
						<input v-model="user[label]" :type="field.type" :id="label" :name="label" />
					</li>
				</ul>
				<div class="wrapper__span">
					<span class="first">Username is 20 characters maximum</span>
					<span>Password must be at least 8 characters</span>
					<span>Phone number must be in french format</span>
				</div>
				<div class="window d-flex align-items-center justify-content-center">
					<ButtonInterfaceSubmit :name="$t('register')"/>
					<ButtonInterface :name="$t('back')" @click="router.push('/')" />
				</div>
			</form>
			<div ref="overlay" id="overlay"></div>
			<PopUp v-if="wrongRegister" :alertTitle="$t('alert_title_register')" :alertInfo="$t('alert_info_register')" @click="closePopup"/>
			<PopUp v-if="wrongRegisterUsername" :alertTitle="$t('alert_title_register')" :alertInfo="$t('alert_info_register_username')" @click="closePopup"/>
			<PopUp v-if="successRegister" :alertTitle="$t('success_title_register')" :alertInfo="$t('success_info_register')"  @click="closePopup"/>
		</section>
	</main>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { entranceHome } from "../composables/views/entranceViews.js";
import { quitHome, quitMenuPrincipal } from "../composables/views/quitViews.js";
import router from "../router";
import ButtonInterface from "../components/childs/ButtonInterface.vue";
import ButtonInterfaceSubmit from "../components/childs/ButtonInterfaceSubmit.vue";
import Title from "../components/childs/Title.vue";
import PopUp from "../components/childs/PopUp.vue";
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const registerPage = ref(null);
const loginRef = ref(null);
const wrongRegister = ref(false);
const successRegister = ref(false);
const wrongRegisterUsername = ref(false);

function closePopup(event) {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha:0,
		duration:1,
		ease:"expo.inOut",
		onComplete: () => {
			if (wrongRegister.value == true 
			|| wrongRegisterUsername.value == true) {
				wrongRegister.value = false;
				wrongRegisterUsername.value = false;
				return;
			} else if (successRegister.value == true) {
				successRegister.value = false;
				router.push('/login');
			}
		}
	})
}

const fields = {
	user_name: { label: t('username'), type: "text" },
	user_password: { label: t('password'), type: "password" },
	user_email: { label: 'mail', type: "email" },
	user_tel: { label: 'phone (fr)', type: "tel" },
};

const user = ref({
	user_name: "",
	user_password: "",
	user_email: "",
	user_tel: "",
});

async function processRegister(event) {
	try {
		event.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user.value.user_name,
				password: user.value.user_password,
				email: user.value.user_email,
				phone_number: user.value.user_tel
			}),
		});
		if (response.status == 409) {
			console.log(`HTTP Error: ${response.status}`);
			wrongRegisterUsername.value = true;
		}
		if (response.status !== 201) {
			console.log(`HTTP Error: ${response.status}`);
			wrongRegister.value = true;
			return;
		} else if (response.status == 201) {
			successRegister.value = true;
		}

	} catch (error) {
		console.error("An error occurred in processForm:", error);
	}
}

onBeforeRouteLeave((to, from, next) => {
	quitHome(registerPage.value, next);
});

onMounted(() => {
	for (const [key, value] of Object.entries(localStorage)) {
        if (key.includes('player'))
            localStorage.removeItem(key);
  }
	entranceHome(registerPage.value);
});
</script>

<style scoped lang="scss">
#registerFields {
	width: 65rem!important;
}
</style>
