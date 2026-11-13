import { NextResponse } from "next/server";
import { authenticate, withSession, ApiError } from "../../../../server/auth";
import { toPublicUser } from "../../../../server/db";
import { rateLimit } from "../../../../server/rate-limit";

function clientKey(request: Request, email: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `login:${ip}:${email.trim().toLowerCase()}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const limited = rateLimit(clientKey(request, email), {
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      {
        error:
          "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  try {
    const user = await authenticate(email, password);
    return withSession(NextResponse.json(toPublicUser(user)), user.id);
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}