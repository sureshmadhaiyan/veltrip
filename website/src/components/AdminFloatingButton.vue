<template>
  <router-link 
    v-if="showButton"
    to="/admin/dashboard" 
    class="admin-floating-btn"
    title="Back to Admin Dashboard"
  >
    📊 Admin
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const showButton = computed(() => {
  // Show button if user is admin/company and NOT on admin routes
  const isAdminUser = authStore.isAuthenticated && 
    (authStore.user?.role === 'ADMIN' || authStore.user?.role === 'COMPANY')
  const isAdminRoute = route.path.startsWith('/admin')
  return isAdminUser && !isAdminRoute
})
</script>

<style scoped>
.admin-floating-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #667eea;
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  z-index: 1000;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-floating-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

@media (max-width: 768px) {
  .admin-floating-btn {
    bottom: 20px;
    right: 20px;
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>

