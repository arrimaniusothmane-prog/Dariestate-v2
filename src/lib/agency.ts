/**
 * Coordonnées publiques de l'agence.
 * Le numéro affiché est celui publié dans le projet (placeholder historique).
 * Remplacez NEXT_PUBLIC_AGENCY_PHONE (chiffres, indicatif, sans +) et
 * NEXT_PUBLIC_AGENCY_PHONE_DISPLAY pour brancher la ligne réelle partout.
 */
const digits = (process.env.NEXT_PUBLIC_AGENCY_PHONE || "212522000000").replace(
  /\D/g,
  ""
);

export const agency = {
  name: "DarEstate",
  legalName: "DarEstate SARL",
  email: "contact@darestimate.ma",
  phoneDisplay:
    process.env.NEXT_PUBLIC_AGENCY_PHONE_DISPLAY || "+212 5 22 00 00 00",
  phoneE164: digits,
  addressLines: [
    "Twin Center, Bureau 1204",
    "Boulevard Zerktouni",
    "Casablanca, Maroc",
  ],
  hours: "Lundi – vendredi, 9h – 19h",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Twin+Center+Boulevard+Zerktouni+Casablanca",
};

export function telHref() {
  return `tel:+${agency.phoneE164}`;
}

export function whatsappHref(message: string) {
  return `https://wa.me/${agency.phoneE164}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsAppMessage =
  "Bonjour DarEstate, je souhaite échanger sur un bien immobilier au Maroc.";
