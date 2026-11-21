"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createDemande } from "@/services/demandeService";
import { DemandeType } from "@/types";

export function NotifyForm({
  subject,
  compact = false,
  tone = "overlay",
}: {
  subject: string;
  compact?: boolean;
  tone?: "overlay" | "light";
}) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    setStatus("sending");
    try {
      await createDemande({
        type: DemandeType.ALERTE,
        title: `Alerte — ${subject}`,
        message: `Prévenez-moi dès qu'un bien correspond : ${subject}`,
        email: email.trim(),
        phone: phone.trim(),
        data: { sujet: subject },
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className={tone === "light" ? "text-sm text-hof" : "text-sm text-white/90"}>
        C’est noté. Nous vous écrivons dès qu’un bien correspond.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "mt-3 space-y-2" : "mt-4 flex flex-col gap-2 sm:flex-row"}>
      <label className="sr-only" htmlFor={`alert-email-${subject}`}>
        E-mail
      </label>
      <input
        id={`alert-email-${subject}`}
        type="email"
        required={!phone}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre e-mail"
        className="w-full rounded-full border border-white/30 bg-white/95 px-3 py-2 text-sm text-hof outline-none placeholder:text-foggy focus-visible:ring-2 focus-visible:ring-white"
      />
      {!compact && (
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp (optionnel)"
          className="w-full rounded-full border border-white/30 bg-white/95 px-3 py-2 text-sm text-hof outline-none placeholder:text-foggy"
        />
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={cnButton(tone)}
      >
        {status === "sending" ? <Loader2 className="mx-auto size-4 animate-spin" /> : "M’alerter"}
      </button>
      {status === "error" && (
        <p className={tone === "light" ? "text-xs text-destructive" : "text-xs text-white"}>
          Envoi impossible. Réessayez dans un instant.
        </p>
      )}
    </form>
  );
}

function cnButton(tone: "overlay" | "light") {
  return tone === "light"
    ? "rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
    : "rounded-full bg-white px-4 py-2 text-sm font-semibold text-hof disabled:opacity-60";
}
