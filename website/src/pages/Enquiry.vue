<template>
  <div class="enquiry-page">
    <section class="enquiry-hero">
      <div class="container">
        <h1>Quick Enquiry</h1>
        <p>Fill out the form below and we'll get back to you soon</p>
      </div>
    </section>

    <section class="enquiry-content">
      <div class="container">
        <div class="enquiry-wrapper">
          <div class="enquiry-form-card">
            <h2>Send Us Your Query</h2>
            <form @submit.prevent="handleSubmit" class="enquiry-form">
              <div class="form-section">
                <h3>Personal Information</h3>
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      v-model="form.name"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      v-model="form.phone"
                      required
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div class="form-group">
                    <label for="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      v-model="form.city"
                      required
                      placeholder="Your city"
                    />
                  </div>
                </div>
              </div>

              <div class="form-section">
                <h3>Enquiry Details</h3>
                <div class="form-group">
                  <label for="enquiryType">Enquiry Type *</label>
                  <select id="enquiryType" v-model="form.enquiryType" required>
                    <option value="">Select enquiry type</option>
                    <option value="booking">Ride Booking</option>
                    <option value="tour">Tour Package</option>
                    <option value="corporate">Corporate Booking</option>
                    <option value="outstation">Outstation Trip</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="query">Your Query *</label>
                  <textarea
                    id="query"
                    v-model="form.query"
                    required
                    rows="5"
                    placeholder="Please describe your query in detail..."
                  ></textarea>
                </div>
                <div v-if="form.enquiryType === 'booking'" class="form-group">
                  <label for="bookingDetails">Booking Details</label>
                  <textarea
                    id="bookingDetails"
                    v-model="form.bookingDetails"
                    rows="3"
                    placeholder="Pickup location, drop location, date, time, number of passengers, etc."
                  ></textarea>
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
                      v-model="form.captcha"
                      required
                      placeholder="Enter the code above"
                      class="captcha-input"
                    />
                  </div>
                  <small v-if="captchaError" class="error-text">{{ captchaError }}</small>
                </div>
              </div>

              <div v-if="error" class="error-message">{{ error }}</div>
              <div v-if="success" class="success-message">
                Thank you! Your enquiry has been submitted successfully. We'll contact you soon.
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-large" :disabled="loading">
                {{ loading ? 'Submitting...' : 'Submit Enquiry' }}
              </button>
            </form>
          </div>

          <div class="enquiry-info">
            <h3>Why Contact Us?</h3>
            <ul class="benefits-list">
              <li>✓ Quick response within 24 hours</li>
              <li>✓ Expert travel consultants</li>
              <li>✓ Customized packages</li>
              <li>✓ Best price guarantee</li>
              <li>✓ 24/7 customer support</li>
            </ul>

            <div class="contact-box">
              <h4>Direct Contact</h4>
              <p><strong>Phone:</strong> <a href="tel:9944374601">+91 9944374601</a></p>
              <p><strong>Email:</strong> <a href="mailto:info@veltrip.com">info@veltrip.com</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/919944374601">+91 9944374601</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form = ref({
  name: '',
  phone: '',
  email: '',
  city: '',
  enquiryType: '',
  query: '',
  bookingDetails: '',
  captcha: '',
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const captchaText = ref('')
const captchaError = ref('')

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = result
  form.value.captcha = ''
  captchaError.value = ''
}

const validateCaptcha = () => {
  if (form.value.captcha.toUpperCase() !== captchaText.value) {
    captchaError.value = 'Invalid captcha code. Please try again.'
    generateCaptcha()
    return false
  }
  captchaError.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateCaptcha()) {
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    success.value = true
    form.value = {
      name: '',
      phone: '',
      email: '',
      city: '',
      enquiryType: '',
      query: '',
      bookingDetails: '',
      captcha: '',
    }
    generateCaptcha()
    
    setTimeout(() => {
      success.value = false
    }, 5000)
  } catch (err) {
    error.value = 'Failed to submit enquiry. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped>
.enquiry-page {
  width: 100%;
}

.enquiry-hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 3rem 0;
  text-align: center;
}

.enquiry-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.enquiry-content {
  padding: 4rem 0;
}

.enquiry-wrapper {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.enquiry-form-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.enquiry-form-card h2 {
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
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
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
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

.enquiry-info {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 10px;
  height: fit-content;
  position: sticky;
  top: 120px;
}

.enquiry-info h3 {
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

.contact-box {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 5px;
  margin-top: 2rem;
}

.contact-box h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.contact-box p {
  color: #666;
  margin: 0.75rem 0;
  line-height: 1.6;
}

.contact-box a {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
}

.contact-box a:hover {
  text-decoration: underline;
}

@media (max-width: 968px) {
  .enquiry-wrapper {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .captcha-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .captcha-input {
    max-width: 100%;
  }
  
  .enquiry-info {
    position: static;
  }
}
</style>

