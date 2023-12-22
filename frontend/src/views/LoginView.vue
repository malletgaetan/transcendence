<template>
	<main>
		<section id="start__menuprincipal" ref="loginPage">
			<Title />
			<form @submit.prevent="processForm" class="d-flex" id="login-form">
				<ul>
					<li v-for="(field, label) in fields" :key="label">
						<label :for="label">{{ field.label }}</label>
						<input v-model="user[label]" :type="field.type" :id="label" :name="label" />
					</li>
				</ul>
				<div class="window d-flex align-items-center justify-content-center">
					<ButtonInterfaceSubmit :name="$t('login')" />
					<ButtonInterface :name="$t('back')" @click="router.push('/')" />
				</div>
			</form>
			<div ref="overlay" id="overlay"></div>

			<section v-if="isDoubleAuth" id="popupWrapper" ref="popupAuth"
				class="d-flex align-items-center justify-content-center">
				<div class="pop__up d-flex flex-column align-items-center justify-content-space-between" ref="popUp">
					<div class="alerte__title align-items-center justify-content-center">
						<h1>Login with 2FA</h1>
					</div>
					<div class="alerte__info align-items-center justify-content-center">
						<p class="alerte__content">You need to choose a 2FA method.</p>
					</div>
					<div class="margin_button" id="wrapperAuthMethods">
						<ButtonInterface name="QR Code" @click="chooseQR" />
						<ButtonInterface name="Mail" @click="chooseMail" />
						<ButtonInterface :name="$t('phone')" @click="choosePhone" />
						<ButtonInterface :name="$t('close')" @click="closeDoubleAuth" />
					</div>
				</div>
				<div ref="overlay" id="overlay"></div>
			</section>

			<section v-if="doubleAuthField" id="popupWrapper" ref="popupRef"
				class="d-flex align-items-center justify-content-center">
				<div id="popupWrapperAuth" class="pop__up d-flex flex-column align-items-center justify-content-space-between" ref="popUp">
					<div v-if="authIsQR" id="QRCode">
					</div>
					<div class="alerte__title align-items-center justify-content-center">
						<h1>{{ $t('code_title') }}</h1>
					</div>
					<input id="authCode" type="text" name="code2FA" />
					<ButtonInterface :name="$t('validation')" @click="processValidation" />
				</div>
				<div ref="overlay" id="overlay"></div>
			</section>


			<PopUp v-if="wrongLogin" :alertTitle="$t('alert_title_login')" :alertInfo="$t('alert_info_login')"
				@click="closePopup" />
			<PopUp v-if="sucessLogin" :alertTitle="$t('success_title_login')" :alertInfo="$t('success_info_login')"
				@click="closePopup" />
		</section>
	</main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { entranceHome } from "../composables/views/entranceViews.js";
import { quitHome, quitMenuPrincipal } from "../composables/views/quitViews.js";
import router from "../router";
import ButtonInterfaceSubmit from "../components/childs/ButtonInterfaceSubmit.vue";
import ButtonInterface from "../components/childs/ButtonInterface.vue";
import Title from "../components/childs/Title.vue";
import PopUp from "../components/childs/PopUp.vue";
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const popupAuth = ref(null)
const loginPage = ref(null);
const wrongLogin = ref(false);
const sucessLogin = ref(false);
const isDoubleAuth = ref(false);
const doubleAuthField = ref(false);

const authIsQR = ref(false);
const authIsMail = ref(false);
const authIsPhone = ref(false);

const fields = {
	user_name: { label: t('username'), type: "text" },
	user_password: { label: t('password'), type: "password" },
};

const user = ref({
	user_name: "",
	user_password: "",
});

const processValidation = (event) => {
	if (authIsQR.value == true) {
		isDoubleAuth.value = false;
		doubleAuthField.value = false;
		processQR(event);
	}

	if (authIsMail.value == true) {
		isDoubleAuth.value = false;
		doubleAuthField.value = false;
		processMail(event);
	}

	if (authIsPhone.value == true) {
		processPhone(event);
	}

}

const chooseQR = (event) => {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha: 0,
		duration: 0.7,
		ease: "expo.inOut",
		onComplete: () => {
			isDoubleAuth.value = false;
			doubleAuthField.value = true;
			authIsQR.value = true;
			getQrCode(event);
		}
	})
}

const chooseMail = (event) => {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha: 0,
		duration: 0.7,
		ease: "expo.inOut",
		onComplete: () => {
			isDoubleAuth.value = false;
			doubleAuthField.value = true;
			authIsMail.value = true;
			sendMail(event);
		}
	})
}

const choosePhone = (event) => {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha: 0,
		duration: 0.7,
		ease: "expo.inOut",
		onComplete: () => {
			isDoubleAuth.value = false;
			doubleAuthField.value = true;
			authIsPhone.value = true;
			sendSMS(event);
		}
	})
}

function closeDoubleAuth() {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha: 0,
		duration: 0.7,
		ease: "expo.inOut",
		onComplete: () => {
			isDoubleAuth.value = false;
		}
	})
}

function closePopup(event) {
	const popup = document.getElementById('popupWrapper')
	gsap.to(popup, {
		autoAlpha: 0,
		duration: 1,
		ease: "expo.inOut",
		onComplete: () => {
			if (wrongLogin.value == true) {
				wrongLogin.value = false;
				return;
			} else if (sucessLogin.value == true) {
				sucessLogin.value = false;
				router.push('/game');
			}
		}
	})
}

async function sendSMS(event) {
	try {
		event.preventDefault();
		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/send-sms/?username=${user.value.user_name}&password=${user.value.user_password}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);
			wrongLogin.value = true;
			return;
		}
	} catch (error) {
		console.error("An error occurred in sendSMS:", error);
	}
}

