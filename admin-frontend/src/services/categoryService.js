import axiosInstance from './axiosInstance';

export const categoryService = {
    getCategoryList: async (search = "") => {
        const response = await axiosInstance.get('/list-categoriesdetails', { params: { search } });
        return response.data;
    },

    addCategory: async (formData) => {
        const response = await axiosInstance.post('/category', formData);
        return response.data;
    },

    updateCategory: async (id, formData) => {
        const response = await axiosInstance.put(`/category/${id}`, formData);
        return response.data;
    },

    // Deactivate Category (Maps to DELETE route)
    deactivateCategory: async (id) => {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    },

    // Reactivate Category (Maps to PUT reactivate route)
    reactivateCategory: async (id) => {
        const response = await axiosInstance.put(`/category/reactivate/${id}`);
        return response.data;
    },

    // Product Service integration for Subcategory page
    addProduct: async (productData) => {
        const response = await axiosInstance.post('/product', productData);
        return response.data;
    }
};