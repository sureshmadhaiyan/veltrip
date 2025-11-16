<template>
  <div class="passengers-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div class="header-top">
          <h1><span class="icon">👥</span> Passengers</h1>
          <router-link to="/admin/passengers/create" class="btn btn-primary">
            <span class="icon">➕</span> Create Passenger
          </router-link>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search by name, email, or phone..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" @change="applyFilters" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading passengers...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th><span class="icon">📷</span> Photo</th>
              <th><span class="icon">👤</span> Name</th>
              <th><span class="icon">📧</span> Email</th>
              <th><span class="icon">📱</span> Phone</th>
              <th><span class="icon">⚧️</span> Gender</th>
              <th><span class="icon">🏢</span> Company</th>
              <th><span class="icon">🚕</span> Bookings</th>
              <th><span class="icon">📊</span> Status</th>
              <th><span class="icon">⚙️</span> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPassengers.length === 0">
              <td colspan="9" class="empty-state">No passengers found</td>
            </tr>
            <tr v-for="passenger in filteredPassengers" :key="passenger.id">
              <td>
                <img 
                  v-if="passenger.photo" 
                  :src="passenger.photo" 
                  :alt="`${passenger.firstName} ${passenger.lastName}`"
                  class="passenger-photo"
                />
                <span v-else class="no-photo">No Photo</span>
              </td>
              <td>
                <strong>{{ passenger.firstName }} {{ passenger.lastName }}</strong>
              </td>
              <td>{{ passenger.email }}</td>
              <td>{{ passenger.phone || '-' }}</td>
              <td>{{ passenger.gender || '-' }}</td>
              <td>{{ passenger.company?.name || '-' }}</td>
              <td>{{ passenger._count?.bookings || 0 }}</td>
              <td>
                <span :class="['status-badge', passenger.isActive ? 'active' : 'inactive']">
                  {{ passenger.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions-cell">
                <router-link :to="`/admin/passengers/${passenger.id}`" class="action-btn view-btn">
                  <span class="icon">👁️</span> View
                </router-link>
                <router-link :to="`/admin/passengers/${passenger.id}/edit`" class="action-btn edit-btn">
                  <span class="icon">✏️</span> Edit
                </router-link>
                <button @click="deletePassenger(passenger)" class="action-btn delete-btn">
                  <span class="icon">🗑️</span> Delete
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
import { getPassengers } from '../api/admin'

const passengers = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')

const filteredPassengers = computed(() => {
  let filtered = passengers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.firstName?.toLowerCase().includes(query) ||
      p.lastName?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.phone?.includes(query)
    )
  }

  if (statusFilter.value === 'active') {
    filtered = filtered.filter(p => p.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(p => !p.isActive)
  }

  return filtered
})

const handleSearch = () => {
  // Search is handled by computed property
}

const applyFilters = () => {
  // Filters are handled by computed property
}

const fetchPassengers = async () => {
  try {
    loading.value = true
    const response = await getPassengers({ page: 1, limit: 100 })
    passengers.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch passengers:', err)
    error.value = err.response?.data?.message || 'Failed to load passengers'
  } finally {
    loading.value = false
  }
}


const deletePassenger = async (passenger) => {
  if (!confirm(`Are you sure you want to delete passenger ${passenger.firstName} ${passenger.lastName}?`)) {
    return
  }

  try {
    await api.delete(`/users/${passenger.id}`)
    alert('Passenger deleted successfully!')
    fetchPassengers()
  } catch (err) {
    console.error('Failed to delete passenger:', err)
    alert(err.response?.data?.message || 'Failed to delete passenger')
  }
}

onMounted(() => {
  fetchPassengers()
})
</script>

<style scoped>
.passengers-page {
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

.passenger-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.no-photo {
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
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

.view-btn {
  background: #d1fae5;
  color: #065f46;
}

.view-btn:hover {
  background: #a7f3d0;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background: #bfdbfe;
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
