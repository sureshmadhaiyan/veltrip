<template>
  <div class="driver-form-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/drivers" class="back-link">← Back to Drivers</router-link>
          <h1>{{ isEditMode ? 'Edit Driver' : 'Create Driver' }}</h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading driver details...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="form-card">
        <form @submit.prevent="saveDriver">
          <h2>
            <span class="icon">👤</span>
            User Account Details
          </h2>
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
            <input type="email" id="email" v-model="form.email" required :disabled="isEditMode" />
          </div>
          <div v-if="!isEditMode" class="form-group">
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
              label="Driver Photo"
              upload-type="driver-photo"
              :required="!isEditMode"
              hint="Upload a clear photo of the driver"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="gender">Gender *</label>
              <select id="gender" v-model="form.gender" required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth *</label>
              <input type="date" id="dateOfBirth" v-model="form.dateOfBirth" required />
            </div>
          </div>

          <h2>
            <span class="icon">🚗</span>
            Driver & Vehicle Details
          </h2>
          <div class="form-group">
            <label for="licenseNumber">License Number *</label>
            <input type="text" id="licenseNumber" v-model="form.licenseNumber" required />
          </div>
          <div class="form-group">
            <label for="vehicleId">Vehicle</label>
            <select id="vehicleId" v-model="form.vehicleId">
              <option :value="null">No Vehicle</option>
              <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.vehicleNumber }} - {{ vehicle.vehicleType }}
              </option>
            </select>
          </div>

          <h3 v-if="isEditMode">
            <span class="icon">⚙️</span>
            Status & Settings
          </h3>
          <div v-if="isEditMode" class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.isApproved" />
                <span>Approved</span>
              </label>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.isOnline" />
                <span>Online</span>
              </label>
            </div>
          </div>

          <div v-if="saveError" class="error-message">{{ saveError }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <router-link to="/admin/drivers" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Driver') }}
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
const driver = ref(null)
const availableVehicles = ref([])
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
  licenseNumber: '',
  vehicleId: null,
  isApproved: false,
  isOnline: false,
})

const fetchDriverDetails = async () => {
  if (!isEditMode.value) return
  
  try {
    loading.value = true
    const driverId = route.params.id
    const response = await api.get(`/drivers/${driverId}`)
    driver.value = response.data
    
    form.value = {
      firstName: driver.value.user?.firstName || '',
      lastName: driver.value.user?.lastName || '',
      email: driver.value.user?.email || '',
      password: '',
      phone: driver.value.user?.phone || '',
      photo: driver.value.photo || '',
      gender: driver.value.gender || '',
      dateOfBirth: driver.value.dateOfBirth 
        ? new Date(driver.value.dateOfBirth).toISOString().split('T')[0] 
        : '',
      licenseNumber: driver.value.licenseNumber || '',
      vehicleId: driver.value.vehicleId || null,
      isApproved: driver.value.isApproved || false,
      isOnline: driver.value.isOnline || false,
    }
  } catch (err) {
    console.error('Failed to fetch driver details:', err)
    error.value = err.response?.data?.message || 'Failed to load driver details'
  } finally {
    loading.value = false
  }
}

const fetchVehicles = async () => {
  try {
    const response = await api.get('/vehicles')
    availableVehicles.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch vehicles:', err)
  }
}

const saveDriver = async () => {
  try {
    isSaving.value = true
    saveError.value = ''
    success.value = ''

    if (isEditMode.value) {
      const payload = {
        ...form.value,
        dateOfBirth: form.value.dateOfBirth || undefined,
        vehicleId: form.value.vehicleId || undefined,
      }
      // Remove user fields from update payload
      delete payload.firstName
      delete payload.lastName
      delete payload.email
      delete payload.password
      delete payload.phone

      await api.patch(`/drivers/${route.params.id}`, payload)
      success.value = 'Driver updated successfully!'
    } else {
      await api.post('/drivers/with-user', form.value)
      success.value = 'Driver created successfully!'
    }
    
    setTimeout(() => {
      router.push('/admin/drivers')
    }, 1500)
  } catch (err) {
    console.error('Failed to save driver:', err)
    saveError.value = err.response?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'create'} driver`
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchDriverDetails()
  fetchVehicles()
})
</script>

<style scoped>
.driver-form-page {
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
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0.5rem 0 0 0;
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
}

.form-card h2:first-child {
  margin-top: 0;
}

.form-card h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin: 2rem 0 1rem 0;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
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
  display: inline-block;
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

