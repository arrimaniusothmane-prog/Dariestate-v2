"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Routes that render their own full-screen chrome (no global navbar/footer). */
const BARE_ROUTES = ["/login"];

function useIsBareRoute() {
  const pathname = usePathname();
  return BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function SiteHeader({ children }: { children: ReactNode }) {
  return useIsBareRoute() ? null : <>{children}</>;
}

export function SiteFooter({ children }: { children: ReactNode }) {
  return useIsBareRoute() ? null : <>{children}</>;
}
