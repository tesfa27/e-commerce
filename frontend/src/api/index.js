import axios from 'axios';

// Create axios instance with backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

// API endpoints
export const productAPI = {
  getAll: (page = 1) => api.get(`api/products?page=${page}`),
  getAdmin: (page = 1) => api.get(`api/products/admin?page=${page}`),
  search: (params) => api.get(`api/products/search?${new URLSearchParams(params).toString()}`),
  getBySlug: (slug) => api.get(`api/products/slug/${slug}`),
  getById: (id) => api.get(`api/products/${id}`),
  create: (data) => api.post('api/products', data),
  update: (id, data) => api.put(`api/products/${id}`, data),
  delete: (id) => api.delete(`api/products/${id}`),
  getCategories: () => api.get('api/products/categories'),
  createReview: (id, review) => api.post(`api/products/${id}/reviews`, review),
};

export const userAPI = {
  signin: (data) => api.post('api/users/signin', data),
  signup: (data) => api.post('api/users/signup', data),
  profile: () => api.get('api/users/profile'),
  updateProfile: (data) => api.put('api/users/profile', data),
  getAll: () => api.get('api/users'),
  getById: (id) => api.get(`api/users/${id}`),
  update: (id, data) => api.put(`api/users/${id}`, data),
  delete: (id) => api.delete(`api/users/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('api/orders', data),
  getById: (id) => api.get(`api/orders/${id}`),
  getHistory: () => api.get('api/orders/history'),
  getMine: (page = 1) => api.get(`api/orders/mine?page=${page}`),
  getAll: (page = 1) => api.get(`api/orders?page=${page}`),
  getSummary: () => api.get('api/orders/summary'),
  pay: (id, data) => api.put(`api/orders/${id}/pay`, data),
  delete: (id) => api.delete(`api/orders/${id}`),
};

export default api;