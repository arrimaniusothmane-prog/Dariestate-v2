import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  Lead,
  LeadStatus,
  Offer,
  OfferStatus,
  Visit,
} from "../types";
import { mockLeads, mockOffers, mockVisits } from "../data/properties";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "marketplace.json");

interface MarketplaceDb {
  leads: Lead[];
  visits: Visit[];
  offers: Offer[];
  favoritesByUser: Record<string, string[]>;
}

function seed(): MarketplaceDb {
  return {
    leads: [...mockLeads],
    visits: [...mockVisits],
    offers: [...mockOffers],
    favoritesByUser: {
      "buyer-1": ["prop-1", "prop-3", "prop-5"],
    },
  };
}

function ensureDb(): void {
  if (existsSync(DB_FILE)) return;
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(seed(), null, 2), "utf8");
}

function readDb(): MarketplaceDb {
  ensureDb();
  const raw = readFileSync(DB_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as MarketplaceDb;
    return {
      leads: parsed.leads ?? [],
      visits: parsed.visits ?? [],
      offers: parsed.offers ?? [],
      favoritesByUser: parsed.favoritesByUser ?? {},
    };
  } catch {
    const data = seed();
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

function writeDb(db: MarketplaceDb): void {
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

export function listLeads(): Lead[] {
  return [...readDb().leads];
}

export function createLead(
  input: Omit<Lead, "id" | "createdAt" | "updatedAt">
): Lead {
  const db = readDb();
  const now = new Date().toISOString();
  const lead: Lead = {
    ...input,
    id: `lead-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db.leads = [...db.leads, lead];
  writeDb(db);
  return lead;
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus
): Lead | null {
  const db = readDb();
  const index = db.leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  const updated: Lead = {
    ...db.leads[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  db.leads[index] = updated;
  writeDb(db);
  return updated;
}

export function listVisits(): Visit[] {
  return [...readDb().visits];
}

export function createVisit(input: Omit<Visit, "id" | "createdAt">): Visit {
  const db = readDb();
  const visit: Visit = {
    ...input,
    id: `visit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.visits = [...db.visits, visit];
  writeDb(db);
  return visit;
}

export function listOffers(): Offer[] {
  return [...readDb().offers];
}

export function createOffer(
  input: Omit<Offer, "id" | "createdAt" | "updatedAt">
): Offer {
  const db = readDb();
  const now = new Date().toISOString();
  const offer: Offer = {
    ...input,
    id: `offer-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db.offers = [...db.offers, offer];
  writeDb(db);
  return offer;
}

export function updateOfferStatus(
  id: string,
  status: OfferStatus
): Offer | null {
  const db = readDb();
  const index = db.offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const updated: Offer = {
    ...db.offers[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  db.offers[index] = updated;
  writeDb(db);
  return updated;
}

export function sendCounterOffer(
  id: string,
  input: { price?: number; message?: string }
): Offer | null {
  const db = readDb();
  const index = db.offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const current = db.offers[index];
  const updated: Offer = {
    ...current,
    status: OfferStatus.COUNTER_OFFER,
    counterPrice: input.price ?? current.price,
    counterMessage: input.message,
    updatedAt: new Date().toISOString(),
  };
  db.offers[index] = updated;
  writeDb(db);
  return updated;
}

export function getFavorites(userId: string): string[] {
  return [...(readDb().favoritesByUser[userId] ?? [])];
}

export function toggleFavorite(
  userId: string,
  propertyId: string
): string[] {
  const db = readDb();
  const current = db.favoritesByUser[userId] ?? [];
  const next = current.includes(propertyId)
    ? current.filter((id) => id !== propertyId)
    : [...current, propertyId];
  db.favoritesByUser = { ...db.favoritesByUser, [userId]: next };
  writeDb(db);
  return [...next];
}
