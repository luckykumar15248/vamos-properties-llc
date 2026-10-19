export function formatMoney(dollars: number | null | undefined) {
  if (dollars == null) return "";
  const sign = dollars < 0 ? "-" : "";
  const digits = Math.abs(dollars).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${grouped}`;
}

export function parseDollars(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\$?\d{1,3}(,\d{3})*$|^\$?\d+$/.test(trimmed)) return null;
  const amount = Number(trimmed.replace(/[$,]/g, ""));
  if (!Number.isInteger(amount) || amount < 1 || amount > 100_000_000) return null;
  return amount;
}

export function dropAmount(previous: number | null, current: number | null) {
  if (previous == null || current == null || previous <= current) return null;
  return previous - current;
}
