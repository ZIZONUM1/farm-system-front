/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import type { Product } from "../types/product";

export const productsApi = {
  getAll: async (params?: any): Promise<any> => {
    const response = await api.get(`/products/all?${params}`);
    return response.data;
  },

  add: async (product: Omit<Product, "id">): Promise<any> => {
    const response = await api.post("/products/add", product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>): Promise<any> => {
    const response = await api.put(`/products/update/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await api.delete(`/products/delete/${id}`);
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};