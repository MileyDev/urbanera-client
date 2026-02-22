export type Drop = {
    slug: string;
    title: string;
    season: string;
    statement: string;
    story: string[];
    heroImageUrl: string;
    coverImageUrl: string;
    productIds?: number[]; // temporary mapping until backend
  };
  
  export const DROPS: Drop[] = [
    {
      slug: "the-first-act",
      title: "The First Act",
      season: "SS26",
      statement: "It started on a street in the trenches—no backing, just hunger and vision.",
      story: [
        "UrbanEra didn’t begin in comfort. It began in motion—street corners, heat, noise, pressure.",
        "This drop is the first chapter: clean silhouettes, hard intent, premium build.",
        "No costume. No noise. Just the uniform for the ones building their own lane."
      ],
      heroImageUrl: "https://res.cloudinary.com/dt67ut3jx/image/upload/f_auto,q_auto/v1758877520/shoot1_r2j69r.jpg",
      coverImageUrl: "https://res.cloudinary.com/dt67ut3jx/image/upload/f_auto,q_auto/v1758537256/hero_d0sx2y.jpg",
      // Optionally curate which products appear in this drop:
      // productIds: [1, 2, 3]
    },
  ];