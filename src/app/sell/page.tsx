import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Users,
  CalendarCheck2,
  HandCoins,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Vendre un bien immobilier au Maroc",
  description:
    "Vendez votre maison, villa ou appartement au Maroc avec DarEstate. Publiez gratuitement, recevez des leads qualifiés et finalisez votre vente accompagné.",
};

const benefits = [
  {
    icon: Upload,
    title: "Publication structurée",
    description:
      "Déposez votre annonce en quelques étapes : photos, descriptif et caractéristiques. Elle est mise en ligne après validation.",
  },
  {
    icon: Users,
    title: "Demandes qualifiées",
    description:
      "Centralisez contacts, demandes de visite et offres dans votre espace vendeur, pour traiter uniquement les dossiers sérieux.",
  },
  {
    icon: CalendarCheck2,
    title: "Visites coordonnées",
    description:
      "Un conseiller DarEstate organise le planning des visites et assure le suivi avec les acheteurs intéressés.",
  },
  {
    icon: HandCoins,
    title: "Rémunération au succès",
    description:
      "Aucun frais de publication. DarEstate perçoit une commission uniquement sur les ventes finalisées — 2 % en moyenne.",
  },
];

export default function SellPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&h=1300&fit=crop"
          alt="Maison moderne à vendre"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <ShieldCheck className="size-4 text-gold" /> Sans frais de publication
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Vendez votre bien{" "}
              <span className="font-serif italic text-gold">dans les meilleures conditions.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Propriétaires et professionnels : publiez votre annonce, recevez
              des demandes qualifiées et conduisez la transaction avec un
              accompagnement dédié.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/seller/add">
                <Button size="lg" className="rounded-full bg-gold text-white hover:bg-gold/90">
                  Publier un bien <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  Accéder à l&apos;espace vendeur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Avantages vendeur
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Une plateforme conçue pour vendre efficacement
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commission model */}
      <section className="bg-ink py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              Un modèle transparent
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Une commission de succès uniquement
            </h2>
            <p className="mt-4 text-white/70">
              Vous ne payez rien pour publier. DarEstate ne gagne que lorsque
              votre vente aboutit.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/60">Prix de vente</p>
              <p className="mt-2 font-display text-2xl font-semibold text-gold">
                1 500 000 MAD
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-sm text-white/60">Commission DarEstate</p>
              <p className="mt-2 font-display text-2xl font-semibold">2%</p>
            </div>
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-center">
              <p className="text-sm text-white/60">Frais de succès</p>
              <p className="mt-2 font-display text-2xl font-semibold text-gold">
                30 000 MAD
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
            <TrendingUp className="size-5 shrink-0 text-gold" />
            Notre rémunération dépend de la vente finalisée : nous concentrons
            nos efforts sur la qualité des annonces et des acheteurs.
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold">
              Le parcours de vente
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-start">
            {[
              { n: "1", t: "Publiez", d: "Photos, descriptif et prix : votre annonce est mise en ligne après validation." },
              { n: "2", t: "Recevez des demandes", d: "Contacts, visites et offres sont centralisés dans votre tableau de bord." },
              { n: "3", t: "Finalisez", d: "Négociez et concluez la vente avec l'appui de nos conseillers." },
            ].map((s) => (
              <div key={s.n} className="relative flex-1 rounded-2xl border border-border/60 bg-card p-6 text-center">
                <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-gold font-display text-lg font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/seller/add">
              <Button size="lg" className="rounded-full">
                Publier mon bien <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}