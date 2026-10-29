import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { MediaLibrary } from "@/components/admin/media-library";
import { listMedia } from "@/lib/dal/media";
import { isMediaKind } from "@/lib/media/files";
import { mediaStorageReady } from "@/lib/media/storage";

export const metadata: Metadata = {
  title: "Media library",
};

type MediaPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function MediaPage({ searchParams }: MediaPageProps) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading the library…</p>}>
      <Library searchParams={searchParams} />
    </Suspense>
  );
}

async function Library({ searchParams }: MediaPageProps) {
  const params = await searchParams;
  const q = one(params.q);
  const kindValue = one(params.kind);
  const kind = isMediaKind(kindValue) ? kindValue : "";
  const assets = await listMedia({ q, kind, folder: "" });

  return (
    <AdminShell current="/admin/media">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Media library</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Photos, videos, and documents for listings and pages. Copy a link and paste it where the file should appear. Files are stored in S3, not on the app server.
        </p>
        <div className="mt-8">
          <MediaLibrary assets={assets} configured={mediaStorageReady()} query={q} kind={kind} />
        </div>
      </main>
    </AdminShell>
  );
}

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
