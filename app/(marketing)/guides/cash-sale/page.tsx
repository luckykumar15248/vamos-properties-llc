import { cacheLife } from "next/cache";
import Link from "next/link";
import { ClosingBand } from "@/components/marketing/closing-band";
import { LeadForm } from "@/components/marketing/lead-form";
import { Section } from "@/components/marketing/section";
import { site } from "@/lib/site";

export const metadata = {
  title: "How a cash sale works in Phoenix",
  description:
    "The steps from a first call with Vamos to a Maricopa County title company, and what a cash price leaves out.",
  alternates: { canonical: "/guides/cash-sale" },
};

export default async function CashSaleGuidePage() {
  "use cache";
  cacheLife("hours");

  return (
    <>
      <Section>
        <p className="text-sm font-semibold text-link">
          <Link href="/guides">Guides</Link>
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          How a cash sale actually works.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          People picture a wire the same afternoon. What you should picture is a phone call, a walkthrough, a number you can refuse, and a title company if you say yes.
        </p>
      </Section>

      <Section tone="mist">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">The order of things.</h2>
        <div className="mt-8 max-w-2xl space-y-8 text-lg leading-8 text-ink">
          <div>
            <h3 className="text-xl font-semibold">You tell us the address</h3>
            <p className="mt-2 text-muted">
              Use the form or call <a href={site.phoneTel} className="font-semibold text-link">{site.phoneDisplay}</a>. If a notice is on the counter, include the sale date. If someone else is on the title, say their name. Those two facts save more time than a dozen photos.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">We ask what a listing would hide</h3>
            <p className="mt-2 text-muted">
              What you owe. What the house needs. Whether anyone lives there. Whether an HOA, a city notice, or a second loan is in the drawer.{" "}
              <Link href="/cash-offer" className="font-semibold text-link">A cash offer</Link> is built from those answers, not from a slogan.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">You see a number, then you choose</h3>
            <p className="mt-2 text-muted">
              The number is usually below a retail list price. You are trading that gap for no repairs, no showings, and no agent commission taken from your side. If the gap is too wide, decline it. Asking did not lock you in.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">A title company closes, if you accept</h3>
            <p className="mt-2 text-muted">
              Title checks who can sign, orders the payoff, and prepares the settlement statement. You should read that statement. A clean file often takes a couple of weeks. Probate, a missing spouse, or a lien can take longer. We will not invent a Friday close to make the first call feel better.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="max-w-2xl text-3xl font-semibold text-ink sm:text-4xl">What this sale does, and what it does not.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-line p-5">
            <h3 className="text-lg font-semibold text-ink">It can</h3>
            <p className="mt-2 leading-7 text-muted">
              Pay the mortgage off at closing, take your name off that loan, and let you leave repairs and leftover belongings behind. If the sale date is the problem, start with{" "}
              <Link href="/stop-foreclosure" className="font-semibold text-link">the foreclosure page</Link>.
            </p>
          </div>
          <div className="border border-line p-5">
            <h3 className="text-lg font-semibold text-ink">It cannot</h3>
            <p className="mt-2 leading-7 text-muted">
              Erase missed payments already on your credit, skip a signature title requires, or pay off a loan that is larger than the cash price. When that last one is true, we talk about{" "}
              <Link href="/take-over-payments" className="font-semibold text-link">taking over the payments</Link> instead of pretending the equity is there.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div>
            <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Bring the address when the page has done its job.</h2>
            <p className="mt-4 leading-7 text-muted">
              If the reason is a divorce, an estate, or a job loss, the{" "}
              <Link href="/guides/life-events" className="font-semibold text-link">life-events guide</Link> covers who has to sign. City pages, starting with{" "}
              <Link href="/areas/phoenix" className="font-semibold text-link">Phoenix</Link>,{" "}
              <Link href="/areas/mesa" className="font-semibold text-link">Mesa</Link>, and{" "}
              <Link href="/areas/glendale" className="font-semibold text-link">Glendale</Link>, are where the house itself differs.
            </p>
          </div>
          <LeadForm sourcePath="/guides/cash-sale" language="en" />
        </div>
      </Section>

      <ClosingBand
        title="A cash offer is a number, not a trap."
        body="Call or send the address. You can still keep the house."
      />
    </>
  );
}
