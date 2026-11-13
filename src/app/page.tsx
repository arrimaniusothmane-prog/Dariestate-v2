import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  HardHat,
  ShieldCheck,
} from "lucide-react";
import { listProperties } from "@/server/properties";
import { HeroSearch } from "@/components/sections/hero-search";
import { FeaturedProperties } from "@/components/sections/featured-properties";
import { categoryIcon } from "@/components/brand/category-icons";
import { PropertyCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { categoryMedia, media } from "@/lib/media";

export const metadata = pageMetadata({
  title: "DarEstate — Le marché immobilier premium au Maroc",
  description:
    "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et transactions accompagnées.",
  path: "/",
});

const categories: {
  value: PropertyCategory;
  title: string;
  description: string;
}[] = [
  { value: PropertyCategory.VILLA, title: "Villas", description: "Plain-pied, piscine, palmiers" },
  { value: PropertyCategory.APARTMENT, title: "Appartements", description: "Résidences neuves et premium" },
  { value: PropertyCategory.HOUSE, title: "Maisons", description: "De ville et familiales" },
  { value: PropertyCategory.LAND, title: "Terrains", description: "Constructibles et résidentiels" },
  { value: PropertyCategory.COMMERCIAL, title: "Locaux", description: "Boutiques, bureaux, activités" },
];

export default async function HomePage() {
  const properties = listProperties();
  const verified = properties.filter((p) => p.isVerified).length;
  const cities = new Set(properties.map((p) => p.address.city)).size;
  const countByCategory = (value: PropertyCategory) =>
    properties.filter((p) => p.category === value).length;

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <Image
          src={media.heroHome}
          alt="Villa contemporaine baignée de lumière dorée au Maroc"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-40 sm:px-6 lg:px-8">
          {/* Headline — the single visual statement */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-hero text-balance text-white">
              L&apos;immobilier premium,{" "}
              <span className="italic text-gold">sélectionné et accompagné.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-white/80 sm:text-lg">
              Appartements, villas et terrains vérifiés à Casablanca, Marrakech
              et Rabat. Un parcours clair, de la première visite jusqu&apos;à
              la signature.
            </p>
          </div>

          {/* Glass search */}
          <div className="mx-auto mt-10 max-w-4xl">
            <HeroSearch />
          </div>

          {/* Trust stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-6 sm:grid-cols-4">
            <Stat value={String(properties.length)} label="Biens en ligne" />
            <Stat value={String(verified)} label="Annonces vérifiées" />
            <Stat value={String(cities)} label="Villes couvertes" />
            <Stat
              value={
                properties.length
                  ? `${Math.round((verified / properties.length) * 100)}%`
                  : "—"
              }
              label="Taux de vérification"
            />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <FeaturedProperties />

      {/* CATEGORIES — visual index */}
      <section id="categories" className="border-y border-line bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-2">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Parcourir par type
            </h2>
            <p className="max-w-md text-muted-foreground">
              Toutes les annonces vérifiées, classées par nature de bien.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const Icon = categoryIcon[c.value];
              const shot = categoryMedia[c.value];
              return (
                <Link
                  key={c.value}
                  href={`/properties?category=${c.value}`}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card"
                >
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <Image
                      src={shot.image}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <span className="absolute left-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                      <Icon className="size-5" />
                    </span>
                    <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight className="size-4" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display text-2xl font-semibold text-white">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/75">{c.description}</p>
                      <p className="mt-3 tnum text-xs font-medium uppercase tracking-wider text-gold">
                        {countByCategory(c.value)} biens
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 text-right">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-gold-strong hover:underline"
            >
              Voir toutes les annonces <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONSTRUCTION — services */}
      <section className="relative overflow-hidden">
        <Image
          src={media.constructionBand}
          alt="Chantier de construction DarEstate"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/55" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:py-20">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold">
              <HardHat className="size-4" />
              Construction · Rénovation · Agencement
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold text-white sm:text-4xl">
              Construction et rénovation,{" "}
              <span className="font-serif italic text-gold">maîtrisées de bout en bout.</span>
            </h2>
            <p className="mt-4 text-pretty text-white/75">
              Conception, réalisation et livraison : villas, appartements et
              agencement intérieur, portés par une seule équipe. Devis sous 48h.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/construction">
                <Button size="lg" className="w-full rounded-full bg-gold text-ink hover:bg-gold/90 sm:w-auto">
                  Découvrir le service <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/construction#devis">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-gold/60 text-gold hover:bg-gold/10 hover:border-gold hover:text-gold sm:w-auto"
                >
                  Demander un devis
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            {[
              { value: "3", label: "Pôles métiers" },
              { value: "12", label: "Corps de métier intégrés" },
              { value: "100%", label: "Chantiers suivis" },
              { value: "48h", label: "Délai de réponse devis" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 px-4 py-4 text-center backdrop-blur-md"
              >
                <p className="tnum font-display text-2xl font-semibold text-gold">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST — quiet strip */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: "Chaque annonce est contrôlée avant publication." },
              { icon: BadgeCheck, text: "Propriétaires et agences certifiés." },
              { icon: CalendarCheck, text: "Visites organisées et accompagnées." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-strong">
                    <Icon className="size-4.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative overflow-hidden bg-ink py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-display text-3xl font-semibold text-white">
              Vous êtes propriétaire ou agent immobilier ?
            </h2>
            <p className="mt-3 text-pretty text-white/70">
              Publiez votre bien en quelques minutes et recevez des demandes
              qualifiées de la part d&apos;acheteurs sérieux.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/publish">
              <Button size="lg" className="rounded-full bg-gold text-ink hover:bg-gold/90">
                Publier un bien
              </Button>
            </Link>
            <Link href="/seller">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-gold/60 text-gold hover:bg-gold/10 hover:border-gold hover:text-gold"
              >
                Espace vendeur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="tnum font-display text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs text-white/60">{label}</p>
    </div>
  );
}