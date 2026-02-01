import api from "./api";
import type { ActionRequest } from "../types/action";

export const actionsApi = {
  getAll: async (params?: any): Promise<any> => {
    const response = await api.get("/actions/all", { params });
    return response.data;
  },

  getProductActions: async (productId: string): Promise<any> => {
    const response = await api.get(`/actions/product/${productId}`);
    return response.data;
  },

  add: async (action: ActionRequest): Promise<any> => {
    const response = await api.post("/actions/add", action);
    return response.data;
  },

  update: async (id: string, action: Partial<ActionRequest>): Promise<any> => {
    const response = await api.put(`/actions/update/${id}`, action);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await api.delete(`/actions/delete/${id}`);
    return response.data;
  },

  getBalance: async (): Promise<any> => {
    const response = await api.get("/balance");
    return response.data;
  },

  getStatistics: async (params?: any): Promise<any> => {
    const response = await api.get("/actions/statistics", { params });
    return response.data;
  },
};