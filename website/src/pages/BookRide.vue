<template>
  <div class="book-ride-page">
    <section class="book-hero">
      <div class="container">
        <h1>Book Your Ride</h1>
        <p>Quick and easy booking in just a few steps</p>
      </div>
    </section>

    <section class="booking-content">
      <div class="container">
        <div class="booking-wrapper">
          <div class="booking-form-card">
            <h2>Ride Details</h2>
            <form @submit.prevent="handleBooking" class="booking-form">
              <!-- Trip Type Selection -->
              <div class="form-section">
                <h3>Select Trip Type</h3>
                <div class="trip-type-grid">
                  <label class="trip-type-card" :class="{ active: booking.tripType === 'city' }">
                    <input type="radio" v-model="booking.tripType" value="city" />
                    <div class="trip-icon">🏙️</div>
                    <div class="trip-name">City Ride</div>
                    <div class="trip-desc">Within city limits</div>
                  </label>
                  <label class="trip-type-card" :class="{ active: booking.tripType === 'airport' }">
                    <input type="radio" v-model="booking.tripType" value="airport" />
                    <div class="trip-icon">✈️</div>
                    <div class="trip-name">Airport Transfer</div>
                    <div class="trip-desc">Pickup/Drop to airport</div>
                  </label>
                  <label class="trip-type-card" :class="{ active: booking.tripType === 'outstation' }">
                    <input type="radio" v-model="booking.tripType" value="outstation" />
                    <div class="trip-icon">🛣️</div>
                    <div class="trip-name">Outstation</div>
                    <div class="trip-desc">Long distance trips</div>
                  </label>
                  <label class="trip-type-card" :class="{ active: booking.tripType === 'hourly' }">
                    <input type="radio" v-model="booking.tripType" value="hourly" />
                    <div class="trip-icon">⏰</div>
                    <div class="trip-name">Hourly Package</div>
                    <div class="trip-desc">Rent by hours</div>
                  </label>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="pickup">Pickup Location *</label>
                  <input
                    type="text"
                    id="pickup"
                    v-model="booking.pickupAddress"
                    required
                    placeholder="Enter pickup address"
                  />
                  <small>Enter your pickup location</small>
                </div>
                <div class="form-group">
                  <label for="drop">Drop Location *</label>
                  <input
                    type="text"
                    id="drop"
                    v-model="booking.dropAddress"
                    required
                    placeholder="Enter drop address"
                  />
                  <small>Enter your destination</small>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="vehicleType">Vehicle Type *</label>
                  <select id="vehicleType" v-model="booking.vehicleType" required>
                    <option value="">Select vehicle</option>
                    <option value="hatchback">Hatchback - ₹8/km</option>
                    <option value="sedan">Sedan - ₹10/km</option>
                    <option value="suv">SUV - ₹12/km</option>
                    <option value="premium">Premium - ₹15/km</option>
                  </select>
                  <small>Choose your preferred vehicle</small>
                </div>
                <div class="form-group">
                  <label for="passengers">Number of Passengers *</label>
                  <select id="passengers" v-model="booking.passengers" required>
                    <option value="">Select</option>
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5+ Passengers</option>
                  </select>
                  <small>Total number of passengers</small>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="date">Date & Time *</label>
                  <input
                    type="datetime-local"
                    id="date"
                    v-model="booking.scheduledAt"
                    required
                    :min="minDateTime"
                  />
                  <small>When do you need the ride?</small>
                </div>
                <div class="form-group">
                  <label for="luggage">Luggage</label>
                  <select id="luggage" v-model="booking.luggage">
                    <option value="none">No Luggage</option>
                    <option value="small">Small (1-2 bags)</option>
                    <option value="medium">Medium (3-4 bags)</option>
                    <option value="large">Large (5+ bags)</option>
                  </select>
                  <small>Amount of luggage</small>
                </div>
              </div>

              <!-- Additional Services -->
              <div class="form-section">
                <h3>Additional Services</h3>
                <div class="services-grid">
                  <label class="service-checkbox">
                    <input type="checkbox" v-model="booking.services" value="childSeat" />
                    <span>Child Seat</span>
                  </label>
                  <label class="service-checkbox">
                    <input type="checkbox" v-model="booking.services" value="wheelchair" />
                    <span>Wheelchair Accessible</span>
                  </label>
                  <label class="service-checkbox">
                    <input type="checkbox" v-model="booking.services" value="wifi" />
                    <span>WiFi Available</span>
                  </label>
                  <label class="service-checkbox">
                    <input type="checkbox" v-model="booking.services" value="ac" />
                    <span>AC Vehicle</span>
                  </label>
                </div>
              </div>

              <!-- Special Instructions -->
              <div class="form-group">
                <label for="instructions">Special Instructions</label>
                <textarea
                  id="instructions"
                  v-model="booking.instructions"
                  rows="3"
                  placeholder="Any special requests or instructions for the driver..."
                ></textarea>
              </div>

              <!-- Contact Information -->
              <div class="form-section">
                <h3>Contact Information</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label for="contactName">Your Name *</label>
                    <input
                      type="text"
                      id="contactName"
                      v-model="booking.contactName"
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div class="form-group">
                    <label for="contactPhone">Phone Number *</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      v-model="booking.contactPhone"
                      required
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="contactEmail">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    v-model="booking.contactEmail"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <!-- Captcha -->
              <div class="form-section">
                <div class="captcha-container">
                  <label for="captcha">Security Verification *</label>
                  <div class="captcha-box">
                    <div class="captcha-display">
                      <span class="captcha-text">{{ captchaText }}</span>
                      <button type="button" @click="generateCaptcha" class="refresh-captcha" title="Refresh">
                        🔄
                      </button>
                    </div>
                    <input
                      type="text"
                      id="captcha"
                      v-model="booking.captcha"
                      required
                      placeholder="Enter the code above"
                      class="captcha-input"
                    />
                  </div>
                  <small v-if="captchaError" class="error-text">{{ captchaError }}</small>
                </div>
              </div>

              <!-- Fare Estimate -->
              <div v-if="estimatedFare" class="fare-estimate">
                <h3>Estimated Fare</h3>
                <div class="fare-breakdown">
                  <div class="fare-item">
                    <span>Base Fare</span>
                    <span>₹{{ fareBreakdown.base }}</span>
                  </div>
                  <div class="fare-item">
                    <span>Distance ({{ estimatedDistance }} km)</span>
                    <span>₹{{ fareBreakdown.distance }}</span>
                  </div>
                  <div v-if="fareBreakdown.services > 0" class="fare-item">
                    <span>Additional Services</span>
                    <span>₹{{ fareBreakdown.services }}</span>
                  </div>
                  <div class="fare-item total">
                    <span>Total Estimated Fare</span>
                    <span class="fare-amount">₹{{ estimatedFare }}</span>
                  </div>
                </div>
                <p class="fare-note">* Final fare may vary based on actual distance and time</p>
              </div>

              <div v-if="error" class="error-message">{{ error }}</div>
              <div v-if="success" class="success-message">
                Booking successful! Your ride is confirmed. Booking ID: {{ bookingId }}
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-large" :disabled="loading || !authStore.isAuthenticated">
                {{ loading ? 'Booking...' : authStore.isAuthenticated ? 'Confirm Booking' : 'Login to Book' }}
              </button>

              <p v-if="!authStore.isAuthenticated" class="login-prompt">
                <router-link to="/login">Login</router-link> to book your ride
              </p>
            </form>
          </div>

          <div class="booking-info">
            <h3>Why Book With Us?</h3>
            <ul class="benefits-list">
              <li>✓ Instant confirmation</li>
              <li>✓ Best price guarantee</li>
              <li>✓ 24/7 customer support</li>
              <li>✓ GPS tracking</li>
              <li>✓ Safe & secure rides</li>
              <li>✓ Professional drivers</li>
              <li>✓ Multiple payment options</li>
              <li>✓ Easy cancellation</li>
            </ul>

            <div class="support-box">
              <h4>Need Help?</h4>
              <p>Call us at <a href="tel:+919940882200">+91 9940882200</a></p>
              <p>Available 24/7</p>
              <p>Email: <a href="mailto:support@veltrip.com">support@veltrip.com</a></p>
            </div>

            <div class="info-box">
              <h4>Booking Tips</h4>
              <ul>
                <li>Book in advance for better rates</li>
                <li>Provide accurate pickup location</li>
                <li>Be ready 5 minutes before pickup time</li>
                <li>Keep your phone charged and accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../api/company'

