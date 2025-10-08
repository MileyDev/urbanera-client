export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes: string[];
  quantity?: number; 
  selectedSize? : string;
  reviews? : Review[]
}

export interface Review {
  id: number;
  productId: number;
  userId: number | null;
  rating: number;
  comment: string;
  createdAt: string;
}