async function sendMail(event) {
	try {
		event.preventDefault();
		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/send-mail/?username=${user.value.user_name}&password=${user.value.user_password}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});
		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);
			wrongLogin.value = true;
			return;
		}
	} catch (error) {
		console.error("An error occurred in sendMail:", error);
	}
}

async function processPhone(event) {
	try {
		event.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/send-sms/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				otp: document.getElementById('authCode').value,
				username: user.value.user_name,
				password: user.value.user_password
			}),
		});

		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);
			wrongLogin.value = true;
			return;
		}

		const text = await response.text();
		if (!text) {
			console.log("Empty response from the server");
			return;
		}

		let data;
		try {
			data = JSON.parse(text);
			if ('token' in data) {
				localStorage.setItem("userLogin", user.value.user_name);
				localStorage.setItem("userToken", data['token']);
				sucessLogin.value = true;
				router.push('/game');
			}
		} catch (jsonError) {
			console.log("Error parsing JSON:", jsonError);
			return;
		}

	} catch (error) {
		console.error("An error occurred in processPhone:", error);
	}
}

async function processMail(event) {
	try {
		event.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/send-mail/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				otp: document.getElementById('authCode').value,
				username: user.value.user_name,
				password: user.value.user_password
			}),
		});

		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);
			wrongLogin.value = true;
			return;
		}

		const text = await response.text();
		if (!text) {
			console.log("Empty response from the server");
			return;
		}

		let data;
		try {
			data = JSON.parse(text);
			if ('token' in data) {
				localStorage.setItem("userLogin", user.value.user_name);
				localStorage.setItem("userToken", data['token']);
				sucessLogin.value = true;
				router.push('/game');
			}
		} catch (jsonError) {
			console.log("Error parsing JSON:", jsonError);
			return;
		}

	} catch (error) {
		console.error("An error occurred in processMail:", error);
	}
}

async function processQR(event) {
	try {
		event.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				otp: document.getElementById('authCode').value,
				username: user.value.user_name,
				password: user.value.user_password
			}),
		});

		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);			
			wrongLogin.value = true;
			return;
		}

		const text = await response.text();
		if (!text) {
			console.log("Empty response from the server");
			return;
		}

		let data;
		try {
			data = JSON.parse(text);
			if ('token' in data) {
				localStorage.setItem("userLogin", user.value.user_name);
				localStorage.setItem("userToken", data['token']);
				sucessLogin.value = true;
				router.push('/game');
			}
		} catch (jsonError) {
			console.log("Error parsing JSON:", jsonError);
			return;
		}
	} catch (error) {
		console.error("An error occurred in processQR:", error);
	}
}

async function getQrCode(event) {
	try {
		event.preventDefault();
		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/otp/?username=${user.value.user_name}&password=${user.value.user_password}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			}
		});
		const text = await response.text();
		if (!text) {
			console.log("Empty response from the server");
			return;
		}

		let data;
		try {
			data = JSON.parse(text);
			if ('qr_code' in data) {
				let xml = new DOMParser().parseFromString(data['qr_code'], 'application/xml')

				document.getElementById('QRCode').replaceWith(xml.documentElement);
			}
		} catch (jsonError) {
			console.log("Error parsing JSON:", jsonError);
			return;
		}
	} catch (error) {
		console.error("An error occurred in getQrCode:", error);
	}
}

async function processForm(event) {
	try {
		event.preventDefault();

		const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/user/login/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user.value.user_name,
				password: user.value.user_password,
			}),
		});

		if (response.status !== 200) {
			console.log(`HTTP Error: ${response.status}`);
			wrongLogin.value = true;
			return;
		}
		isDoubleAuth.value = true;
	} catch (error) {
		console.error("An error occurred in processForm:", error);
	}
}

onBeforeRouteLeave((to, from, next) => {
	quitHome(loginPage.value, next);
});

onMounted(() => {
	for (const [key, value] of Object.entries(localStorage)) {
		if (key.includes('player'))
			localStorage.removeItem(key);
	}
	entranceHome(loginPage.value);
});
</script>

<style lang="scss">

#popupWrapperAuth {
	padding: 3rem;
	svg {
		background-color: #04D7F3;
		margin-bottom: 2rem;
	}
}

#authField {
	margin-bottom: 2rem;
	outline: none;
	border: none;
	border-bottom: 1px solid #04D7F3;
	background: rgba(0, 0, 0, 0);
	padding: 0.5rem;
	color: #04D7F3;
	user-select: none;
	margin-top: 2rem;
}

.window {
	z-index: 1;
}

#loginPage {
	position: absolute;
	width: 100vw;
	height: 100vh;
	background-color: #0000009c;
}

form {
	font-size: 0.8rem;
	z-index: 5;
	width: 35rem;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	ul {
		display: flex;
		width: 100%;
		justify-content: space-between;
		flex-direction: row;
		list-style: none;
		text-align: center;
		padding: 0;
		margin-bottom: 4rem;
		margin-top: 3rem;

		li {
			display: flex;
			flex-direction: column;

			label {
				color: #04D7F3;
				margin-bottom: 1rem;
			}
		}
	}

	span {
		.first {
			margin-bottom: 1rem;
		}

		color: rgb(196, 88, 88);
		font-size: 0.7rem;
	}

	.wrapper__span {
		border: 1px solid rgb(196, 88, 88);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 2rem;
	}

	label {
		list-style-type: none;
	}

	input {
		outline: none;
		border: none;
		border-bottom: 1px solid #04D7F3;
		background: rgba(0, 0, 0, 0);
		padding: 0.5rem;
		color: #04D7F3;
		user-select: none;
	}
}

.margin_button > * {
	margin-bottom: 2rem;
}

#authCode {
	margin-bottom: 2rem;
}
</style>
