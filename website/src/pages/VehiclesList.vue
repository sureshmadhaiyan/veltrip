<template>
  <div class="vehicles-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div class="header-top">
          <h1><span class="icon">🚙</span> Vehicles</h1>
          <router-link to="/admin/vehicles/create" class="btn btn-primary">
            <span class="icon">➕</span> Create Vehicle
          </router-link>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search by vehicle number, type, or model..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" @change="applyFilters" class="filter-select">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading vehicles...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th><span class="icon">🔢</span> Vehicle Number</th>
              <th><span class="icon">🚗</span> Type</th>
              <th><span class="icon">🏭</span> Model</th>
              <th><span class="icon">🎨</span> Color</th>
              <th><span class="icon">📅</span> Year</th>
              <th><span class="icon">📊</span> Status</th>
              <th><span class="icon">👤</span> Driver</th>
              <th><span class="icon">🏢</span> Company</th>
              <th><span class="icon">⚙️</span> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredVehicles.length === 0">
              <td colspan="9" class="empty-state">No vehicles found</td>
            </tr>
            <tr v-for="vehicle in filteredVehicles" :key="vehicle.id">
              <td><strong>{{ vehicle.vehicleNumber }}</strong></td>
              <td>{{ vehicle.vehicleType }}</td>
              <td>{{ vehicle.vehicleModel || 'N/A' }}</td>
              <td>{{ vehicle.vehicleColor || 'N/A' }}</td>
              <td>{{ vehicle.year || 'N/A' }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(vehicle.status)]">
                  {{ vehicle.status }}
                </span>
              </td>
              <td>
                <span v-if="vehicle.drivers && vehicle.drivers.length > 0">
                  {{ vehicle.drivers[0].user?.firstName }} {{ vehicle.drivers[0].user?.lastName }}
                </span>
                <span v-else style="color: #6b7280">No driver</span>
              </td>
              <td>{{ vehicle.company?.name || 'N/A' }}</td>
              <td class="actions-cell">
                <router-link :to="`/admin/vehicles/${vehicle.id}`" class="action-btn edit-btn">
                  <span class="icon">✏️</span> Edit
                </router-link>
                <button @click="deleteVehicle(vehicle.id)" class="action-btn delete-btn">
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

const vehicles = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')

const filteredVehicles = computed(() => {
  let filtered = vehicles.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(v => 
      v.vehicleNumber?.toLowerCase().includes(query) ||
      v.vehicleType?.toLowerCase().includes(query) ||
      v.vehicleModel?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(v => v.status === statusFilter.value)
  }

  return filtered
})

const getStatusClass = (status) => {
  const classes = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance',
    RETIRED: 'retired',
  }
  return classes[status] || ''
}

const handleSearch = () => {
  // Search is handled by computed property
}

const applyFilters = () => {
  // Filters are handled by computed property
}

const fetchVehicles = async () => {
  try {
    loading.value = true
    const response = await api.get('/vehicles')
    vehicles.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch vehicles:', err)
    error.value = err.response?.data?.message || 'Failed to load vehicles'
  } finally {
    loading.value = false
  }
}

const deleteVehicle = async (vehicleId) => {
  if (!confirm('Are you sure you want to delete this vehicle?')) {
    return
  }

  try {
    await api.delete(`/vehicles/${vehicleId}`)
    alert('Vehicle deleted successfully!')
    fetchVehicles()
  } catch (err) {
    console.error('Failed to delete vehicle:', err)
    alert(err.response?.data?.message || 'Failed to delete vehicle')
  }
}

onMounted(() => {
  fetchVehicles()
})
</script>

<style scoped>
.vehicles-page {
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

.status-badge.maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.retired {
  background: #e5e7eb;
  color: #374151;
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

