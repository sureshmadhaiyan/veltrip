<template>
  <section class="banner">
    <div class="carousel-container">
      <div 
        class="carousel-slide" 
        v-for="(slide, index) in slides" 
        :key="index"
        :class="{ active: currentSlide === index }"
        :style="getSlideStyle(slide)"
      >
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <div class="container">
            <h1 class="banner-title">{{ slide.title }}</h1>
            <p class="banner-subtitle">{{ slide.subtitle }}</p>
            <div class="banner-cta">
              <router-link to="/book" class="btn-primary">Book Your Ride Now</router-link>
              <router-link to="/tariff" class="btn-secondary">View Tariff</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Carousel Controls -->
      <button class="carousel-btn prev" @click="prevSlide" aria-label="Previous slide">
        ‹
      </button>
      <button class="carousel-btn next" @click="nextSlide" aria-label="Next slide">
        ›
      </button>
      
      <!-- Carousel Indicators -->
      <div class="carousel-indicators">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCompanyStore } from '../stores/company'

const companyStore = useCompanyStore()
const currentSlide = ref(0)
let autoPlayInterval = null

const slides = computed(() => {
  const defaultSlides = [
    {
      title: 'Welcome to Premium Cab Services',
      subtitle: 'Safe, Reliable, and Comfortable Rides for Every Journey',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80',
      gradient: `linear-gradient(135deg, ${companyStore.theme.primaryColor || '#FFC107'} 0%, ${companyStore.theme.secondaryColor || '#4CAF50'} 100%)`,
    },
    {
      title: '24/7 Available Service',
      subtitle: 'Book your ride anytime, anywhere. We are always here for you.',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=80',
      gradient: `linear-gradient(135deg, ${companyStore.theme.secondaryColor || '#4CAF50'} 0%, ${companyStore.theme.primaryColor || '#FFC107'} 100%)`,
    },
    {
      title: 'Premium Fleet of Vehicles',
      subtitle: 'From economy to luxury, choose the perfect ride for your journey.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80',
      gradient: `linear-gradient(135deg, ${companyStore.theme.accentColor || '#FFD54F'} 0%, ${companyStore.theme.primaryColor || '#FFC107'} 100%)`,
    },
    {
      title: 'Expert Professional Drivers',
      subtitle: 'Experienced, licensed, and courteous drivers for your safety and comfort.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
      gradient: `linear-gradient(135deg, ${companyStore.theme.primaryColor || '#FFC107'} 0%, ${companyStore.theme.accentColor || '#FFD54F'} 100%)`,
    },
  ]
  
  // Use company-specific slides if available
  if (companyStore.company?.bannerSlides) {
    return companyStore.company.bannerSlides
  }
  
  return defaultSlides
})

const getSlideStyle = (slide) => {
  return {
    backgroundImage: slide.image ? `url(${slide.image})` : 'none',
    background: slide.gradient || `linear-gradient(135deg, ${companyStore.theme.primaryColor || '#FFC107'} 0%, ${companyStore.theme.secondaryColor || '#4CAF50'} 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  resetAutoPlay()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoPlay()
}

const resetAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  startAutoPlay()
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style scoped>
.banner {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
  z-index: 1;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 2rem 0;
  text-align: center;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease;
}

.banner-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.banner-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1.2s ease;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  background: #f0f0f0;
}

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: #ffffff;
  font-size: 3rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 20px;
}

.carousel-btn.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.carousel-indicators button.active {
  background: #ffffff;
  transform: scale(1.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .carousel-container,
  .carousel-slide {
    min-height: 400px;
  }
  
  .banner-title {
    font-size: 2.5rem;
  }
  
  .banner-subtitle {
    font-size: 1.2rem;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 0.875rem 2rem;
    font-size: 0.9rem;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 2rem;
  }
  
  .carousel-btn.prev {
    left: 10px;
  }
  
  .carousel-btn.next {
    right: 10px;
  }
}
</style>
