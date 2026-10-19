import { propertyTypes, publicStatuses, listingSorts, type ListingSort } from "@/lib/listings/catalog";

export function ListingFilters({
  city,
  cities,
  propertyType,
  status,
  min,
  max,
  sort,
}: {
  city: string;
  cities: string[];
  propertyType: string;
  status: string;
  min: string;
  max: string;
  sort: ListingSort;
}) {
  return (
    <form action="/listings" className="grid gap-3 border border-line bg-panel p-4 sm:grid-cols-2 lg:grid-cols-6">
      <label className="block text-sm text-ink">
        City
        <select name="city" defaultValue={city} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
          <option value="">All cities</option>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink">
        Type
        <select name="type" defaultValue={propertyType} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
          <option value="">Any type</option>
          {propertyTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink">
        Status
        <select name="status" defaultValue={status} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
          <option value="">Available and pending</option>
          {publicStatuses.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink">
        Min price
        <input name="min" inputMode="numeric" defaultValue={min} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink" />
      </label>
      <label className="block text-sm text-ink">
        Max price
        <input name="max" inputMode="numeric" defaultValue={max} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink" />
      </label>
      <label className="block text-sm text-ink">
        Sort
        <select name="sort" defaultValue={sort} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
          {listingSorts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <div className="sm:col-span-2 lg:col-span-6">
        <button type="submit" className="inline-flex min-h-12 items-center bg-navy px-4 text-base font-semibold text-white">
          Show homes
        </button>
      </div>
    </form>
  );
}
