import "server-only";

import { getDb } from "@/src/prisma/db";
import { requireAdmin } from "@/lib/admin/auth";
import { editorHtml, excerptFromHtml } from "@/lib/blog/content";
import { sanitizePostHtml } from "@/lib/blog/html";

export type TermRef = { id: number; slug: string; name: string };

export type PublicComment = {
  id: number;
  parentId: number | null;
  authorName: string;
  body: string;
  createdAt: string;
  isStaff: boolean;
};

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  categories: TermRef[];
  tags: TermRef[];
};

export type PublicPost = PostCard & {
  html: string;
  authorName: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  comments: PublicComment[];
};

export type AdminPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  status: "draft" | "published";
  featuredImageUrl: string;
  featuredImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImageUrl: string;
  categoryIds: number[];
  tagNames: string[];
  publishedAt: string | null;
  updatedAt: string;
};

export type CategoryView = {
  id: number;
  slug: string;
  name: string;
  description: string;
  parentId: number | null;
};

export type TagView = { id: number; slug: string; name: string };

export type AdminComment = {
  id: number;
  postId: number;
  postTitle: string;
  postSlug: string;
  parentId: number | null;
  authorName: string;
  authorEmail: string;
  body: string;
  status: string;
  isStaff: boolean;
  createdAt: string;
};

type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  status: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImageUrl: string | null;
  publishedAt: Date | string | null;
  authorId: number | null;
  updatedAt: Date | string;
};

function toIso(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  return d instanceof Date ? d.toISOString() : d;
}

async function graph() {
  const db = getDb();
  const [posts, categories, tags, postCategories, postTags, users] = await Promise.all([
    db.post.findMany({ orderBy: { updatedAt: "desc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
    db.postCategory.findMany(),
    db.postTag.findMany(),
    db.user.findMany({ select: { id: true, name: true } }),
  ]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const tagById = new Map(tags.map((tag) => [tag.id, tag]));
  const names = new Map(users.map((user) => [user.id, user.name]));
  return { posts, categories, tags, postCategories, postTags, categoryById, tagById, names };
}

function termsFor(
  postId: number,
  links: { postId: number; categoryId?: number; tagId?: number }[],
  lookup: Map<number, { id: number; slug: string; name: string }>,
  field: "categoryId" | "tagId",
) {
  const refs: TermRef[] = [];
  for (const link of links) {
    const id = link[field];
    if (link.postId !== postId || id == null) continue;
    const term = lookup.get(id);
    if (term) refs.push({ id: term.id, slug: term.slug, name: term.name });
  }
  return refs;
}

function card(
  post: PostRow,
  categories: TermRef[],
  tags: TermRef[],
): PostCard {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt?.trim() || excerptFromHtml(editorHtml(post.body)),
    featuredImageUrl: post.featuredImageUrl,
    featuredImageAlt: post.featuredImageAlt,
    publishedAt: toIso(post.publishedAt),
    updatedAt: toIso(post.updatedAt) ?? "",
    categories,
    tags,
  };
}

export async function listPublishedPosts() {
  const data = await graph();
  return data.posts
    .filter((post) => post.status === "published")
    .map((post) =>
      card(
        post,
        termsFor(post.id, data.postCategories, data.categoryById, "categoryId"),
        termsFor(post.id, data.postTags, data.tagById, "tagId"),
      ),
    )
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 60);
}

export async function getPublicPost(slug: string): Promise<PublicPost | null> {
  const db = getDb();
  const post = await db.post.findFirst({ where: { slug } });
  if (!post || post.status !== "published") return null;
  const data = await graph();
  const current = data.posts.find((item) => item.id === post.id) ?? post;
  const comments = await db.comment.findMany({
    where: { postId: post.id, status: "approved" },
    orderBy: { createdAt: "asc" },
  });
  const summary = card(
    current,
    termsFor(post.id, data.postCategories, data.categoryById, "categoryId"),
    termsFor(post.id, data.postTags, data.tagById, "tagId"),
  );
  return {
    ...summary,
    html: sanitizePostHtml(current.body),
    authorName: current.authorId ? data.names.get(current.authorId) ?? "Vamos Properties" : "Vamos Properties",
    metaTitle: current.metaTitle?.trim() || current.title,
    metaDescription: current.metaDescription?.trim() || summary.excerpt,
    canonicalUrl: current.canonicalUrl,
    ogImageUrl: current.ogImageUrl || current.featuredImageUrl,
    comments: comments.map((comment) => ({
      id: comment.id,
      parentId: comment.parentId,
      authorName: comment.authorName,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      isStaff: comment.isStaff,
    })),
  };
}

export async function getCategoryArchive(slug: string) {
  const data = await graph();
  const category = data.categories.find((item) => item.slug === slug);
  if (!category) return null;
  const posts = (await listPublishedPosts()).filter((post) => post.categories.some((item) => item.slug === slug));
  const children = data.categories
    .filter((item) => item.parentId === category.id)
    .map((item) => ({ slug: item.slug, name: item.name }));
  return {
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    children,
    posts,
  };
}

export async function getTagArchive(slug: string) {
  const data = await graph();
  const tag = data.tags.find((item) => item.slug === slug);
  if (!tag) return null;
  const posts = (await listPublishedPosts()).filter((post) => post.tags.some((item) => item.slug === slug));
  return { slug: tag.slug, name: tag.name, posts };
}

export async function blogSitemapEntries() {
  const posts = await listPublishedPosts();
  const categories = new Map<string, string>();
  const tags = new Map<string, string>();
  for (const post of posts) {
    for (const category of post.categories) {
      const current = categories.get(category.slug);
      if (!current || current < post.updatedAt) categories.set(category.slug, post.updatedAt);
    }
    for (const tag of post.tags) {
      const current = tags.get(tag.slug);
      if (!current || current < post.updatedAt) tags.set(tag.slug, post.updatedAt);
    }
  }
  return {
    posts: posts.map((post) => ({ path: `/blog/${post.slug}`, updatedAt: post.updatedAt })),
    categories: [...categories.entries()].map(([slug, updatedAt]) => ({ path: `/blog/category/${slug}`, updatedAt })),
    tags: [...tags.entries()].map(([slug, updatedAt]) => ({ path: `/blog/tag/${slug}`, updatedAt })),
  };
}

export async function listAdminPosts() {
  await requireAdmin();
  const data = await graph();
  return data.posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    status: post.status === "published" ? "published" : "draft",
    updatedAt: toIso(post.updatedAt) ?? "",
    categories: termsFor(post.id, data.postCategories, data.categoryById, "categoryId").map((item) => item.name),
  }));
}

