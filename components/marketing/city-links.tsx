import Link from "next/link";
import { areas } from "@/lib/content/areas";

export function CityLinks({ heading = "Cities we buy in" }: { heading?: string }) {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{heading}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted">
        The offer follows the block. Open the city closest to the house, then send the address.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <li key={area.slug}>
            <Link
              href={`/areas/${area.slug}`}
              className="flex min-h-12 items-center border border-line bg-panel px-4 font-semibold text-ink"
            >
              Sell a house in {area.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
