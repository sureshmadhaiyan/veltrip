import api from './company'

export const getMetrics = async (range = 'overall') => {
  try {
    const response = await api.get(`/admin/metrics?range=${range}`)
    return response.data
  } catch (error) {
    console.error('Error fetching metrics:', error)
    throw error
  }
}

export const getAllData = async () => {
  try {
    const response = await api.get('/admin/data')
    return response.data
  } catch (error) {
    console.error('Error fetching all data:', error)
    throw error
  }
}

export const getCompanies = async (params = {}) => {
  try {
    const response = await api.get('/admin/companies', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw error
  }
}

export const getCompanyDetails = async (id) => {
  try {
    const response = await api.get(`/admin/companies/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching company details:', error)
    throw error
  }
}

export const getDrivers = async (params = {}) => {
  try {
    const response = await api.get('/admin/drivers', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching drivers:', error)
    throw error
  }
}

export const getPassengers = async (params = {}) => {
  try {
    const response = await api.get('/admin/passengers', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching passengers:', error)
    throw error
  }
}

export const getTrips = async (params = {}) => {
  try {
    const response = await api.get('/admin/trips', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw error
  }
}

export const getCollectionDetails = async (params = {}) => {
  try {
    const response = await api.get('/admin/collections', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching collection details:', error)
    throw error
  }
}