const router = useRouter()
const authStore = useAuthStore()

const booking = ref({
  tripType: 'city',
  pickupAddress: '',
  dropAddress: '',
  vehicleType: '',
  passengers: '',
  scheduledAt: '',
  luggage: 'none',
  services: [],
  instructions: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  captcha: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const bookingId = ref(null)
const estimatedFare = ref(null)
const estimatedDistance = ref(15) // Default 15 km
const captchaText = ref('')
const captchaError = ref('')

const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 30) // Minimum 30 minutes from now
  return now.toISOString().slice(0, 16)
})

const fareBreakdown = computed(() => {
  const baseFare = 50
  const rates = {
    hatchback: 8,
    sedan: 10,
    suv: 12,
    premium: 15,
  }
  const ratePerKm = rates[booking.value.vehicleType] || 10
  const distanceFare = estimatedDistance.value * ratePerKm
  const servicesFare = booking.value.services.length * 50
  
  return {
    base: baseFare,
    distance: distanceFare,
    services: servicesFare,
  }
})

const calculateFare = () => {
  if (!booking.value.vehicleType) {
    estimatedFare.value = null
    return
  }
  
  const total = fareBreakdown.value.base + fareBreakdown.value.distance + fareBreakdown.value.services
  estimatedFare.value = total
}

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = result
  booking.value.captcha = ''
  captchaError.value = ''
}

