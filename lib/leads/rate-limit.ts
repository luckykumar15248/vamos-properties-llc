const hits = new Map<string, { count: number; reset: number }>();

export function allowLead(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || current.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
