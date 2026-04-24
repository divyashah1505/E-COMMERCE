import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenHelper';

const axiosInstance = axios.create({
  // Ensure your .env file has VITE_API_BASE_URL=https://nonevanescent-unarmored-lang.ngrok-free.dev/api/admin
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  timeout: 15000,
  headers: { 
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Vital for ngrok
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/loginAdmin');
    // If token expired or unauthorized, redirect to login
    if (error.response?.status === 401 && !isLoginEndpoint) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;