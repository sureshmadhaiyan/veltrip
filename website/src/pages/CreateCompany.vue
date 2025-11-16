<template>
  <div class="create-company-page">
    <AdminSidebar />
    <div class="page-wrapper">
    <div class="page-header">
      <h1>Create Travel Company</h1>
      <router-link to="/admin/companies" class="btn btn-secondary">
        ← Back to List
      </router-link>
    </div>

    <div class="page-content">
      <form @submit.prevent="handleCreate" class="company-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Company Name *</label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              placeholder="GT Holidays"
            />
          </div>

          <div class="form-group">
            <label for="domain">Domain *</label>
            <input
              type="text"
              id="domain"
              v-model="form.domain"
              required
              placeholder="gtholidays.com"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="subdomain">Subdomain (Optional)</label>
          <input
            type="text"
            id="subdomain"
            v-model="form.subdomain"
            placeholder="gtholidays"
          />
          <small>If provided, company can be accessed via: {subdomain}.veltrip.com</small>
        </div>

        <h3>Company Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="pan">PAN Number</label>
            <input type="text" id="pan" v-model="form.pan" placeholder="ABCDE1234F" />
          </div>
          <div class="form-group">
            <label for="gstin">GSTIN Number</label>
            <input type="text" id="gstin" v-model="form.gstin" placeholder="29ABCDE1234F1Z5" />
          </div>
        </div>
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="form.address" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="form.city" />
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <input type="text" id="state" v-model="form.state" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="pincode">Pincode</label>
            <input type="text" id="pincode" v-model="form.pincode" />
          </div>
          <div class="form-group">
            <label for="phone">Company Phone</label>
            <input type="tel" id="phone" v-model="form.phone" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="email">Company Email</label>
            <input type="email" id="email" v-model="form.email" />
          </div>
          <div class="form-group">
            <label for="contactPerson">Contact Person</label>
            <input type="text" id="contactPerson" v-model="form.contactPerson" />
          </div>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.isActive" />
            Active Status (Company will be active immediately)
          </label>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <div class="form-actions">
          <router-link to="/admin/companies" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create Company' }}
          </button>
        </div>
      </form>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import api from '../api/company'

const router = useRouter()

     const form = ref({
       name: '',
       domain: '',
       subdomain: '',
       pan: '',
       gstin: '',
       address: '',
       city: '',
       state: '',
       pincode: '',
       phone: '',
       email: '',
       contactPerson: '',
       isActive: true,
     })

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleCreate = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await api.post('/companies', {
      name: form.value.name,
      domain: form.value.domain,
      subdomain: form.value.subdomain || null,
      pan: form.value.pan || null,
      gstin: form.value.gstin || null,
      address: form.value.address || null,
      city: form.value.city || null,
      state: form.value.state || null,
      pincode: form.value.pincode || null,
      phone: form.value.phone || null,
      email: form.value.email || null,
      contactPerson: form.value.contactPerson || null,
      isActive: form.value.isActive,
    })

    success.value = 'Company created successfully! Redirecting...'
    
    setTimeout(() => {
      router.push('/admin/companies')
    }, 1500)
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create company. Please try again.'
    error.value = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-company-page {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
}

.page-wrapper {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  max-width: 800px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #1f2937;
  font-size: 2rem;
  margin: 0;
}

.page-content {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.company-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

h3 {
  color: #1f2937;
  font-size: 1.25rem;
  margin: 2rem 0 1rem 0;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #667eea;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  transform: translateY(-2px);
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
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>

