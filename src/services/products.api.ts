/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./api";
import type { Product } from "../types/product";

export const productsApi = {
  getAll: async (): Promise<any> => {
    const response = await api.get("/products/all");
    return response.data;
  },

  add: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post("/products/add", product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/update/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/delete/${id}`);
  },
};