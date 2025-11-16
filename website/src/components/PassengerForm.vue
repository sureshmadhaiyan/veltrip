<template>
  <div class="passenger-form-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/passengers" class="back-link">
            <span class="icon">←</span> Back to Passengers
          </router-link>
          <h1>
            <span class="icon">👤</span>
            {{ isEditMode ? 'Edit Passenger' : 'Create Passenger' }}
          </h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading passenger details...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="form-card">
        <form @submit.prevent="savePassenger">
          <h2>
            <span class="icon">📝</span>
            Personal Information
          </h2>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">
                <span class="icon">👤</span>
                First Name *
              </label>
              <input type="text" id="firstName" v-model="form.firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName">
                <span class="icon">👤</span>
                Last Name *
              </label>
              <input type="text" id="lastName" v-model="form.lastName" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">
              <span class="icon">📧</span>
              Email *
            </label>
            <input type="email" id="email" v-model="form.email" required :disabled="isEditMode" />
          </div>
          <div v-if="!isEditMode" class="form-group">
            <label for="password">
              <span class="icon">🔒</span>
              Password *
            </label>
            <input type="password" id="password" v-model="form.password" required minlength="6" />
          </div>
          <div class="form-group">
            <label for="phone">
              <span class="icon">📱</span>
              Phone
            </label>
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
              <label for="gender">
                <span class="icon">⚧️</span>
                Gender
              </label>
              <select id="gender" v-model="form.gender">
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">
                <span class="icon">📅</span>
                Date of Birth
              </label>
              <input type="date" id="dateOfBirth" v-model="form.dateOfBirth" />
            </div>
          </div>
          <div v-if="!isEditMode" class="form-group">
            <label for="otpCode">
              <span class="icon">🔐</span>
              OTP Code (for phone verification)
            </label>
            <input type="text" id="otpCode" v-model="form.otpCode" placeholder="Enter 6-digit OTP" maxlength="6" />
            <small>Enter the OTP sent to the phone number for verification</small>
          </div>

          <div v-if="saveError" class="error-message">{{ saveError }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <router-link to="/admin/passengers" class="btn btn-secondary">
              <span class="icon">✕</span> Cancel
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <span class="icon">{{ isEditMode ? '💾' : '➕' }}</span>
              {{ isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Passenger') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from './AdminSidebar.vue'
import PhotoUpload from './PhotoUpload.vue'
import api from '../api/company'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const passenger = ref(null)
const loading = ref(false)
const isSaving = ref(false)
const error = ref('')
const saveError = ref('')
const success = ref('')

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

const fetchPassengerDetails = async () => {
  if (!isEditMode.value) return
  
  try {
    loading.value = true
    const passengerId = route.params.id
    const response = await api.get(`/users/${passengerId}`)
    passenger.value = response.data
    
    form.value = {
      firstName: passenger.value.firstName || '',
      lastName: passenger.value.lastName || '',
      email: passenger.value.email || '',
      password: '',
      phone: passenger.value.phone || '',
      photo: passenger.value.photo || '',
      gender: passenger.value.gender || '',
      dateOfBirth: passenger.value.dateOfBirth 
        ? new Date(passenger.value.dateOfBirth).toISOString().split('T')[0] 
        : '',
      otpCode: '',
      role: passenger.value.role || 'CUSTOMER',
    }
  } catch (err) {
    console.error('Failed to fetch passenger details:', err)
    error.value = err.response?.data?.message || 'Failed to load passenger details'
  } finally {
    loading.value = false
  }
}

const savePassenger = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    success.value = ''

    if (isEditMode.value) {
      const payload = {
        ...form.value,
        dateOfBirth: form.value.dateOfBirth || undefined,
        otpCode: form.value.otpCode || undefined,
      }
      // Remove fields that shouldn't be updated
      delete payload.password
      delete payload.email
      delete payload.role

      await api.patch(`/users/${route.params.id}`, payload)
      success.value = 'Passenger updated successfully!'
    } else {
      await api.post('/users', form.value)
      success.value = 'Passenger created successfully!'
    }
    
    setTimeout(() => {
      router.push('/admin/passengers')
    }, 1500)
  } catch (err) {
    console.error('Failed to save passenger:', err)
    saveError.value = err.response?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'create'} passenger`
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchPassengerDetails()
})
</script>

<style scoped>
.passenger-form-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.page-wrapper > * {
  max-width: 800px;
  width: 100%;
  margin-left: auto;
}

@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
  width: 100%;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0.5rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.2em;
}

.form-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.form-card h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-card h2:first-child {
  margin-top: 0;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group input[type="tel"],
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

.form-group input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #667eea;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

