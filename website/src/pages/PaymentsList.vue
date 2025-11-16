<template>
  <div class="payments-list-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <h1><span class="icon">💳</span> Payments</h1>
        <div class="header-actions">
          <button @click="exportPayments" class="btn btn-secondary">Export</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by payment ID, customer name, or booking ID..."
            class="search-input"
          />
        </div>
        <div class="filter-row">
          <select v-model="companyFilter" class="filter-select">
            <option value="">All Companies</option>
            <option v-for="company in companies" :key="company.id" :value="company.id">
              {{ company.name }}
            </option>
          </select>
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <select v-model="methodFilter" class="filter-select">
            <option value="">All Methods</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="WALLET">Wallet</option>
            <option value="CASH">Cash</option>
          </select>
          <input
            type="date"
            v-model="dateFrom"
            placeholder="From Date"
            class="filter-date"
          />
          <input
            type="date"
            v-model="dateTo"
            placeholder="To Date"
            class="filter-date"
          />
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Payments</div>
          <div class="stat-value">{{ filteredPayments.length }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Amount</div>
          <div class="stat-value">₹{{ totalAmount.toLocaleString() }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Paid</div>
          <div class="stat-value success">₹{{ paidAmount.toLocaleString() }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending</div>
          <div class="stat-value warning">₹{{ pendingAmount.toLocaleString() }}</div>
        </div>
      </div>

      <!-- Payments Table -->
      <div v-if="loading" class="loading">Loading payments...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th><span class="icon">🆔</span> Payment ID</th>
              <th><span class="icon">👤</span> Customer</th>
              <th><span class="icon">🏢</span> Company</th>
              <th><span class="icon">🚕</span> Booking</th>
              <th><span class="icon">💰</span> Amount</th>
              <th><span class="icon">💳</span> Method</th>
              <th><span class="icon">📊</span> Status</th>
              <th><span class="icon">📅</span> Date</th>
              <th><span class="icon">⚙️</span> Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPayments.length === 0">
              <td colspan="9" class="empty-state">No payments found</td>
            </tr>
            <tr v-for="payment in filteredPayments" :key="payment.id">
              <td>
                <code class="id-cell">{{ payment.id.substring(0, 8) }}...</code>
              </td>
              <td>
                <div class="user-cell">
                  <span class="user-name">{{ payment.user?.firstName }} {{ payment.user?.lastName }}</span>
                  <small class="user-email">{{ payment.user?.email }}</small>
                </div>
              </td>
              <td>{{ payment.company?.name }}</td>
              <td>
                <router-link :to="`/admin/trips/${payment.bookingId}`" class="booking-link">
                  {{ payment.booking?.pickupAddress?.substring(0, 20) }}...
                </router-link>
              </td>
              <td class="amount-cell">₹{{ payment.amount.toLocaleString() }}</td>
              <td>
                <span class="method-badge">{{ payment.method }}</span>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(payment.status)]">
                  {{ payment.status }}
                </span>
              </td>
              <td>{{ formatDate(payment.createdAt) }}</td>
              <td class="actions-cell">
                <router-link :to="`/admin/payments/${payment.id}`" class="action-btn view-btn">
                  <span class="icon">👁️</span> View
                </router-link>
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
import api, { paymentApi } from '../api/company'

const payments = ref([])
const companies = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const companyFilter = ref('')
const statusFilter = ref('')
const methodFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const filteredPayments = computed(() => {
  let filtered = [...payments.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.id.toLowerCase().includes(query) ||
      `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase().includes(query) ||
      p.bookingId.toLowerCase().includes(query) ||
      p.user?.email?.toLowerCase().includes(query)
    )
  }

  if (companyFilter.value) {
    filtered = filtered.filter(p => p.companyId === companyFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(p => p.status === statusFilter.value)
  }

  if (methodFilter.value) {
    filtered = filtered.filter(p => p.method === methodFilter.value)
  }

  if (dateFrom.value) {
    filtered = filtered.filter(p => new Date(p.createdAt) >= new Date(dateFrom.value))
  }

  if (dateTo.value) {
    filtered = filtered.filter(p => new Date(p.createdAt) <= new Date(dateTo.value + 'T23:59:59'))
  }

  return filtered
})

const totalAmount = computed(() => {
  return filteredPayments.value.reduce((sum, p) => sum + p.amount, 0)
})

const paidAmount = computed(() => {
  return filteredPayments.value
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)
})

const pendingAmount = computed(() => {
  return filteredPayments.value
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)
})

const fetchPayments = async () => {
  try {
    loading.value = true
    const response = await paymentApi.getAll()
    payments.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch payments:', err)
    error.value = err.response?.data?.message || 'Failed to load payments'
  } finally {
    loading.value = false
  }
}

const fetchCompanies = async () => {
  try {
    const response = await api.get('/companies')
    companies.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch companies:', err)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    PAID: 'success',
    PENDING: 'warning',
    FAILED: 'error',
    REFUNDED: 'info',
  }
  return classes[status] || ''
}

const exportPayments = () => {
  // TODO: Implement export functionality
  alert('Export functionality coming soon!')
}

onMounted(() => {
  fetchPayments()
  fetchCompanies()
})
</script>

<style scoped>
.payments-list-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0;
}

.filters-section {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.filter-select,
.filter-date {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-value.success {
  color: #10b981;
}

.stat-value.warning {
  color: #f59e0b;
}

.table-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.id-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.user-cell {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
}

.amount-cell {
  font-weight: 600;
  color: #059669;
}

.method-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.error {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.booking-link {
  color: #667eea;
  text-decoration: none;
}

.booking-link:hover {
  text-decoration: underline;
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.view-btn {
  background: #d1fae5;
  color: #065f46;
}

.view-btn:hover {
  background: #a7f3d0;
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

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}
</style>

