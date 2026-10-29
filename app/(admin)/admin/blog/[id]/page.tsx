import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogDeskNav } from "@/components/admin/blog-nav";
import { PostEditor } from "@/components/admin/post-editor";
import { getAdminPost, listCategories } from "@/lib/dal/blog";
import { listMedia } from "@/lib/dal/media";

export const metadata: Metadata = { title: "Edit post" };

type EditParams = { params: Promise<{ id: string }> };

export default function EditPostPage({ params }: EditParams) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading the post…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: EditParams) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();
  const [post, categories, media] = await Promise.all([
    getAdminPost(postId),
    listCategories(),
    listMedia({ q: "", kind: "", folder: "" }),
  ]);
  if (!post) notFound();

  return (
    <AdminShell current="/admin/blog">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Edit post</h1>
        {post.status === "published" ? (
          <p className="mt-3 text-base text-muted">
            Public link: <Link href={`/blog/${post.slug}`} className="font-semibold text-link">{`/blog/${post.slug}`}</Link>
          </p>
        ) : (
          <p className="mt-3 text-base text-muted">This draft is not on the public site.</p>
        )}
        <BlogDeskNav current="posts" />
        <PostEditor
          post={post}
          categories={categories}
          media={media.map((item) => ({ id: item.id, url: item.url, fileName: item.fileName, kind: item.kind, alt: item.alt }))}
        />
      </main>
    </AdminShell>
  );
}
