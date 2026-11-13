import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.darestimate.ma"
).replace(/\/$/, "");

export const defaultDescription =
  "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et accompagnement complet.";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description = defaultDescription,
  path,
  index = true,
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  index?: boolean;
  image?: string;
}): Metadata {
  const url = path ? absoluteUrl(path) : undefined;
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl("/brand/mark.jpg");

  return {
    title,
    description,
    alternates: path
      ? {
          canonical: path,
          languages: {
            fr: path,
            "x-default": path,
          },
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "DarEstate",
      title,
      description,
      url,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

/** JSON-LD Organisation + site Web — à injecter dans le layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "DarEstate",
        url: siteUrl,
        logo: absoluteUrl("/brand/mark.jpg"),
        email: "contact@darestimate.ma",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "DarEstate",
        description: defaultDescription,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: "fr-MA",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/properties?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
