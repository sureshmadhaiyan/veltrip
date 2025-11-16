<template>
  <div class="driver-details-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/drivers" class="back-link">← Back to Drivers</router-link>
          <h1>Driver Details</h1>
        </div>
        <div v-if="driver" class="header-actions">
          <router-link :to="`/admin/drivers/${driver.id}/edit`" class="btn btn-primary">
            ✏️ Edit Driver
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading driver details...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="driver" class="details-content">
        <!-- Driver Info Card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Driver Information</h2>
          </div>
          <div class="card-body">
            <div class="photo-section">
              <img 
                v-if="driver.photo" 
                :src="driver.photo" 
                alt="Driver Photo" 
                class="driver-photo-large"
              />
              <div v-else class="no-photo-large">
                <span class="photo-placeholder">📷</span>
                <p>No Photo</p>
              </div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>Full Name</label>
                <p><strong>{{ driver.user?.firstName }} {{ driver.user?.lastName }}</strong></p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ driver.user?.email }}</p>
              </div>
              <div class="info-item">
                <label>Phone</label>
                <p>{{ driver.user?.phone || '-' }}</p>
              </div>
              <div class="info-item">
                <label>License Number</label>
                <p><strong>{{ driver.licenseNumber }}</strong></p>
              </div>
              <div class="info-item">
                <label>Gender</label>
                <p>{{ driver.gender || '-' }}</p>
              </div>
              <div class="info-item">
                <label>Date of Birth</label>
                <p>{{ driver.dateOfBirth ? formatDate(driver.dateOfBirth) : '-' }}</p>
              </div>
              <div class="info-item">
                <label>Status</label>
                <p>
                  <span :class="['status-badge', driver.isApproved ? 'active' : 'inactive']">
                    {{ driver.isApproved ? 'Approved' : 'Pending Approval' }}
                  </span>
                </p>
              </div>
              <div class="info-item">
                <label>Online Status</label>
                <p>
                  <span :class="['status-badge', driver.isOnline ? 'active' : 'inactive']">
                    {{ driver.isOnline ? 'Online' : 'Offline' }}
                  </span>
                </p>
              </div>
              <div class="info-item">
                <label>Company</label>
                <p>{{ driver.company?.name || '-' }}</p>
              </div>
              <div class="info-item">
                <label>Created At</label>
                <p>{{ formatDate(driver.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Information Card -->
        <div class="info-card" v-if="driver.vehicle">
          <div class="card-header">
            <h2>Vehicle Information</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Vehicle Number</label>
                <p><strong>{{ driver.vehicle.vehicleNumber }}</strong></p>
              </div>
              <div class="info-item">
                <label>Vehicle Type</label>
                <p>{{ driver.vehicle.vehicleType }}</p>
              </div>
              <div class="info-item">
                <label>Model</label>
                <p>{{ driver.vehicle.vehicleModel || '-' }}</p>
              </div>
              <div class="info-item">
                <label>Color</label>
                <p>{{ driver.vehicle.vehicleColor || '-' }}</p>
              </div>
              <div class="info-item">
                <label>Status</label>
                <p>
                  <span :class="['status-badge', getVehicleStatusClass(driver.vehicle.status)]">
                    {{ driver.vehicle.status }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="info-card">
          <div class="card-body">
            <p style="color: #6b7280; text-align: center;">No vehicle assigned to this driver</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Driver not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import api from '../api/company'

const route = useRoute()
const driver = ref(null)
const loading = ref(true)
const error = ref('')

const fetchDriverDetails = async () => {
  try {
    loading.value = true
    const driverId = route.params.id
    const response = await api.get(`/drivers/${driverId}`)
    driver.value = response.data
  } catch (err) {
    console.error('Failed to fetch driver details:', err)
    error.value = err.response?.data?.message || 'Failed to load driver details'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const getVehicleStatusClass = (status) => {
  const classes = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance',
    RETIRED: 'retired',
  }
  return classes[status] || ''
}

onMounted(() => {
  fetchDriverDetails()
})
</script>

<style scoped>
.driver-details-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.header-actions {
  display: flex;
  gap: 1rem;
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

.btn-primary:hover {
  background: #5568d3;
}

.details-content {
  display: grid;
  gap: 2rem;
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.card-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
}

.card-body {
  padding: 2rem;
}

.photo-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.driver-photo-large {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-photo-large {
  display: inline-block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.photo-placeholder {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item p {
  margin: 0;
  color: #1f2937;
  font-size: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.retired {
  background: #e5e7eb;
  color: #374151;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>

