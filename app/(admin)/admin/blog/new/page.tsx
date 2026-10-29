import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogDeskNav } from "@/components/admin/blog-nav";
import { PostEditor } from "@/components/admin/post-editor";
import { listCategories } from "@/lib/dal/blog";
import { listMedia } from "@/lib/dal/media";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading the editor…</p>}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  const [categories, media] = await Promise.all([listCategories(), listMedia({ q: "", kind: "", folder: "" })]);
  return (
    <AdminShell current="/admin/blog">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">New post</h1>
        <BlogDeskNav current="posts" />
        <PostEditor
          post={null}
          categories={categories}
          media={media.map((item) => ({ id: item.id, url: item.url, fileName: item.fileName, kind: item.kind, alt: item.alt }))}
        />
      </main>
    </AdminShell>
  );
}
