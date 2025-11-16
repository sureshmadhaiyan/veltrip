<template>
  <div class="passenger-details-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/passengers" class="back-link">← Back to Passengers</router-link>
          <h1>Passenger Details</h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="passenger" class="details-content">
        <!-- Passenger Info Card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Passenger Information</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Name</label>
                <p>{{ passenger.firstName }} {{ passenger.lastName }}</p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ passenger.email }}</p>
              </div>
              <div class="info-item">
                <label>Phone</label>
                <p>{{ passenger.phone || 'Not provided' }}</p>
              </div>
              <div class="info-item">
                <label>Gender</label>
                <p>{{ passenger.gender || 'Not provided' }}</p>
              </div>
              <div class="info-item">
                <label>Date of Birth</label>
                <p>{{ passenger.dateOfBirth ? formatDate(passenger.dateOfBirth) : 'Not provided' }}</p>
              </div>
              <div class="info-item">
                <label>Status</label>
                <span :class="['status-badge', passenger.isActive ? 'active' : 'inactive']">
                  {{ passenger.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="info-item">
                <label>Email Verified</label>
                <span :class="['status-badge', passenger.emailVerified ? 'active' : 'inactive']">
                  {{ passenger.emailVerified ? 'Verified' : 'Not Verified' }}
                </span>
              </div>
              <div class="info-item">
                <label>Phone Verified</label>
                <span :class="['status-badge', passenger.phoneVerified ? 'active' : 'inactive']">
                  {{ passenger.phoneVerified ? 'Verified' : 'Not Verified' }}
                </span>
              </div>
              <div class="info-item">
                <label>Company</label>
                <p>{{ passenger.company?.name || 'N/A' }}</p>
              </div>
              <div class="info-item">
                <label>Member Since</label>
                <p>{{ formatDate(passenger.createdAt) }}</p>
              </div>
            </div>
            <div v-if="passenger.photo" class="photo-section">
              <label>Profile Photo</label>
              <img :src="passenger.photo" alt="Profile Photo" class="profile-photo" />
            </div>
          </div>
        </div>

        <!-- Ride History Card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Ride History</h2>
            <span class="badge">{{ bookings.length }} Total Rides</span>
          </div>
          <div class="card-body">
            <div v-if="bookings.length === 0" class="empty-state">
              <p>No rides yet</p>
            </div>
            <div v-else class="bookings-list">
              <div v-for="booking in bookings" :key="booking.id" class="booking-item">
                <div class="booking-header">
                  <div class="booking-id">Trip #{{ booking.id.slice(0, 8) }}</div>
                  <span :class="['status-badge', getStatusClass(booking.status)]">
                    {{ booking.status }}
                  </span>
                </div>
                <div class="booking-details">
                  <div class="route">
                    <div class="location">
                      <span class="location-icon">📍</span>
                      <div>
                        <strong>Pickup:</strong> {{ booking.pickupAddress }}
                      </div>
                    </div>
                    <div class="location">
                      <span class="location-icon">🎯</span>
                      <div>
                        <strong>Drop:</strong> {{ booking.dropAddress }}
                      </div>
                    </div>
                  </div>
                  <div class="booking-meta">
                    <div class="meta-item">
                      <strong>Distance:</strong> {{ booking.distance?.toFixed(2) || 'N/A' }} km
                    </div>
                    <div class="meta-item">
                      <strong>Fare:</strong> ₹{{ booking.actualFare || booking.estimatedFare || 'N/A' }}
                    </div>
                    <div class="meta-item">
                      <strong>Date:</strong> {{ formatDate(booking.createdAt) }}
                    </div>
                    <div v-if="booking.driver" class="meta-item">
                      <strong>Driver:</strong> {{ booking.driver.vehicleNumber }}
                    </div>
                  </div>
                  <div v-if="booking.rating" class="rating">
                    <strong>Rating:</strong>
                    <span class="stars">{{ '⭐'.repeat(booking.rating) }}</span>
                  </div>
                  <div v-if="booking.feedback" class="feedback">
                    <strong>Feedback:</strong> {{ booking.feedback }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
const passenger = ref(null)
const bookings = ref([])
const loading = ref(true)
const error = ref('')

const fetchPassengerDetails = async () => {
  try {
    loading.value = true
    const passengerId = route.params.id
    
    // Fetch passenger details
    const passengerResponse = await api.get(`/users/${passengerId}`)
    passenger.value = passengerResponse.data

    // Fetch all bookings and filter by customerId on frontend
    // Note: In production, you should add a query parameter to the backend
    const bookingsResponse = await api.get('/bookings')
    const allBookings = bookingsResponse.data || []
    bookings.value = allBookings.filter(booking => booking.customerId === passengerId)
  } catch (err) {
    console.error('Failed to fetch passenger details:', err)
    error.value = err.response?.data?.message || 'Failed to load passenger details'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const statusMap = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  }
  return statusMap[status] || 'pending'
}

onMounted(() => {
  fetchPassengerDetails()
})
</script>

<style scoped>
.passenger-details-page {
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

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.card-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
}

.badge {
  background: #667eea;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.card-body {
  padding: 2rem;
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
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 1rem;
  color: #1f2937;
  margin: 0;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.accepted {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.in-progress {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.photo-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.photo-section label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-photo {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.booking-item:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.booking-id {
  font-weight: 600;
  color: #667eea;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.route {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.location {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.location-icon {
  font-size: 1.25rem;
}

.booking-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.meta-item {
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-item strong {
  color: #374151;
}

.rating {
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.stars {
  margin-left: 0.5rem;
}

.feedback {
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}
</style>

