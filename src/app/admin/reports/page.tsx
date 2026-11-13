"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FileDown, BarChart3, MapPin, Filter, Trophy } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { getProperties } from "@/services/propertyService";
import { getDashboardStats } from "@/services/transactionService";
import type { DashboardStats, Property } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

const downloadReports = [
  { title: "Rapport mensuel", desc: "Activité de la plateforme, Vue d'ensemble", file: "rapport-mensuel.pdf" },
  { title: "Rapport revenus", desc: "Détail des commissions et ventes", file: "rapport-revenus.pdf" },
  { title: "Rapport utilisateurs", desc: "Croissance et répartition par rôle", file: "rapport-utilisateurs.pdf" },
];

export default function AdminReportsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getProperties().then(setProperties).catch(() => undefined);
    getDashboardStats().then(setStats).catch(() => undefined);
  }, []);

  const topBiens = [...properties]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const cityCounts = properties.reduce<Record<string, number>>((acc, p) => {
    const city = p.address.city.split(",")[0]?.trim() || p.address.city;
    acc[city] = (acc[city] ?? 0) + 1;
    return acc;
  }, {});
  const leadsByCity = Object.entries(cityCounts)
    .map(([city, value]) => ({ city, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const maxCity = Math.max(1, ...leadsByCity.map((c) => c.value));

  const funnel = [
    { label: "Biens", value: stats?.activeProperties ?? properties.length, pct: 100 },
    { label: "Leads", value: stats?.totalLeads ?? 0, pct: 40 },
    { label: "Visites", value: stats?.visits ?? 0, pct: 25 },
    { label: "Offres", value: stats?.offers ?? 0, pct: 15 },
    { label: "Transactions", value: stats?.completedTransactions ?? 0, pct: 8 },
  ];

  return (
    <div>
      <DashboardHeader
        title="Rapports"
        subtitle="Vue d'activité basée sur les données persistées de la plateforme."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {downloadReports.map((r) => (
          <div
            key={r.file}
            className="rounded-2xl border border-border/60 bg-card p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-sand text-gold">
                <FileDown className="size-5" />
              </span>
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Export PDF bientôt disponible
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="size-5 text-gold" />
            <h3 className="font-display text-lg font-semibold">Entonnoir</h3>
          </div>
          <div className="space-y-3">
            {funnel.map((step) => (
              <div key={step.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{step.label}</span>
                  <span className="tnum font-medium">{step.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-5 text-gold" />
            <h3 className="font-display text-lg font-semibold">
              Biens par ville
            </h3>
          </div>
          <div className="space-y-3">
            {leadsByCity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée.</p>
            ) : (
              leadsByCity.map((row) => (
                <div key={row.city}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{row.city}</span>
                    <span className="tnum font-medium">{row.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{
                        width: `${Math.round((row.value / maxCity) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="size-5 text-gold" />
          <h3 className="font-display text-lg font-semibold">
            Biens les plus vus
          </h3>
          <Badge variant="secondary" className="ml-auto gap-1">
            <Filter className="size-3.5" /> Temps réel
          </Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {topBiens.map((p) => {
            const img = p.images.find((i) => i.isPrimary) ?? p.images[0];
            return (
              <div key={p.id} className="overflow-hidden rounded-xl border border-border/50">
                <div className="relative aspect-[4/3] bg-muted">
                  {img && (
                    <Image
                      src={img.url}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.views} vues · {formatPrice(p.price)}
                  </p>
                </div>
              </div>
            );
          })}
          {topBiens.length === 0 && (
            <p className={cn("col-span-full text-sm text-muted-foreground")}>
              Aucun bien à afficher.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