export async function getAdminPost(id: number): Promise<AdminPost | null> {
  await requireAdmin();
  const data = await graph();
  const post = data.posts.find((item) => item.id === id);
  if (!post) return null;
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    html: sanitizePostHtml(post.body),
    status: post.status === "published" ? "published" : "draft",
    featuredImageUrl: post.featuredImageUrl ?? "",
    featuredImageAlt: post.featuredImageAlt ?? "",
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    canonicalUrl: post.canonicalUrl ?? "",
    ogImageUrl: post.ogImageUrl ?? "",
    categoryIds: termsFor(post.id, data.postCategories, data.categoryById, "categoryId").map((item) => item.id),
    tagNames: termsFor(post.id, data.postTags, data.tagById, "tagId").map((item) => item.name),
    publishedAt: toIso(post.publishedAt),
    updatedAt: toIso(post.updatedAt) ?? "",
  };
}

export async function listCategories() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    parentId: row.parentId,
  })) satisfies CategoryView[];
}

export async function listTags() {
  await requireAdmin();
  const db = getDb();
  const rows = await db.tag.findMany({ orderBy: { name: "asc" } });
  return rows.map((row) => ({ id: row.id, slug: row.slug, name: row.name })) satisfies TagView[];
}

export async function listAdminComments(status: string) {
  await requireAdmin();
  const db = getDb();
  const [comments, posts] = await Promise.all([
    db.comment.findMany({ orderBy: { createdAt: "desc" } }),
    db.post.findMany({ select: { id: true, title: true, slug: true } }),
  ]);
  const postById = new Map(posts.map((post) => [post.id, post]));
  return comments
    .filter((comment) => (status ? comment.status === status : true))
    .slice(0, 200)
    .map((comment) => {
      const post = postById.get(comment.postId);
      return {
        id: comment.id,
        postId: comment.postId,
        postTitle: post?.title ?? "Removed post",
        postSlug: post?.slug ?? "",
        parentId: comment.parentId,
        authorName: comment.authorName,
        authorEmail: comment.authorEmail ?? "",
        body: comment.body,
        status: comment.status,
        isStaff: comment.isStaff,
        createdAt: comment.createdAt.toISOString(),
      } satisfies AdminComment;
    });
}
