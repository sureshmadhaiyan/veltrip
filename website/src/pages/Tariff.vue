<template>
  <div class="tariff-page">
    <section class="tariff-hero">
      <div class="container">
        <h1>Our Tariff Plans</h1>
        <p>Transparent pricing with no hidden charges</p>
      </div>
    </section>

    <section class="tariff-content">
      <div class="container">
        <div class="tariff-tables">
          <div class="tariff-table">
            <h2>City Rides</h2>
            <table>
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>Base Fare</th>
                  <th>Per KM</th>
                  <th>Per Hour</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hatchback</td>
                  <td>₹50</td>
                  <td>₹8/km</td>
                  <td>₹100/hr</td>
                </tr>
                <tr>
                  <td>Sedan</td>
                  <td>₹70</td>
                  <td>₹10/km</td>
                  <td>₹120/hr</td>
                </tr>
                <tr>
                  <td>SUV</td>
                  <td>₹90</td>
                  <td>₹12/km</td>
                  <td>₹150/hr</td>
                </tr>
                <tr>
                  <td>Premium</td>
                  <td>₹120</td>
                  <td>₹15/km</td>
                  <td>₹200/hr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="tariff-table">
            <h2>Airport Transfer</h2>
            <table>
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>One Way</th>
                  <th>Round Trip</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Hatchback</td>
                  <td>₹800</td>
                  <td>₹1,500</td>
                </tr>
                <tr>
                  <td>Sedan</td>
                  <td>₹1,000</td>
                  <td>₹1,900</td>
                </tr>
                <tr>
                  <td>SUV</td>
                  <td>₹1,200</td>
                  <td>₹2,300</td>
                </tr>
                <tr>
                  <td>Premium</td>
                  <td>₹1,500</td>
                  <td>₹2,900</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="tariff-table">
            <h2>Outstation</h2>
            <table>
              <thead>
                <tr>
                  <th>Distance</th>
                  <th>Hatchback</th>
                  <th>Sedan</th>
                  <th>SUV</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>100-200 km</td>
                  <td>₹1,200</td>
                  <td>₹1,500</td>
                  <td>₹1,800</td>
                </tr>
                <tr>
                  <td>200-300 km</td>
                  <td>₹2,000</td>
                  <td>₹2,500</td>
                  <td>₹3,000</td>
                </tr>
                <tr>
                  <td>300-500 km</td>
                  <td>₹3,500</td>
                  <td>₹4,500</td>
                  <td>₹5,500</td>
                </tr>
                <tr>
                  <td>500+ km</td>
                  <td>Custom</td>
                  <td>Custom</td>
                  <td>Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="tariff-notes">
          <h3>Important Notes</h3>
          <ul>
            <li>All prices are inclusive of GST</li>
            <li>Night charges (10 PM - 6 AM): Additional 20%</li>
            <li>Driver charges: ₹200/day for outstation trips</li>
            <li>Toll charges and parking fees are extra</li>
            <li>Minimum booking duration: 4 hours for city rides</li>
            <li>Cancellation charges apply as per policy</li>
          </ul>
        </div>

        <div class="cta-section">
          <router-link to="/book" class="btn btn-primary btn-large">Book Your Ride Now</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Tariff page component
</script>

<style scoped>
.tariff-page {
  width: 100%;
}

.tariff-hero {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  padding: 4rem 0;
  text-align: center;
}

.tariff-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.tariff-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.tariff-content {
  padding: 4rem 0;
}

.tariff-tables {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

.tariff-table {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tariff-table h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--primary-color);
  color: #ffffff;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  font-weight: 600;
}

tbody tr:hover {
  background: #f9fafb;
}

.tariff-notes {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.tariff-notes h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.tariff-notes ul {
  list-style: none;
  padding-left: 0;
}

.tariff-notes li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tariff-notes li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.cta-section {
  text-align: center;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .tariff-hero h1 {
    font-size: 2rem;
  }
  
  table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }
}
</style>

