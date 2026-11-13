"use client";

import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-24">
      <Link
        href="/login"
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Retour à la connexion
      </Link>

      <div className="mt-6 rounded-3xl border border-border/60 bg-card p-8 shadow-sm">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-sand">
          <MailCheck className="size-7 text-gold" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">
          Mot de passe oublié
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La réinitialisation automatique n&apos;est pas encore disponible.
          Contactez notre équipe avec l&apos;adresse email de votre compte :
          nous vous aiderons à retrouver l&apos;accès.
        </p>

        <div className="mt-6 space-y-3">
          <Link href="/contact" className="block w-full">
            <Button className="w-full rounded-full">Contacter le support</Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Ou écrivez à{" "}
            <a
              href="mailto:contact@darestimate.ma"
              className="font-medium text-gold-strong underline-offset-2 hover:underline"
            >
              contact@darestimate.ma
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
