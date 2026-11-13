import { NextResponse } from "next/server";
import { ApiError, requireUser } from "../../../server/auth";
import {
  createTransaction,
  getDashboardStats,
  listCommissions,
  listTransactions,
} from "../../../server/transactions";
import { UserRole } from "../../../types";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") ?? "transactions";

    if (kind === "stats") {
      if (user.role !== UserRole.ADMIN) {
        throw new ApiError("Accès refusé.", 403);
      }
      return NextResponse.json(getDashboardStats());
    }

    if (kind === "commissions") {
      return NextResponse.json(listCommissions());
    }

    return NextResponse.json(listTransactions());
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (
      user.role !== UserRole.SELLER &&
      user.role !== UserRole.AGENT &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ApiError("Accès refusé.", 403);
    }
    const body = await request.json();
    const txn = createTransaction({
      propertyId: body.propertyId,
      sellerId: body.sellerId || user.id,
      buyerId: body.buyerId,
      salePrice: Number(body.salePrice),
      commissionPercentage: Number(body.commissionPercentage) || 2,
      commissionAmount: Number(body.commissionAmount),
      status: body.status,
    });
    return NextResponse.json(txn, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
