import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  Property,
  PropertyCategory,
  PropertyFilters,
  PropertyStatus,
  User,
} from "../types";
import { mockProperties } from "../data/properties";
import { readUsers, toPublicUser } from "./db";
import { slugify } from "../lib/utils";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "properties.json");

function ensureDb(): void {
  if (existsSync(DB_FILE)) return;
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(mockProperties, null, 2), "utf8");
}

export function readProperties(): Property[] {
  ensureDb();
  const raw = readFileSync(DB_FILE, "utf8");
  try {
    return JSON.parse(raw) as Property[];
  } catch {
    writeFileSync(DB_FILE, JSON.stringify(mockProperties, null, 2), "utf8");
    return [...mockProperties];
  }
}

export function writeProperties(properties: Property[]): void {
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(properties, null, 2), "utf8");
}

function sellerMap(): Map<string, User> {
  const map = new Map<string, User>();
  for (const u of readUsers()) {
    map.set(u.id, toPublicUser(u));
  }
  return map;
}

export function withSellers(props: Property[]): Property[] {
  const sellers = sellerMap();
  return props.map((p) => ({
    ...p,
    seller: sellers.get(p.sellerId),
  }));
}

export function listProperties(): Property[] {
  return withSellers(readProperties());
}

export function getPropertyById(id: string): Property | null {
  const found = readProperties().find((p) => p.id === id);
  return found ? withSellers([found])[0] : null;
}

export function getPropertyBySlug(slug: string): Property | null {
  const found = readProperties().find((p) => p.slug === slug);
  return found ? withSellers([found])[0] : null;
}

export function getPropertiesByCategory(category: PropertyCategory): Property[] {
  return withSellers(readProperties().filter((p) => p.category === category));
}

export function getFeaturedProperties(): Property[] {
  return withSellers(
    readProperties()
      .filter((p) => p.status === PropertyStatus.PUBLISHED && p.isVerified)
      .slice(0, 6)
  );
}

export function filterProperties(filters: Partial<PropertyFilters>): Property[] {
  let results = [...readProperties()];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.address.city.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.city) {
    results = results.filter((p) =>
      p.address.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.minSurface !== undefined) {
    results = results.filter((p) => p.surface >= filters.minSurface!);
  }

  if (filters.maxSurface !== undefined) {
    results = results.filter((p) => p.surface <= filters.maxSurface!);
  }

  if (filters.bedrooms !== undefined) {
    results = results.filter((p) => p.bedrooms === filters.bedrooms);
  }

  if (filters.bathrooms !== undefined) {
    results = results.filter((p) => p.bathrooms === filters.bathrooms);
  }

  if (filters.isFurnished !== undefined) {
    results = results.filter((p) => p.isFurnished === filters.isFurnished);
  }

  if (filters.hasParking !== undefined) {
    results = results.filter((p) => p.hasParking === filters.hasParking);
  }

  if (filters.hasPool !== undefined) {
    results = results.filter((p) => p.hasPool === filters.hasPool);
  }

  if (filters.hasGarden !== undefined) {
    results = results.filter((p) => p.hasGarden === filters.hasGarden);
  }

  if (filters.hasTerrace !== undefined) {
    results = results.filter((p) => p.hasTerrace === filters.hasTerrace);
  }

  if (filters.isNewConstruction !== undefined) {
    results = results.filter(
      (p) => p.isNewConstruction === filters.isNewConstruction
    );
  }

  if (filters.isVerified !== undefined) {
    results = results.filter((p) => p.isVerified === filters.isVerified);
  }

  if (filters.status) {
    results = results.filter((p) => p.status === filters.status);
  }

  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "surface-asc":
        results.sort((a, b) => a.surface - b.surface);
        break;
      case "surface-desc":
        results.sort((a, b) => b.surface - a.surface);
        break;
      case "newest":
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        results.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "popular":
        results.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }
  }

  return withSellers(results);
}

export function createProperty(
  input: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt" | "seller">
): Property {
  const now = new Date().toISOString();
  const property: Property = {
    ...input,
    id: `prop-${Date.now()}`,
    slug: slugify(input.title),
    createdAt: now,
    updatedAt: now,
  };
  writeProperties([...readProperties(), property]);
  return withSellers([property])[0];
}

export function updateProperty(
  id: string,
  updates: Partial<Property>
): Property | null {
  const properties = readProperties();
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = properties[index];
  const updated: Property = {
    ...current,
    ...updates,
    id: current.id,
    slug: updates.title ? slugify(updates.title) : current.slug,
    updatedAt: new Date().toISOString(),
  };
  delete (updated as { seller?: User }).seller;
  properties[index] = updated;
  writeProperties(properties);
  return withSellers([updated])[0];
}

export function deleteProperty(id: string): boolean {
  const properties = readProperties();
  const next = properties.filter((p) => p.id !== id);
  if (next.length === properties.length) return false;
  writeProperties(next);
  return true;
}

export function togglePauseProperty(id: string): Property | null {
  const prop = getPropertyById(id);
  if (!prop) return null;
  const newStatus =
    prop.status === PropertyStatus.PAUSED
      ? PropertyStatus.PUBLISHED
      : PropertyStatus.PAUSED;
  return updateProperty(id, { status: newStatus });
}

export function markAsSold(id: string): Property | null {
  return updateProperty(id, { status: PropertyStatus.SOLD });
}
