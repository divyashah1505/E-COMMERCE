// admin-frontend/src/services/axiosInstance.js

import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenHelper';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/loginAdmin');
    const status = error.response?.status;
    const errorMessage = (error.response?.data?.message || '').toLowerCase();

    if (status === 401 && !isLoginEndpoint) {
      // Only clear the stored token when the backend EXPLICITLY says the
      // token is expired or malformed.  Generic 401s caused by backend
      // service outages (e.g. Redis unavailable) must NOT destroy the
      // session — the user legitimately logged in and holds a valid JWT.
      const isTokenTrulyInvalid =
        errorMessage.includes('token expired') ||
        errorMessage.includes('invalid token') ||
        errorMessage.includes('jwt expired') ||
        errorMessage.includes('jwt malformed') ||
        errorMessage.includes('token is not valid');

      if (isTokenTrulyInvalid) {
        removeToken();
        // Do NOT hard-redirect here — React's AdminAuthGuard will
        // detect the missing token and navigate to /login on next render.
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;