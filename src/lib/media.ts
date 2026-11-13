import { PropertyCategory } from "@/types";

/** Curated photography — warm Moroccan / Mediterranean premium feel */
export const media = {
  heroHome:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&h=1600&fit=crop&q=80",
  heroBuy:
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000&h=1300&fit=crop&q=80",
  heroAbout:
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=2000&h=1300&fit=crop&q=80",
  heroLogin:
    "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1800&q=80",
  heroConstruction:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&h=1300&fit=crop&q=80",
  heroAgent:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2000&h=1300&fit=crop&q=80",
  constructionBand:
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1600&h=900&fit=crop&q=80",
  og:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=630&fit=crop&q=80",
} as const;

export const categoryMedia: Record<
  PropertyCategory,
  { image: string; alt: string }
> = {
  [PropertyCategory.VILLA]: {
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=700&fit=crop&q=80",
    alt: "Villa contemporaine avec piscine",
  },
  [PropertyCategory.APARTMENT]: {
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=700&fit=crop&q=80",
    alt: "Appartement lumineux avec balcon",
  },
  [PropertyCategory.HOUSE]: {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=700&fit=crop&q=80",
    alt: "Maison familiale ouverte sur le jardin",
  },
  [PropertyCategory.LAND]: {
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&h=700&fit=crop&q=80",
    alt: "Terrain constructible sous ciel dégagé",
  },
  [PropertyCategory.COMMERCIAL]: {
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=700&fit=crop&q=80",
    alt: "Local commercial moderne",
  },
};
