import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  Commission,
  CommissionStatus,
  DashboardStats,
  PropertyStatus,
  Transaction,
  TransactionStatus,
} from "../types";
import { mockCommissions, mockTransactions } from "../data/properties";
import { readUsers } from "./db";
import { listLeads, listOffers, listVisits } from "./marketplace";
import { listProperties } from "./properties";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "transactions.json");

interface TxnDb {
  transactions: Transaction[];
  commissions: Commission[];
}

function seed(): TxnDb {
  return {
    transactions: [...mockTransactions],
    commissions: [...mockCommissions],
  };
}

function ensureDb(): void {
  if (existsSync(DB_FILE)) return;
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(seed(), null, 2), "utf8");
}

function readDb(): TxnDb {
  ensureDb();
  try {
    const parsed = JSON.parse(readFileSync(DB_FILE, "utf8")) as TxnDb;
    return {
      transactions: parsed.transactions ?? [],
      commissions: parsed.commissions ?? [],
    };
  } catch {
    const data = seed();
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

function writeDb(db: TxnDb): void {
  mkdirSync(DB_DIR, { recursive: true });
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

export function listTransactions(): Transaction[] {
  return [...readDb().transactions];
}

export function listCommissions(): Commission[] {
  return [...readDb().commissions];
}

export function createTransaction(
  input: Omit<Transaction, "id" | "createdAt">
): Transaction {
  const db = readDb();
  const txn: Transaction = {
    ...input,
    id: `txn-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.transactions = [...db.transactions, txn];

  const commission: Commission = {
    id: `comm-${Date.now()}`,
    transactionId: txn.id,
    amount: txn.commissionAmount,
    percentage: txn.commissionPercentage,
    status:
      txn.status === TransactionStatus.COMPLETED
        ? CommissionStatus.DUE
        : CommissionStatus.PENDING,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    paidDate: "",
    createdAt: txn.createdAt,
  };
  db.commissions = [...db.commissions, commission];
  writeDb(db);
  return txn;
}

export function getDashboardStats(): DashboardStats {
  const transactions = listTransactions();
  const properties = listProperties();
  const completed = transactions.filter(
    (t) => t.status === TransactionStatus.COMPLETED
  );
  const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return {
    totalUsers: readUsers().length,
    activeProperties: properties.filter(
      (p) => p.status === PropertyStatus.PUBLISHED
    ).length,
    newProperties: properties.filter(
      (p) => new Date(p.createdAt).getTime() > monthAgo
    ).length,
    totalLeads: listLeads().length,
    visits: listVisits().length,
    offers: listOffers().length,
    completedTransactions: completed.length,
    totalRevenue: completed.reduce((sum, t) => sum + t.salePrice, 0),
    commissionRevenue: completed.reduce(
      (sum, t) => sum + t.commissionAmount,
      0
    ),
  };
}
