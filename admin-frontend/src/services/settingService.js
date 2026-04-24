import axiosInstance from './axiosInstance';

/**
 * Updates the global payment method
 * @param {number} methodId - 1 for Stripe, 2 for Razorpay
 */
export const updatePaymentMethod = async (methodId) => {
  try {
    // axiosInstance handles the Base URL and the Bearer Token
    const response = await axiosInstance.put('/update-payment', {
      paymentMethod: methodId
    });
    return response.data;
  } catch (error) {
    // Extracts the error message from your backend response
    throw error.response?.data || { message: "Server Error" };
  }
};