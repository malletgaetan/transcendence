import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuPrincipal from '../views/MenuPrincipal.vue'
import InGame from '../views/InGame.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/game',
      name: 'MenuPrincipal',
      component: MenuPrincipal
    },
    {
      path: '/game/start',
      name: 'InGame',
      component: InGame
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView,
    }
  ]
})

export default router
