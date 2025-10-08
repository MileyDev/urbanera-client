export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes: string[];
  quantity?: number; 
  selectedSize? : string;
}