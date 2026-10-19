import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { ListingForm } from "@/components/admin/listing-form";

export const metadata: Metadata = {
  title: "New listing",
};

export default function NewListingPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading the form…</p>}>
      <NewListing />
    </Suspense>
  );
}

async function NewListing() {
  return (
    <AdminShell current="/admin/listings">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/admin/listings" className="inline-flex min-h-11 items-center text-sm text-pine">
          All listings
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-ink">New listing</h1>
        <ListingForm />
      </main>
    </AdminShell>
  );
}
