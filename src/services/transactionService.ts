import {
  Transaction,
  TransactionStatus,
  Commission,
  DashboardStats,
} from "../types";
import { setUserLookup } from "@/lib/lookup-cache";
import { getProperties } from "./propertyService";

async function ensureLookups(): Promise<void> {
  await getProperties();
  try {
    const res = await fetch("/api/directory", { credentials: "include" });
    if (res.ok) setUserLookup(await res.json());
  } catch {
    /* ignore */
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  await ensureLookups();
  const res = await fetch("/api/transactions?kind=transactions", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de charger les transactions.");
  return res.json();
}

export async function getCommissions(): Promise<Commission[]> {
  await ensureLookups();
  const res = await fetch("/api/transactions?kind=commissions", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de charger les commissions.");
  return res.json();
}

export function calculateCommission(
  salePrice: number,
  percentage: number
): number {
  return Math.round(salePrice * (percentage / 100));
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "createdAt">
): Promise<Transaction> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(transaction),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Impossible de créer la transaction.");
  }
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch("/api/transactions?kind=stats", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Impossible de charger les statistiques.");
  return res.json();
}

export type { TransactionStatus };
