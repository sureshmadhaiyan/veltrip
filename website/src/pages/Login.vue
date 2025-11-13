<template>
  <div class="login-page">
    <div class="container">
      <div class="login-container">
        <div class="login-form-wrapper">
          <h2>Login to Your Account</h2>
          <p class="subtitle">Welcome back! Please login to continue.</p>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Enter your email"
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
            
            <div v-if="error" class="error-message">{{ error }}</div>
            
            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            
            <div class="form-footer">
              <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
    await authStore.loginUser(email.value, password.value)
    router.push('/book')
  } catch (err) {
    error.value = err.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-container {
  max-width: 450px;
  margin: 0 auto;
  width: 100%;
}

.login-form-wrapper {
  background: #ffffff;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-form-wrapper h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-block {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.form-footer a {
  color: var(--primary-color);
  font-weight: 600;
}

@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 2rem 1.5rem;
  }
}
</style>

