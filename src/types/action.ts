export interface Action {
  _id: string;
  id: string;
  type: "buy" | "other";
  typeDesc?: string;
  amountType: "piece" | "kg" | "litre";
  amount: number;
  product?: string;
  date: string;
  "وارد": number;
  "منصرف": number;
  "بيان": string;
  "رصيد": number;
  createdAt?: string;
  updatedAt?: string;
}

export type ActionType = "buy" | "other";
export type AmountType = "piece" | "kg" | "litre";

export interface ActionRequest {
  type: ActionType;
  typeDesc?: string;
  amountType: AmountType;
  amount: number;
  product?: string;
  date?: string;
  income?: number;
  outcome?: number;
  desc?: string;
}