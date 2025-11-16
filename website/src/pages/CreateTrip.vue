<template>
  <div class="create-trip-page">
    <AdminSidebar />
    <div class="page-wrapper">
      <div class="page-header">
        <div>
          <router-link to="/admin/trips" class="back-link">← Back to Trips</router-link>
          <h1>Create Trip</h1>
        </div>
      </div>

      <div class="form-card">
        <form @submit.prevent="createTrip">
          <h2>Trip Details</h2>
          
          <!-- Company Selection -->
          <div class="form-group">
            <label for="companyId">Company *</label>
            <select id="companyId" v-model="form.companyId" required @change="onCompanyChange">
              <option value="">Select Company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Customer Search -->
          <div class="form-group">
            <label for="customerSearch">Customer *</label>
            <div class="search-dropdown">
              <input 
                type="text" 
                id="customerSearch"
                v-model="customerSearch"
                @input="searchCustomers"
                @focus="showCustomerDropdown = true"
                placeholder="Search by email, name, or phone..."
                required
              />
              <div v-if="showCustomerDropdown && filteredCustomers.length > 0" class="dropdown-list">
                <div 
                  v-for="customer in filteredCustomers" 
                  :key="customer.id"
                  @click="selectCustomer(customer)"
                  class="dropdown-item"
                >
                  <div class="customer-info">
                    <strong>{{ customer.firstName }} {{ customer.lastName }}</strong>
                    <small>{{ customer.email }}</small>
                    <small v-if="customer.phone">{{ customer.phone }}</small>
                  </div>
                </div>
              </div>
              <div v-if="selectedCustomer" class="selected-item">
                <strong>{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</strong>
                <span class="remove-btn" @click="clearCustomer">×</span>
              </div>
            </div>
          </div>

          <!-- Vehicle Search -->
          <div class="form-group">
            <label for="vehicleSearch">Vehicle (Optional)</label>
            <div class="search-dropdown">
              <input 
                type="text" 
                id="vehicleSearch"
                v-model="vehicleSearch"
                @input="searchVehicles"
                @focus="showVehicleDropdown = true"
                placeholder="Search by vehicle number, type, or model..."
              />
              <div v-if="showVehicleDropdown && filteredVehicles.length > 0" class="dropdown-list">
                <div 
                  v-for="vehicle in filteredVehicles" 
                  :key="vehicle.id"
                  @click="selectVehicle(vehicle)"
                  class="dropdown-item"
                >
                  <div class="vehicle-info">
                    <strong>{{ vehicle.vehicleNumber }}</strong>
                    <small>{{ vehicle.vehicleType }} - {{ vehicle.vehicleModel || 'N/A' }}</small>
                    <small v-if="vehicle.drivers && vehicle.drivers.length > 0">
                      Driver: {{ vehicle.drivers[0].user?.firstName }} {{ vehicle.drivers[0].user?.lastName }}
                    </small>
                  </div>
                </div>
              </div>
              <div v-if="selectedVehicle" class="selected-item">
                <strong>{{ selectedVehicle.vehicleNumber }}</strong>
                <span> - {{ selectedVehicle.vehicleType }}</span>
                <span class="remove-btn" @click="clearVehicle">×</span>
              </div>
            </div>
          </div>

          <!-- Driver Search -->
          <div class="form-group">
            <label for="driverSearch">Driver (Optional)</label>
            <div class="search-dropdown">
              <input 
                type="text" 
                id="driverSearch"
                v-model="driverSearch"
                @input="searchDrivers"
                @focus="showDriverDropdown = true"
                placeholder="Search by email, name, or phone..."
              />
              <div v-if="showDriverDropdown && filteredDrivers.length > 0" class="dropdown-list">
                <div 
                  v-for="driver in filteredDrivers" 
                  :key="driver.id"
                  @click="selectDriver(driver)"
                  class="dropdown-item"
                >
                  <div class="driver-info">
                    <strong>{{ driver.user?.firstName }} {{ driver.user?.lastName }}</strong>
                    <small>{{ driver.user?.email }}</small>
                    <small v-if="driver.vehicle">{{ driver.vehicle.vehicleNumber }} - {{ driver.vehicle.vehicleType }}</small>
                  </div>
                </div>
              </div>
              <div v-if="selectedDriver" class="selected-item">
                <strong>{{ selectedDriver.user?.firstName }} {{ selectedDriver.user?.lastName }}</strong>
                <span v-if="selectedDriver.vehicle"> - {{ selectedDriver.vehicle.vehicleNumber }}</span>
                <span class="remove-btn" @click="clearDriver">×</span>
              </div>
            </div>
          </div>

          <!-- Location Details -->
          <h3>Location Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="pickupAddress">Pickup Address (Arrival) *</label>
              <input 
                type="text" 
                id="pickupAddress" 
                v-model="form.pickupAddress" 
                required 
                placeholder="123 Main Street, City"
              />
            </div>
            <div class="form-group">
              <label for="dropAddress">Drop Address (Destination) *</label>
              <input 
                type="text" 
                id="dropAddress" 
                v-model="form.dropAddress" 
                required 
                placeholder="456 Park Avenue, City"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="pickupLatitude">Pickup Latitude *</label>
              <input 
                type="number" 
                step="any"
                id="pickupLatitude" 
                v-model="form.pickupLatitude" 
                required 
                placeholder="12.9716"
              />
            </div>
            <div class="form-group">
              <label for="pickupLongitude">Pickup Longitude *</label>
              <input 
                type="number" 
                step="any"
                id="pickupLongitude" 
                v-model="form.pickupLongitude" 
                required 
                placeholder="77.5946"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dropLatitude">Drop Latitude *</label>
              <input 
                type="number" 
                step="any"
                id="dropLatitude" 
                v-model="form.dropLatitude" 
                required 
                placeholder="12.9352"
              />
            </div>
            <div class="form-group">
              <label for="dropLongitude">Drop Longitude *</label>
              <input 
                type="number" 
                step="any"
                id="dropLongitude" 
                v-model="form.dropLongitude" 
                required 
                placeholder="77.6245"
              />
            </div>
          </div>

          <!-- Odometer Readings -->
          <h3>Odometer Readings</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="startingKm">Starting KM</label>
              <input 
                type="number" 
                step="0.1"
                id="startingKm" 
                v-model="form.startingKm" 
                placeholder="1000.5"
              />
            </div>
            <div class="form-group">
              <label for="endingKm">Ending KM</label>
              <input 
                type="number" 
                step="0.1"
                id="endingKm" 
                v-model="form.endingKm" 
                placeholder="1050.5"
              />
            </div>
          </div>

          <!-- Trip Timing -->
          <h3>Trip Timing</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="scheduledAt">Scheduled Start Date & Time</label>
              <input 
                type="datetime-local" 
                id="scheduledAt" 
                v-model="form.scheduledAt" 
              />
            </div>
            <div class="form-group">
              <label for="startedAt">Actual Start Date & Time</label>
              <input 
                type="datetime-local" 
                id="startedAt" 
                v-model="form.startedAt" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="completedAt">Trip End Date & Time</label>
            <input 
              type="datetime-local" 
              id="completedAt" 
              v-model="form.completedAt" 
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>

          <div class="form-actions">
            <router-link to="/admin/trips" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Creating...' : 'Create Trip' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import api from '../api/company'
import { getPassengers, getCompanies } from '../api/admin'
import { getDrivers } from '../api/admin'

const router = useRouter()
const companies = ref([])
const customers = ref([])
const drivers = ref([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const customerSearch = ref('')
const driverSearch = ref('')
const vehicleSearch = ref('')
const showCustomerDropdown = ref(false)
const showDriverDropdown = ref(false)
const showVehicleDropdown = ref(false)
const selectedCustomer = ref(null)
const selectedDriver = ref(null)
const selectedVehicle = ref(null)

const form = ref({
  companyId: '',
  customerId: '',
  driverId: '',
  vehicleId: '',
  pickupAddress: '',
  dropAddress: '',
  pickupLatitude: null,
  pickupLongitude: null,
  dropLatitude: null,
  dropLongitude: null,
  startingKm: null,
  endingKm: null,
  scheduledAt: '',
  startedAt: '',
  completedAt: '',
})

const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers.value.slice(0, 10)
  const search = customerSearch.value.toLowerCase()
  return customers.value.filter(c => 
    c.email?.toLowerCase().includes(search) ||
    c.firstName?.toLowerCase().includes(search) ||
    c.lastName?.toLowerCase().includes(search) ||
    c.phone?.includes(search)
  ).slice(0, 10)
})

const vehicles = ref([])

const filteredVehicles = computed(() => {
  if (!vehicleSearch.value) return vehicles.value.filter(v => v.status === 'ACTIVE').slice(0, 10)
  const search = vehicleSearch.value.toLowerCase()
  return vehicles.value.filter(v => 
    v.status === 'ACTIVE' &&
    (v.vehicleNumber?.toLowerCase().includes(search) ||
     v.vehicleType?.toLowerCase().includes(search) ||
     v.vehicleModel?.toLowerCase().includes(search))
  ).slice(0, 10)
})

const filteredDrivers = computed(() => {
  if (!driverSearch.value) return drivers.value.filter(d => d.isApproved && d.isOnline).slice(0, 10)
  const search = driverSearch.value.toLowerCase()
  return drivers.value.filter(d => {
    const user = d.user
    return (
      (d.isApproved && d.isOnline) &&
      (user?.email?.toLowerCase().includes(search) ||
       user?.firstName?.toLowerCase().includes(search) ||
       user?.lastName?.toLowerCase().includes(search) ||
       d.vehicle?.vehicleNumber?.toLowerCase().includes(search))
    )
  }).slice(0, 10)
})

const searchCustomers = () => {
  showCustomerDropdown.value = true
}

const searchDrivers = () => {
  showDriverDropdown.value = true
}

const searchVehicles = () => {
  showVehicleDropdown.value = true
}

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  form.value.customerId = customer.id
  customerSearch.value = `${customer.firstName} ${customer.lastName}`
  showCustomerDropdown.value = false
}

