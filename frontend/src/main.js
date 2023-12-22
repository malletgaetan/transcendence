import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './locales/i18n'

import App from './App.vue'
import router from './router'


const app = createApp(App)


app.use(createPinia())
app.use(router)

app.use(i18n).mount('#app')