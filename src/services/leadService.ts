import {
  Lead,
  LeadStatus,
  Visit,
  Offer,
  OfferStatus,
} from "../types";
import { hasPropertyLookup, hasUserLookup } from "@/lib/lookup-cache";
import { getProperties } from "./propertyService";

async function ensureLookups(): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  if (!hasPropertyLookup()) tasks.push(getProperties());
  if (!hasUserLookup()) {
    tasks.push(
      fetch("/api/directory", { credentials: "include" })
        .then(async (res) => {
          if (!res.ok) return;
          const { setUserLookup } = await import("@/lib/lookup-cache");
          setUserLookup(await res.json());
        })
        .catch(() => undefined)
    );
  }
  if (tasks.length) await Promise.all(tasks);
}

export async function getLeads(): Promise<Lead[]> {
  await ensureLookups();
  const res = await fetch("/api/leads?kind=leads", { credentials: "include" });
  if (!res.ok) throw new Error("Impossible de charger les leads.");
  return res.json();
}

export async function createLead(
  lead: Omit<Lead, "id" | "createdAt" | "updatedAt">
): Promise<Lead> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "lead", ...lead }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de créer le lead.");
  }
  return res.json();
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead | null> {
  const res = await fetch("/api/leads", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, kind: "lead", status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de mettre à jour le lead.");
  }
  return res.json();
}

export async function getVisits(): Promise<Visit[]> {
  await ensureLookups();
  const res = await fetch("/api/leads?kind=visits", { credentials: "include" });
  if (!res.ok) throw new Error("Impossible de charger les visites.");
  return res.json();
}

export async function createVisit(
  visit: Omit<Visit, "id" | "createdAt">
): Promise<Visit> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "visit", ...visit }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de créer la visite.");
  }
  const data = await res.json();
  return data.visit ?? data;
}

export async function createVisitRequest(input: {
  propertyId: string;
  sellerId: string;
  buyerId?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  time: string;
  numberOfVisitors: number;
  status?: LeadStatus;
}): Promise<{ lead: Lead; visit: Visit }> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "visit", ...input }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de demander une visite.");
  }
  return res.json();
}

export async function getOffers(): Promise<Offer[]> {
  await ensureLookups();
  const res = await fetch("/api/leads?kind=offers", { credentials: "include" });
  if (!res.ok) throw new Error("Impossible de charger les offres.");
  return res.json();
}

export async function createOffer(
  offer: Omit<Offer, "id" | "createdAt" | "updatedAt">
): Promise<Offer> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "offer", ...offer }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de créer l'offre.");
  }
  const data = await res.json();
  return data.offer ?? data;
}

export async function createOfferRequest(input: {
  propertyId: string;
  sellerId: string;
  buyerId?: string;
  price: number;
  message: string;
  preferredContact: string;
  name: string;
  phone: string;
  email: string;
}): Promise<{ offer: Offer; lead: Lead }> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ kind: "offer", ...input }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible d'envoyer l'offre.");
  }
  return res.json();
}

export async function updateOfferStatus(
  id: string,
  status: OfferStatus
): Promise<Offer | null> {
  const res = await fetch("/api/leads", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id, kind: "offer", status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de mettre à jour l'offre.");
  }
  return res.json();
}

export interface CounterOfferInput {
  price?: number;
  message?: string;
}

export async function sendCounterOffer(
  id: string,
  input: CounterOfferInput
): Promise<Offer | null> {
  const res = await fetch("/api/leads", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      id,
      kind: "offer",
      action: "counter",
      counterPrice: input.price,
      counterMessage: input.message,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible d'envoyer la contre-offre.");
  }
  return res.json();
}

export async function getFavorites(_userId?: string): Promise<string[]> {
  const res = await fetch("/api/favorites", { credentials: "include" });
  if (res.status === 401) return [];
  if (!res.ok) throw new Error("Impossible de charger les favoris.");
  return res.json();
}

export async function toggleFavorite(
  _userId: string,
  propertyId: string
): Promise<string[]> {
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ propertyId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Connexion requise pour les favoris.");
  }
  return res.json();
}
