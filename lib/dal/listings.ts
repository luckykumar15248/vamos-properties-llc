import "server-only";

import { getDb } from "@/src/prisma/db";
import { requireAdmin } from "@/lib/admin/auth";
import type { ListingStatus } from "@/lib/admin/pipeline";
import { isFreshListing, isPropertyType, isPublicStatus, type ListingSort, type PropertyType } from "@/lib/listings/catalog";
import { dropAmount, formatMoney } from "@/lib/listings/money";

export type ListingInput = {
  title: string;
  address: string;
  city: string;
  beds: number | null;
  baths: string;
  sqft: number | null;
  propertyType: PropertyType | "";
  listPrice: number | null;
  monthlyPayment: number | null;
  terms: string;
  status: ListingStatus;
  featured: boolean;
  summary: string;
  description: string;
  features: string;
  neighborhood: string;
  schools: string;
  yearBuilt: number | null;
  photos: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  localTags: string;
};

export type PricePoint = {
  id: number;
  amount: number;
  previousAmount: number | null;
  recordedAt: string;
};

export type ListingView = {
  id: number;
  title: string;
  slug: string;
  address: string;
  city: string | null;
  beds: number | null;
  baths: string | null;
  sqft: number | null;
  propertyType: string | null;
  price: string | null;
  listPrice: number | null;
  previousPrice: number | null;
  priceChangedAt: string | null;
  drop: number | null;
  monthlyPayment: number | null;
  terms: string | null;
  status: string;
  featured: boolean;
  summary: string | null;
  description: string | null;
  features: string[];
  neighborhood: string | null;
  schools: string | null;
  yearBuilt: number | null;
  photos: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  localTags: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  prices: PricePoint[];
  isNew: boolean;
};

type ListingRow = {
  id: number;
  title: string;
  slug: string;
  address: string;
  city: string | null;
  beds: number | null;
  baths: string | null;
  sqft: number | null;
  propertyType: string | null;
  price: string | null;
  listPrice: number | null;
  previousPrice: number | null;
  priceChangedAt: string | null;
  monthlyPayment: number | null;
  terms: string | null;
  status: string;
  featured: boolean;
  summary: string | null;
  description: string | null;
  features: string | null;
  neighborhood: string | null;
  schools: string | null;
  yearBuilt: number | null;
  photos: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  localTags: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return base || "home";
}

export function photoList(value: string | null) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function lineList(value: string | null) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toView(row: ListingRow, prices: PricePoint[], now: number): ListingView {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    address: row.address,
    city: row.city,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    propertyType: row.propertyType,
    price: row.listPrice != null ? formatMoney(row.listPrice) : row.price,
    listPrice: row.listPrice,
    previousPrice: row.previousPrice,
    priceChangedAt: row.priceChangedAt ? String(row.priceChangedAt) : null,
    drop: dropAmount(row.previousPrice, row.listPrice),
    monthlyPayment: row.monthlyPayment,
    terms: row.terms,
    status: row.status,
    featured: row.featured,
    summary: row.summary,
    description: row.description,
    features: lineList(row.features),
    neighborhood: row.neighborhood,
    schools: row.schools,
    yearBuilt: row.yearBuilt,
    photos: photoList(row.photos),
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    keywords: row.keywords,
    localTags: row.localTags,
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
    prices,
    isNew: isFreshListing(row.publishedAt ? String(row.publishedAt) : null, now),
  };
}

function asRow(row: ListingRow): ListingRow {
  return {
    ...row,
    priceChangedAt: row.priceChangedAt ? String(row.priceChangedAt) : null,
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    createdAt: String(row.createdAt),
    updatedAt: String(row.updatedAt),
  };
}

async function uniqueSlug(title: string, address: string, city: string, currentId?: number) {
  const db = getDb();
  const base = slugify(`${address} ${city || title}`);
  const taken = await db.orm.public.Listing.where({ slug: base }).select("id").first();
  if (!taken || taken.id === currentId) return base;
  return `${base}-${currentId ?? Date.now().toString(36)}`;
}

async function pricesFor(listingId: number): Promise<PricePoint[]> {
  const db = getDb();
  const rows = await db.orm.public.ListingPrice.where({ listingId })
    .orderBy((price) => price.recordedAt.desc())
    .all();
  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    previousAmount: row.previousAmount,
    recordedAt: String(row.recordedAt),
  }));
}

export async function listListings() {
  await requireAdmin();
  const db = getDb();
  const now = Date.now();
  const rows = await db.orm.public.Listing.orderBy((listing) => listing.updatedAt.desc()).all();
  return rows.map((row) => toView(asRow(row), [], now));
}

export async function getListing(id: number) {
  await requireAdmin();
  const db = getDb();
  const row = await db.orm.public.Listing.where({ id }).first();
  if (!row) return null;
  const prices = await pricesFor(id);
  return toView(asRow(row), prices, Date.now());
}

