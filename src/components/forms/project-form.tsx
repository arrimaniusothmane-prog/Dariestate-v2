"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createDemande } from "@/services/demandeService";
import { DemandeType } from "@/types";
import { cn } from "@/lib/utils";

const needs = ["Acheter", "Louer", "Vendre", "Estimer", "Visiter"] as const;

export function ProjectForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [need, setNeed] = useState<(typeof needs)[number]>(needs[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await createDemande({
        type: DemandeType.CONTACT,
        title: `Projet — ${need}`,
        name: name.trim(),
        phone: phone.trim(),
        message: `${name.trim()} souhaite : ${need}.`,
        data: { besoin: need },
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex max-w-lg items-start gap-3 rounded-2xl border border-white/15 bg-white px-5 py-4 text-[#111111]">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
        <p className="text-sm leading-relaxed">
          Merci {name.split(" ")[0]}. Un conseiller vous rappelle sous 24 h.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-lg space-y-4 rounded-3xl border border-white/15 bg-white p-5 text-[#111111] shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6"
    >
      <div>
        <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
          Votre besoin
        </p>
        <div
          role="radiogroup"
          aria-label="Besoin"
          className="mt-2 flex flex-wrap gap-2"
        >
          {needs.map((item) => {
            const active = need === item;
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setNeed(item)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#111111] text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-[#111111]"
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="project-name"
            className="mb-1.5 block text-sm font-medium text-[#111111]"
          >
            Nom
          </label>
          <input
            id="project-name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-[#111111] outline-none placeholder:text-neutral-400 focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15"
          />
        </div>
        <div>
          <label
            htmlFor="project-phone"
            className="mb-1.5 block text-sm font-medium text-[#111111]"
          >
            Téléphone
          </label>
          <input
            id="project-phone"
            required
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6 …"
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-[#111111] outline-none placeholder:text-neutral-400 focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="flex h-12 w-full items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Envoyer ma demande"
        )}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm text-neutral-600">
          L’envoi n’a pas abouti. Appelez-nous ou réessayez.
        </p>
      )}
    </form>
  );
}
