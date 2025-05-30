// Instructions: Update frontend API client to use VITE_API_BASE_URL environment variable

// src/utils/api.ts
import axios from 'axios';

// Use environment variable for API base URL, default for local dev if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle common API errors (like 401 for token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.error('API Error: Unauthorized. Token might be expired.');
      // Example: localStorage.removeItem('token'); window.location.href = '/login';
      // Consider using AuthContext to trigger logout or token refresh if implemented
    }
    return Promise.reject(error);
  }
);

export default apiClient;
