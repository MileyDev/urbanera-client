export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity?: number; // Optional to match backend Product model
}