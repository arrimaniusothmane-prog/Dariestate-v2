import { PropertyCategory } from "@/types";

export type Landing = {
  slug: string;
  title: string;
  description: string;
  city?: string;
  category?: PropertyCategory;
};

export const landings: Landing[] = [
  {
    slug: "appartement-a-vendre-casablanca",
    title: "Appartement à vendre Casablanca",
    description:
      "Appartements vérifiés à vendre à Casablanca : Maarif, Anfa, Californie, Ain Diab et Racine. Prix, surface et visite avec DarEstate.",
    city: "Casablanca",
    category: PropertyCategory.APARTMENT,
  },
  {
    slug: "villa-marrakech",
    title: "Villa Marrakech",
    description:
      "Villas à Marrakech, Guéliz, Hivernage et Palmeraie. Biens vérifiés, visite organisée et accompagnement notaire.",
    city: "Marrakech",
    category: PropertyCategory.VILLA,
  },
  {
    slug: "villa-casablanca",
    title: "Villa à vendre Casablanca",
    description:
      "Villas à vendre à Casablanca et Bouskoura. Annonces vérifiées, prix au m² et demande de visite.",
    city: "Casablanca",
    category: PropertyCategory.VILLA,
  },
  {
    slug: "appartement-rabat",
    title: "Appartement à Rabat",
    description:
      "Appartements à Rabat, Agdal et Souissi. Sélection DarEstate, propriétaires certifiés.",
    city: "Rabat",
    category: PropertyCategory.APARTMENT,
  },
  {
    slug: "terrain-a-vendre",
    title: "Terrain à vendre au Maroc",
    description:
      "Terrains résidentiels et agricoles au Maroc. Surface, localisation et dossier vérifié.",
    category: PropertyCategory.LAND,
  },
];

export function landingBySlug(slug: string) {
  return landings.find((item) => item.slug === slug);
}
