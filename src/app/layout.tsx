import type { Metadata } from "next";
import { Inter, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { organizationJsonLd, siteUrl } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DarEstate — Le marché immobilier premium au Maroc",
    template: "%s | DarEstate",
  },
  description:
    "Découvrez des appartements, villas et terrains sélectionnés au Maroc. Un marché immobilier premium avec biens vérifiés, propriétaires vérifiés et transactions accompagnées.",
  keywords: [
    "immobilier maroc",
    "achat maison maroc",
    "villa casablanca",
    "appartement rabat",
    "terrain marrakech",
    "DarEstate",
    "immobilier premium maroc",
    "agence immobilière casablanca",
  ],
  authors: [{ name: "DarEstate" }],
  creator: "DarEstate",
  publisher: "DarEstate",
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DarEstate",
    url: siteUrl,
    title: "DarEstate — Le marché immobilier premium au Maroc",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    images: [
      {
        url: "/brand/mark.jpg",
        width: 1024,
        height: 1024,
        alt: "DarEstate — Immobilier premium au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DarEstate — Le marché immobilier premium au Maroc",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    images: ["/brand/mark.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${inter.variable} ${manrope.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <AppProviders>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
          >
            Aller au contenu principal
          </a>
          <SiteHeader>
            <Navbar />
          </SiteHeader>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter>
            <Footer />
            <MobileNav />
          </SiteFooter>
        </AppProviders>
      </body>
    </html>
  );
}
