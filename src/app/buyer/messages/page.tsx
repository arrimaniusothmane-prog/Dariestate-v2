"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";

export default function BuyerMessagesPage() {
  return (
    <div>
      <DashboardHeader
        title="Messages"
        subtitle="Échangez avec les vendeurs et conseillers DarEstate."
      />

      <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-border/80 bg-card px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-sand text-gold">
          <MessageSquare className="size-7" />
        </span>
        <h2 className="mt-5 font-display text-xl font-semibold">
          Bientôt disponible
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          La messagerie intégrée arrive prochainement. En attendant, utilisez
          les formulaires de contact sur les annonces ou écrivez-nous
          directement.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/properties" />} className="rounded-full">
            Parcourir les biens
          </Button>
          <Button
            variant="outline"
            render={<Link href="/contact" />}
            className="rounded-full"
          >
            Contacter DarEstate
          </Button>
        </div>
      </div>
    </div>
  );
}
