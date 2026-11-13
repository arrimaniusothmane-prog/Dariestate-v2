import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mot de passe oublié",
  description:
    "Besoin d'aide pour accéder à votre compte DarEstate ? Contactez le support.",
  path: "/forgot-password",
  index: false,
});

export default function ForgotPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}