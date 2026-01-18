export interface Action {
  id: string;
  productId: string;
  productName: string;
  actionType: 'harvest' | 'watering' | 'selling' | 'adding';
  quantity: number;
  date: string;
}

export type ActionType = 'harvest' | 'watering' | 'selling' | 'adding';

export interface ActionRequest {
  productId: string;
  actionType: ActionType;
  quantity: number;
}