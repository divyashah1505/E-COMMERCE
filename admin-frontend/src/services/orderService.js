import axiosInstance from './axiosInstance';

export const orderService = {
  /**
   * Fetches the order list from the backend
   * @returns {Promise} Resolves with the API response containing orders
   */
  getOrderList: async () => {
    try {
      const response = await axiosInstance.get('/admin/order-list');
      return response.data;
    } catch (error) {
      console.error('Error fetching order list:', error);
      throw error;
    }
  }
};
