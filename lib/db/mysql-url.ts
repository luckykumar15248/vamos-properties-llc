import "server-only";

/**
 * Shape DATABASE_URL for Vercel serverless → EC2 MySQL.
 * Never log the returned string. It contains the password.
 *
 * Each serverless instance opens its own Prisma pool. Keep connection_limit
 * at 1 so a traffic spike cannot exhaust EC2 max_connections.
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

export function isMysqlDatabaseUrl(raw = process.env.DATABASE_URL) {
  const url = raw?.trim() ?? "";
  return url.startsWith("mysql://") || url.startsWith("mysqls://");
}

export function runtimeDatabaseUrl(raw: string | undefined) {
  const url = raw?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!url.startsWith("mysql://") && !url.startsWith("mysqls://")) {
    throw new Error("DATABASE_URL must be a mysql:// connection string.");
  }

  const params: string[] = [];
  for (const [key, value] of Object.entries(POOL_DEFAULTS)) {
    if (!hasParam(url, key)) params.push(`${key}=${value}`);
  }

  const sslMode = (process.env.MYSQL_SSL_MODE ?? "").trim().toLowerCase();
  const sslAlready = hasParam(url, "sslaccept") || hasParam(url, "ssl") || hasParam(url, "sslcert");
  if (!sslAlready && sslMode && sslMode !== "off") {
    params.push(sslMode === "strict" ? "sslaccept=strict" : "sslaccept=accept_invalid_certs");
  }

  return appendParams(url, params);
}
