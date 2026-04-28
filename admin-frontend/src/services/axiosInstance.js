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

    if (error.response?.status === 401 && !isLoginEndpoint) {
      removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;