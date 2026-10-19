import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { ListingCard } from "@/components/marketing/listing-card";
import { ListingFilters } from "@/components/marketing/listing-filters";
import { ListingSkeleton } from "@/components/marketing/listing-skeleton";
import { Section } from "@/components/marketing/section";
import { listPublicListings } from "@/lib/dal/listings";
import { isListingSort, isPropertyType, isPublicStatus } from "@/lib/listings/catalog";
import { parseDollars } from "@/lib/listings/money";

export const metadata: Metadata = {
  title: "Homes for sale",
  description: "Homes Vamos can show you in Maricopa County. Call before you drive over.",
};

type ListingsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ListingsPage({ searchParams }: ListingsProps) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Listings searchParams={searchParams} />
    </Suspense>
  );
}

async function Listings({ searchParams }: ListingsProps) {
  await connection();
  const params = await searchParams;
  const city = one(params.city);
  const propertyType = one(params.type);
  const status = one(params.status);
  const sortValue = one(params.sort);
  const sort = isListingSort(sortValue) ? sortValue : "newest";
  const { listings, cities } = await listPublicListings(
    {
      city,
      propertyType: isPropertyType(propertyType) ? propertyType : "",
      status: isPublicStatus(status) ? status : "",
      min: parseDollars(one(params.min)),
      max: parseDollars(one(params.max)),
      sort,
    },
    Date.now(),
  );

  return (
    <Section>
      <h1 className="text-4xl font-semibold text-ink">Homes for sale</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        These are houses Vamos has under contract or can offer in the Valley. Call before you drive over. Selling your own house starts on the contact page.
      </p>
      <div className="mt-8">
        <ListingFilters
          city={city}
          cities={cities}
          propertyType={isPropertyType(propertyType) ? propertyType : ""}
          status={isPublicStatus(status) ? status : ""}
          min={one(params.min)}
          max={one(params.max)}
          sort={sort}
        />
      </div>
      {listings.length === 0 ? (
        <p className="mt-8 border border-line bg-panel px-4 py-6 text-base text-ink">
          {city || propertyType || status || params.min || params.max
            ? "Nothing matches that search right now."
            : "No homes are listed right now. Call if you want to hear about the next one."}
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}
