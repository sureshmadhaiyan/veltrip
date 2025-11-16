<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <h1>Admin Panel</h1>
        <p class="subtitle">Login to access admin dashboard</p>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="admin@veltrip.com"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-group">
            <label for="loginType">Login Type</label>
            <select id="loginType" v-model="loginType" required>
              <option value="admin">Admin</option>
              <option value="company">Travel Company</option>
            </select>
          </div>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <div class="register-link">
          <p>Don't have a company account?</p>
          <router-link to="/admin/register-company">Register Travel Company</router-link>
          <p style="margin-top: 1rem;">
            <router-link to="/company/login">Company Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loginType = ref('admin')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    
    if (response.data && response.data.user) {
      const userRole = response.data.user.role
      
      // Check if login type matches user role
      if (loginType.value === 'admin' && userRole !== 'ADMIN') {
        error.value = 'This account is not an admin account'
        loading.value = false
        return
      }
      
      if (loginType.value === 'company' && userRole !== 'COMPANY') {
        error.value = 'This account is not a company account'
        loading.value = false
        return
      }
      
      // Store auth data
      if (response.data.accessToken) {
        authStore.setUser(response.data.user)
        authStore.setToken(response.data.accessToken)
        if (response.data.refreshToken) {
          authStore.setRefreshToken(response.data.refreshToken)
        }
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      }
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.'
    error.value = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.register-link p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>

