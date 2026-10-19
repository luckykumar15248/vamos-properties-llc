import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 32;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export const dummyPasswordHash = hashPassword("placeholder-password-value");

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, "base64url");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
