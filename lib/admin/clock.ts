const PHOENIX = "America/Phoenix";

export type ReplyMark =
  | { kind: "filed" }
  | { kind: "after_hours" }
  | { kind: "on_time"; minutes: number }
  | { kind: "due"; minutesLeft: number }
  | { kind: "waiting"; minutes: number }
  | { kind: "late"; minutes: number };

export function minutesSince(iso: string, now = Date.now()) {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return 0;
  return Math.max(0, Math.round((now - created) / 60_000));
}

export function phoenixHour(iso: string) {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: PHOENIX,
    hour: "numeric",
    hourCycle: "h23",
  }).format(new Date(iso));
  const value = Number(hour);
  return Number.isNaN(value) ? 0 : value;
}

export function phoenixToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PHOENIX,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function daysUntilSale(saleDate: string | null, now = new Date()) {
  if (!saleDate || !/^\d{4}-\d{2}-\d{2}$/.test(saleDate)) return null;
  const start = Date.parse(`${phoenixToday(now)}T00:00:00Z`);
  const sale = Date.parse(`${saleDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(sale)) return null;
  return Math.round((sale - start) / 86_400_000);
}

export function saleIsUrgent(days: number | null) {
  return days !== null && days <= 21;
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PHOENIX,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatSaleDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function saleHint(days: number | null) {
  if (days === null) return null;
  if (days === 0) return "Sale today";
  if (days === 1) return "Sale tomorrow";
  if (days > 1) return `Sale in ${days} days`;
  const ago = Math.abs(days);
  return ago === 1 ? "Sale was yesterday" : `Sale was ${ago} days ago`;
}

export function replyMark(
  createdAt: string,
  status: string,
  events: { type: string; author: string; createdAt: string }[],
  now = Date.now(),
): ReplyMark {
  if (status === "closed" || status === "lost") return { kind: "filed" };
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return { kind: "after_hours" };
  const hour = phoenixHour(createdAt);
  if (hour < 8 || hour >= 19) return { kind: "after_hours" };

  const firstHuman = events
    .filter((event) => (event.type === "note" || event.type === "status") && event.author !== "system")
    .map((event) => new Date(event.createdAt).getTime())
    .filter((time) => !Number.isNaN(time))
    .sort((a, b) => a - b)[0];

  if (firstHuman !== undefined) {
    const minutes = Math.max(0, Math.round((firstHuman - created) / 60_000));
    return minutes <= 5 ? { kind: "on_time", minutes } : { kind: "late", minutes };
  }

  const elapsed = Math.max(0, Math.round((now - created) / 60_000));
  if (elapsed < 5) return { kind: "due", minutesLeft: Math.max(1, 5 - elapsed) };
  return { kind: "waiting", minutes: elapsed };
}

export function replyLabel(mark: ReplyMark) {
  switch (mark.kind) {
    case "filed":
      return "Filed";
    case "after_hours":
      return "After hours";
    case "on_time":
      return mark.minutes === 0 ? "Replied within a minute" : `Replied in ${mark.minutes} min`;
    case "due":
      return `Reply due · ${mark.minutesLeft} min left`;
    case "waiting":
      return `No note yet · ${mark.minutes} min`;
    case "late":
      return `First note at ${mark.minutes} min`;
  }
}

export function formatPhone(digits: string) {
  const raw = digits.replace(/\D/g, "");
  const local = raw.length === 11 && raw.startsWith("1") ? raw.slice(1) : raw;
  if (local.length !== 10) return digits;
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

export function phoneHref(digits: string) {
  const raw = digits.replace(/\D/g, "");
  if (raw.length === 10) return `tel:+1${raw}`;
  if (raw.length === 11 && raw.startsWith("1")) return `tel:+${raw}`;
  return `tel:${raw}`;
}

export function languageLabel(value: string) {
  if (value === "es") return "Spanish";
  if (value === "en") return "English";
  return value;
}
