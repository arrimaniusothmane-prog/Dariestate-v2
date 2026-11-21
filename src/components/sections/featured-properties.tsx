"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PropertyCategory } from "@/types";

export function FeaturedProperties({
  title = "Biens sélectionnés",
  subtitle,
  href = "/properties",
  kind = "featured",
  limit = 10,
}: {
  title?: string;
  subtitle?: string;
  href?: string;
  kind?: "featured" | "villas" | "apartments";
  limit?: number;
}) {
  const { properties, loading } = useProperties();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(true);

  const list = properties
    .filter((p) => {
      switch (kind) {
        case "villas":
          return p.category === PropertyCategory.VILLA && p.hasPool;
        case "apartments":
          return p.category === PropertyCategory.APARTMENT;
        default:
          return p.isVerified;
      }
    })
    .slice(0, limit);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      setCanBack(el.scrollLeft > 8);
      setCanForward(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [loading]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1760px] px-6 md:px-10">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-heading-sm font-medium tracking-tight text-hof">
              {title}
            </h2>
            <Link href={href} aria-label={`Tout voir — ${title}`}>
              <ArrowRight className="size-5 text-hof" />
            </Link>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <CarouselArrow dir="left" disabled={!canBack} onClick={() => scrollBy(-1)} />
            <CarouselArrow dir="right" disabled={!canForward} onClick={() => scrollBy(1)} />
          </div>
        </div>

        {subtitle && (
          <p className="-mt-3 mb-6 text-sm text-foggy">{subtitle}</p>
        )}

        {/* Horizontal scroll row */}
        <div
          ref={scrollerRef}
          className="scrollbar-hide -mx-6 flex gap-3 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-[240px] shrink-0 sm:w-[260px]">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="mt-3 space-y-2 px-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : (
            list.map((property) => (
              <div key={property.id} className="w-[240px] shrink-0 sm:w-[260px]">
                <PropertyCard property={property} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Défiler vers la gauche" : "Défiler vers la droite"}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-line bg-white transition-colors hover:bg-faint",
        disabled ? "cursor-default opacity-50" : "text-hof"
      )}
    >
      <Icon className={cn("size-4", disabled && "text-grey-500")} />
    </button>
  );
}