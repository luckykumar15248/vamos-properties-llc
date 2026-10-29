import "server-only";

import { getDb } from "@/src/prisma/db";
import { requireAdmin } from "@/lib/admin/auth";
import { isMediaKind, type MediaKind } from "@/lib/media/files";

export type MediaAssetView = {
  id: number;
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  kind: MediaKind;
  sizeBytes: number;
  folder: string | null;
  alt: string | null;
  createdAt: string;
};

export type MediaQuery = {
  q: string;
  kind: MediaKind | "";
  folder: string;
};

function toView(row: {
  id: number;
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  kind: string;
  sizeBytes: number;
  folder: string | null;
  alt: string | null;
  createdAt: Date | string;
}): MediaAssetView | null {
  if (!isMediaKind(row.kind)) return null;
  return {
    id: row.id,
    key: row.key,
    url: row.url,
    fileName: row.fileName,
    contentType: row.contentType,
    kind: row.kind,
    sizeBytes: row.sizeBytes,
    folder: row.folder,
    alt: row.alt,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

export async function listMedia(query: MediaQuery) {
  await requireAdmin();
  const db = getDb();
  const rows = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  const needle = query.q.trim().toLowerCase();
  return rows
    .map((row) => toView(row))
    .filter((asset): asset is MediaAssetView => asset !== null)
    .filter((asset) => (query.kind ? asset.kind === query.kind : true))
    .filter((asset) => (query.folder ? asset.folder === query.folder : true))
    .filter((asset) => {
      if (!needle) return true;
      return asset.fileName.toLowerCase().includes(needle) || (asset.folder ?? "").toLowerCase().includes(needle);
    })
    .slice(0, 300);
}

export async function findMediaByKey(key: string) {
  const db = getDb();
  const row = await db.mediaAsset.findFirst({ where: { key } });
  if (!row) return null;
  return toView(row);
}

export async function createMediaAsset(input: {
  key: string;
  url: string;
  fileName: string;
  contentType: string;
  kind: MediaKind;
  sizeBytes: number;
  folder: string | null;
  createdById: number;
}) {
  await requireAdmin();
  const db = getDb();
  const created = await db.mediaAsset.create({
    data: {
      key: input.key,
      url: input.url,
      fileName: input.fileName,
      contentType: input.contentType,
      kind: input.kind,
      sizeBytes: input.sizeBytes,
      folder: input.folder,
      alt: input.fileName,
      createdById: input.createdById,
    },
  });
  return toView(created);
}

export async function getMedia(id: number) {
  await requireAdmin();
  const db = getDb();
  const current = await db.mediaAsset.findFirst({ where: { id } });
  if (!current) return null;
  return toView(current);
}

export async function deleteMediaRecord(id: number) {
  await requireAdmin();
  const db = getDb();
  await db.mediaAsset.delete({ where: { id } });
}
