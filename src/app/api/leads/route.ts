import { NextResponse } from "next/server";
import { ApiError, getSessionUser, requireUser } from "../../../server/auth";
import {
  createLead,
  createOffer,
  createVisit,
  listLeads,
  listOffers,
  listVisits,
  sendCounterOffer,
  updateLeadStatus,
  updateOfferStatus,
} from "../../../server/marketplace";
import { LeadStatus, OfferStatus, UserRole } from "../../../types";

export async function GET(request: Request) {
  try {
    await requireUser();
    const url = new URL(request.url);
    const kind = url.searchParams.get("kind") ?? "leads";

    if (kind === "visits") return NextResponse.json(listVisits());
    if (kind === "offers") return NextResponse.json(listOffers());
    return NextResponse.json(listLeads());
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
    const body = await request.json();
    const kind = body?.kind as string | undefined;
    const session = await getSessionUser();

    if (kind === "visit") {
      const lead = createLead({
        propertyId: body.propertyId,
        buyerId: body.buyerId || session?.id || "guest",
        sellerId: body.sellerId,
        status: body.status ?? LeadStatus.VISIT_REQUESTED,
        message: body.message ?? "",
        name: body.name ?? "",
        phone: body.phone ?? "",
        email: body.email ?? "",
      });
      const visit = createVisit({
        propertyId: body.propertyId,
        leadId: lead.id,
        date: body.date,
        time: body.time,
        numberOfVisitors: Number(body.numberOfVisitors) || 1,
        phone: body.phone ?? "",
        message: body.message ?? "",
        status: body.status ?? LeadStatus.VISIT_REQUESTED,
      });
      return NextResponse.json({ lead, visit }, { status: 201 });
    }

    if (kind === "offer") {
      const offer = createOffer({
        propertyId: body.propertyId,
        buyerId: body.buyerId || session?.id || "guest",
        price: Number(body.price),
        message: body.message ?? "",
        preferredContact: body.preferredContact ?? "Email",
        status: body.status ?? OfferStatus.PENDING,
      });
      const lead = createLead({
        propertyId: body.propertyId,
        buyerId: body.buyerId || session?.id || "guest",
        sellerId: body.sellerId,
        status: LeadStatus.OFFER_MADE,
        message: body.message ?? "",
        name: body.name ?? "",
        phone: body.phone ?? "",
        email: body.email ?? "",
      });
      return NextResponse.json({ offer, lead }, { status: 201 });
    }

    const lead = createLead({
      propertyId: body.propertyId,
      buyerId: body.buyerId || session?.id || "guest",
      sellerId: body.sellerId,
      status: body.status ?? LeadStatus.NEW,
      message: body.message ?? "",
      name: body.name ?? "",
      phone: body.phone ?? "",
      email: body.email ?? "",
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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
    const { id, kind, status, counterPrice, counterMessage } = body ?? {};

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Identifiant requis." }, { status: 400 });
    }

    if (kind === "offer") {
      if (status === OfferStatus.COUNTER_OFFER || body?.action === "counter") {
        const updated = sendCounterOffer(id, {
          price: counterPrice,
          message: counterMessage,
        });
        if (!updated) {
          return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
        }
        return NextResponse.json(updated);
      }
      if (!Object.values(OfferStatus).includes(status)) {
        return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
      }
      const updated = updateOfferStatus(id, status);
      if (!updated) {
        return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    if (!Object.values(LeadStatus).includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }
    const updated = updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Lead introuvable." }, { status: 404 });
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
