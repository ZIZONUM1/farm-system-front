import api from "./api";
import type { Action, ActionRequest } from "../types/action";

export const actionsApi = {
  getAll: async (): Promise<Action[]> => {
    const response = await api.get("/actions/all");
    return response.data;
  },

  add: async (action: ActionRequest): Promise<Action> => {
    const response = await api.post("/actions/add", action);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/actions/delete/${id}`);
  },
};