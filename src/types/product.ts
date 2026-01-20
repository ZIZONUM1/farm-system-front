export interface Product {
  amount: ReactNode;
  desc: ReactNode;
  _id: Key | null | undefined;
  id: string;
  name: string;
  quantity: number;
  price: number;
}