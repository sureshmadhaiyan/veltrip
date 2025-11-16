<template>
  <div class="collections-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <h1>Collection Details</h1>
        <div class="date-filters">
          <input type="date" v-model="startDate" @change="loadCollections" />
          <span>to</span>
          <input type="date" v-model="endDate" @change="loadCollections" />
          <button @click="clearFilters" class="btn btn-secondary">Clear</button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading collections...</p>
      </div>

      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else>
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon">💰</div>
            <div class="card-info">
              <div class="card-value">₹{{ formatCurrency(summary.totalAmount) }}</div>
              <div class="card-label">Total Collection</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon">📊</div>
            <div class="card-info">
              <div class="card-value">{{ summary.totalCount }}</div>
              <div class="card-label">Total Transactions</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon">📈</div>
            <div class="card-info">
              <div class="card-value">₹{{ formatCurrency(summary.averageAmount) }}</div>
              <div class="card-label">Average Amount</div>
            </div>
          </div>
        </div>

        <!-- Collections Table -->
        <div class="collections-table-container">
          <table class="collections-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Customer</th>
                <th>Booking Details</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in collections" :key="payment.id">
                <td>{{ payment.id.substring(0, 8) }}...</td>
                <td>
                  {{ payment.user?.firstName }} {{ payment.user?.lastName }}
                  <br />
                  <small style="color: #6b7280">{{ payment.user?.email }}</small>
                </td>
                <td>
                  <div class="booking-details">
                    <div><strong>From:</strong> {{ payment.booking?.pickupAddress }}</div>
                    <div><strong>To:</strong> {{ payment.booking?.dropAddress }}</div>
                  </div>
                </td>
                <td class="amount-cell">₹{{ formatCurrency(payment.amount) }}</td>
                <td>
                  <span class="method-badge">{{ payment.method }}</span>
                </td>
                <td>{{ formatDate(payment.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="collections.length === 0" class="empty-state">
            <p>No collections found for the selected period.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import { getCollectionDetails } from '../api/admin'

const collections = ref([])
const summary = ref({ totalAmount: 0, totalCount: 0, averageAmount: 0 })
const loading = ref(false)
const error = ref('')
const startDate = ref('')
const endDate = ref('')

const loadCollections = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    const response = await getCollectionDetails(params)
    collections.value = response.payments || []
    summary.value = response.summary || { totalAmount: 0, totalCount: 0, averageAmount: 0 }
  } catch (err) {
    console.error('Failed to load collections:', err)
    error.value = err.response?.data?.message || 'Failed to load collections.'
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  startDate.value = ''
  endDate.value = ''
  loadCollections()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

onMounted(() => {
  loadCollections()
})
</script>


<style scoped>
.collections-page {
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
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.date-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}

.date-filters input[type="date"] {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  font-size: 2.5rem;
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.card-label {
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.collections-table-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.collections-table {
  width: 100%;
  border-collapse: collapse;
}

.collections-table th {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.85rem;
  border-bottom: 2px solid #e5e7eb;
}

.collections-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.collections-table tbody tr:hover {
  background: #f9fafb;
}

.booking-details {
  font-size: 0.9rem;
  line-height: 1.6;
}

.booking-details div {
  margin-bottom: 0.25rem;
}

.amount-cell {
  font-weight: 600;
  color: #10b981;
}

.method-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #dbeafe;
  color: #1e40af;
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

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}
</style>