const selectDriver = (driver) => {
  selectedDriver.value = driver
  form.value.driverId = driver.id
  driverSearch.value = `${driver.user?.firstName} ${driver.user?.lastName}`
  showDriverDropdown.value = false
}

const clearCustomer = () => {
  selectedCustomer.value = null
  form.value.customerId = ''
  customerSearch.value = ''
}

const selectVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
  form.value.vehicleId = vehicle.id
  vehicleSearch.value = `${vehicle.vehicleNumber} - ${vehicle.vehicleType}`
  showVehicleDropdown.value = false
  
  // If vehicle has a driver, auto-select driver
  if (vehicle.drivers && vehicle.drivers.length > 0) {
    const driver = vehicle.drivers[0]
    selectDriver(driver)
  }
}

const clearDriver = () => {
  selectedDriver.value = null
  form.value.driverId = ''
  driverSearch.value = ''
}

const clearVehicle = () => {
  selectedVehicle.value = null
  form.value.vehicleId = ''
  vehicleSearch.value = ''
}

const onCompanyChange = () => {
  // Filter customers, drivers, and vehicles by company
  fetchCustomers()
  fetchDrivers()
  fetchVehicles()
}

const fetchCompanies = async () => {
  try {
    const response = await getCompanies({ page: 1, limit: 100 })
    companies.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch companies:', err)
  }
}

