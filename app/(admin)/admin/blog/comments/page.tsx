import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogDeskNav } from "@/components/admin/blog-nav";
import { CommentDesk } from "@/components/admin/comment-desk";
import { listAdminComments } from "@/lib/dal/blog";

export const metadata: Metadata = { title: "Comments" };

type CommentsProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function CommentsPage({ searchParams }: CommentsProps) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading comments…</p>}>
      <Comments searchParams={searchParams} />
    </Suspense>
  );
}

async function Comments({ searchParams }: CommentsProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.status) ? params.status[0] : params.status;
  const status = raw === "pending" || raw === "approved" || raw === "flagged" ? raw : "";
  const comments = await listAdminComments(status);
  const filters = [
    { href: "/admin/blog/comments", id: "", label: "All" },
    { href: "/admin/blog/comments?status=pending", id: "pending", label: "Waiting" },
    { href: "/admin/blog/comments?status=approved", id: "approved", label: "Approved" },
    { href: "/admin/blog/comments?status=flagged", id: "flagged", label: "Flagged" },
  ];

  return (
    <AdminShell current="/admin/blog">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Comments</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">New comments wait here until you approve them. A reply publishes right away under that comment.</p>
        <BlogDeskNav current="comments" />
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Comment status">
          {filters.map((filter) => (
            <Link
              key={filter.id || "all"}
              href={filter.href}
              aria-current={status === filter.id ? "page" : undefined}
              className={`inline-flex min-h-11 items-center px-3 text-sm font-semibold ${status === filter.id ? "bg-navy text-white" : "border border-line text-ink"}`}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
        <CommentDesk comments={comments} />
      </main>
    </AdminShell>
  );
}
