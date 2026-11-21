"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  Globe,
  HardHat,
  Info,
  LogOut,
  Menu,
  Moon,
  Sun,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/types";

export function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isAuth =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAuth) return null;

  const tabs = [
    { href: "/properties", label: t("nav.nosBiens"), icon: Building2 },
    { href: "/construction", label: t("nav.travaux"), icon: HardHat },
    { href: "/invest", label: t("nav.investir"), icon: TrendingUp },
    { href: "/about", label: t("nav.apropos"), icon: Info },
  ];

  const dashboardHref =
    user?.role === UserRole.ADMIN &&
    user.email.trim().toLowerCase() === "arrimaniusothmane@gmail.com"
      ? "/admin"
      : user?.role === UserRole.SELLER || user?.role === UserRole.AGENT
      ? "/seller"
      : "/buyer";

  const langOptions: { code: Locale; label: string }[] = [
    { code: "fr", label: "FR" },
    { code: "ar", label: "عر" },
    { code: "en", label: "EN" },
  ];

  const pill = cn(
    "flex h-14 items-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors",
    scrolled
      ? "border-white/20 bg-[#111111]/92"
      : "border-white/10 bg-[#111111]/95"
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-4 pt-3 md:block md:px-6 md:pt-4">
      <nav className="pointer-events-auto relative mx-auto grid max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={cn(pill, "w-full min-w-0 justify-center gap-1 overflow-x-auto px-2.5")}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              pathname === tab.href ||
              (tab.href !== "/" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="size-[1.125rem] shrink-0" strokeWidth={1.7} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </Link>
            );
          })}
        </div>

        <Link href="/" aria-label="DarEstate — Accueil" className="relative z-10 justify-self-center shrink-0">
          <span className="flex size-16 flex-col items-center justify-center gap-0.5 rounded-full border border-white/15 bg-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#111111]">
              <Building2 className="size-4" />
            </span>
            <span className="text-[10px] leading-none font-semibold tracking-tight text-white">
              Dar<span className="text-white/70">Estate</span>
            </span>
          </span>
        </Link>

        <div className={cn(pill, "w-full min-w-0 justify-end gap-2 px-3")}>
          <Link
            href="/publish"
            className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t("nav.publier")}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  aria-label="Changer de langue"
                  className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                />
              }
            >
              <Globe className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Langue</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {langOptions.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(
                      locale === lang.code && "font-semibold text-brand-text"
                    )}
                  >
                    {lang.label} —{" "}
                    {lang.code === "fr"
                      ? "Français"
                      : lang.code === "ar"
                        ? "العربية"
                        : "English"
                    }
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  aria-label="Menu"
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors",
                    user
                      ? "border border-white/15 bg-white/10 hover:bg-white/20"
                      : "bg-white/10 hover:bg-white/20"
                  )}
                />
              }
            >
              {user ? (
                user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="size-4 text-white" />
                )
              ) : (
                <Menu className="size-4 text-white" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {user ? (
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="font-medium text-hof">{user.name}</p>
                    <p className="text-xs text-foggy">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href={dashboardHref} />}>
                    Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/favorites" />}>
                    Mes favoris
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/publish" />}>
                    Publier un bien
                  </DropdownMenuItem>
                  {tabs.map((tab) => (
                    <DropdownMenuItem key={tab.href} render={<Link href={tab.href} />}>
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                    <LogOut className="mr-2 size-4" />
                    {t("nav.deconnexion")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/login" />}>
                    {t("nav.connexion")}
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/publish" />}>
                    {t("nav.publier")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {tabs.map((tab) => (
                    <DropdownMenuItem key={tab.href} render={<Link href={tab.href} />}>
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/contact" />}>
                    Contact
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
