import axiosInstance from "./axiosInstance";

export const productService = {
  // Get Product List
  getProductList: async (search = "") => {
    const response = await axiosInstance.get("/product-list", {
      params: { search },
    });
    return response.data;
  },

  // Add Product
  addProduct: async (formData) => {
    const response = await axiosInstance.post("/product", formData);
    return response.data;
  },

  // Update Product
 updateProduct: async (id, formData) => {
    const response = await axiosInstance.put(`/product/${id}`, formData);
    return response.data;
},

  // Delete Product
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/product/${id}`);
    return response.data;
  },

  // Upload Product Image
  uploadImage: async (formData) => {
    const response = await axiosInstance.post("/upload-photos", formData);
    return response.data;
  },
};

export default productService;