import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DarEstate — Le marché immobilier premium au Maroc",
    short_name: "DarEstate",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}