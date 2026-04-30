import axiosInstance from './axiosInstance';

export const categoryService = {

    getCategoryList: async (search = "") => {
        const response = await axiosInstance.get('/list-categoriesdetails', {
            params: { search }
        });
        return response.data;
    },

    // =========================
    // CATEGORY (MULTIPART FIXED)
    // =========================
    addCategory: async (formData) => {
        return await axiosInstance.post('/category', formData);
    },

  updateCategory: async (id, formData) => {
    return await axiosInstance.put(`/category/${id}`, formData);
},

    // =========================
    // STATUS
    // =========================
    deactivateCategory: async (id) => {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    },

    reactivateCategory: async (id) => {
        const response = await axiosInstance.put(`/category/reactivate/${id}`);
        return response.data;
    },

    // =========================
    // PRODUCT (JSON OK)
    // =========================
    addProduct: async (productData) => {
        const response = await axiosInstance.post('/product', productData);
        return response.data;
    },

    // =========================
    // IMAGE UPLOAD (MULTIPART FIXED)
    // =========================
 uploadImage: async (formData) => {
    return await axiosInstance.post('/upload-photos', formData);
}
};