import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Tariff from './pages/Tariff.vue'
import Contact from './pages/Contact.vue'
import BookRide from './pages/BookRide.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/tariff', name: 'Tariff', component: Tariff },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/book', name: 'BookRide', component: BookRide },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
