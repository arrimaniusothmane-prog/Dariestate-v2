import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProperties } from "@/services/propertyService";
import { landingBySlug, landings } from "@/lib/landings";
import { PropertyCard } from "@/components/property/property-card";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return landings.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/immobilier/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const landing = landingBySlug(slug);
  if (!landing) return { title: "Page introuvable" };
  return pageMetadata({
    title: landing.title,
    description: landing.description,
    path: `/immobilier/${landing.slug}`,
  });
}

export default async function LandingPage({
  params,
}: PageProps<"/immobilier/[slug]">) {
  const { slug } = await params;
  const landing = landingBySlug(slug);
  if (!landing) notFound();

  const properties = await getProperties();
  const matches = properties.filter((property) => {
    const cityOk = landing.city
      ? property.address.city.toLowerCase().includes(landing.city.toLowerCase()) ||
        property.address.state.toLowerCase().includes(landing.city.toLowerCase())
      : true;
    const typeOk = landing.category ? property.category === landing.category : true;
    return cityOk && typeOk && property.listing !== "rent";
  });

  return (
    <div className="mx-auto max-w-[1760px] px-6 pb-28 pt-24 md:px-10">
      <h1 className="text-heading max-w-3xl font-semibold text-hof">{landing.title}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foggy">{landing.description}</p>
      {matches.length === 0 ? (
        <p className="mt-10 text-sm text-hof">Aucun bien publié pour le moment sur cette sélection.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {matches.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
