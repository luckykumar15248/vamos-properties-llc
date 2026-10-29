"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { createMediaAsset, deleteMediaRecord, findMediaByKey, getMedia } from "@/lib/dal/media";
import { isMediaKey, mediaRule } from "@/lib/media/files";
import { inspectMediaObject, mediaStorageReady, newMediaKey, publicMediaUrl, removeMediaObject, signMediaUpload } from "@/lib/media/storage";

const folderSchema = z
  .string()
  .trim()
  .max(40)
  .regex(/^[a-z0-9][a-z0-9 -]*$/i, "Use letters, numbers, and spaces for the folder.")
  .or(z.literal(""));

const prepareSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  contentType: z.string().trim(),
  sizeBytes: z.number().int().positive(),
  folder: folderSchema,
});

const saveSchema = prepareSchema.extend({
  key: z.string().trim(),
});

function refreshMedia() {
  revalidatePath("/admin/media");
}

export async function prepareMediaUpload(input: z.input<typeof prepareSchema>) {
  await requireAdmin();
  if (!mediaStorageReady()) {
    return { ok: false as const, message: "Media storage is not configured yet." };
  }
  const parsed = prepareSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Check the file and try again." };
  }
  const rule = mediaRule(parsed.data.contentType);
  if (!rule) {
    return { ok: false as const, message: "Use a JPEG, PNG, WebP, MP4, MOV, or PDF. HEIC files are converted first." };
  }
  if (parsed.data.sizeBytes > rule.maxBytes) {
    return { ok: false as const, message: "That file is larger than this library accepts." };
  }
  const key = newMediaKey(parsed.data.contentType);
  if (!key || !isMediaKey(key)) {
    return { ok: false as const, message: "That file type cannot be stored." };
  }
  const signed = await signMediaUpload(key, parsed.data.contentType, parsed.data.sizeBytes);
  if (!signed) {
    return { ok: false as const, message: "Media storage is not configured yet." };
  }
  return {
    ok: true as const,
    key,
    uploadUrl: signed.uploadUrl,
    publicUrl: signed.publicUrl,
    contentType: parsed.data.contentType,
    fileName: parsed.data.fileName,
    folder: parsed.data.folder,
  };
}

export async function saveMediaUpload(input: z.input<typeof saveSchema>) {
  const actor = await requireAdmin();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success || !isMediaKey(parsed.data.key)) {
    return { ok: false as const, message: "That upload could not be saved." };
  }
  const existing = await findMediaByKey(parsed.data.key);
  if (existing) {
    refreshMedia();
    return { ok: true as const, message: "Already in the library.", asset: existing };
  }
  const stored = await inspectMediaObject(parsed.data.key);
  const rule = mediaRule(parsed.data.contentType);
  if (!stored || !rule || stored.contentType !== parsed.data.contentType || stored.sizeBytes !== parsed.data.sizeBytes) {
    return { ok: false as const, message: "That upload did not arrive in storage. Try it again." };
  }
  const asset = await createMediaAsset({
    key: parsed.data.key,
    url: publicMediaUrl(parsed.data.key),
    fileName: parsed.data.fileName,
    contentType: parsed.data.contentType,
    kind: rule.kind,
    sizeBytes: stored.sizeBytes,
    folder: parsed.data.folder || null,
    createdById: actor.id,
  });
  if (!asset) return { ok: false as const, message: "That upload could not be saved." };
  refreshMedia();
  return { ok: true as const, message: "Saved to the library.", asset };
}

export async function removeMedia(id: number) {
  await requireAdmin();
  if (!Number.isInteger(id) || id < 1) {
    return { ok: false as const, message: "That file is not in the library." };
  }
  const existing = await getMedia(id);
  if (!existing) return { ok: false as const, message: "That file is not in the library." };
  if (mediaStorageReady()) {
    try {
      await removeMediaObject(existing.key);
    } catch {
      return { ok: false as const, message: "Storage did not remove that file. It is still in the library." };
    }
  }
  await deleteMediaRecord(id);
  refreshMedia();
  return { ok: true as const, message: "Removed from the library." };
}
