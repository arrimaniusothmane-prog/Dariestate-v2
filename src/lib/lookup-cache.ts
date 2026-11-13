import type { Property, User } from "@/types";

let propertiesById = new Map<string, Property>();
let usersById = new Map<string, User>();

export function setPropertyLookup(list: Property[]): void {
  propertiesById = new Map(list.map((p) => [p.id, p]));
}

export function upsertPropertyLookup(property: Property): void {
  propertiesById.set(property.id, property);
}

export function setUserLookup(list: User[]): void {
  usersById = new Map(list.map((u) => [u.id, u]));
}

export function getCachedProperty(id: string): Property | undefined {
  return propertiesById.get(id);
}

export function getCachedUser(id: string): User | undefined {
  return usersById.get(id);
}

export function hasPropertyLookup(): boolean {
  return propertiesById.size > 0;
}

export function hasUserLookup(): boolean {
  return usersById.size > 0;
}
