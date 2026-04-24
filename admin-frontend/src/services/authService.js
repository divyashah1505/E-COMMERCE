import axiosInstance from './axiosInstance';

export const authService = {
  /**
   * Admin Login
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Resolves with the API response
   */
  loginAdmin: async (credentials) => {
    try {
      const response = await axiosInstance.post('/loginAdmin', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
};
