<template>
  <TopBar />
  <header class="header" :style="headerStyle">
    <div class="container">
      <nav class="navbar">
        <div class="logo">
          <router-link to="/" class="logo-link">
            <img v-if="companyStore.theme.logo" :src="companyStore.theme.logo" alt="Logo" class="logo-img" />
            <span class="logo-text">{{ companyStore.companyName }}</span>
          </router-link>
        </div>
        
        <ul class="nav-menu" :class="{ active: menuOpen }">
          <li><router-link to="/" @click="closeMenu">Home</router-link></li>
          <li><router-link to="/tours" @click="closeMenu">Tour Packages</router-link></li>
          <li><router-link to="/tariff" @click="closeMenu">Tariff</router-link></li>
          <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
          <li v-if="!authStore.isAuthenticated">
            <router-link to="/login" @click="closeMenu" class="btn-login">Login</router-link>
          </li>
          <li v-else class="user-menu">
            <span class="user-name">{{ authStore.user?.firstName }}</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </li>
        </ul>
        
        <button class="menu-toggle" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '../stores/company'
import { useAuthStore } from '../stores/auth'
import TopBar from './TopBar.vue'

const router = useRouter()
const companyStore = useCompanyStore()
const authStore = useAuthStore()
const menuOpen = ref(false)

const headerStyle = computed(() => ({
  backgroundColor: companyStore.theme.primaryColor || '#FFC107',
  color: '#1f2937',
}))

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleLogout = () => {
  authStore.logoutUser()
  router.push('/')
  closeMenu()
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 998;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #1f2937;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-menu a:hover {
  opacity: 0.8;
}

.btn-login {
  background: rgba(76, 175, 80, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  border: 2px solid #4CAF50;
  color: #1f2937;
  transition: all 0.3s;
}

.btn-login:hover {
  background: #4CAF50;
  color: #ffffff;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: #1f2937;
}

.btn-logout {
  background: rgba(76, 175, 80, 0.2);
  color: #1f2937;
  border: 2px solid #4CAF50;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: #4CAF50;
  color: #ffffff;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: #1f2937;
  margin: 3px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 120px;
    flex-direction: column;
    background: rgba(255, 193, 7, 0.98);
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    padding: 2rem 0;
  }
  
  .nav-menu a {
    color: #1f2937;
  }
  
  .nav-menu.active {
    left: 0;
  }
}
</style>

