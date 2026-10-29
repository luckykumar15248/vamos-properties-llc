import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogDeskNav } from "@/components/admin/blog-nav";
import { formatBlogDate } from "@/lib/blog/content";
import { listAdminPosts } from "@/lib/dal/blog";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading posts…</p>}>
      <Posts />
    </Suspense>
  );
}

async function Posts() {
  const posts = await listAdminPosts();
  return (
    <AdminShell current="/admin/blog">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-ink">Blog</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Drafts stay off the public site. Published posts show at /blog.</p>
          </div>
          <Link href="/admin/blog/new" className="inline-flex min-h-12 items-center bg-amber px-4 text-base font-semibold text-amber-ink">
            New post
          </Link>
        </div>
        <BlogDeskNav current="posts" />
        {posts.length === 0 ? (
          <p className="mt-8 border border-line bg-panel px-4 py-6 text-base text-ink">No posts yet.</p>
        ) : (
          <ul className="mt-8 grid gap-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/admin/blog/${post.id}`} className="block border border-line bg-panel px-4 py-4">
                  <p className="text-lg font-semibold text-ink">{post.title}</p>
                  <p className="mt-2 text-sm text-muted">
                    {post.status === "published" ? "Published" : "Draft"}
                    {` · ${formatBlogDate(post.updatedAt)}`}
                    {post.categories.length ? ` · ${post.categories.join(", ")}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AdminShell>
  );
}
