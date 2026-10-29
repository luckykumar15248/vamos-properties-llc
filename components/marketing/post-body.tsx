import { sanitizePostHtml } from "@/lib/blog/html";

export function PostBody({ html }: { html: string }) {
  return <div className="post-content mt-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(html) }} />;
}
