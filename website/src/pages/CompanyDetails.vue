<template>
  <div class="company-details-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <button @click="$router.back()" class="back-btn">← Back</button>
          <h1>Company Details</h1>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading company details...</p>
      </div>

      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else-if="company" class="company-details">
        <!-- Company Info Card -->
        <div class="info-card">
          <h2>Company Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Company Name:</label>
              <span>{{ company.name }}</span>
            </div>
            <div class="info-item">
              <label>Domain:</label>
              <span>{{ company.domain }}</span>
            </div>
            <div class="info-item">
              <label>Subdomain:</label>
              <span>{{ company.subdomain || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>PAN:</label>
              <span>{{ company.pan || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>GSTIN:</label>
              <span>{{ company.gstin || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Address:</label>
              <span>{{ company.address || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>City:</label>
              <span>{{ company.city || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>State:</label>
              <span>{{ company.state || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Pincode:</label>
              <span>{{ company.pincode || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Phone:</label>
              <span>{{ company.phone || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ company.email || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Contact Person:</label>
              <span>{{ company.contactPerson || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span :class="['status-badge', company.isActive ? 'active' : 'inactive']">
                {{ company.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="info-item">
              <label>Created At:</label>
              <span>{{ formatDate(company.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Statistics Card -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-value">{{ company._count?.users || 0 }}</div>
              <div class="stat-label">Users</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🚗</div>
            <div class="stat-info">
              <div class="stat-value">{{ company._count?.drivers || 0 }}</div>
              <div class="stat-label">Drivers</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <div class="stat-value">{{ company._count?.bookings || 0 }}</div>
              <div class="stat-label">Bookings</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💳</div>
            <div class="stat-info">
              <div class="stat-value">{{ company._count?.payments || 0 }}</div>
              <div class="stat-label">Payments</div>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="info-card" v-if="company.users && company.users.length > 0">
          <h2>Recent Users</h2>
          <table class="mini-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in company.users" :key="user.id">
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recent Drivers -->
        <div class="info-card" v-if="company.drivers && company.drivers.length > 0">
          <h2>Recent Drivers</h2>
          <table class="mini-table">
            <thead>
              <tr>
                <th>Vehicle Number</th>
                <th>Vehicle Type</th>
                <th>Status</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in company.drivers" :key="driver.id">
                <td>{{ driver.vehicleNumber }}</td>
                <td>{{ driver.vehicleType }}</td>
                <td>
                  <span :class="['status-badge', driver.isOnline ? 'active' : 'inactive']">
                    {{ driver.isOnline ? 'Online' : 'Offline' }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', driver.isApproved ? 'active' : 'inactive']">
                    {{ driver.isApproved ? 'Yes' : 'No' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import { getCompanyDetails } from '../api/admin'

const route = useRoute()
const company = ref(null)
const loading = ref(false)
const error = ref('')

const loadCompanyDetails = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getCompanyDetails(route.params.id)
    company.value = data
  } catch (err) {
    console.error('Failed to load company details:', err)
    error.value = err.response?.data?.message || 'Failed to load company details.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

onMounted(() => {
  loadCompanyDetails()
})
</script>

<style scoped>
.company-details-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 1400px;
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

.back-btn {
  background: #6b7280;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #4b5563;
}

h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
}

.info-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.info-card h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-item span {
  color: #1f2937;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  display: inline-block;
}

.status-badge.active {
  background-color: #4CAF50;
}

.status-badge.inactive {
  background-color: #EF4444;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
}

.mini-table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.85rem;
  border-bottom: 2px solid #e5e7eb;
}

.mini-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.mini-table tbody tr:hover {
  background: #f9fafb;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>

