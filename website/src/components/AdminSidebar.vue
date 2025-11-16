<template>
  <aside class="admin-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h2 v-if="!isCollapsed">Veltrip Admin</h2>
      <button @click="toggleSidebar" class="toggle-btn">
        {{ isCollapsed ? '☰' : '✕' }}
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link 
        to="/admin/dashboard" 
        class="nav-item"
        :class="{ active: $route.path === '/admin/dashboard' }"
      >
        <span class="nav-icon">📊</span>
        <span v-if="!isCollapsed" class="nav-label">Dashboard</span>
      </router-link>
      
      <div class="nav-section">
        <div 
          class="nav-section-header"
          @click="toggleTravelCompany"
        >
          <span class="nav-icon">🏢</span>
          <span v-if="!isCollapsed" class="nav-label">Travel Company</span>
          <span v-if="!isCollapsed" class="nav-arrow">{{ travelCompanyOpen ? '▼' : '▶' }}</span>
        </div>
        
        <div v-if="travelCompanyOpen && !isCollapsed" class="nav-submenu">
          <router-link 
            to="/admin/companies" 
            class="nav-subitem"
            :class="{ active: $route.path.startsWith('/admin/companies') && $route.path !== '/admin/companies/create' }"
          >
            <span class="nav-icon">📋</span>
            <span class="nav-label">View All Companies</span>
          </router-link>
          <router-link 
            to="/admin/companies/create" 
            class="nav-subitem"
            :class="{ active: $route.path === '/admin/companies/create' }"
          >
            <span class="nav-icon">➕</span>
            <span class="nav-label">Create Company</span>
          </router-link>
        </div>
      </div>

      <router-link 
        to="/admin/drivers" 
        class="nav-item"
        :class="{ active: $route.path === '/admin/drivers' }"
      >
        <span class="nav-icon">🚗</span>
        <span v-if="!isCollapsed" class="nav-label">Drivers</span>
      </router-link>

      <router-link 
        to="/admin/passengers" 
        class="nav-item"
        :class="{ active: $route.path === '/admin/passengers' }"
      >
        <span class="nav-icon">👥</span>
        <span v-if="!isCollapsed" class="nav-label">Passengers</span>
      </router-link>

      <router-link 
        to="/admin/trips" 
        class="nav-item"
        :class="{ active: $route.path === '/admin/trips' }"
      >
        <span class="nav-icon">🚕</span>
        <span v-if="!isCollapsed" class="nav-label">Trips</span>
      </router-link>

      <router-link 
        to="/admin/payments" 
        class="nav-item"
        :class="{ active: $route.path.startsWith('/admin/payments') }"
      >
        <span class="nav-icon">💳</span>
        <span v-if="!isCollapsed" class="nav-label">Payments</span>
      </router-link>

      <div class="nav-section">
        <div 
          class="nav-section-header"
          @click="toggleVehicles"
        >
          <span class="nav-icon">🚙</span>
          <span v-if="!isCollapsed" class="nav-label">Vehicles</span>
          <span v-if="!isCollapsed" class="nav-arrow">{{ vehiclesOpen ? '▼' : '▶' }}</span>
        </div>
        
        <div v-if="vehiclesOpen && !isCollapsed" class="nav-submenu">
          <router-link 
            to="/admin/vehicles" 
            class="nav-subitem"
            :class="{ active: $route.path === '/admin/vehicles' && $route.path !== '/admin/vehicles/create' }"
          >
            <span class="nav-icon">📋</span>
            <span class="nav-label">View All Vehicles</span>
          </router-link>
          <router-link 
            to="/admin/vehicles/create" 
            class="nav-subitem"
            :class="{ active: $route.path === '/admin/vehicles/create' }"
          >
            <span class="nav-icon">➕</span>
            <span class="nav-label">Create Vehicle</span>
          </router-link>
        </div>
      </div>

      <router-link 
        to="/admin/collections" 
        class="nav-item"
        :class="{ active: $route.path === '/admin/collections' }"
      >
        <span class="nav-icon">💰</span>
        <span v-if="!isCollapsed" class="nav-label">Collections</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)
const travelCompanyOpen = ref(true)
const vehiclesOpen = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleTravelCompany = () => {
  if (!isCollapsed.value) {
    travelCompanyOpen.value = !travelCompanyOpen.value
  }
}

const toggleVehicles = () => {
  if (!isCollapsed.value) {
    vehiclesOpen.value = !vehiclesOpen.value
  }
}

// Auto-expand sections when on relevant routes
watch(() => route.path, (newPath) => {
  if (newPath.includes('/admin/companies')) {
    travelCompanyOpen.value = true
  }
  if (newPath.includes('/admin/vehicles')) {
    vehiclesOpen.value = true
  }
}, { immediate: true })
</script>

<style scoped>
.admin-sidebar {
  width: 260px;
  min-height: 100vh;
  background: #1f2937;
  color: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.admin-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #374151;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.toggle-btn:hover {
  background: #374151;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s;
  gap: 0.75rem;
}

.nav-item:hover {
  background: #374151;
  color: #ffffff;
}

.nav-item.active {
  background: #667eea;
  color: #ffffff;
  border-right: 3px solid #ffffff;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-weight: 500;
}

.nav-section {
  margin-top: 0.5rem;
}

.nav-section-header {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: #d1d5db;
  cursor: pointer;
  transition: all 0.3s;
  gap: 0.75rem;
  justify-content: space-between;
}

.nav-section-header:hover {
  background: #374151;
  color: #ffffff;
}

.nav-arrow {
  font-size: 0.75rem;
  margin-left: auto;
}

.nav-submenu {
  background: #111827;
  padding: 0.5rem 0;
}

.nav-subitem {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem 0.75rem 3rem;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.3s;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.nav-subitem:hover {
  background: #374151;
  color: #ffffff;
}

.nav-subitem.active {
  background: #4b5563;
  color: #ffffff;
  border-left: 3px solid #667eea;
}

@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }
  
  .admin-sidebar.collapsed {
    transform: translateX(0);
    width: 70px;
  }
}
</style>

