export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  sizes: string[];
  quantity?: number;
  selectedSize?: string;

  // new (from API)
  ratingAvg?: number;
  reviewCount?: number;

  // new (for drops)
  collection?: { slug: string; title: string; season?: string };

  dropOrder?: number | null;
}

export interface Review {
  id: number;
  productId: number;
  userId: number | null;
  user?: {id: number; username: string};
  rating: number;
  comment: string;
  createdAt: string;
}