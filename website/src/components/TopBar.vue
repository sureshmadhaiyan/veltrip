<template>
  <div class="top-bar" :style="topBarStyle">
    <div class="container">
      <div class="top-bar-content">
        <a href="tel:9944374601" class="phone-link">
          <span class="phone-icon">📞</span>
          <span class="phone-number">+91 9944374601</span>
        </a>
        <div class="top-bar-actions">
          <a href="tel:9944374601" class="call-btn">Call Now</a>
          <router-link to="/enquiry" class="enquiry-btn">Enquiry</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCompanyStore } from '../stores/company'

const companyStore = useCompanyStore()

const topBarStyle = computed(() => ({
  backgroundColor: companyStore.theme.secondaryColor || '#4CAF50',
  color: '#ffffff',
}))
</script>

<style scoped>
.top-bar {
  padding: 0.75rem 0;
  background: var(--secondary-color);
  color: #ffffff;
  font-size: 1rem;
  z-index: 1000;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phone-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s;
}

.phone-link:hover {
  opacity: 0.8;
}

.phone-icon {
  font-size: 1.5rem;
  animation: pulse-phone 2s infinite;
}

@keyframes pulse-phone {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.phone-number {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.top-bar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.call-btn,
.enquiry-btn {
  padding: 0.4rem 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.call-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.call-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.enquiry-btn {
  background: var(--primary-color);
  color: #1f2937;
}

.enquiry-btn:hover {
  background: #FFD54F;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .top-bar {
    font-size: 0.9rem;
    padding: 0.6rem 0;
  }
  
  .top-bar-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .phone-number {
    font-size: 1.1rem;
  }
  
  .phone-icon {
    font-size: 1.3rem;
  }
  
  .top-bar-actions {
    width: 100%;
    justify-content: center;
  }
  
  .call-btn,
  .enquiry-btn {
    flex: 1;
    max-width: 150px;
    text-align: center;
  }
}
</style>
