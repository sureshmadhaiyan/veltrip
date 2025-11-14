<template>
  <div class="tour-packages-page">
    <section class="packages-hero">
      <div class="container">
        <h1>Tour Packages All Over India</h1>
        <p>Explore the beauty of India with our curated tour packages</p>
      </div>
    </section>

    <section class="packages-content">
      <div class="container">
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-tabs">
            <button 
              v-for="region in regions" 
              :key="region"
              @click="selectedRegion = region"
              :class="{ active: selectedRegion === region }"
              class="filter-tab"
            >
              {{ region }}
            </button>
          </div>
        </div>

        <!-- Packages Grid -->
        <div class="packages-grid">
          <div 
            v-for="packageItem in filteredPackages" 
            :key="packageItem.id"
            class="package-card"
          >
            <div class="package-image">
              <img :src="packageItem.image" :alt="packageItem.name" />
              <div class="package-badge" v-if="packageItem.badge">
                {{ packageItem.badge }}
              </div>
            </div>
            <div class="package-content">
              <h3>{{ packageItem.name }}</h3>
              <div class="package-location">
                <span class="location-icon">📍</span>
                <span>{{ packageItem.location }}</span>
              </div>
              <div class="package-details">
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span>{{ packageItem.duration }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">👥</span>
                  <span>{{ packageItem.people }}</span>
                </div>
              </div>
              <p class="package-description">{{ packageItem.description }}</p>
              <div class="package-highlights">
                <h4>Highlights:</h4>
                <ul>
                  <li v-for="highlight in packageItem.highlights" :key="highlight">
                    {{ highlight }}
                  </li>
                </ul>
              </div>
              <div class="package-footer">
                <div class="package-price">
                  <span class="price-label">Starting from</span>
                  <span class="price-amount">₹{{ packageItem.price }}</span>
                  <span class="price-unit">/person</span>
                </div>
                <router-link to="/book" class="btn btn-primary">
                  Book Now
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedRegion = ref('All India')

const regions = ['All India', 'North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast']

const packages = [
  {
    id: 1,
    name: 'Golden Triangle Tour',
    location: 'Delhi, Agra, Jaipur',
    region: 'North India',
    duration: '5 Days / 4 Nights',
    people: '2-4 People',
    price: '15,999',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    description: 'Experience the rich heritage of India with visits to iconic monuments.',
    highlights: ['Taj Mahal', 'Red Fort', 'Amber Fort', 'City Palace'],
    badge: 'Popular',
  },
  {
    id: 2,
    name: 'Kerala Backwaters',
    location: 'Kochi, Alleppey, Munnar',
    region: 'South India',
    duration: '6 Days / 5 Nights',
    people: '2-4 People',
    price: '18,999',
    image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=800&q=80',
    description: 'Cruise through serene backwaters and explore tea plantations.',
    highlights: ['Houseboat Stay', 'Tea Gardens', 'Spice Plantations', 'Beaches'],
    badge: 'Best Seller',
  },
  {
    id: 3,
    name: 'Goa Beach Paradise',
    location: 'North & South Goa',
    region: 'West India',
    duration: '4 Days / 3 Nights',
    people: '2-6 People',
    price: '12,999',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    description: 'Relax on pristine beaches and enjoy vibrant nightlife.',
    highlights: ['Beach Hopping', 'Water Sports', 'Nightlife', 'Portuguese Heritage'],
  },
  {
    id: 4,
    name: 'Darjeeling & Sikkim',
    location: 'Darjeeling, Gangtok',
    region: 'Northeast',
    duration: '7 Days / 6 Nights',
    people: '2-4 People',
    price: '22,999',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    description: 'Witness breathtaking mountain views and Buddhist monasteries.',
    highlights: ['Toy Train', 'Tiger Hill', 'Monasteries', 'Mountain Views'],
  },
  {
    id: 5,
    name: 'Rajasthan Royal Tour',
    location: 'Udaipur, Jodhpur, Jaisalmer',
    region: 'North India',
    duration: '8 Days / 7 Nights',
    people: '2-4 People',
    price: '24,999',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&q=80',
    description: 'Explore the royal cities of Rajasthan with palaces and forts.',
    highlights: ['City Palace', 'Mehrangarh Fort', 'Desert Safari', 'Lake Pichola'],
    badge: 'Luxury',
  },
  {
    id: 6,
    name: 'Kashmir Valley',
    location: 'Srinagar, Gulmarg, Pahalgam',
    region: 'North India',
    duration: '6 Days / 5 Nights',
    people: '2-4 People',
    price: '19,999',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    description: 'Discover the paradise on earth with stunning landscapes.',
    highlights: ['Dal Lake', 'Gulmarg Gondola', 'Pahalgam Valley', 'Shikara Ride'],
  },
  {
    id: 7,
    name: 'Tamil Nadu Heritage',
    location: 'Chennai, Madurai, Rameswaram',
    region: 'South India',
    duration: '7 Days / 6 Nights',
    people: '2-4 People',
    price: '16,999',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
    description: 'Explore ancient temples and rich Dravidian culture.',
    highlights: ['Meenakshi Temple', 'Rameswaram Temple', 'Mahabalipuram', 'Pondicherry'],
  },
  {
    id: 8,
    name: 'Himachal Adventure',
    location: 'Shimla, Manali, Dharamshala',
    region: 'North India',
    duration: '8 Days / 7 Nights',
    people: '2-6 People',
    price: '21,999',
    image: 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800&q=80',
    description: 'Mountain adventure with trekking and scenic beauty.',
    highlights: ['Rohtang Pass', 'Solang Valley', 'Tibetan Monasteries', 'Adventure Sports'],
  },
  {
    id: 9,
    name: 'Kolkata & Sundarbans',
    location: 'Kolkata, Sundarbans',
    region: 'East India',
    duration: '5 Days / 4 Nights',
    people: '2-4 People',
    price: '17,999',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    description: 'Cultural heritage and wildlife adventure in the mangroves.',
    highlights: ['Victoria Memorial', 'Howrah Bridge', 'Sundarbans Safari', 'Bengali Cuisine'],
  },
  {
    id: 10,
    name: 'Mumbai & Pune',
    location: 'Mumbai, Pune, Lonavala',
    region: 'West India',
    duration: '5 Days / 4 Nights',
    people: '2-4 People',
    price: '14,999',
    image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
    description: 'Explore the financial capital and nearby hill stations.',
    highlights: ['Gateway of India', 'Marine Drive', 'Lonavala', 'Aga Khan Palace'],
  },
  {
    id: 11,
    name: 'Varanasi Spiritual',
    location: 'Varanasi, Sarnath',
    region: 'Central India',
    duration: '3 Days / 2 Nights',
    people: '2-4 People',
    price: '9,999',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    description: 'Spiritual journey along the Ganges with ancient rituals.',
    highlights: ['Ganga Aarti', 'Sarnath', 'Temples', 'Boat Ride'],
  },
  {
    id: 12,
    name: 'Andaman Islands',
    location: 'Port Blair, Havelock, Neil',
    region: 'South India',
    duration: '6 Days / 5 Nights',
    people: '2-4 People',
    price: '28,999',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    description: 'Tropical paradise with crystal clear waters and coral reefs.',
    highlights: ['Radhanagar Beach', 'Scuba Diving', 'Cellular Jail', 'Coral Reefs'],
    badge: 'Premium',
  },
]

const filteredPackages = computed(() => {
  if (selectedRegion.value === 'All India') {
    return packages
  }
  return packages.filter(pkg => pkg.region === selectedRegion.value)
})
</script>

<style scoped>
.tour-packages-page {
  width: 100%;
}

.packages-hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}

