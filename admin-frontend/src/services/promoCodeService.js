import axiosInstance from './axiosInstance';

export const promoCodeService = {
  // Fetch all promo codes
  getPromoCodes: async (search = '') => {
    // axiosInstance already has the /api/admin baseURL
    const response = await axiosInstance.get(`/list-promocodes?search=${search}`);
    return response.data;
  },
  addPromoCode: (data) =>
    axiosInstance.post('/promocode', data).then(res => res.data),

  // Update promo code
  updatePromoCode: async (id, data) => {
    const response = await axiosInstance.put(`/promocode/${id}`, data);
    return response.data;
  },

  // Delete promo code
  deletePromoCode: async (id) => {
    const response = await axiosInstance.delete(`/promocode/${id}`);
    return response.data;
  }
};