"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, Heart, Search, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Accueil", kind: "brand" as const },
    { href: "/properties", label: "Recherche", kind: "icon" as const, Icon: Search },
    { href: "/construction", label: "Travaux", kind: "icon" as const, Icon: HardHat },
    { href: "/favorites", label: "Favoris", kind: "icon" as const, Icon: Heart },
    { href: "/account", label: "Compte", kind: "icon" as const, Icon: UserRound },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden" aria-label="Navigation mobile">
      <div className="glass border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 grid-cols-5">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active
                    ? "text-ink"
                    : "text-muted-foreground hover:text-ink"
                )}
              >
                {item.kind === "brand" ? (
                  <BrandMark
                    tone={active ? "brand" : "onLight"}
                    className="size-6 rounded-lg"
                  />
                ) : (
                  <item.Icon
                    className={cn("size-5", active && "text-gold-strong")}
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                )}
                {item.label}
                {active && (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
