<template>
  <div class="edit-vehicle-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/vehicles" class="back-link">← Back to Vehicles</router-link>
          <h1>Edit Vehicle</h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading vehicle details...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="vehicle" class="form-card">
        <form @submit.prevent="updateVehicle">
          <h2>Vehicle Information</h2>
          
          <div class="form-group">
            <label for="vehicleNumber">Vehicle Number *</label>
            <input 
              type="text" 
              id="vehicleNumber" 
              v-model="form.vehicleNumber" 
              required 
              placeholder="KA01AB1234"
              maxlength="20"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="vehicleType">Vehicle Type *</label>
              <select id="vehicleType" v-model="form.vehicleType" required>
                <option value="">Select Type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="luxury">Luxury</option>
                <option value="van">Van</option>
                <option value="minivan">Minivan</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="form.status">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRED">Retired</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="vehicleModel">Vehicle Model</label>
              <input 
                type="text" 
                id="vehicleModel" 
                v-model="form.vehicleModel" 
                placeholder="Toyota Camry"
              />
            </div>
            <div class="form-group">
              <label for="vehicleColor">Vehicle Color</label>
              <input 
                type="text" 
                id="vehicleColor" 
                v-model="form.vehicleColor" 
                placeholder="White"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="year">Manufacturing Year</label>
              <input 
                type="number" 
                id="year" 
                v-model.number="form.year" 
                placeholder="2020"
                min="1900"
                :max="new Date().getFullYear()"
              />
            </div>
            <div class="form-group">
              <label for="registrationDate">Registration Date</label>
              <input 
                type="date" 
                id="registrationDate" 
                v-model="form.registrationDate" 
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="insuranceExpiry">Insurance Expiry Date</label>
              <input 
                type="date" 
                id="insuranceExpiry" 
                v-model="form.insuranceExpiry" 
              />
            </div>
            <div class="form-group">
              <label for="permitExpiry">Permit Expiry Date</label>
              <input 
                type="date" 
                id="permitExpiry" 
                v-model="form.permitExpiry" 
              />
            </div>
          </div>

          <div v-if="updateError" class="error-message">{{ updateError }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <router-link to="/admin/vehicles" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
      <div v-else class="empty-state">
        <p>Vehicle not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import api from '../api/company'

const route = useRoute()
const router = useRouter()

const vehicle = ref(null)
const loading = ref(true)
const isSaving = ref(false)
const error = ref('')
const updateError = ref('')
const success = ref('')

const form = ref({
  vehicleNumber: '',
  vehicleType: '',
  vehicleModel: '',
  vehicleColor: '',
  year: null,
  status: 'ACTIVE',
  registrationDate: '',
  insuranceExpiry: '',
  permitExpiry: '',
})

const fetchVehicleDetails = async () => {
  try {
    loading.value = true
    const vehicleId = route.params.id
    const response = await api.get(`/vehicles/${vehicleId}`)
    vehicle.value = response.data
    
    // Populate form with existing vehicle data
    form.value = {
      vehicleNumber: vehicle.value.vehicleNumber,
      vehicleType: vehicle.value.vehicleType,
      vehicleModel: vehicle.value.vehicleModel || '',
      vehicleColor: vehicle.value.vehicleColor || '',
      year: vehicle.value.year || null,
      status: vehicle.value.status,
      registrationDate: vehicle.value.registrationDate 
        ? new Date(vehicle.value.registrationDate).toISOString().split('T')[0] 
        : '',
      insuranceExpiry: vehicle.value.insuranceExpiry 
        ? new Date(vehicle.value.insuranceExpiry).toISOString().split('T')[0] 
        : '',
      permitExpiry: vehicle.value.permitExpiry 
        ? new Date(vehicle.value.permitExpiry).toISOString().split('T')[0] 
        : '',
    }
  } catch (err) {
    console.error('Failed to fetch vehicle details:', err)
    error.value = err.response?.data?.message || 'Failed to load vehicle details'
  } finally {
    loading.value = false
  }
}

const updateVehicle = async () => {
  try {
    isSaving.value = true
    updateError.value = ''
    success.value = ''

    const payload = {
      ...form.value,
      year: form.value.year || undefined,
      registrationDate: form.value.registrationDate || undefined,
      insuranceExpiry: form.value.insuranceExpiry || undefined,
      permitExpiry: form.value.permitExpiry || undefined,
    }

    await api.patch(`/vehicles/${route.params.id}`, payload)
    success.value = 'Vehicle updated successfully!'
    
    setTimeout(() => {
      router.push('/admin/vehicles')
    }, 1500)
  } catch (err) {
    console.error('Failed to update vehicle:', err)
    updateError.value = err.response?.data?.message || 'Failed to update vehicle'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchVehicleDetails()
})
</script>

<style scoped>
.edit-vehicle-page {
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
.form-group input[type="number"],
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

.empty-state {
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

