"use client";

import { useState } from "react";
import type { Property } from "@/types";

const nearbyByCity: { match: string; places: string[] }[] = [
  {
    match: "maarif",
    places: ["Tramway Casa", "Lycées du quartier", "Commerces de l’avenue"],
  },
  {
    match: "anfa",
    places: ["Corniche", "Écoles privées", "Cliniques"],
  },
  {
    match: "californie",
    places: ["Plages d’Ain Diab", "Commerces", "Écoles internationales"],
  },
  {
    match: "gueliz",
    places: ["Avenue Mohammed V", "Cafés et commerces", "Gare routière"],
  },
  {
    match: "agdal",
    places: ["Tramway de Rabat", "Université", "Marché de l’Agdal"],
  },
  {
    match: "marrakech",
    places: ["Médina", "Guéliz", "Aéroport Marrakech-Ménara"],
  },
  {
    match: "rabat",
    places: ["Tramway", "Agdal", "Centre-ville"],
  },
  {
    match: "casablanca",
    places: ["Tramway", "Aéroport Mohammed V", "Centre-ville"],
  },
];

export function nearbyPlaces(city: string) {
  const key = city.toLowerCase();
  return (
    nearbyByCity.find((item) => key.includes(item.match))?.places ?? [
      "Commerces de proximité",
      "Établissements scolaires",
      "Axes routiers",
    ]
  );
}

export function PropertyMap({
  latitude,
  longitude,
  title,
  city,
}: {
  latitude: number;
  longitude: number;
  title: string;
  city: string;
}) {
  const bbox = `${longitude - 0.04},${latitude - 0.03},${longitude + 0.04},${latitude + 0.03}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const places = nearbyPlaces(city);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border">
      <iframe
        title={`Carte — ${title}`}
        src={src}
        className="h-72 w-full"
        loading="lazy"
      />
      <ul className="grid gap-2 p-4 sm:grid-cols-3">
        {places.map((place) => (
          <li key={place} className="rounded-xl bg-faint px-3 py-2 text-sm text-hof">
            {place}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultsMap({ properties }: { properties: Property[] }) {
  const [activeId, setActiveId] = useState(properties[0]?.id);
  const active = properties.find((item) => item.id === activeId) ?? properties[0];
  if (!active) return null;

  const bbox = `${active.longitude - 0.08},${active.latitude - 0.06},${active.longitude + 0.08},${active.latitude + 0.06}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${active.latitude}%2C${active.longitude}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card lg:sticky lg:top-28">
      <iframe title="Carte des biens" src={src} className="h-80 w-full" loading="lazy" />
      <ul className="max-h-64 divide-y divide-border overflow-y-auto">
        {properties.map((property) => (
          <li key={property.id}>
            <button
              type="button"
              onClick={() => setActiveId(property.id)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm ${
                property.id === active.id ? "bg-faint font-semibold text-hof" : "text-foggy"
              }`}
            >
              <span className="truncate">{property.title}</span>
              <span className="shrink-0">{property.address.city.split(",")[0]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
