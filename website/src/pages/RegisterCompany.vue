<template>
  <div class="register-company-page">
    <div class="register-container">
      <div class="register-card">
        <h1>Register Travel Company</h1>
        <p class="subtitle">Create your company account</p>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                v-model="form.firstName"
                required
                placeholder="John"
              />
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                v-model="form.lastName"
                required
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              required
              placeholder="admin@company.com"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password *</label>
            <input
              type="password"
              id="password"
              v-model="form.password"
              required
              minlength="6"
              placeholder="Minimum 6 characters"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              placeholder="+91 9876543210"
            />
          </div>
          
          <div class="form-group">
            <label for="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              v-model="form.companyName"
              required
              placeholder="GT Holidays"
            />
          </div>
          
          <div class="form-group">
            <label for="domain">Domain *</label>
            <input
              type="text"
              id="domain"
              v-model="form.domain"
              required
              placeholder="gtholidays.com"
            />
          </div>
          
          <div class="form-group">
            <label for="subdomain">Subdomain (Optional)</label>
            <input
              type="text"
              id="subdomain"
              v-model="form.subdomain"
              placeholder="gtholidays"
            />
          </div>
          
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register Company' }}
          </button>
        </form>
        
        <div class="login-link">
          <p>Already have an account?</p>
          <router-link to="/admin/login">Login</router-link>
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

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  companyName: '',
  domain: '',
  subdomain: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await api.post('/auth/register-company', form.value)
    
    if (response.data && response.data.user) {
      success.value = 'Company registered successfully! Redirecting...'
      
      // Store auth data
      if (response.data.accessToken) {
        authStore.setUser(response.data.user)
        authStore.setToken(response.data.accessToken)
        if (response.data.refreshToken) {
          authStore.setRefreshToken(response.data.refreshToken)
        }
        
        // Redirect to admin dashboard
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      }
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
    error.value = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-company-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-container {
  width: 100%;
  max-width: 600px;
}

.register-card {
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

.register-form {
  margin-top: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
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

.success-message {
  background: #d1fae5;
  color: #065f46;
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

.login-link {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-link p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

