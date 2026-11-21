"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Bath, BedDouble, ChevronLeft, ChevronRight, Heart, Maximize2 } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/labels";
import { useFavorites } from "@/hooks/useProperties";
import { useI18n } from "@/components/providers/i18n-provider";
import { highlightLabel, propertyHighlight, showsRooms } from "@/lib/badges";

export function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  const { locale } = useI18n();
  const [imageError, setImageError] = useState(false);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(property.id);
  const images = [...property.images].sort((a, b) => a.order - b.order);
  const highlight = propertyHighlight(property);
  const rooms = showsRooms(property);
  const perSqm = property.surface > 0 ? Math.round(property.price / property.surface) : null;
  const rent = property.listing === "rent";

  useEffect(() => {
    if (!hovering || images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [hovering, images.length]);

  const image = images[index];

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const step = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((current) => (current + delta + images.length) % images.length);
  };

  return (
    <div
      className={cn("group block w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setIndex(0);
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-deco">
        <Link href={`/properties/${property.slug}`} aria-label={property.title} className="absolute inset-0">
          {image && !imageError ? (
            <Image
              src={image.url}
              alt={image.alt || property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              quality={68}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-foggy">
              {categoryLabel[property.category]}
            </div>
          )}
        </Link>

        {highlight && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-hof shadow-tooltip">
            {highlightLabel[highlight][locale]}
          </span>
        )}

        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={isFavorite}
          className="absolute right-2 top-2 z-10 flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
        >
          <Heart
            className={cn(
              "size-5",
              isFavorite ? "fill-rausch stroke-rausch" : "fill-black/40 stroke-white"
            )}
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => step(e, -1)}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-hof opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={(e) => step(e, 1)}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-hof opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1">
              {images.slice(0, 5).map((item, dot) => (
                <span
                  key={item.id}
                  className={cn(
                    "h-1.5 rounded-full bg-white/80",
                    dot === index ? "w-4" : "w-1.5 opacity-70"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-3 space-y-1 px-1">
        <h3 className="truncate text-sm font-medium text-hof">
          <Link href={`/properties/${property.slug}`} className="hover:text-rausch">
            {property.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 truncate text-sm text-foggy">
          {property.address.city}
          {property.isVerified && (
            <span className="inline-flex items-center gap-0.5 pl-1 text-hof">
              <BadgeCheck className="size-3.5" />
              <span className="text-xs">Vérifié</span>
            </span>
          )}
        </p>
        <p className="tnum text-sm font-semibold text-hof">
          {formatPrice(property.price)}
          {rent ? " / mois" : ""}
          {perSqm !== null && (
            <span className="ml-2 font-normal text-foggy">
              {formatPrice(perSqm)}
              {rent ? " / m²" : " / m²"}
            </span>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-xs text-foggy">
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="size-3.5" strokeWidth={1.7} />
            {property.surface} m²
          </span>
          {rooms && property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" strokeWidth={1.7} />
              {property.bedrooms}
            </span>
          )}
          {rooms && property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" strokeWidth={1.7} />
              {property.bathrooms}
            </span>
          )}
        </div>
        <Link
          href={`/properties/${property.slug}`}
          className="inline-flex items-center gap-1 pt-1 text-xs font-semibold text-hof transition-colors hover:text-rausch"
        >
          Voir le bien <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
