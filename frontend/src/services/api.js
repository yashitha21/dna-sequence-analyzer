import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on requests
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('genetrace_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const searchService = {
  run: (dna, pattern) => api.post('/search', { dna, pattern }),
  history: () => api.get('/history'),
};

export const mutationService = {
  detect: (original, mutated) => api.post('/mutation', { original, mutated }),
};

export const compareService = {
  similarity: (seq1, seq2) => api.post('/compare', { seq1, seq2 }),
};

export const analyticsService = {
  fetch: () => api.get('/analytics'),
};

export default api;
