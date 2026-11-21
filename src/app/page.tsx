import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Clock, MessageCircle, Scale, ShieldCheck } from "lucide-react";
import { getProperties } from "@/services/propertyService";
import { HeroSearch } from "@/components/sections/hero-search";
import { HomeRail } from "@/components/sections/home-rails";
import { Testimonials } from "@/components/sections/testimonials";
import { ProjectForm } from "@/components/forms/project-form";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyCategory } from "@/types";
import { Button } from "@/components/ui/button";
import {
  HeroTitle,
  LocalizedHeading,
  LocalizedText,
} from "@/components/ui/localized";
import { pageMetadata } from "@/lib/seo";
import { defaultWhatsAppMessage, whatsappHref } from "@/lib/agency";

export const metadata = pageMetadata({
  title: "DarEstate — Le marché immobilier premium au Maroc",
  description:
    "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et transactions accompagnées.",
  path: "/",
});

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2400&h=1600&fit=crop";

const categories: { label: string; href: string; image: string; category?: PropertyCategory }[] = [
  { label: "Villas", href: "/properties?category=VILLA", category: PropertyCategory.VILLA, image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=70" },
  { label: "Appartements", href: "/properties?category=APARTMENT", category: PropertyCategory.APARTMENT, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=70" },
  { label: "Maisons", href: "/properties?category=HOUSE", category: PropertyCategory.HOUSE, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=70" },
  { label: "Terrains", href: "/properties?category=LAND", category: PropertyCategory.LAND, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=70" },
  { label: "Biens de luxe", href: "/properties?minPrice=5000000", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=70" },
];

const cityImages: Record<string, string> = {
  Casablanca: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=70",
  Marrakech: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=70",
  Rabat: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=70",
  Tanger: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=70",
  Agadir: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=70",
};

const guarantees = [
  { icon: ShieldCheck, label: "100 % annonces vérifiées" },
  { icon: BadgeCheck, label: "Propriétaires certifiés" },
  { icon: Scale, label: "Accompagnement notaire" },
  { icon: Clock, label: "Réponse sous 24 h" },
];

const destinationNames = ["Casablanca", "Marrakech", "Rabat", "Tanger", "Agadir"];

export default async function HomePage() {
  const properties = await getProperties();
  const imageOf = (index: number) =>
    properties[index % properties.length]?.images[0]?.url ?? HERO_IMAGE;

  const categoryCards = categories.map((item) => ({
    label: item.label,
    href: item.href,
    image: item.image,
    count: item.category
      ? properties.filter((p) => p.category === item.category).length
      : properties.filter((p) => p.price >= 5000000 && p.listing !== "rent").length,
  }));

  const destinations = destinationNames.map((city) => {
    const matching = properties.filter((p) =>
      p.address.city.toLowerCase().includes(city.toLowerCase())
    );
    return {
      label: city,
      href: `/properties?city=${encodeURIComponent(city)}`,
      count: matching.length,
      image: cityImages[city],
    };
  });

  const selected = properties.filter((p) => p.isVerified).slice(0, 4);

  return (
    <div>
      <h1 className="sr-only">
        DarEstate — Le marché immobilier premium au Maroc
      </h1>

      {/* HERO — full screen */}
      <section className="bg-faint">
        <div className="relative h-[100svh] min-h-[min(560px,100svh)] w-full">
          <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="Villa contemporaine avec piscine sous le ciel bleu au Maroc"
            fill
            priority
            sizes="100vw"
            quality={70}
            className="object-cover"
          />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/88 via-[#0a0a0a]/45 to-[#000000]/25" />

          <div className="hero-content-top absolute inset-x-0 top-[48%] z-10 flex -translate-y-1/2 flex-col items-center gap-7 px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <HeroTitle className="text-hero text-balance text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]" />
              <LocalizedText
                k="hero.shortSubtitle"
                className="hero-subtitle mx-auto mt-5 max-w-xl text-pretty text-lg text-white/90 sm:text-xl"
              />
            </div>
            <HeroSearch />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1760px] px-6 py-12 md:px-10 md:py-14">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-center gap-3.5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-bebe text-hof">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-[15px] font-semibold leading-snug text-hof">{item.label}</span>
                </li>
              );
            })}
          </ul>
          <Link href="#avis" className="mt-8 inline-flex text-sm font-semibold text-hof hover:text-rausch">
            Lire les avis clients <ArrowRight className="ml-1 size-4" />
          </Link>
        </div>
      </section>

      <section id="biens" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-[1760px] px-6 md:px-10">
          <SectionHead kTitle="home.properties" kSubtitle="home.propertiesSub" href="/properties" />
          <HomeRail items={categoryCards} />
        </div>
      </section>

      <section id="destinations" className="scroll-mt-24 bg-card py-20 md:py-28">
        <div className="mx-auto max-w-[1760px] px-6 md:px-10">
          <SectionHead kTitle="home.destinations" kSubtitle="home.destinationsSub" href="/properties" />
          <HomeRail items={destinations} />
        </div>
      </section>

      <section id="selection" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-[1760px] px-6 md:px-10">
          <SectionHead
            kTitle="home.selected"
            kSubtitle="home.selectedSub"
            href="/properties"
          />
          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {selected.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* INVESTIR */}
      <section className="bg-[#111111] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1760px] items-center gap-10 px-6 md:grid-cols-2 md:px-10">
          <div>
            <LocalizedHeading
              k="home.invest"
              className="text-heading max-w-lg font-semibold text-white"
            />
            <LocalizedText
              k="home.investSub"
              className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-white/70"
            />
            <Link href="/invest">
              <Button className="mt-8 rounded-full bg-rausch text-gold-foreground hover:bg-rausch-600">
                Découvrir <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={imageOf(3)}
              alt="Opportunité d'investissement immobilier au Maroc"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* PUBLIER */}
      <section id="publier" className="scroll-mt-24 bg-card py-20 md:py-28">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <div className="max-w-2xl">
            <LocalizedHeading
              k="home.publish"
              className="text-heading font-semibold text-hof"
            />
            <LocalizedText
              k="home.publishSub"
              className="mt-4 text-pretty text-sm leading-relaxed text-foggy"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/publish">
              <Button className="rounded-full bg-[#111111] text-white hover:bg-rausch">
                Publier un bien <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/estimer">
              <Button variant="outline" className="rounded-full">
                Estimer mon bien
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="a-propos" className="scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-[1760px] px-6 md:px-10">
          <div className="max-w-2xl">
            <LocalizedHeading
              k="home.about"
              className="text-heading font-semibold text-hof"
            />
            <LocalizedText
              k="home.aboutSub"
              className="mt-4 text-pretty text-sm leading-relaxed text-foggy"
            />
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-hof transition-colors hover:text-rausch"
            >
              En savoir plus <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="projet" className="scroll-mt-24 bg-[#111111] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1760px] gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
          <div className="max-w-xl">
            <LocalizedHeading
              k="home.contact"
              className="text-heading font-semibold text-white"
            />
            <LocalizedText
              k="home.contactSub"
              className="mt-4 text-pretty text-sm leading-relaxed text-white/70"
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/contact">
                <Button className="w-full rounded-full bg-white text-[#111111] hover:bg-white/90 sm:w-auto">
                  Nous contacter <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <a
                href={whatsappHref(defaultWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/35 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  <MessageCircle className="mr-2 size-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
          <div className="lg:justify-self-end">
            <ProjectForm />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  kTitle,
  kSubtitle,
  href,
}: {
  kTitle: string;
  kSubtitle: string;
  href: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <LocalizedHeading
          k={kTitle}
          className="text-heading font-semibold tracking-tight text-hof"
        />
        <LocalizedText
          k={kSubtitle}
          className="mt-2 max-w-xl text-pretty text-sm text-foggy"
        />
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-hof transition-colors hover:text-rausch"
      >
        Tout voir <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

