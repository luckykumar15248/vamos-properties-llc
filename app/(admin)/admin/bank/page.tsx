import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatPhone, formatWhen, phoneHref } from "@/lib/admin/clock";
import { statusLabel } from "@/lib/admin/pipeline";
import { searchBank } from "@/lib/dal/admin";
import { leadSituations } from "@/lib/site";

export const metadata: Metadata = {
  title: "Data bank",
};

type BankProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default function BankPage({ searchParams }: BankProps) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading the data bank…</p>}>
      <Bank searchParams={searchParams} />
    </Suspense>
  );
}

async function Bank({ searchParams }: BankProps) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q) ?? "";
  const { leads } = await searchBank(query);
  const contacts = new Map<string, { name: string; phone: string; email: string | null; count: number }>();
  for (const lead of leads) {
    const current = contacts.get(lead.phone);
    if (current) {
      current.count += 1;
      if (!current.email && lead.email) current.email = lead.email;
    } else {
      contacts.set(lead.phone, { name: lead.name, phone: lead.phone, email: lead.email, count: 1 });
    }
  }

  return (
    <AdminShell current="/admin/bank">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Data bank</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Every seller who has written in. Search an address, name, phone, or email before a mailer or a second call.
        </p>
        <form className="mt-6 flex flex-wrap gap-3" action="/admin/bank">
          <label className="sr-only" htmlFor="q">
            Search the data bank
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Address, name, or phone"
            className="min-h-12 min-w-0 flex-1 border border-line bg-panel px-3 text-base text-ink"
          />
          <button type="submit" className="inline-flex min-h-12 items-center bg-navy px-4 text-base font-semibold text-white">
            Search
          </button>
        </form>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-ink">Submissions</h2>
            {leads.length === 0 ? (
              <p className="mt-3 text-base text-muted">Nothing matches that search.</p>
            ) : (
              <ul className="mt-3 grid gap-3">
                {leads.map((lead) => (
                  <li key={lead.id} className="border border-line bg-panel px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-base font-semibold text-ink">
                      {lead.address}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {lead.name} · {statusLabel(lead.status)} · {optionLabel(leadSituations, lead.situation)} · {formatWhen(lead.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Contacts</h2>
            <ul className="mt-3 grid gap-3">
              {[...contacts.values()].map((contact) => (
                <li key={contact.phone} className="border border-line bg-panel px-4 py-3">
                  <p className="text-base font-semibold text-ink">{contact.name}</p>
                  <p className="mt-1 text-sm text-ink">
                    <a href={phoneHref(contact.phone)} className="text-pine">
                      {formatPhone(contact.phone)}
                    </a>
                    {contact.email ? ` · ${contact.email}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-muted">{contact.count} submission{contact.count === 1 ? "" : "s"}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

function optionLabel(list: readonly { value: string; label: string }[], value: string) {
  return list.find((item) => item.value === value)?.label ?? value;
}
