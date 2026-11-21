import type { Property } from "@/types";
import { agency } from "@/lib/agency";
import { siteUrl } from "@/lib/seo";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agency.name,
    legalName: agency.legalName,
    url: siteUrl,
    email: agency.email,
    telephone: `+${agency.phoneE164}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Twin Center, Bureau 1204, Boulevard Zerktouni",
      addressLocality: "Casablanca",
      addressCountry: "MA",
    },
    areaServed: ["Casablanca", "Marrakech", "Rabat"],
    openingHours: "Mo-Fr 09:00-19:00",
  };
}

export function listingJsonLd(property: Property) {
  const image = property.images.find((img) => img.isPrimary) ?? property.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description.slice(0, 300),
    url: `${siteUrl}/properties/${property.slug}`,
    image: image?.url,
    datePosted: property.createdAt,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address.street,
      addressLocality: property.address.city,
      addressRegion: property.address.state,
      postalCode: property.address.zip,
      addressCountry: "MA",
    },
  };
}
