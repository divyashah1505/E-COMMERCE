import axiosInstance from './axiosInstance';

export const subscriptionService = {
  getAllPlans: async () => {
    const response = await axiosInstance.get('/view-subscription-plans');
    return response.data;
  },
  getPlanById: async (id) => {
    const response = await axiosInstance.get(`/view-subscription-plans/${id}`);
    return response.data;
  },
  addPlan: (data) => 
    axiosInstance.post('/addPlan', data).then(res => res.data),

  updatePlan: async (id, data) => {
    const response = await axiosInstance.put(`/updatesub/${id}`, data);
    return response.data;
  },
  disablePlan: async (id) => {
    const response = await axiosInstance.delete(`/disablesub/${id}`);
    return response.data;
  },
  enablePlan: async (id) => {
    const response = await axiosInstance.post(`/enablesub/${id}`);
    return response.data;
  }
};