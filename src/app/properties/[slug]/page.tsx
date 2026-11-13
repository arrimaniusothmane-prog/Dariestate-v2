import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPropertyBySlug,
  listProperties,
} from "@/server/properties";
import { PropertyDetail } from "@/components/property/property-detail";

export async function generateMetadata({
  params,
}: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Bien introuvable" };

  const primary = property.images.find((i) => i.isPrimary) ?? property.images[0];

  return {
    title: `${property.title} — ${property.address.city}`,
    description: property.description.slice(0, 160),
    alternates: {
      canonical: `/properties/${property.slug}`,
      languages: {
        fr: `/properties/${property.slug}`,
      },
    },
    openGraph: {
      title: `${property.title} · ${property.address.city}`,
      description: property.description.slice(0, 160),
      type: "website",
      url: `https://www.darestimate.ma/properties/${property.slug}`,
      images: primary ? [{ url: primary.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} · ${property.address.city}`,
      description: property.description.slice(0, 160),
      images: primary ? [primary.url] : undefined,
    },
  };
}

export async function generateStaticParams() {
  return listProperties().map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({
  params,
}: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetail property={property} />;
}
