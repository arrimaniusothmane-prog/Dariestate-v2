"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HardHat, Heart, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  if (isAuth) return null;

  const items = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/properties", label: "Recherche", icon: Search },
    { href: "/construction", label: "Travaux", icon: HardHat },
    { href: "/favorites", label: "Favoris", icon: Heart },
    { href: "/account", label: "Compte", icon: User },
  ];

return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="border-t border-white/10 bg-[#111111] pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-[76px] grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                )}
              >
                <Icon className={cn("size-6", active && "stroke-gold-light")} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
                {active && (
                  <span className="absolute top-0 h-0.5 w-10 rounded-full bg-gold-light" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
