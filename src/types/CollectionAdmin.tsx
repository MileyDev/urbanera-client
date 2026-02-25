export type CollectionAdminDto = {
    id: number;
    slug: string;
    title: string;
    season: string;
    statement: string;
    story: string;
    coverImageUrl: string;
    heroImageUrl: string;
    accent: string | null;
    isPublished: boolean;
    createdAtUtc: string;
    updatedAtUtc: string;
  };
  
  export type UpsertCollectionRequest = {
    slug: string;
    title: string;
    season: string;
    statement: string;
    story: string;
    coverImageUrl: string;
    heroImageUrl: string;
    accent?: string | null;
    isPublished: boolean;
  };
  
  export type AssignProductsToCollectionRequest = {
    productIds: number[];
    clearExistingCollectionAssignments: boolean;
  };
  
  export type SetDropOrderRequest = {
    items: { productId: number; dropOrder: number }[];
  };

  