.packages-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.packages-content {
  padding: 4rem 0;
}

.filter-section {
  margin-bottom: 3rem;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: var(--text-color);
}

.filter-tab:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.filter-tab.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #ffffff;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.package-card {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.package-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.package-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.package-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.package-card:hover .package-image img {
  transform: scale(1.1);
}

.package-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-color);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.package-content {
  padding: 1.5rem;
}

.package-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.package-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.location-icon {
  font-size: 1.2rem;
}

.package-details {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1.1rem;
}

.package-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.package-highlights {
  margin-bottom: 1.5rem;
}

.package-highlights h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.package-highlights ul {
  list-style: none;
  padding: 0;
}

.package-highlights li {
  padding: 0.25rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #666;
  font-size: 0.9rem;
}

.package-highlights li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.package-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.package-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.85rem;
  color: #666;
}

.price-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
}

.price-unit {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 768px) {
  .packages-hero h1 {
    font-size: 2rem;
  }
  
  .packages-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .filter-tab {
    flex-shrink: 0;
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }
  
  .package-image {
    height: 200px;
  }
  
  .package-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .package-footer .btn {
    width: 100%;
  }
  
  .package-price {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .packages-hero {
    padding: 2rem 0;
  }
  
  .packages-hero h1 {
    font-size: 1.75rem;
  }
  
  .package-content {
    padding: 1rem;
  }
  
  .package-content h3 {
    font-size: 1.25rem;
  }
  
  .package-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

