"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/types";

function loginHref(pathname: string) {
  return `/login?next=${encodeURIComponent(pathname || "/")}`;
}

function GuardShell({
  children,
  allowed,
  title,
  description,
}: {
  children: ReactNode;
  allowed: boolean;
  title: string;
  description: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(loginHref(pathname));
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
          <ShieldAlert className="size-7" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold">Connexion requise</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connectez-vous pour accéder à cet espace.
          </p>
        </div>
        <Button render={<Link href={loginHref(pathname)} />}>Se connecter</Button>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <ShieldAlert className="size-7" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold">{title}</h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <Button render={<Link href="/" />}>Retour à l&apos;accueil</Button>
      </div>
    );
  }

  return <>{children}</>;
}

export function BuyerGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const allowed =
    !!user &&
    (user.role === UserRole.BUYER ||
      user.role === UserRole.ADMIN ||
      user.role === UserRole.AGENT);

  return (
    <GuardShell
      allowed={allowed}
      title="Espace acheteur"
      description="Cet espace est réservé aux comptes acheteurs."
    >
      {children}
    </GuardShell>
  );
}

export function SellerGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const allowed =
    !!user &&
    (user.role === UserRole.SELLER ||
      user.role === UserRole.AGENT ||
      user.role === UserRole.ADMIN);

  return (
    <GuardShell
      allowed={allowed}
      title="Espace vendeur"
      description="Cet espace est réservé aux vendeurs et agents immobiliers."
    >
      {children}
    </GuardShell>
  );
}
