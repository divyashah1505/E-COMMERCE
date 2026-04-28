// admin-frontend/src/services/authService.js

import axiosInstance from './axiosInstance';

export const authService = {
  /**
   * Admin Login
   * @param {Object} credentials
   * @returns {Promise<Object>}
   */
  loginAdmin: async (credentials) => {
    try {
      const response = await axiosInstance.post('/loginAdmin', credentials);
      return response.data;
    } catch (error) {
      console.error(
        'Login error:',
        error.response?.data || error.message
      );
      throw error;
    }
  },
};