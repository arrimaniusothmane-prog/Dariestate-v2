import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Estimez votre bien au Maroc",
  description:
    "Demandez une estimation de votre appartement, villa ou terrain à Casablanca, Marrakech ou Rabat. Réponse sous 24 h.",
  path: "/estimer",
});

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
