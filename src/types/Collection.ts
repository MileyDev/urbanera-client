import type { Product } from "./Product";

export type CollectionListItem = {
  slug: string;
  title: string;
  season: string;
  statement: string;
  coverImageUrl: string;
  heroImageUrl: string;
  accent?: string | null;
  productCount: number;
};

export type CollectionDetail = {
  slug: string;
  title: string;
  season: string;
  statement: string;
  story: string; // backend is string, we split into paragraphs
  coverImageUrl: string;
  heroImageUrl: string;
  accent?: string | null;
  products: Product[];
};