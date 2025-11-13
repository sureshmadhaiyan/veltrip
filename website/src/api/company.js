import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get company by subdomain or domain
export const getCompanyByDomain = async (domain) => {
  try {
    const response = await api.get(`/companies/domain/${domain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

// Get company by subdomain
export const getCompanyBySubdomain = async (subdomain) => {
  try {
    const response = await api.get(`/companies/subdomain/${subdomain}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

// Get company by ID
export const getCompanyById = async (id) => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

export default api;

