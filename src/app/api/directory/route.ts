import { NextResponse } from "next/server";
import { ApiError, requireUser } from "../../../server/auth";
import { readUsers, toPublicUser } from "../../../server/db";

/** Public directory for logged-in users (no passwords). */
export async function GET() {
  try {
    await requireUser();
    return NextResponse.json(readUsers().map(toPublicUser));
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