function listingData(
  input: ListingInput,
  publishedAt: string | null,
  previousPrice: number | null,
  priceChangedAt: string | null,
) {
  return {
    title: input.title,
    address: input.address,
    city: input.city || null,
    beds: input.beds,
    baths: input.baths || null,
    sqft: input.sqft,
    propertyType: input.propertyType || null,
    price: input.listPrice != null ? formatMoney(input.listPrice) : null,
    listPrice: input.listPrice,
    previousPrice,
    priceChangedAt,
    monthlyPayment: input.monthlyPayment,
    terms: input.terms || null,
    status: input.status,
    featured: input.featured,
    summary: input.summary || null,
    description: input.description || null,
    features: input.features || null,
    neighborhood: input.neighborhood || null,
    schools: input.schools || null,
    yearBuilt: input.yearBuilt,
    photos: input.photos || null,
    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
    keywords: input.keywords || null,
    localTags: input.localTags || null,
    publishedAt,
  };
}

export async function saveListing(id: number | null, input: ListingInput) {
  await requireAdmin();
  const db = getDb();
  const nowIso = new Date().toISOString();

  return db.transaction(async (tx) => {
    if (id) {
      const current = await tx.orm.public.Listing.where({ id })
        .select("id", "slug", "listPrice", "previousPrice", "priceChangedAt", "publishedAt")
        .first();
      if (!current) return { ok: false as const, message: "That listing is not in the inventory." };

      const priceChanged = input.listPrice != null && input.listPrice !== current.listPrice;
      const publishedAt = current.publishedAt
        ? String(current.publishedAt)
        : isPublicStatus(input.status)
          ? nowIso
          : null;

      await tx.orm.public.Listing.where({ id }).update(
        listingData(
          input,
          publishedAt,
          priceChanged ? current.listPrice : current.previousPrice,
          priceChanged ? nowIso : current.priceChangedAt ? String(current.priceChangedAt) : null,
        ),
      );

      if (priceChanged && input.listPrice != null) {
        await tx.orm.public.ListingPrice.create({
          listingId: id,
          amount: input.listPrice,
          previousAmount: current.listPrice,
        });
      }
      return { ok: true as const, id, slug: current.slug, message: priceChanged ? "Price updated." : "Listing saved." };
    }

    const slug = await uniqueSlug(input.title, input.address, input.city);
    const created = await tx.orm.public.Listing.create({
      ...listingData(input, isPublicStatus(input.status) ? nowIso : null, null, null),
      slug,
    });
    if (input.listPrice != null) {
      await tx.orm.public.ListingPrice.create({
        listingId: created.id,
        amount: input.listPrice,
        previousAmount: null,
      });
    }
    return { ok: true as const, id: created.id, slug, message: "Listing saved." };
  });
}

export type PublicQuery = {
  city: string;
  propertyType: string;
  status: string;
  min: number | null;
  max: number | null;
  sort: ListingSort;
};

export async function listPublicListings(query: PublicQuery, now: number) {
  const db = getDb();
  const rows = await db.orm.public.Listing.orderBy((listing) => listing.updatedAt.desc()).all();
  const listings = rows
    .map((row) => toView(asRow(row), [], now))
    .filter((listing) => isPublicStatus(listing.status))
    .filter((listing) => (query.status && isPublicStatus(query.status) ? listing.status === query.status : true))
    .filter((listing) => (query.city ? listing.city?.toLowerCase() === query.city.toLowerCase() : true))
    .filter((listing) => (query.propertyType && isPropertyType(query.propertyType) ? listing.propertyType === query.propertyType : true))
    .filter((listing) => (query.min != null ? listing.listPrice != null && listing.listPrice >= query.min : true))
    .filter((listing) => (query.max != null ? listing.listPrice != null && listing.listPrice <= query.max : true))
    .sort((left, right) => {
      if (left.featured !== right.featured) return left.featured ? -1 : 1;
      if (query.sort === "price_asc") return (left.listPrice ?? Number.MAX_SAFE_INTEGER) - (right.listPrice ?? Number.MAX_SAFE_INTEGER);
      if (query.sort === "price_desc") return (right.listPrice ?? 0) - (left.listPrice ?? 0);
      return right.publishedAt?.localeCompare(left.publishedAt ?? "") ?? 0;
    });

  const cities = [...new Set(rows.filter((row) => isPublicStatus(row.status) && row.city).map((row) => row.city as string))].sort((a, b) =>
    a.localeCompare(b),
  );
  return { listings, cities };
}

export async function getPublicListing(slug: string, now: number) {
  const db = getDb();
  const row = await db.orm.public.Listing.where({ slug }).first();
  if (!row || !isPublicStatus(row.status)) return null;
  const prices = await pricesFor(row.id);
  return toView(asRow(row), prices, now);
}

export async function listPublicSlugs() {
  const db = getDb();
  const rows = await db.orm.public.Listing.select("slug", "updatedAt", "status").all();
  return rows
    .filter((row) => isPublicStatus(row.status))
    .map((row) => ({ slug: row.slug, updatedAt: String(row.updatedAt) }));
}
