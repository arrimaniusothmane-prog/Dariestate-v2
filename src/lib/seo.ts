import type { Metadata } from "next";

export const siteUrl = "https://www.darestimate.ma";

export const defaultDescription =
  "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et accompagnement complet.";

export function pageMetadata({
  title,
  description = defaultDescription,
  path,
  index = true,
}: {
  title: string;
  description?: string;
  path?: string;
  index?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: path
      ? {
          canonical: path,
          languages: {
            fr: path,
            en: path,
            ar: path,
          },
        }
      : undefined,
    openGraph: {
      title,
      description,
      url: path ? `${siteUrl}${path}` : undefined,
      images: [
        {
          url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&h=630&q=70",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    robots: index ? undefined : { index: false, follow: false },
  };
}