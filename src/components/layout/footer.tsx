"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, MapPin, Phone } from "lucide-react";
import { agency, telHref, whatsappHref, defaultWhatsAppMessage } from "@/lib/agency";

const sections = [
  {
    title: "DarEstate",
    links: [
      { href: "/about", label: "À propos" },
      { href: "/invest", label: "Investir" },
      { href: "/buy", label: "Acheter" },
      { href: "/sell", label: "Vendre" },
    ],
  },
  {
    title: "Services & Travaux",
    links: [
      { href: "/construction", label: "Construction" },
      { href: "/construction#renovation", label: "Rénovation" },
      { href: "/construction#agencement", label: "Agencement" },
      { href: "/construction#realisations", label: "Nos réalisations" },
      { href: "/construction#devis", label: "Demander un devis" },
    ],
  },
  {
    title: "Immobilier",
    links: [
      { href: "/properties?category=APARTMENT", label: "Appartements" },
      { href: "/properties?category=VILLA", label: "Villas" },
      { href: "/properties?category=LAND", label: "Terrains" },
      { href: "/properties?category=COMMERCIAL", label: "Commercial" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/help", label: "Centre d'aide" },
      { href: "/publish", label: "Publier un bien" },
      { href: "/agent", label: "Espace Professionnel" },
    ],
  },
];

const socials = [
  {
    label: "WhatsApp",
    href: whatsappHref(defaultWhatsAppMessage),
    path: "M12 3.5c-4.7 0-8.5 3.6-8.5 8.1 0 1.4.4 2.8 1.1 4L3.5 20.5l5-1.3c1.1.6 2.3.9 3.5.9 4.7 0 8.5-3.6 8.5-8.1S16.7 3.5 12 3.5zm4.6 11.5c-.2.6-1.1 1.1-1.6 1.1-.4 0-.9.2-3.1-.7-2.6-1.1-4.2-3.6-4.3-3.8-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.9.8 2 .1.1.1.3 0 .4-.1.2-.2.3-.3.5l-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.6.7 1.8.9.2.1.4.2.4.4.1.2 0 .8-.2 1.4z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.darestimate.ma",
    path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z",
  },
  {
    label: "Email",
    href: `mailto:${agency.email}`,
    path: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11zm1.6.5 7.4 5.1L19.4 7H4.6zM19 8.4l-6.4 4.4a1 1 0 0 1-1.2 0L5 8.4V17h14V8.4z",
  },
];

export function Footer() {
  const pathname = usePathname();
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password"
  ) {
    return null;
  }

  return (
    <footer className="border-t border-line bg-faint">
      <div className="mx-auto max-w-[1760px] px-6 pb-28 pt-14 md:px-10 md:pb-10">
        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-rausch text-gold-foreground">
                <Building2 className="size-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-hof">
                Dar<span className="text-brand-text">Estate</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-foggy">
              La plateforme immobilière premium au Maroc. Des biens vérifiés,
              des propriétaires certifiés.
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic text-foggy">
              {agency.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
              <span className="mt-2 block text-hof">{agency.hours}</span>
            </address>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-hof">{section.title}</h3>
              <ul className="mt-3 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foggy transition-colors hover:text-hof"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-line pt-6 md:flex-row">
          <p className="text-sm text-foggy">
            © {new Date().getFullYear()} DarEstate. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href={agency.mapsUrl} className="flex items-center gap-1.5 text-sm text-hof hover:text-rausch">
              <MapPin className="size-4" />
              Casablanca
            </a>
            <a href={telHref()} className="flex items-center gap-1.5 text-sm font-medium text-hof">
              <Phone className="size-4" />
              {agency.phoneDisplay}
            </a>
            <Link href="/legal/terms" className="text-sm text-foggy hover:text-hof">
              Conditions
            </Link>
            <Link href="/legal/privacy" className="text-sm text-foggy hover:text-hof">
              Confidentialité
            </Link>
            <Link href="/legal/mentions" className="text-sm text-foggy hover:text-hof">
              Mention légale
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full text-hof transition-colors hover:bg-bebe"
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                  <path d={s.path} fill="currentColor" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}