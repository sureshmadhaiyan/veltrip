<template>
  <div class="company-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <h1>🏢 Company Login</h1>
          <p class="subtitle">Access your company dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">
              <span class="icon">📧</span>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your company email"
              required
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">
              <span class="icon">🔒</span>
              Password
            </label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="error-message">
            <span class="icon">⚠️</span>
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="!loading" class="icon">🚀</span>
            <span v-else class="spinner"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="login-footer">
            <p>
              Don't have an account?
              <router-link to="/admin/register-company" class="link">
                Register Company
              </router-link>
            </p>
            <p>
              <router-link to="/admin/login" class="link">
                Admin Login
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/company'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
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
      
      // Only allow COMPANY role users
      if (userRole !== 'COMPANY') {
        error.value = 'This account is not a company account. Please use admin login.'
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
        
        // Redirect to admin dashboard (company users use the same dashboard)
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
.company-login-page {
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

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 0;
  font-size: 0.9rem;
}

.login-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.icon {
  font-size: 1.2em;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-footer p {
  margin: 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>

