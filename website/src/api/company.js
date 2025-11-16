import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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

const API_URL = API_BASE_URL;

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
  },
};

// Payment API methods
export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  verify: (id, data) => api.post(`/payments/${id}/verify`, data),
};

export default api;

