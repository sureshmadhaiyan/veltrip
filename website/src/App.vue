<template>
  <div id="app" :style="appStyle">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCompanyStore } from './stores/company'
import { applyTheme as applyThemeUtil } from './utils/themeColors'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const companyStore = useCompanyStore()

const appStyle = computed(() => {
  const theme = companyStore.theme
  return {
    '--primary-color': theme.primaryColor || '#FFC107',
    '--secondary-color': theme.secondaryColor || '#4CAF50',
    '--accent-color': theme.accentColor || '#FFD54F',
    '--text-color': theme.textColor || '#1f2937',
    '--bg-color': theme.backgroundColor || '#ffffff',
  }
})

const applyTheme = () => {
  const theme = companyStore.theme
  applyThemeUtil(theme)
}

onMounted(async () => {
  await companyStore.detectCompany()
  applyTheme()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #FFC107; /* Taxi Yellow */
  --secondary-color: #4CAF50; /* Green */
  --accent-color: #FFD54F; /* Light Yellow */
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.main-content {
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
}

section {
  padding: 4rem 0;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--text-color);
  font-weight: 700;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

a:hover {
  opacity: 0.8;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: var(--primary-color);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: #ffffff;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  section {
    padding: 2.5rem 0;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  h2 {
    font-size: 1.75rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  section {
    padding: 2rem 0;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>
