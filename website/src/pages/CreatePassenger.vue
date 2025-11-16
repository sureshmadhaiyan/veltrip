<template>
  <div class="create-passenger-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <h1>Create Passenger</h1>
        <router-link to="/admin/passengers" class="btn btn-secondary">
          ← Back to List
        </router-link>
      </div>

      <div class="form-card">
        <form @submit.prevent="createPassenger">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input type="text" id="firstName" v-model="form.firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input type="text" id="lastName" v-model="form.lastName" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>
          <div class="form-group">
            <label for="password">Password *</label>
            <input type="password" id="password" v-model="form.password" required minlength="6" />
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" v-model="form.phone" />
          </div>
          <div class="form-group">
            <PhotoUpload
              v-model="form.photo"
              label="Profile Photo"
              upload-type="passenger-photo"
              hint="Upload a profile photo (optional)"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="gender">Gender</label>
              <select id="gender" v-model="form.gender">
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input type="date" id="dateOfBirth" v-model="form.dateOfBirth" />
            </div>
          </div>
          <div class="form-group">
            <label for="otpCode">OTP Code (for phone verification)</label>
            <input type="text" id="otpCode" v-model="form.otpCode" placeholder="Enter 6-digit OTP" maxlength="6" />
            <small>Enter the OTP sent to the phone number for verification</small>
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <router-link to="/admin/passengers" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Passenger' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import PhotoUpload from '../components/PhotoUpload.vue'
import api from '../api/company'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  photo: '',
  gender: '',
  dateOfBirth: '',
  otpCode: '',
  role: 'CUSTOMER',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const createPassenger = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await api.post('/users', form.value)
    success.value = 'Passenger created successfully!'
    setTimeout(() => {
      router.push('/admin/passengers')
    }, 1500)
  } catch (err) {
    console.error('Failed to create passenger:', err)
    error.value = err.response?.data?.message || 'Failed to create passenger.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-passenger-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.page-wrapper > * {
  max-width: 800px;
  width: 100%;
}

@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
}

.form-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  font-weight: 600;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="tel"],
.form-group input[type="url"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.error-message {
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.success-message {
  color: #10b981;
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>


