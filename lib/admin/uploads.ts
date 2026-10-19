import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 4 * 1024 * 1024;

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function storeListingPhotos(files: File[]) {
  const saved: string[] = [];
  const incoming = files.filter((file) => file.size > 0);
  if (incoming.length === 0) return saved;

  const dir = path.join(process.cwd(), "public", "listing-photos");
  await mkdir(dir, { recursive: true });

  for (const file of incoming) {
    const extension = extensions[file.type];
    if (!extension || file.size > MAX_BYTES) {
      throw new Error("listing_photo");
    }
    const name = `${randomUUID()}.${extension}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    saved.push(`/listing-photos/${name}`);
  }
  return saved;
}
