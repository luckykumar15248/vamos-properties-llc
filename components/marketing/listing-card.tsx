import Link from "next/link";
import { formatWhen } from "@/lib/admin/clock";
import { propertyTypeLabel } from "@/lib/listings/catalog";
import { formatMoney } from "@/lib/listings/money";
import type { ListingView } from "@/lib/dal/listings";

export function ListingCard({ listing }: { listing: ListingView }) {
  const photo = listing.photos[0];
  const specs = [
    listing.beds != null ? `${listing.beds} bd` : "",
    listing.baths ? `${listing.baths} ba` : "",
    listing.sqft != null ? `${listing.sqft.toLocaleString("en-US")} sqft` : "",
  ].filter(Boolean);

  return (
    <article className="flex h-full flex-col border border-line bg-panel">
      <Link href={`/listings/${listing.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] bg-mist">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <p className="grid h-full place-items-center px-4 text-center text-sm text-muted">Photo coming</p>
          )}
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
            {listing.isNew ? <Badge tone="navy">New</Badge> : null}
            {listing.drop ? <Badge tone="amber">Price dropped</Badge> : null}
            {listing.featured ? <Badge tone="navy">Featured</Badge> : null}
            {listing.status === "under_contract" ? <Badge tone="navy">Under contract</Badge> : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-4 py-4">
          <p className="text-sm text-muted">
            {[listing.city, propertyTypeLabel(listing.propertyType)].filter(Boolean).join(" · ")}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink">{listing.address}</h2>
          <p className="mt-3 text-2xl font-semibold text-ink">{listing.listPrice != null ? formatMoney(listing.listPrice) : "Call for price"}</p>
          {listing.drop && listing.previousPrice != null ? (
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">{formatMoney(listing.previousPrice)}</span>
              {` · Down ${formatMoney(listing.drop)}`}
              {listing.priceChangedAt ? ` · ${formatWhen(listing.priceChangedAt)}` : ""}
            </p>
          ) : null}
          {specs.length > 0 ? <p className="mt-3 text-sm text-ink">{specs.join(" · ")}</p> : null}
        </div>
      </Link>
    </article>
  );
}

function Badge({ children, tone }: { children: string; tone: "navy" | "amber" }) {
  const className = tone === "amber" ? "bg-amber text-amber-ink" : "bg-navy text-white";
  return <span className={`inline-flex min-h-7 items-center px-2 text-xs font-semibold ${className}`}>{children}</span>;
}
