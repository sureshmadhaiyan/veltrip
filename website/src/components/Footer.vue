<template>
  <footer class="footer" :style="footerStyle">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>{{ companyStore.companyName }}</h3>
          <p>Your trusted partner for safe and reliable cab services. Making every journey comfortable and memorable.</p>
          <div class="social-links">
            <a href="#" class="social-link">Facebook</a>
            <a href="#" class="social-link">Twitter</a>
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">LinkedIn</a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/tariff">Tariff</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
            <li><router-link to="/book">Book a Ride</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Services</h4>
          <ul>
            <li><a href="#">City Rides</a></li>
            <li><a href="#">Airport Transfer</a></li>
            <li><a href="#">Outstation</a></li>
            <li><a href="#">Corporate</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Contact Us</h4>
          <ul class="contact-info">
            <li>
              <strong>Phone:</strong>
              <a :href="`tel:${contactPhone}`">{{ contactPhone }}</a>
            </li>
            <li>
              <strong>Email:</strong>
              <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
            </li>
            <li>
              <strong>Address:</strong>
              <span>{{ contactAddress }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} {{ companyStore.companyName }}. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Cancellation Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useCompanyStore } from '../stores/company'

const companyStore = useCompanyStore()
const currentYear = new Date().getFullYear()

const footerStyle = computed(() => ({
  backgroundColor: companyStore.theme.secondaryColor || '#4CAF50',
  color: '#ffffff',
}))

const contactPhone = computed(() => companyStore.company?.phone || '+91 9940882200')
const contactEmail = computed(() => companyStore.company?.email || 'info@veltrip.com')
const contactAddress = computed(() => companyStore.company?.address || 'Your City, Your State, India')
</script>

<style scoped>
.footer {
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  margin-bottom: 1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #ffffff;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.footer-section a:hover {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  transition: all 0.3s;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.contact-info li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.contact-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #ffffff;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.footer-links a:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

