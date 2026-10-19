import { site } from "@/lib/site";

export function ClosingBand({
  title,
  body,
  offerLabel = "Get your cash offer",
}: {
  title: string;
  body: string;
  offerLabel?: string;
}) {
  return (
    <section className="bg-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg leading-8 text-white/78">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={site.phoneTel}
            className="inline-flex min-h-12 items-center justify-center bg-amber px-6 text-base font-semibold text-amber-ink"
          >
            {site.phoneDisplay}
          </a>
          <a
            href="#offer"
            className="inline-flex min-h-12 items-center justify-center border border-white/35 px-6 text-base font-semibold text-white"
          >
            {offerLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
