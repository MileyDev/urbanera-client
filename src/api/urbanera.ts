import axios from "axios";
import type { CollectionDetail, CollectionListItem } from "../types/Collection";
import type { Product } from "../types/Product";

export const BASEURL = "https://urbaneraapi.onrender.com/api";

export const api = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },

});

export async function fetchCollections() {
  const { data } = await api.get<CollectionListItem[]>(`${BASEURL}/collections`);
  return data ?? [];
}

export async function fetchCollectionDetail(slug: string) {
  const { data } = await api.get<CollectionDetail>(`${BASEURL}/collections/${slug}`);
  return data;
}

export async function fetchProductsByCollection(slug: string) {
  const { data } = await api.get<Product[]>(`${BASEURL}/products`, { params: { collection: slug } });
  return data ?? [];
}