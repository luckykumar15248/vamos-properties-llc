import "server-only";

/**
 * Shape DATABASE_URL for Vercel serverless → PostgreSQL.
 * Never log the returned string. It contains the password.
 *
 * Each serverless instance opens its own Prisma pool. Keep connection_limit
 * at 1 so a traffic spike cannot exhaust the remote pooler (PgBouncer / Neon).
 */

const POOL_DEFAULTS: Record<string, string> = {
  connection_limit: "1",
  pool_timeout: "10",
  connect_timeout: "10",
};

function hasParam(url: string, key: string) {
  return new RegExp(`[?&]${key}=`, "i").test(url);
}

function appendParams(url: string, params: string[]) {
  if (params.length === 0) return url;
  return url + (url.includes("?") ? "&" : "?") + params.join("&");
}

export function runtimeDatabaseUrl(raw: string | undefined) {
  const url = raw?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!url.startsWith("postgres://") && !url.startsWith("postgresql://")) {
    throw new Error("DATABASE_URL must be a postgres:// connection string.");
  }

  const params: string[] = [];
  for (const [key, value] of Object.entries(POOL_DEFAULTS)) {
    if (!hasParam(url, key)) params.push(`${key}=${value}`);
  }

  return appendParams(url, params);
}
