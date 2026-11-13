import { NextResponse } from "next/server";
import { ApiError, requireUser } from "../../../server/auth";
import {
  createProperty,
  filterProperties,
  listProperties,
} from "../../../server/properties";
import {
  PropertyCategory,
  PropertyStatus,
  UserRole,
} from "../../../types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");
    const hasFilters =
      url.searchParams.has("search") ||
      url.searchParams.has("city") ||
      url.searchParams.has("minPrice") ||
      url.searchParams.has("maxPrice") ||
      url.searchParams.has("bedrooms") ||
      url.searchParams.has("sortBy") ||
      url.searchParams.has("status") ||
      category;

    if (slug) {
      const { getPropertyBySlug } = await import("../../../server/properties");
      const property = getPropertyBySlug(slug);
      if (!property) {
        return NextResponse.json({ error: "Bien introuvable." }, { status: 404 });
      }
      return NextResponse.json(property);
    }

    if (featured === "1") {
      const { getFeaturedProperties } = await import("../../../server/properties");
      return NextResponse.json(getFeaturedProperties());
    }

    if (hasFilters) {
      const num = (key: string) => {
        const v = url.searchParams.get(key);
        if (v == null || v === "") return undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
      };
      const bool = (key: string) => {
        const v = url.searchParams.get(key);
        if (v == null) return undefined;
        return v === "1" || v === "true";
      };

      const cat = category as PropertyCategory | null;
      const status = url.searchParams.get("status") as PropertyStatus | null;

      return NextResponse.json(
        filterProperties({
          search: url.searchParams.get("search") ?? "",
          category:
            cat && Object.values(PropertyCategory).includes(cat)
              ? cat
              : undefined,
          city: url.searchParams.get("city") ?? undefined,
          minPrice: num("minPrice"),
          maxPrice: num("maxPrice"),
          minSurface: num("minSurface"),
          maxSurface: num("maxSurface"),
          bedrooms: num("bedrooms"),
          bathrooms: num("bathrooms"),
          isFurnished: bool("isFurnished"),
          hasParking: bool("hasParking"),
          hasPool: bool("hasPool"),
          hasGarden: bool("hasGarden"),
          hasTerrace: bool("hasTerrace"),
          isNewConstruction: bool("isNewConstruction"),
          isVerified: bool("isVerified"),
          status:
            status && Object.values(PropertyStatus).includes(status)
              ? status
              : undefined,
          sortBy: url.searchParams.get("sortBy") ?? undefined,
        })
      );
    }

    return NextResponse.json(listProperties());
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
      throw new ApiError("Réservé aux vendeurs.", 403);
    }

    const body = await request.json();
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Titre requis." }, { status: 400 });
    }

    const property = createProperty({
      ...body,
      sellerId: body.sellerId || user.id,
      views: body.views ?? 0,
      favoriteCount: body.favoriteCount ?? 0,
      status: body.status ?? PropertyStatus.PUBLISHED,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError)
      return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
