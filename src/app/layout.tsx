import type { Metadata } from "next";
import { DM_Sans, Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { organizationJsonLd } from "@/lib/schema";
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from "@/lib/theme";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans-default",
  display: "swap",
});

const programaSans = Inter({
  subsets: ["latin"],
  variable: "--font-programa",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.darestimate.ma"),
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
  ],
  alternates: {
    languages: {
      fr: "/",
      en: "/",
      ar: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DarEstate",
    url: "https://www.darestimate.ma",
    title: "DarEstate — Le marché immobilier premium au Maroc",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "DarEstate — Immobilier premium au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DarEstate — Le marché immobilier premium au Maroc",
    description:
      "Découvrez des appartements, villas et terrains sélectionnés au Maroc.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      dir="ltr"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${sans.variable} ${programaSans.variable} ${arabic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppProviders>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
              Aller au contenu principal
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileNav />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
