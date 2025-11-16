<template>
  <div class="edit-trip-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/trips" class="back-link">← Back to Trips</router-link>
          <h1>Edit Trip</h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="trip" class="form-card">
        <form @submit.prevent="updateTrip">
          <h2>Trip Details</h2>
          
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status" required>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pickupAddress">Pickup Address *</label>
              <input 
                type="text" 
                id="pickupAddress" 
                v-model="form.pickupAddress" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="dropAddress">Drop Address *</label>
              <input 
                type="text" 
                id="dropAddress" 
                v-model="form.dropAddress" 
                required 
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pickupLatitude">Pickup Latitude *</label>
              <input 
                type="number" 
                step="any"
                id="pickupLatitude" 
                v-model="form.pickupLatitude" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="pickupLongitude">Pickup Longitude *</label>
              <input 
                type="number" 
                step="any"
                id="pickupLongitude" 
                v-model="form.pickupLongitude" 
                required 
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dropLatitude">Drop Latitude *</label>
              <input 
                type="number" 
                step="any"
                id="dropLatitude" 
                v-model="form.dropLatitude" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="dropLongitude">Drop Longitude *</label>
              <input 
                type="number" 
                step="any"
                id="dropLongitude" 
                v-model="form.dropLongitude" 
                required 
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="scheduledAt">Scheduled At</label>
              <input 
                type="datetime-local" 
                id="scheduledAt" 
                v-model="form.scheduledAt" 
              />
            </div>
            <div class="form-group">
              <label for="actualFare">Actual Fare (₹)</label>
              <input 
                type="number" 
                step="0.01"
                id="actualFare" 
                v-model="form.actualFare" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="driverId">Driver ID (optional)</label>
            <input 
              type="text" 
              id="driverId" 
              v-model="form.driverId" 
              placeholder="Enter driver ID to assign"
            />
          </div>

          <div class="form-group">
            <label for="rating">Rating (1-5)</label>
            <input 
              type="number" 
              min="1" 
              max="5"
              id="rating" 
              v-model="form.rating" 
            />
          </div>

          <div class="form-group">
            <label for="feedback">Feedback</label>
            <textarea 
              id="feedback" 
              v-model="form.feedback" 
              rows="3"
            ></textarea>
          </div>

          <div v-if="updateError" class="error-message">{{ updateError }}</div>
          <div v-if="updateSuccess" class="success-message">{{ updateSuccess }}</div>

          <div class="form-actions">
            <router-link to="/admin/trips" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="updating">
              {{ updating ? 'Updating...' : 'Update Trip' }}
            </button>
          </div>
        </form>
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
const trip = ref(null)
const loading = ref(true)
const error = ref('')
const updating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')

const form = ref({
  status: '',
  pickupAddress: '',
  dropAddress: '',
  pickupLatitude: null,
  pickupLongitude: null,
  dropLatitude: null,
  dropLongitude: null,
  scheduledAt: '',
  actualFare: null,
  driverId: '',
  rating: null,
  feedback: '',
})

const fetchTrip = async () => {
  try {
    loading.value = true
    const tripId = route.params.id
    const response = await api.get(`/bookings/${tripId}`)
    trip.value = response.data
    
    // Populate form
    form.value = {
      status: trip.value.status,
      pickupAddress: trip.value.pickupAddress,
      dropAddress: trip.value.dropAddress,
      pickupLatitude: trip.value.pickupLatitude,
      pickupLongitude: trip.value.pickupLongitude,
      dropLatitude: trip.value.dropLatitude,
      dropLongitude: trip.value.dropLongitude,
      scheduledAt: trip.value.scheduledAt ? new Date(trip.value.scheduledAt).toISOString().slice(0, 16) : '',
      actualFare: trip.value.actualFare || null,
      driverId: trip.value.driverId || '',
      rating: trip.value.rating || null,
      feedback: trip.value.feedback || '',
    }
  } catch (err) {
    console.error('Failed to fetch trip:', err)
    error.value = err.response?.data?.message || 'Failed to load trip details'
  } finally {
    loading.value = false
  }
}

const updateTrip = async () => {
  updating.value = true
  updateError.value = ''
  updateSuccess.value = ''
  
  try {
    const updateData = {
      status: form.value.status,
      pickupAddress: form.value.pickupAddress,
      dropAddress: form.value.dropAddress,
      pickupLatitude: parseFloat(form.value.pickupLatitude),
      pickupLongitude: parseFloat(form.value.pickupLongitude),
      dropLatitude: parseFloat(form.value.dropLatitude),
      dropLongitude: parseFloat(form.value.dropLongitude),
      scheduledAt: form.value.scheduledAt ? new Date(form.value.scheduledAt).toISOString() : undefined,
      actualFare: form.value.actualFare ? parseFloat(form.value.actualFare) : undefined,
      driverId: form.value.driverId || undefined,
      rating: form.value.rating ? parseInt(form.value.rating) : undefined,
      feedback: form.value.feedback || undefined,
    }

    await api.patch(`/bookings/${route.params.id}`, updateData)
    updateSuccess.value = 'Trip updated successfully!'
    
    setTimeout(() => {
      router.push('/admin/trips')
    }, 1500)
  } catch (err) {
    console.error('Failed to update trip:', err)
    updateError.value = err.response?.data?.message || 'Failed to update trip'
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchTrip()
})
</script>

<style scoped>
.edit-trip-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 900px;
  width: 100%;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
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

.form-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
.form-group input[type="datetime-local"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