const fetchCustomers = async () => {
  try {
    const params = { page: 1, limit: 100 }
    if (form.value.companyId) {
      // Note: Admin API might filter by company automatically based on user
    }
    const response = await getPassengers(params)
    let allCustomers = response.data || []
    
    // Filter by company if selected
    if (form.value.companyId) {
      allCustomers = allCustomers.filter(c => c.companyId === form.value.companyId)
    }
    
    customers.value = allCustomers
  } catch (err) {
    console.error('Failed to fetch customers:', err)
  }
}

const fetchDrivers = async () => {
  try {
    const params = { page: 1, limit: 100 }
    const response = await getDrivers(params)
    let allDrivers = response.data || []
    
    // Filter by company if selected
    if (form.value.companyId) {
      allDrivers = allDrivers.filter(d => d.companyId === form.value.companyId)
    }
    
    drivers.value = allDrivers
  } catch (err) {
    console.error('Failed to fetch drivers:', err)
  }
}

const fetchVehicles = async () => {
  try {
    const response = await api.get('/vehicles')
    let allVehicles = response.data || []
    
    // Filter by company if selected
    if (form.value.companyId) {
      allVehicles = allVehicles.filter(v => v.companyId === form.value.companyId)
    }
    
    vehicles.value = allVehicles
  } catch (err) {
    console.error('Failed to fetch vehicles:', err)
  }
}

