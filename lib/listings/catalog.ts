export const propertyTypes = [
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condo" },
  { value: "manufactured", label: "Manufactured" },
  { value: "land", label: "Land" },
] as const;

export type PropertyType = (typeof propertyTypes)[number]["value"];

export const publicStatuses = [
  { value: "active", label: "Available" },
  { value: "under_contract", label: "Under contract" },
] as const;

export const listingSorts = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price, low to high" },
  { value: "price_desc", label: "Price, high to low" },
] as const;

export type ListingSort = (typeof listingSorts)[number]["value"];

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function propertyTypeLabel(value: string | null) {
  if (!value) return "";
  return propertyTypes.find((item) => item.value === value)?.label ?? value;
}

export function isPublicStatus(value: string) {
  return value === "active" || value === "under_contract";
}

export function isFreshListing(publishedAt: string | null, now: number) {
  if (!publishedAt) return false;
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  const age = now - published;
  return age >= 0 && age <= NEW_WINDOW_MS;
}

export function isListingSort(value: string): value is ListingSort {
  return listingSorts.some((item) => item.value === value);
}

export function isPropertyType(value: string): value is PropertyType {
  return propertyTypes.some((item) => item.value === value);
}
