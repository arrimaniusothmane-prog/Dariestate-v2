import { NextResponse } from "next/server";

/** Password reset by email is not available yet — never return credentials. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "La réinitialisation automatique n'est pas disponible. Contactez le support via /contact.",
    },
    { status: 410 }
  );
}
