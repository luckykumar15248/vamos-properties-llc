import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogDeskNav } from "@/components/admin/blog-nav";
import { CategoryManager } from "@/components/admin/category-manager";
import { listCategories, listTags } from "@/lib/dal/blog";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-base text-muted">Loading categories…</p>}>
      <Categories />
    </Suspense>
  );
}

async function Categories() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);
  return (
    <AdminShell current="/admin/blog">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Categories and tags</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          A category can sit inside another. Tags stay flat and get attached on the post.
        </p>
        <BlogDeskNav current="categories" />
        <CategoryManager categories={categories} tags={tags} />
      </main>
    </AdminShell>
  );
}
