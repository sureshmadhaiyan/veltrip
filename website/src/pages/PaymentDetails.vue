<template>
  <div class="payment-details-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/payments" class="back-link">← Back to Payments</router-link>
          <h1>Payment Details</h1>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading payment details...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="payment" class="details-content">
        <!-- Payment Info Card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Payment Information</h2>
            <span :class="['status-badge-large', getStatusClass(payment.status)]">
              {{ payment.status }}
            </span>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Payment ID</label>
                <p><code>{{ payment.id }}</code></p>
              </div>
              <div class="info-item">
                <label>Amount</label>
                <p class="amount-large">₹{{ payment.amount.toLocaleString() }}</p>
              </div>
              <div class="info-item">
                <label>Currency</label>
                <p>{{ payment.currency }}</p>
              </div>
              <div class="info-item">
                <label>Payment Method</label>
                <p><span class="method-badge">{{ payment.method }}</span></p>
              </div>
              <div class="info-item">
                <label>Razorpay Order ID</label>
                <p><code>{{ payment.razorpayOrderId || '-' }}</code></p>
              </div>
              <div class="info-item">
                <label>Razorpay Payment ID</label>
                <p><code>{{ payment.razorpayPaymentId || '-' }}</code></p>
              </div>
              <div class="info-item">
                <label>Created At</label>
                <p>{{ formatDate(payment.createdAt) }}</p>
              </div>
              <div class="info-item">
                <label>Updated At</label>
                <p>{{ formatDate(payment.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="info-card">
          <div class="card-header">
            <h2>Customer Information</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Name</label>
                <p><strong>{{ payment.user?.firstName }} {{ payment.user?.lastName }}</strong></p>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>{{ payment.user?.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Information -->
        <div class="info-card">
          <div class="card-header">
            <h2>Company Information</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Company Name</label>
                <p><strong>{{ payment.company?.name }}</strong></p>
              </div>
              <div class="info-item">
                <label>Domain</label>
                <p>{{ payment.company?.domain }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Information -->
        <div class="info-card" v-if="payment.booking">
          <div class="card-header">
            <h2>Booking/Trip Information</h2>
            <router-link :to="`/admin/trips/${payment.bookingId}`" class="btn btn-sm btn-primary">
              View Trip
            </router-link>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>Booking ID</label>
                <p><code>{{ payment.bookingId }}</code></p>
              </div>
              <div class="info-item">
                <label>Pickup Address</label>
                <p>{{ payment.booking.pickupAddress }}</p>
              </div>
              <div class="info-item">
                <label>Drop Address</label>
                <p>{{ payment.booking.dropAddress }}</p>
              </div>
              <div class="info-item">
                <label>Trip Status</label>
                <p>
                  <span :class="['status-badge', getBookingStatusClass(payment.booking.status)]">
                    {{ payment.booking.status }}
                  </span>
                </p>
              </div>
              <div class="info-item" v-if="payment.booking.driver">
                <label>Driver</label>
                <p>
                  {{ payment.booking.driver.user?.firstName }} {{ payment.booking.driver.user?.lastName }}
                  <span v-if="payment.booking.driver.vehicle" class="vehicle-info">
                    ({{ payment.booking.driver.vehicle.vehicleNumber }})
                  </span>
                </p>
              </div>
              <div class="info-item">
                <label>Estimated Fare</label>
                <p>₹{{ payment.booking.estimatedFare?.toLocaleString() || '-' }}</p>
              </div>
              <div class="info-item">
                <label>Actual Fare</label>
                <p>₹{{ payment.booking.actualFare?.toLocaleString() || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Payment not found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import { paymentApi } from '../api/company'

const route = useRoute()
const payment = ref(null)
const loading = ref(true)
const error = ref('')

const fetchPaymentDetails = async () => {
  try {
    loading.value = true
    const paymentId = route.params.id
    const response = await paymentApi.getById(paymentId)
    payment.value = response.data
  } catch (err) {
    console.error('Failed to fetch payment details:', err)
    error.value = err.response?.data?.message || 'Failed to load payment details'
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

const getBookingStatusClass = (status) => {
  const classes = {
    COMPLETED: 'success',
    IN_PROGRESS: 'warning',
    PENDING: 'warning',
    ACCEPTED: 'info',
    CANCELLED: 'error',
  }
  return classes[status] || ''
}

onMounted(() => {
  fetchPaymentDetails()
})
</script>

<style scoped>
.payment-details-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
}

.status-badge-large {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge-large.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge-large.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge-large.error {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge-large.info {
  background: #dbeafe;
  color: #1e40af;
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

.info-item code {
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.amount-large {
  font-size: 1.5rem;
  font-weight: 700;
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

.vehicle-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #667eea;
  color: #ffffff;
}

.btn-primary:hover {
  background: #5568d3;
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

