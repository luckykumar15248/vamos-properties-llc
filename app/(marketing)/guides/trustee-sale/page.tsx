import { cacheLife } from "next/cache";
import Link from "next/link";
import { ClosingBand } from "@/components/marketing/closing-band";
import { LeadForm } from "@/components/marketing/lead-form";
import { Section } from "@/components/marketing/section";
import { site } from "@/lib/site";

export const metadata = {
  title: "After a Notice of Trustee's Sale in Arizona",
  description:
    "What the date on an Arizona trustee sale notice means, what a cash sale can and cannot fix, and when to call.",
  alternates: { canonical: "/guides/trustee-sale" },
};

export default async function TrusteeSaleGuidePage() {
  "use cache";
  cacheLife("hours");

  return (
    <>
      <Section>
        <p className="text-sm font-semibold text-link">
          <Link href="/guides">Guides</Link>
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          The notice has a date. Start there.
        </h1>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-ink">
          <p>
            A Notice of Trustee&apos;s Sale in Arizona is the clock. In most cases the sale cannot be held before the 91st day after the notice is recorded. The date printed on your paper is the one that counts. This page is a plain-language overview, not legal advice. Have an Arizona lawyer read your notice if you need advice on your own case.
          </p>
          <p>
            You can still call the servicer, a housing counselor, or that lawyer. Talking to Vamos does not cancel those options, and it does not pause the date by itself.
          </p>
        </div>
      </Section>

      <Section tone="mist">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">What to do this week.</h2>
        <ol className="mt-8 max-w-2xl space-y-6">
          <li>
            <h3 className="text-xl font-semibold text-ink">Find the sale date and the recording date</h3>
            <p className="mt-2 leading-7 text-muted">
              They are not the same day. The recording date starts the count. The sale date is the deadline you can see. Put both on the form if you have them.
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-ink">Pull a mortgage statement</h3>
            <p className="mt-2 leading-7 text-muted">
              We need a real balance, not a guess from memory. A second mortgage or an HOA balance changes whether a{" "}
              <Link href="/cash-offer" className="font-semibold text-link">cash offer</Link> can clear the debt.
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-ink">List everyone who must sign</h3>
            <p className="mt-2 leading-7 text-muted">
              A spouse, an heir, or a co-owner who has moved out can still be required at title. Finding them late is how a date gets missed.
            </p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-ink">Ask whether the date is even workable</h3>
            <p className="mt-2 leading-7 text-muted">
              Title has to open a file and order a payoff. Some sales can still be beaten. Some cannot.{" "}
              <Link href="/stop-foreclosure" className="font-semibold text-link">The foreclosure page</Link> is the short version. The phone is faster if the date is close:{" "}
              <a href={site.phoneTel} className="font-semibold text-link">{site.phoneDisplay}</a>.
            </p>
          </li>
        </ol>
      </Section>

      <Section>
        <h2 className="max-w-2xl text-3xl font-semibold text-ink sm:text-4xl">What a sale before the auction does not do.</h2>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-ink">
          <p>
            Paying the loan off at closing can keep the trustee sale itself from happening. It does not erase the months you were already behind. We do not repair credit.
          </p>
          <p>
            If the cash price will not cover the payoff, say so when we ask.{" "}
            <Link href="/take-over-payments" className="font-semibold text-link">Taking over the payments</Link> can be discussed, and your name can stay on the loan. That is not a quieter way of saying the foreclosure is over.
          </p>
          <p>
            The house can be in <Link href="/areas/phoenix" className="font-semibold text-link">Phoenix</Link>,{" "}
            <Link href="/areas/mesa" className="font-semibold text-link">Mesa</Link>,{" "}
            <Link href="/areas/surprise" className="font-semibold text-link">Surprise</Link>, or anywhere else in Maricopa County. The county timeline does not add days because the house is farther from downtown.
          </p>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div>
            <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Send the date with the address.</h2>
            <p className="mt-4 leading-7 text-muted">
              If you want the Spanish explanation, it lives at{" "}
              <Link href="/es/ejecucion-hipotecaria" className="font-semibold text-link">ejecución hipotecaria</Link>.
            </p>
          </div>
          <LeadForm sourcePath="/guides/trustee-sale" language="en" />
        </div>
      </Section>

      <ClosingBand
        title="Do not wait until the week of the sale."
        body="If the date is close, call. A form at 7:00 p.m. still gets a morning reply, and some dates cannot spare a morning."
      />
    </>
  );
}
