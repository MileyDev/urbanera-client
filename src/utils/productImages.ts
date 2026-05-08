export function normalizeProductImages(imageUrl: string[] | string | null | undefined): string[] {
  if (Array.isArray(imageUrl)) {
    return imageUrl.map((url) => url.trim()).filter(Boolean);
  }

  if (typeof imageUrl === "string" && imageUrl.trim()) {
    return [imageUrl.trim()];
  }

  return [];
}

export function getPrimaryProductImage(
  imageUrl: string[] | string | null | undefined,
  fallback = "https://via.placeholder.com/560"
) {
  return normalizeProductImages(imageUrl)[0] ?? fallback;
}

export function parseProductImageInput(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}
