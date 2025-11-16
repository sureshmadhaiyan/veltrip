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

    <section class="tour-preview">
      <div class="container">
        <h2 class="section-title">Explore India with Our Tour Packages</h2>
        <p class="section-subtitle">Discover amazing destinations across India</p>
        <div class="tour-cards-preview">
          <div class="tour-card-mini" v-for="tour in featuredTours" :key="tour.id">
            <div class="tour-image-mini">
              <img :src="tour.image" :alt="tour.name" />
            </div>
            <div class="tour-info-mini">
              <h4>{{ tour.name }}</h4>
              <p class="tour-location-mini">📍 {{ tour.location }}</p>
              <p class="tour-price-mini">From ₹{{ tour.price }}</p>
            </div>
          </div>
        </div>
        <div class="tour-cta">
          <router-link to="/tours" class="btn btn-primary btn-large">View All Tour Packages</router-link>
        </div>
      </div>
    </section>

    <section class="daily-deals">
      <div class="container">
        <h2 class="section-title">Daily Deals</h2>
        <p class="section-subtitle">Special offers and discounts for today</p>
        <div class="deals-grid">
          <div class="deal-card" v-for="deal in dailyDeals" :key="deal.id">
            <div class="deal-image">
              <img :src="deal.image" :alt="deal.title" />
              <div class="deal-badge">{{ deal.discount }}</div>
            </div>
            <div class="deal-content">
              <h3>{{ deal.title }}</h3>
              <p class="deal-location">📍 {{ deal.location }}</p>
              <div class="deal-price">
                <span class="old-price">₹{{ deal.oldPrice }}</span>
                <span class="new-price">₹{{ deal.newPrice }}</span>
              </div>
              <p class="deal-validity">Valid: {{ deal.validity }}</p>
              <router-link to="/book" class="btn btn-primary btn-block">Book Now</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <p class="section-subtitle">Real experiences from our happy travelers</p>
        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-rating">
              <span v-for="i in 5" :key="i" class="star">★</span>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">{{ testimonial.name.charAt(0) }}</div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-location">{{ testimonial.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Banner from '../components/Banner.vue'
import { ref } from 'vue'

const featuredTours = ref([
  {
    id: 1,
    name: 'Golden Triangle',
    location: 'Delhi, Agra, Jaipur',
    price: '15,999',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
  },
  {
    id: 2,
    name: 'Kerala Backwaters',
    location: 'Kochi, Alleppey',
    price: '18,999',
    image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=400&q=80',
  },
  {
    id: 3,
    name: 'Goa Beach',
    location: 'North & South Goa',
    price: '12,999',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
  },
  {
    id: 4,
    name: 'Kashmir Valley',
    location: 'Srinagar, Gulmarg',
    price: '19,999',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  },
])

const dailyDeals = ref([
  {
    id: 1,
    title: 'Mumbai City Tour',
    location: 'Mumbai, Maharashtra',
    discount: '20% OFF',
    oldPrice: '2,500',
    newPrice: '2,000',
    validity: 'Today Only',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80',
  },
  {
    id: 2,
    title: 'Bangalore Airport Transfer',
    location: 'Bangalore, Karnataka',
    discount: '15% OFF',
    oldPrice: '1,200',
    newPrice: '1,020',
    validity: 'Valid till Month End',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80',
  },
  {
    id: 3,
    title: 'Delhi Outstation',
    location: 'Delhi to Agra',
    discount: '25% OFF',
    oldPrice: '3,500',
    newPrice: '2,625',
    validity: 'Weekend Special',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
  },
  {
    id: 4,
    title: 'Chennai City Package',
    location: 'Chennai, Tamil Nadu',
    discount: '30% OFF',
    oldPrice: '2,000',
    newPrice: '1,400',
    validity: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
  },
])

const testimonials = ref([
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Bangalore',
    text: 'Excellent service! The driver was professional and the car was very clean. Highly recommended for airport transfers.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Booked a tour package to Goa through Veltrip. Everything was well organized and the trip was amazing. Great value for money!',
  },
  {
    id: 3,
    name: 'Amit Patel',
    location: 'Delhi',
    text: 'Used their outstation service for a family trip. The driver was courteous and the vehicle was comfortable. Will definitely use again.',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    text: 'Best cab service in the city! Always on time, clean cars, and friendly drivers. The booking process is so easy.',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    location: 'Pune',
    text: 'Took the Golden Triangle tour package. The itinerary was perfect and the guide was knowledgeable. Had a wonderful experience!',
  },
  {
    id: 6,
    name: 'Anjali Mehta',
    location: 'Chennai',
    text: 'Corporate booking was seamless. They handled our team travel requirements perfectly. Professional and reliable service.',
  },
])
</script>

<style scoped>
.home {
  width: 100%;
}

.features,
.services {
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  color: var(--text-color);
}

.features-grid,
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card,
.service-card {
  background: #ffffff;
  padding: 1.75rem;
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
  padding: 5rem 0;
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

.tour-preview {
  padding: 5rem 0;
  background: #f9fafb;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.tour-cards-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tour-card-mini {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.tour-card-mini:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.tour-image-mini {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.tour-image-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tour-info-mini {
  padding: 1rem;
}

.tour-info-mini h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.tour-location-mini {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.tour-price-mini {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-color);
}

.tour-cta {
  text-align: center;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .tour-cards-preview {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .tour-image-mini {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .tour-cards-preview {
    grid-template-columns: 1fr;
  }
}

.daily-deals {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.deal-card {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.deal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.deal-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.deal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.deal-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-color);
  color: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.deal-content {
  padding: 1.5rem;
}

.deal-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.deal-location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.deal-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 1rem;
}

.new-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.deal-validity {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
}

.testimonials {
  padding: 5rem 0;
  background: #f9fafb;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.testimonial-rating {
  margin-bottom: 1rem;
}

.star {
  color: #FFC107;
  font-size: 1.2rem;
}

.testimonial-text {
  color: #666;
  line-height: 1.8;
  font-style: italic;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.author-location {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 768px) {
  .deals-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .deal-image {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .deals-grid,
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>

