import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

export const ADMIN_COOKIE = "vamos_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

type SessionPayload = {
  uid: number;
  exp: number;
};

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) return null;
  return value;
}

function sign(body: string, key: string) {
  return createHmac("sha256", key).update(body).digest("base64url");
}

function signaturesMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sealSession(userId: number) {
  const key = secret();
  if (!key) return null;
  const body = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE_SECONDS * 1000 } satisfies SessionPayload),
  ).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export function openSession(token: string | undefined) {
  const key = secret();
  if (!key || !token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!signaturesMatch(signature, sign(body, key))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload || typeof payload.uid !== "number" || !Number.isInteger(payload.uid) || payload.uid < 1) {
      return null;
    }
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return { uid: payload.uid };
  } catch {
    return null;
  }
}

export async function readSession() {
  await connection();
  const jar = await cookies();
  return openSession(jar.get(ADMIN_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
