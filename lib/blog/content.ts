import { z } from "zod";

const publicUrl = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Use a full image or file link.");

export const postBlocks = z
  .array(
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("paragraph"), text: z.string().trim().min(1).max(4000) }),
      z.object({ type: z.literal("heading"), text: z.string().trim().min(1).max(180) }),
      z.object({ type: z.literal("quote"), text: z.string().trim().min(1).max(1000) }),
      z.object({
        type: z.literal("list"),
        items: z.array(z.string().trim().min(1).max(300)).min(1).max(20),
      }),
      z.object({
        type: z.literal("image"),
        url: publicUrl,
        alt: z.string().trim().max(180),
        caption: z.string().trim().max(240),
      }),
      z.object({
        type: z.literal("gallery"),
        images: z
          .array(z.object({ url: publicUrl, alt: z.string().trim().max(180) }))
          .min(1)
          .max(12),
      }),
      z.object({
        type: z.literal("video"),
        url: publicUrl,
        caption: z.string().trim().max(240),
      }),
      z.object({
        type: z.literal("file"),
        url: publicUrl,
        label: z.string().trim().min(1).max(160),
      }),
    ]),
  )
  .max(40);

export type PostBlock = z.infer<typeof postBlocks>[number];

export function parseBlocks(raw: string): PostBlock[] {
  try {
    const parsed = postBlocks.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "post";
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function blocksToHtml(blocks: PostBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
      if (block.type === "heading") return `<h2>${escapeHtml(block.text)}</h2>`;
      if (block.type === "quote") return `<blockquote><p>${escapeHtml(block.text)}</p></blockquote>`;
      if (block.type === "list") return `<ul>${block.items.map((item) => `<li><p>${escapeHtml(item)}</p></li>`).join("")}</ul>`;
      if (block.type === "image") {
        const caption = block.caption ? `<p>${escapeHtml(block.caption)}</p>` : "";
        return `<img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt)}" />${caption}`;
      }
      if (block.type === "gallery") {
        return block.images.map((image) => `<img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" />`).join("");
      }
      if (block.type === "video") {
        const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : "";
        return `<figure data-video=""><video src="${escapeHtml(block.url)}" controls="true" preload="metadata"></video>${caption}</figure>`;
      }
      return `<p data-file=""><a href="${escapeHtml(block.url)}" download="">${escapeHtml(block.label)}</a></p>`;
    })
    .join("");
}

export function editorHtml(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) return blocksToHtml(parseBlocks(trimmed));
  return raw;
}

export function plainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptFromHtml(html: string) {
  return plainText(html).slice(0, 180);
}

export function formatBlogDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Phoenix",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function readingMinutes(html: string) {
  const words = plainText(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
