import Link from "next/link";
import { formatBlogDate } from "@/lib/blog/content";
import type { PostCard as PostCardData } from "@/lib/dal/blog";

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="flex h-full flex-col border border-line bg-panel">
      {post.featuredImageUrl ? (
        <img src={post.featuredImageUrl} alt={post.featuredImageAlt || ""} className="h-48 w-full object-cover" />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        {post.categories[0] ? (
          <p className="text-sm font-semibold text-link">
            <Link href={`/blog/category/${post.categories[0].slug}`}>{post.categories[0].name}</Link>
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className="mt-3 leading-7 text-muted">{post.excerpt}</p> : null}
        {post.publishedAt ? <p className="mt-4 text-sm text-muted">{formatBlogDate(post.publishedAt)}</p> : null}
      </div>
    </article>
  );
}
