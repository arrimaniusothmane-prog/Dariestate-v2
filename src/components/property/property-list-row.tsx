"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin, Bath, BedDouble, Ruler, Heart, BadgeCheck, ArrowRight } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/labels";
import { propertyHighlight, highlightLabel, showsRooms } from "@/lib/badges";
import { useI18n } from "@/components/providers/i18n-provider";
import { useFavorites } from "@/hooks/useProperties";
import { Badge } from "@/components/ui/badge";

export function PropertyListRow({ property }: { property: Property }) {
  const [imageError, setImageError] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(property.id);
  const { locale } = useI18n();
  const highlight = propertyHighlight(property);
  const rooms = showsRooms(property);
  const perSqm = property.surface > 0 ? Math.round(property.price / property.surface) : null;

  const primaryImage = property.images.find((i) => i.isPrimary) ?? property.images[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg sm:flex-row">
      {/* Image */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-72">
        {primaryImage && !imageError ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || property.title}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            {categoryLabel[property.category]}
          </div>
        )}
        <Badge className="pointer-events-none absolute left-3 top-3 bg-white text-hof">
          {highlight ? highlightLabel[highlight][locale] : categoryLabel[property.category]}
        </Badge>
        <button
          onClick={() => toggleFavorite(property.id)}
          className={cn(
            "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90",
            isFavorite ? "bg-gold text-white" : "bg-black/30 text-white hover:bg-black/50"
          )}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={isFavorite}
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {property.isVerified && (
                <BadgeCheck className="size-4 shrink-0 text-gold" />
              )}
              <h3 className="truncate font-display text-lg font-semibold">
                {property.title}
              </h3>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {property.address.city}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-xl font-semibold text-primary">
              {formatPrice(property.price)}
              {property.listing === "rent" ? " / mois" : ""}
            </p>
            {perSqm !== null && (
              <p className="text-xs text-muted-foreground">{formatPrice(perSqm)} / m²</p>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-border/60 pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4" /> {property.surface} m²
          </span>
          {rooms && property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4" /> {property.bedrooms} ch
            </span>
          )}
          {rooms && property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="size-4" /> {property.bathrooms} sdb
            </span>
          )}
          <span className="ml-auto hidden items-center gap-1 font-medium text-gold sm:flex">
            Voir le bien <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      <Link
        href={`/properties/${property.slug}`}
        aria-label={`Voir ${property.title}`}
        className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
    </div>
  );
}