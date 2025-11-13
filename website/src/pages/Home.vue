<template>
  <div class="home">
    <Banner />
    
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Choose Us?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚗</div>
            <h3>Premium Fleet</h3>
            <p>Well-maintained, comfortable vehicles for every need</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👨‍✈️</div>
            <h3>Expert Drivers</h3>
            <p>Professional, licensed, and experienced drivers</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Transparent pricing with no hidden charges</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Safe & Secure</h3>
            <p>24/7 support and GPS tracking for your safety</p>
          </div>
        </div>
      </div>
    </section>

    <section class="services">
      <div class="container">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">
          <div class="service-card">
            <h3>City Rides</h3>
            <p>Quick and convenient rides within the city</p>
            <router-link to="/book" class="btn btn-primary">Book Now</router-link>
          </div>
          <div class="service-card">
            <h3>Airport Transfer</h3>
            <p>Reliable airport pick-up and drop services</p>
            <router-link to="/book" class="btn btn-primary">Book Now</router-link>
          </div>
          <div class="service-card">
            <h3>Outstation</h3>
            <p>Long-distance trips with comfortable vehicles</p>
            <router-link to="/book" class="btn btn-primary">Book Now</router-link>
          </div>
          <div class="service-card">
            <h3>Corporate</h3>
            <p>Dedicated corporate travel solutions</p>
            <router-link to="/book" class="btn btn-primary">Book Now</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">50,000+</div>
            <div class="stat-label">Happy Customers</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Fleet Vehicles</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Support Available</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">4.8★</div>
            <div class="stat-label">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Banner from '../components/Banner.vue'
</script>

<style scoped>
.home {
  width: 100%;
}

.features,
.services {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.features-grid,
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card,
.service-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover,
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3,
.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.feature-card p,
.service-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.stats {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>

