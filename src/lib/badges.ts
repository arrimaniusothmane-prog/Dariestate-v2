import type { Property } from "@/types";

export type Highlight = "favorite" | "new" | "drop" | "exclusive";

/** Coup de cœur limité à trois biens. Les autres pastilles sont distinctes. */
const highlights: Record<string, Highlight> = {
  "prop-1": "favorite",
  "prop-6": "favorite",
  "prop-3": "favorite",
  "prop-11": "exclusive",
  "prop-5": "drop",
  "prop-12": "new",
};

export const highlightLabel: Record<Highlight, { fr: string; en: string; ar: string }> = {
  favorite: { fr: "Coup de cœur", en: "Editor's pick", ar: "اختيارنا" },
  new: { fr: "Nouveau", en: "New", ar: "جديد" },
  drop: { fr: "Prix en baisse", en: "Price drop", ar: "سعر منخفض" },
  exclusive: { fr: "Exclusivité", en: "Exclusive", ar: "حصري" },
};

export function propertyHighlight(property: Property): Highlight | null {
  if (property.previousPrice && property.previousPrice > property.price) return "drop";
  return highlights[property.id] ?? null;
}

export function showsRooms(property: Property) {
  return property.category !== "LAND" && property.category !== "COMMERCIAL";
}
