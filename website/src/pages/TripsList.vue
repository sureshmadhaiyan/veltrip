<template>
  <div class="trips-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div class="header-top">
          <h1><span class="icon">🚕</span> Trips</h1>
          <router-link to="/admin/trips/create" class="btn btn-primary">
            <span class="icon">➕</span> Create Trip
          </router-link>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search by pickup, drop, customer, or vehicle..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" @change="applyFilters" class="filter-select">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading trips...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th><span class="icon">🆔</span> Trip ID</th>
              <th><span class="icon">👤</span> Customer</th>
              <th><span class="icon">📍</span> Pickup</th>
              <th><span class="icon">🎯</span> Drop</th>
              <th><span class="icon">🚗</span> Driver/Vehicle</th>
              <th><span class="icon">📊</span> Status</th>
              <th><span class="icon">💰</span> Fare</th>
              <th><span class="icon">📏</span> Distance</th>
              <th><span class="icon">📅</span> Created</th>
              <th><span class="icon">⚙️</span> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTrips.length === 0">
              <td colspan="10" class="empty-state">No trips found</td>
            </tr>
            <tr v-for="trip in filteredTrips" :key="trip.id">
              <td><strong>{{ trip.id.substring(0, 8) }}...</strong></td>
              <td>
                {{ trip.customer?.firstName }} {{ trip.customer?.lastName }}
                <br>
                <small style="color: #6b7280">{{ trip.customer?.email }}</small>
              </td>
              <td>
                <div class="address-cell">{{ trip.pickupAddress }}</div>
              </td>
              <td>
                <div class="address-cell">{{ trip.dropAddress }}</div>
              </td>
              <td>
                <span v-if="trip.driver?.vehicle">
                  {{ trip.driver.vehicle.vehicleNumber }}
                  <br>
                  <small style="color: #6b7280">{{ trip.driver.vehicle.vehicleType }}</small>
                </span>
                <span v-else style="color: #6b7280">No driver</span>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(trip.status)]">
                  {{ trip.status }}
                </span>
              </td>
              <td>₹{{ (trip.actualFare || trip.estimatedFare || 0).toFixed(2) }}</td>
              <td>{{ trip.distance?.toFixed(2) || '-' }} km</td>
              <td>{{ formatDate(trip.createdAt) }}</td>
              <td class="actions-cell">
                <router-link :to="`/admin/trips/${trip.id}`" class="action-btn edit-btn">Edit</router-link>
                <button 
                  v-if="trip.status === 'PENDING'" 
                  @click="confirmTrip(trip.id)" 
                  class="action-btn confirm-btn"
                >
                  Confirm
                </button>
                <button 
                  v-if="!trip.driver" 
                  @click="showAssignDriver(trip)" 
                  class="action-btn assign-btn"
                >
                  Assign
                </button>
                <button 
                  v-if="trip.status === 'PENDING' || trip.status === 'CANCELLED'" 
                  @click="deleteTrip(trip.id)" 
                  class="action-btn delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import api from '../api/company'
import { getTrips } from '../api/admin'

const trips = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')

const filteredTrips = computed(() => {
  let filtered = trips.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.pickupAddress?.toLowerCase().includes(query) ||
      t.dropAddress?.toLowerCase().includes(query) ||
      t.customer?.firstName?.toLowerCase().includes(query) ||
      t.customer?.lastName?.toLowerCase().includes(query) ||
      t.driver?.vehicle?.vehicleNumber?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(t => t.status === statusFilter.value)
  }

  return filtered
})

const getStatusClass = (status) => {
  const classes = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  }
  return classes[status] || ''
}

const handleSearch = () => {
  // Search is handled by computed property
}

const applyFilters = () => {
  // Filters are handled by computed property
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const fetchTrips = async () => {
  try {
    loading.value = true
    const response = await getTrips({ page: 1, limit: 100 })
    trips.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch trips:', err)
    error.value = err.response?.data?.message || 'Failed to load trips'
  } finally {
    loading.value = false
  }
}

const confirmTrip = async (tripId) => {
  try {
    await api.post(`/bookings/${tripId}/confirm`)
    alert('Trip confirmed successfully!')
    fetchTrips()
  } catch (err) {
    console.error('Failed to confirm trip:', err)
    alert(err.response?.data?.message || 'Failed to confirm trip')
  }
}

const showAssignDriver = (trip) => {
  const driverId = prompt('Enter driver ID to assign:')
  if (driverId) {
    assignDriver(trip.id, driverId)
  }
}

const assignDriver = async (tripId, driverId) => {
  try {
    await api.post(`/bookings/${tripId}/assign-driver`, { driverId })
    alert('Driver assigned successfully!')
    fetchTrips()
  } catch (err) {
    console.error('Failed to assign driver:', err)
    alert(err.response?.data?.message || 'Failed to assign driver')
  }
}

const deleteTrip = async (tripId) => {
  if (!confirm('Are you sure you want to delete this trip?')) {
    return
  }

  try {
    await api.delete(`/bookings/${tripId}`)
    alert('Trip deleted successfully!')
    fetchTrips()
  } catch (err) {
    console.error('Failed to delete trip:', err)
    alert(err.response?.data?.message || 'Failed to delete trip')
  }
}

onMounted(() => {
  fetchTrips()
})
</script>

<style scoped>
.trips-page {
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
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
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

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.table-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9fafb;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.address-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
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
  background: #ddd6fe;
  color: #5b21b6;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background: #bfdbfe;
}

.confirm-btn {
  background: #d1fae5;
  color: #065f46;
}

.confirm-btn:hover {
  background: #a7f3d0;
}

.assign-btn {
  background: #ddd6fe;
  color: #5b21b6;
}

.assign-btn:hover {
  background: #c4b5fd;
}

.delete-btn {
  background: #fee2e2;
  color: #991b1b;
}

.delete-btn:hover {
  background: #fecaca;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
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
</style>
