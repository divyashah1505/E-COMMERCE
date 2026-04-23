import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenHelper';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 
    // REMOVED 'Content-Type': 'application/json' to allow FormData to work
    'ngrok-skip-browser-warning': 'true'
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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