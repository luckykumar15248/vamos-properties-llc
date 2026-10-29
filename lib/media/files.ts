export const mediaKinds = ["image", "video", "document"] as const;

export type MediaKind = (typeof mediaKinds)[number];

const limits: Record<string, { extension: string; kind: MediaKind; maxBytes: number }> = {
  "image/jpeg": { extension: "jpg", kind: "image", maxBytes: 25 * 1024 * 1024 },
  "image/png": { extension: "png", kind: "image", maxBytes: 25 * 1024 * 1024 },
  "image/webp": { extension: "webp", kind: "image", maxBytes: 25 * 1024 * 1024 },
  "video/mp4": { extension: "mp4", kind: "video", maxBytes: 250 * 1024 * 1024 },
  "video/quicktime": { extension: "mov", kind: "video", maxBytes: 250 * 1024 * 1024 },
  "application/pdf": { extension: "pdf", kind: "document", maxBytes: 25 * 1024 * 1024 },
};

export function mediaRule(contentType: string) {
  return limits[contentType] ?? null;
}

export function isHeic(fileName: string, contentType: string) {
  return /image\/hei[cf]/i.test(contentType) || /\.(heic|heif)$/i.test(fileName);
}

export function isMediaKind(value: string): value is MediaKind {
  return mediaKinds.includes(value as MediaKind);
}

const keyPattern = /^media\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|mp4|mov|pdf)$/;

export function isMediaKey(key: string) {
  return keyPattern.test(key);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
