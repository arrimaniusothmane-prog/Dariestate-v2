import {
  Property,
  PropertyCategory,
  PropertyFilters,
} from "../types";
import { setPropertyLookup, upsertPropertyLookup } from "@/lib/lookup-cache";

function buildQuery(filters: Partial<PropertyFilters>): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.city) params.set("city", filters.city);
  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.minSurface !== undefined)
    params.set("minSurface", String(filters.minSurface));
  if (filters.maxSurface !== undefined)
    params.set("maxSurface", String(filters.maxSurface));
  if (filters.bedrooms !== undefined)
    params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms !== undefined)
    params.set("bathrooms", String(filters.bathrooms));
  if (filters.isFurnished !== undefined)
    params.set("isFurnished", filters.isFurnished ? "1" : "0");
  if (filters.hasParking !== undefined)
    params.set("hasParking", filters.hasParking ? "1" : "0");
  if (filters.hasPool !== undefined)
    params.set("hasPool", filters.hasPool ? "1" : "0");
  if (filters.hasGarden !== undefined)
    params.set("hasGarden", filters.hasGarden ? "1" : "0");
  if (filters.hasTerrace !== undefined)
    params.set("hasTerrace", filters.hasTerrace ? "1" : "0");
  if (filters.isNewConstruction !== undefined)
    params.set("isNewConstruction", filters.isNewConstruction ? "1" : "0");
  if (filters.isVerified !== undefined)
    params.set("isVerified", filters.isVerified ? "1" : "0");
  if (filters.status) params.set("status", filters.status);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function clientGet(path: string): Promise<Response> {
  return fetch(path, { credentials: "include" });
}

export async function getProperties(): Promise<Property[]> {
  const res = await clientGet("/api/properties");
  if (!res.ok) throw new Error("Impossible de charger les biens.");
  const list = (await res.json()) as Property[];
  setPropertyLookup(list);
  return list;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const res = await clientGet("/api/properties?featured=1");
  if (!res.ok) throw new Error("Impossible de charger les biens.");
  return res.json();
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const res = await clientGet(
    `/api/properties?slug=${encodeURIComponent(slug)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Impossible de charger le bien.");
  const property = (await res.json()) as Property;
  upsertPropertyLookup(property);
  return property;
}

export async function getPropertiesByCategory(
  category: PropertyCategory
): Promise<Property[]> {
  const res = await clientGet(
    `/api/properties?category=${encodeURIComponent(category)}`
  );
  if (!res.ok) throw new Error("Impossible de charger les biens.");
  return res.json();
}

export async function searchProperties(
  filters: PropertyFilters
): Promise<Property[]> {
  const res = await clientGet(`/api/properties${buildQuery(filters)}`);
  if (!res.ok) throw new Error("Impossible de rechercher les biens.");
  return res.json();
}

export async function addProperty(
  property: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Property> {
  const res = await fetch("/api/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(property),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible d'ajouter le bien.");
  }
  return res.json();
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<Property | null> {
  const res = await fetch(`/api/properties/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de mettre à jour le bien.");
  }
  return res.json();
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await fetch(`/api/properties/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de supprimer le bien.");
  }
}

export async function togglePauseProperty(
  id: string
): Promise<Property | null> {
  const res = await fetch(`/api/properties/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: "togglePause" }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de modifier le statut.");
  }
  return res.json();
}

export async function markAsSold(id: string): Promise<Property | null> {
  const res = await fetch(`/api/properties/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action: "markSold" }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de marquer comme vendu.");
  }
  return res.json();
}
