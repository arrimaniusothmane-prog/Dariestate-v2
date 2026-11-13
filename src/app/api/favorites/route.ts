import { NextResponse } from "next/server";
import { ApiError, requireUser } from "../../../server/auth";
import { getFavorites, toggleFavorite } from "../../../server/marketplace";

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(getFavorites(user.id));
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
    const body = await request.json();
    const propertyId =
      typeof body?.propertyId === "string" ? body.propertyId : "";
    if (!propertyId) {
      return NextResponse.json(
        { error: "Identifiant du bien requis." },
        { status: 400 }
      );
    }
    const favorites = toggleFavorite(user.id, propertyId);
    return NextResponse.json(favorites);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
