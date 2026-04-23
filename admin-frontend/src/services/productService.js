import axiosInstance from './axiosInstance';

export const productService = {
    /**
     * Fetches all products
     */
    getProductList: async () => {
        try {
            const response = await axiosInstance.get('/admin/product-list');
            return response.data; 
        } catch (error) {
            console.error("Service Error:", error);
            throw error;
        }
    },

    /**
     * Update product details (including image via FormData)
     */
    updateProduct: async (id, formData) => {
        const response = await axiosInstance.put(`/admin/product/${id}`, formData);
        return response.data;
    },

    /**
     * Deactivate product (Sets status to 0)
     */
    deactivateProduct: async (id) => {
        const response = await axiosInstance.delete(`/admin/product/${id}`);
        return response.data;
    },

    /**
     * Reactivate product (Sets status to 1)
     */
    reactivateProduct: async (id) => {
        const response = await axiosInstance.put(`/admin/product/reactivate/${id}`);
        return response.data;
    }
};