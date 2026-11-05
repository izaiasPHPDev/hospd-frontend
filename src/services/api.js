import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sistemahospd-app.t4kpnp.easypanel.host/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospd_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
