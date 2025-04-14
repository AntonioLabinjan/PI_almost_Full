// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import TodoPage from '../views/TodoPage.vue'
import ImageUpload from '../views/ImageUpload.vue'
import { useUserStore } from '../stores/user'
import { auth } from '../firebase'


const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/todo', name: 'TodoPage', component: TodoPage},
  { path: '/images', name: 'ImageUpload', component: ImageUpload} 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
