import { NextResponse } from "next/server";
import { ApiError, requireUser } from "../../../../server/auth";
import {
  deleteProperty,
  getPropertyById,
  markAsSold,
  togglePauseProperty,
  updateProperty,
} from "../../../../server/properties";
import { UserRole } from "../../../../types";

type Params = { params: Promise<{ id: string }> };

async function assertCanEdit(id: string) {
  const user = await requireUser();
  const property = getPropertyById(id);
  if (!property) throw new ApiError("Bien introuvable.", 404);
  const isOwner = property.sellerId === user.id;
  const isAdmin = user.role === UserRole.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ApiError("Vous ne pouvez pas modifier ce bien.", 403);
  }
  return { user, property };
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const property = getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await assertCanEdit(id);
    const body = await request.json();

    if (body?.action === "togglePause") {
      const updated = togglePauseProperty(id);
      return NextResponse.json(updated);
    }
    if (body?.action === "markSold") {
      const updated = markAsSold(id);
      return NextResponse.json(updated);
    }

    const updated = updateProperty(id, body ?? {});
    if (!updated) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await assertCanEdit(id);
    const ok = deleteProperty(id);
    if (!ok) {
      return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
