import axiosInstance from './axiosInstance';

export const categoryService = {
    getCategoryList: async (search = "") => {
        const response = await axiosInstance.get('/admin/list-categoriesdetails', { params: { search } });
        return response.data;
    },

    addCategory: async (formData) => {
        const response = await axiosInstance.post('/admin/category', formData);
        return response.data;
    },

    updateCategory: async (id, formData) => {
        const response = await axiosInstance.put(`/admin/category/${id}`, formData);
        return response.data;
    },

    // Deactivate Category (Maps to DELETE route)
    deactivateCategory: async (id) => {
        const response = await axiosInstance.delete(`/admin/category/${id}`);
        return response.data;
    },

    // Reactivate Category (Maps to PUT reactivate route)
    reactivateCategory: async (id) => {
        const response = await axiosInstance.put(`/admin/category/reactivate/${id}`);
        return response.data;
    },

    // Product Service integration for Subcategory page
    addProduct: async (productData) => {
        const response = await axiosInstance.post('/admin/product', productData);
        return response.data;
    }
};