const validateCaptcha = () => {
  if (booking.value.captcha.toUpperCase() !== captchaText.value) {
    captchaError.value = 'Invalid captcha code. Please try again.'
    generateCaptcha()
    return false
  }
  captchaError.value = ''
  return true
}

// Watch for changes to recalculate fare
watch([() => booking.value.vehicleType, () => booking.value.services], () => {
  calculateFare()
})

const handleBooking = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!validateCaptcha()) {
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    calculateFare()
    
    const response = await api.post('/bookings', {
      pickupAddress: booking.value.pickupAddress,
      dropAddress: booking.value.dropAddress,
      pickupLatitude: 0, // Would get from geocoding
      pickupLongitude: 0,
      dropLatitude: 0,
      dropLongitude: 0,
      scheduledAt: booking.value.scheduledAt,
    })

    bookingId.value = response.data.id
    success.value = true
    generateCaptcha()
    
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Booking failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped>
.book-ride-page {
  width: 100%;
}

.book-hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}

.book-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.booking-content {
  padding: 4rem 0;
}

.booking-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.booking-form-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.booking-form-card h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.trip-type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.trip-type-card {
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #ffffff;
}

.trip-type-card input {
  display: none;
}

.trip-type-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.trip-type-card.active {
  border-color: var(--primary-color);
  background: rgba(255, 193, 7, 0.1);
}

.trip-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.trip-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.trip-desc {
  font-size: 0.85rem;
  color: #666;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.service-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.service-checkbox:hover {
  border-color: var(--primary-color);
  background: rgba(255, 193, 7, 0.05);
}

.service-checkbox input[type="checkbox"]:checked + span {
  color: var(--primary-color);
  font-weight: 600;
}

.fare-estimate {
  background: #f0f9ff;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1.5rem 0;
  border: 2px solid var(--primary-color);
}

.fare-estimate h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.fare-breakdown {
  margin-bottom: 1rem;
}

.fare-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.fare-item.total {
  border-top: 2px solid var(--primary-color);
  border-bottom: none;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 700;
}

.fare-amount {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.fare-note {
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-large {
  padding: 1rem;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.login-prompt {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-prompt a {
  color: var(--primary-color);
  font-weight: 600;
}

.booking-info {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 10px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.booking-info h3 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.benefits-list li {
  padding: 0.75rem 0;
  color: #666;
  font-size: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.support-box,
.info-box {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 5px;
  margin-top: 2rem;
}

.support-box h4,
.info-box h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.support-box p,
.info-box li {
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.6;
}

.support-box a,
.info-box a {
  color: var(--primary-color);
  font-weight: 600;
}

.info-box ul {
  list-style: none;
  padding: 0;
}

.info-box li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.info-box li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.captcha-container {
  margin-top: 1rem;
}

.captcha-box {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
}

.captcha-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  border: 2px solid #e5e7eb;
}

.captcha-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
  color: var(--primary-color);
  font-family: monospace;
  user-select: none;
}

.refresh-captcha {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.3s;
}

.refresh-captcha:hover {
  transform: rotate(180deg);
}

.captcha-input {
  flex: 1;
  max-width: 200px;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-size: 1rem;
}

.captcha-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

@media (max-width: 968px) {
  .booking-wrapper {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .trip-type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .book-hero h1 {
    font-size: 2rem;
  }
  
  .booking-info {
    position: static;
  }
  
  .captcha-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .captcha-input {
    max-width: 100%;
  }
}
</style>
