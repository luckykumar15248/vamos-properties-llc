import "server-only";

import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { mediaRule } from "@/lib/media/files";

type Storage = {
  bucket: string;
  region: string;
  client: S3Client;
};

let storage: Storage | null | undefined;

function readStorage(): Storage | null {
  if (storage !== undefined) return storage;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_BUCKET_NAME;
  if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    storage = null;
    return null;
  }
  storage = {
    bucket,
    region,
    client: new S3Client({ region, credentials: { accessKeyId, secretAccessKey } }),
  };
  return storage;
}

export function mediaStorageReady() {
  return readStorage() !== null;
}

export function publicMediaUrl(key: string) {
  const base = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  const bucket = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) return "";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function newMediaKey(contentType: string) {
  const rule = mediaRule(contentType);
  if (!rule) return null;
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `media/${year}/${month}/${randomUUID()}.${rule.extension}`;
}

export async function signMediaUpload(key: string, contentType: string, sizeBytes: number) {
  const current = readStorage();
  if (!current) return null;
  const command = new PutObjectCommand({
    Bucket: current.bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: sizeBytes,
  });
  const uploadUrl = await getSignedUrl(current.client, command, { expiresIn: 600 });
  return { uploadUrl, publicUrl: publicMediaUrl(key) };
}

export async function inspectMediaObject(key: string) {
  const current = readStorage();
  if (!current) return null;
  try {
    const head = await current.client.send(new HeadObjectCommand({ Bucket: current.bucket, Key: key }));
    return {
      sizeBytes: head.ContentLength ?? 0,
      contentType: (head.ContentType ?? "").split(";")[0].trim(),
    };
  } catch {
    return null;
  }
}

export async function removeMediaObject(key: string) {
  const current = readStorage();
  if (!current) return false;
  await current.client.send(new DeleteObjectCommand({ Bucket: current.bucket, Key: key }));
  return true;
}
