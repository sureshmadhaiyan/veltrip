<template>
  <div class="contact-page">
    <section class="contact-hero">
      <div class="container">
        <h1>Get in Touch</h1>
        <p>We're here to help! Contact us for any queries or bookings.</p>
      </div>
    </section>

    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-form-wrapper">
            <h2>Send us a Message</h2>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  required
                  placeholder="Enter your name"
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="form.phone"
                  required
                  placeholder="Enter your phone"
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  v-model="form.subject"
                  required
                  placeholder="Enter subject"
                />
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="5"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              
              <div v-if="success" class="success-message">
                Thank you! We'll get back to you soon.
              </div>
              
              <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
                {{ loading ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>

          <div class="contact-info">
            <h2>Contact Information</h2>
            
            <div class="info-item">
              <div class="info-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+91 9940882200</p>
                <p>+91 1234567890</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>info@veltrip.com</p>
                <p>support@veltrip.com</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div>
                <h3>Address</h3>
                <p>123 Main Street</p>
                <p>Your City, State - 123456</p>
                <p>India</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">🕒</div>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                <p>24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    success.value = true
    form.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    }
    setTimeout(() => {
      success.value = false
    }, 5000)
  }, 1000)
}
</script>

<style scoped>
.contact-page {
  width: 100%;
}

.contact-hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}

.contact-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.contact-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.contact-content {
  padding: 4rem 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-form-wrapper,
.contact-info {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-form-wrapper h2,
.contact-info h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
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
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
}

.info-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.info-item h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.info-item p {
  color: #666;
  margin: 0.25rem 0;
  line-height: 1.6;
}

@media (max-width: 968px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-hero h1 {
    font-size: 2rem;
  }
}
</style>

