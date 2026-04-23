import axiosInstance from './axiosInstance';

export const userService = {
  /**
   * Fetches the user list from the backend
   * @param {Object} params - Query parameters (page, limit, username, etc.)
   */
  getUserList: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/admin/user-list', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user list:', error);
      throw error;
    }
  },

  /**
   * Deactivates/Deletes a user
   * @param {String} userId - The ID of the user to deactivate
   */
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/admin/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Reactivates a deactivated user
   * @param {String} userId - The ID of the user to reactivate
   */
  activateUser: async (userId) => {
    try {
      // Note: Assuming the route is prefixed with /admin based on your other routes
      const response = await axiosInstance.put(`/admin/user/activate/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  }
};