const createTrip = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    if (!selectedCustomer.value) {
      error.value = 'Please select a customer'
      loading.value = false
      return
    }

    const tripData = {
      companyId: form.value.companyId,
      customerId: form.value.customerId,
      pickupAddress: form.value.pickupAddress,
      dropAddress: form.value.dropAddress,
      pickupLatitude: parseFloat(form.value.pickupLatitude),
      pickupLongitude: parseFloat(form.value.pickupLongitude),
      dropLatitude: parseFloat(form.value.dropLatitude),
      dropLongitude: parseFloat(form.value.dropLongitude),
      startingKm: form.value.startingKm ? parseFloat(form.value.startingKm) : undefined,
      endingKm: form.value.endingKm ? parseFloat(form.value.endingKm) : undefined,
      scheduledAt: form.value.scheduledAt ? new Date(form.value.scheduledAt).toISOString() : undefined,
      startedAt: form.value.startedAt ? new Date(form.value.startedAt).toISOString() : undefined,
      completedAt: form.value.completedAt ? new Date(form.value.completedAt).toISOString() : undefined,
      driverId: form.value.driverId || undefined,
      vehicleId: form.value.vehicleId || undefined,
    }

    // Create the trip
    const response = await api.post('/bookings', tripData)
    
    // If driver is selected, assign them (if not already assigned)
    if (form.value.driverId && !response.data.driverId) {
      await api.post(`/bookings/${response.data.id}/assign-driver`, {
        driverId: form.value.driverId,
      })
    }

    success.value = 'Trip created successfully!'
    
    setTimeout(() => {
      router.push('/admin/trips')
    }, 1500)
  } catch (err) {
    console.error('Failed to create trip:', err)
    error.value = err.response?.data?.message || 'Failed to create trip'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCompanies()
  fetchCustomers()
  fetchDrivers()
  fetchVehicles()
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-dropdown')) {
      showCustomerDropdown.value = false
      showDriverDropdown.value = false
      showVehicleDropdown.value = false
    }
  })
})
</script>

<style scoped>
.create-trip-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 1000px;
  width: 100%;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .page-wrapper {
    margin-left: 0;
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0.5rem 0 0 0;
}

.form-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-card h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-card h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin: 2rem 0 1rem 0;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.search-dropdown {
  position: relative;
}

.search-dropdown input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: border-color 0.2s ease;
}

.search-dropdown input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.25rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.customer-info,
.driver-info,
.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.customer-info strong,
.driver-info strong,
.vehicle-info strong {
  color: #1f2937;
  font-size: 0.95rem;
}

.customer-info small,
.driver-info small,
.vehicle-info small {
  color: #6b7280;
  font-size: 0.85rem;
}

.selected-item {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-item strong {
  color: #1f2937;
}

.remove-btn {
  cursor: pointer;
  color: #ef4444;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: bold;
  padding: 0 0.5rem;
}

.remove-btn:hover {
  color: #dc2626;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="datetime-local"],
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #667eea;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
