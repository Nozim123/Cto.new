import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
};

// Mall API
export const mallAPI = {
  getAll: () => api.get('/malls'),
  getById: (id) => api.get(`/malls/${id}`),
  create: (data) => api.post('/malls', data),
  update: (id, data) => api.put(`/malls/${id}`, data),
  delete: (id) => api.delete(`/malls/${id}`),
};

// Store API
export const storeAPI = {
  getAll: (mallId) => api.get('/stores', { params: { mall_id: mallId } }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
};

// Product API
export const productAPI = {
  getAll: (storeId) => api.get('/products', { params: { store_id: storeId } }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Banner API
export const bannerAPI = {
  getAll: () => api.get('/banners'),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;