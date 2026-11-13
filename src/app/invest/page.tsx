import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  Building2,
  ShieldCheck,
  ArrowUpRight,
  Home,
  Landmark,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Investir dans l'immobilier au Maroc",
  description:
    "Découvrez les opportunités d'investissement immobilier au Maroc avec DarEstate. Rendements locatifs attractifs, programmes neufs premium et accompagnement juridique complet.",
  alternates: {
    canonical: "/invest",
    languages: { fr: "/invest" },
  },
};

const stats = [
  { value: "6", label: "grandes villes couvertes" },
  { value: "2%", label: "commission au succès" },
  { value: "100%", label: "annonces contrôlées" },
  { value: "1", label: "interlocuteur dédié" },
];

const reasons = [
  {
    icon: MapPin,
    title: "Position stratégique",
    description:
      "Le Maroc constitue un carrefour économique entre l'Europe et l'Afrique, avec des métropoles en développement continu.",
  },
  {
    icon: TrendingUp,
    title: "Potentiel locatif",
    description:
      "La demande locative dans les grandes villes offre des perspectives de revenus réguliers pour les investisseurs.",
  },
  {
    icon: Building2,
    title: "Offre résidentielle premium",
    description:
      "Résidences neuves et biens haut de gamme dans des quartiers à fort potentiel de valorisation.",
  },
  {
    icon: ShieldCheck,
    title: "Cadre juridique accompagné",
    description:
      "Transaction, notaire et fiscalité : nos équipes vous orientent à chaque étape de votre investissement.",
  },
];

const investmentTypes = [
  {
    icon: Home,
    title: "Résidence locative",
    description: "Un appartement destiné à générer un revenu locatif récurrent.",
    href: "/properties?category=APARTMENT",
  },
  {
    icon: Landmark,
    title: "Villa patrimoniale",
    description: "Un bien premium pour un usage personnel ou une valorisation à long terme.",
    href: "/properties?category=VILLA",
  },
  {
    icon: MapPin,
    title: "Terrain résidentiel",
    description: "Un foncier pour construire ou développer un projet immobilier.",
    href: "/properties?category=LAND",
  },
  {
    icon: Store,
    title: "Local commercial",
    description: "Un emplacement pour votre activité ou une mise en location professionnelle.",
    href: "/properties?category=COMMERCIAL",
  },
];

export default function InvestPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&h=1300&fit=crop"
          alt="Immeuble moderne premium au Maroc"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <TrendingUp className="size-4 text-gold" /> Investissement immobilier
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Investissez dans{" "}
              <span className="font-serif italic text-gold">l&apos;immobilier marocain.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Une sélection de biens adaptés à l&apos;investissement locatif et
              patrimonial, avec un accompagnement transactionnel et juridique.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Voir les opportunités <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Échanger avec un conseiller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border/60 bg-sand/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl font-semibold text-gold">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why invest */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Marché marocain
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Les atouts d&apos;un investissement au Maroc
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une demande locative soutenue, des métropoles en développement et
              un cadre d&apos;accompagnement pour sécuriser chaque étape.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment types */}
      <section className="bg-sand/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Votre profil d&apos;investissement
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Types d&apos;investissement
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choisissez la stratégie qui correspond à vos objectifs et
              parcourez les biens disponibles dans chaque catégorie.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {investmentTypes.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                  <span className="mt-4 flex items-center gap-1 text-sm font-medium text-gold">
                    Voir les biens <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <TrendingUp className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">
            Investissez avec un partenaire de confiance
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Nos conseillers vous accompagnent dans la sélection, la visite et la
            finalisation de votre investissement au Maroc.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                Parler à un conseiller <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Explorer les biens
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
