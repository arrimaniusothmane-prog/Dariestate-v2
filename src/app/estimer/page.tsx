"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createDemande } from "@/services/demandeService";
import { DemandeType } from "@/types";

export default function EstimatePage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "Casablanca",
    type: "Appartement",
    surface: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await createDemande({
        type: DemandeType.ESTIMATION,
        title: `Estimation ${form.type} — ${form.city}`,
        name: form.name,
        phone: form.phone,
        message: `${form.type} d’environ ${form.surface} m² à ${form.city}.`,
        data: { ville: form.city, type: form.type, surface: form.surface },
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-24">
      <h1 className="text-heading font-semibold text-hof">Estimez votre bien</h1>
      <p className="mt-3 text-sm leading-relaxed text-foggy">
        Indiquez l’essentiel. Un conseiller revient vers vous avec une fourchette, avant toute mise en vente.
      </p>
      {status === "done" ? (
        <p className="mt-8 rounded-2xl bg-faint px-5 py-4 text-sm text-hof">
          Demande reçue. Nous vous appelons sous 24 h avec une première estimation.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <Field label="Nom" value={form.name} onChange={(name) => setForm({ ...form, name })} />
          <Field label="Téléphone" type="tel" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
          <label className="text-sm font-medium text-hof">
            Ville
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2.5"
            >
              {["Casablanca", "Marrakech", "Rabat", "Tanger", "Agadir"].map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-hof">
            Type de bien
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2.5"
            >
              {["Appartement", "Villa", "Maison", "Terrain", "Local"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <Field label="Surface (m²)" type="number" value={form.surface} onChange={(surface) => setForm({ ...form, surface })} />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {status === "sending" ? <Loader2 className="mx-auto size-4 animate-spin" /> : "Demander une estimation"}
          </button>
          {status === "error" && (
            <p className="text-sm text-destructive">L’envoi a échoué. Réessayez ou appelez l’agence.</p>
          )}
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm font-medium text-hof">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
