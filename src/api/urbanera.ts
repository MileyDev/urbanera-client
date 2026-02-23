import axios from "axios";
import type { CollectionDetail, CollectionListItem } from "../types/Collection";
import type { Product } from "../types/Product";

export const API = "https://urbaneraapi.onrender.com/api";

export async function fetchCollections() {
  const { data } = await axios.get<CollectionListItem[]>(`${API}/collections`);
  return data ?? [];
}

export async function fetchCollectionDetail(slug: string) {
  const { data } = await axios.get<CollectionDetail>(`${API}/collections/${slug}`);
  return data;
}

export async function fetchProductsByCollection(slug: string) {
  const { data } = await axios.get<Product[]>(`${API}/products`, { params: { collection: slug } });
  return data ?? [];
}