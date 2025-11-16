<template>
  <div class="admin-dashboard">
    <AdminSidebar />
    <div class="dashboard-main">
    <div class="admin-header">
      <div class="header-content">
        <div>
          <h1>Admin Dashboard</h1>
          <p class="user-info" v-if="authStore.user">
            Logged in as: <strong>{{ authStore.user.firstName }} {{ authStore.user.lastName }}</strong>
            <span v-if="authStore.user.role === 'COMPANY'"> ({{ authStore.user.company?.name || 'Company' }})</span>
            <span v-else> ({{ authStore.user.role }})</span>
          </p>
        </div>
        <div class="header-actions">
          <select v-model="selectedRange" @change="loadMetrics" class="range-selector" :disabled="loading">
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="overall">Overall</option>
          </select>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>Total Bookings</h3>
            <p class="card-value">{{ metrics.summary?.totalBookings || 0 }}</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>Total Revenue</h3>
            <p class="card-value">₹{{ formatCurrency(metrics.summary?.totalRevenue || 0) }}</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">👥</div>
          <div class="card-content">
            <h3>Total Users</h3>
            <p class="card-value">{{ metrics.summary?.totalUsers || 0 }}</p>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon">🚗</div>
          <div class="card-content">
            <h3>Total Drivers</h3>
            <p class="card-value">{{ metrics.summary?.totalDrivers || 0 }}</p>
          </div>
        </div>
        <div class="summary-card" v-if="authStore.user?.role === 'ADMIN'">
          <div class="card-icon">🏢</div>
          <div class="card-content">
            <h3>Total Companies</h3>
            <p class="card-value">{{ metrics.summary?.totalCompanies || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading metrics...</p>
      </div>

      <!-- Charts Section -->
      <div v-else class="charts-section">
        <div class="chart-container">
          <h2>Bookings Trend (Line Chart)</h2>
          <LineChart :data="bookingsLineData" />
        </div>

        <div class="chart-container">
          <h2>Revenue Growth (Area Chart)</h2>
          <AreaChart :data="revenueAreaData" />
        </div>

        <div class="chart-container">
          <h2>Bookings by Status (Donut Chart)</h2>
          <DonutChart :data="statusDonutData" />
        </div>

        <div class="chart-container">
          <h2>Bookings by Company (Bar Chart)</h2>
          <BarChart :data="companyBarData" />
        </div>

        <div class="chart-container">
          <h2>Revenue by Company (Bar Chart)</h2>
          <BarChart :data="revenueBarData" />
        </div>

        <div class="chart-container">
          <h2>User vs Driver Registrations (Scatter Chart)</h2>
          <ScatterChart :data="registrationsScatterData" />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getMetrics } from '../api/admin'
import AdminSidebar from '../components/AdminSidebar.vue'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import AreaChart from '../components/charts/AreaChart.vue'
import ScatterChart from '../components/charts/ScatterChart.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const selectedRange = ref('overall')
const metrics = ref({ summary: {} })
const loading = ref(false)

const loadMetrics = async () => {
  loading.value = true
  try {
    const data = await getMetrics(selectedRange.value)
    metrics.value = data || { summary: {} }
  } catch (error) {
    console.error('Failed to load metrics:', error)
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      router.push('/admin/login')
    } else {
      // Show error message
      alert('Failed to load metrics. Please try again.')
    }
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount)
}

const bookingsLineData = computed(() => ({
  labels: metrics.value.bookingsByDate?.map((item) => item.date) || [],
  datasets: [{
    label: 'Bookings',
    data: metrics.value.bookingsByDate?.map((item) => item.count) || [],
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    tension: 0.4,
  }],
}))

const revenueAreaData = computed(() => ({
  labels: metrics.value.revenueByDate?.map((item) => item.date) || [],
  datasets: [{
    label: 'Revenue',
    data: metrics.value.revenueByDate?.map((item) => item.revenue) || [],
    borderColor: '#48bb78',
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
    fill: true,
    tension: 0.4,
  }],
}))

const statusDonutData = computed(() => ({
  labels: metrics.value.bookingsByStatus?.map((item) => item.status) || [],
  datasets: [{
    data: metrics.value.bookingsByStatus?.map((item) => item.count) || [],
    backgroundColor: [
      '#667eea',
      '#48bb78',
      '#ed8936',
      '#f56565',
      '#9f7aea',
    ],
  }],
}))

const companyBarData = computed(() => ({
  labels: metrics.value.bookingsByCompany?.map((item) => item.company) || [],
  datasets: [{
    label: 'Bookings',
    data: metrics.value.bookingsByCompany?.map((item) => item.count) || [],
    backgroundColor: '#667eea',
  }],
}))

const revenueBarData = computed(() => ({
  labels: metrics.value.revenueByCompany?.map((item) => item.company) || [],
  datasets: [{
    label: 'Revenue (₹)',
    data: metrics.value.revenueByCompany?.map((item) => item.revenue) || [],
    backgroundColor: '#48bb78',
  }],
}))

const registrationsScatterData = computed(() => {
  const userDates = metrics.value.userRegistrations || []
  const driverDates = metrics.value.driverRegistrations || []
  
  const allDates = [...new Set([...userDates.map((d) => d.date), ...driverDates.map((d) => d.date)])].sort()
  
  return {
    datasets: [
      {
        label: 'Users',
        data: allDates.map((date) => {
          const userData = userDates.find((d) => d.date === date)
          return { x: date, y: userData?.count || 0 }
        }),
        backgroundColor: '#667eea',
      },
      {
        label: 'Drivers',
        data: allDates.map((date) => {
          const driverData = driverDates.find((d) => d.date === date)
          return { x: date, y: driverData?.count || 0 }
        }),
        backgroundColor: '#48bb78',
      },
    ],
  }
})

const handleLogout = () => {
  authStore.logoutUser()
  router.push('/admin/login')
}

onMounted(() => {
  if (!authStore.isAuthenticated || (authStore.user?.role !== 'ADMIN' && authStore.user?.role !== 'COMPANY')) {
    router.push('/admin/login')
    return
  }
  loadMetrics()
})

// Watch for route changes to reload metrics when returning to dashboard
watch(() => route.path, (newPath) => {
  if (newPath === '/admin/dashboard' && authStore.isAuthenticated) {
    loadMetrics()
  }
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.dashboard-main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
  }
}

.admin-header {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  color: #1f2937;
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
}

.user-info {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.user-info strong {
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.range-selector {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-logout {
  padding: 0.5rem 1.5rem;
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #dc2626;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2.5rem;
}

.card-content h3 {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.card-value {
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.chart-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container h2 {
  color: #1f2937;
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
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

.loading-state p {
  color: #6b7280;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>

