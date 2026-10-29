"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Node } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { deletePost, savePost } from "@/lib/admin/blog-actions";
import type { AdminPost, CategoryView } from "@/lib/dal/blog";
import type { MediaKind } from "@/lib/media/files";

type MediaChoice = {
  id: number;
  url: string;
  fileName: string;
  kind: MediaKind;
  alt: string | null;
};

type Picker = "image" | "video" | "document" | "featured" | "og";

const fieldClass = "mt-2 w-full border border-line bg-paper px-3 py-3 text-base text-ink";

const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: "" },
      caption: { default: "" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "figure[data-video]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          return {
            src: element.querySelector("video")?.getAttribute("src") ?? "",
            caption: element.querySelector("figcaption")?.textContent ?? "",
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const children: [string, Record<string, string>, string?][] = [
      ["video", { src: String(node.attrs.src ?? ""), controls: "true", preload: "metadata" }],
    ];
    const caption = String(node.attrs.caption ?? "");
    if (caption) children.push(["figcaption", {}, caption]);
    return ["figure", { "data-video": "" }, ...children];
  },
});

const FileEmbed = Node.create({
  name: "fileEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      href: { default: "" },
      label: { default: "Download" },
    };
  },
  parseHTML() {
    return [
      {
        tag: "p[data-file]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const link = element.querySelector("a");
          return { href: link?.getAttribute("href") ?? "", label: link?.textContent || "Download" };
        },
      },
    ];
  },
  renderHTML({ node }) {
    return ["p", { "data-file": "" }, ["a", { href: String(node.attrs.href ?? ""), download: "" }, String(node.attrs.label || "Download")]];
  },
});

function ToolButton({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center px-3 text-sm font-semibold ${pressed ? "bg-navy text-white" : "text-ink"}`}
    >
      {label}
    </button>
  );
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-panel p-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PostEditor({
  post,
  categories,
  media,
}: {
  post: AdminPost | null;
  categories: CategoryView[];
  media: MediaChoice[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featuredImageUrl ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post?.featuredImageAlt ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.ogImageUrl ?? "");
  const [categoryIds, setCategoryIds] = useState<number[]>(post?.categoryIds ?? []);
  const [tags, setTags] = useState(post?.tagNames.join(", ") ?? "");
  const [picker, setPicker] = useState<Picker | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const selection = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder: "Write the article. Use the toolbar for headings, lists, and media." }),
      Image.configure({ allowBase64: false }),
      VideoEmbed,
      FileEmbed,
    ],
    content: post?.html || "",
    editorProps: {
      attributes: { class: "px-4 py-4" },
    },
  });

  function onTitle(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80),
      );
    }
  }

  function rememberSelection() {
    if (!editor) return;
    selection.current = { from: editor.state.selection.from, to: editor.state.selection.to };
  }

  function openPicker(next: Picker) {
    rememberSelection();
    setPicker(next);
  }

  function place() {
    if (!editor) return null;
    const range = selection.current;
    const chain = range ? editor.chain().setTextSelection(range) : editor.chain();
    return chain.focus();
  }

  function chooseMedia(item: MediaChoice) {
    if (picker === "featured") {
      setFeaturedImageUrl(item.url);
      setFeaturedImageAlt(item.alt || item.fileName);
    } else if (picker === "og") {
      setOgImageUrl(item.url);
    } else if (picker === "image") {
      place()?.setImage({ src: item.url, alt: item.alt || item.fileName }).run();
    } else if (picker === "video") {
      place()?.insertContent({ type: "videoEmbed", attrs: { src: item.url, caption: "" } }).run();
    } else if (picker === "document") {
      place()?.insertContent({ type: "fileEmbed", attrs: { href: item.url, label: item.fileName } }).run();
    }
    setPicker(null);
  }

  function applyLink() {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  }

  async function onSave() {
    if (!editor) return;
    setPending(true);
    setMessage("");
    const result = await savePost({
      id: post?.id ?? null,
      title,
      slug,
      excerpt,
      status,
      html: editor.getHTML(),
      featuredImageUrl,
      featuredImageAlt,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImageUrl,
      categoryIds,
      tagNames: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage(status === "published" ? "Saved and published." : "Draft saved.");
    if (!post) router.push(`/admin/blog/${result.id}`);
    else router.refresh();
  }

  async function onDelete() {
    if (!post || pending) return;
    if (!window.confirm("Remove this post from the desk and the public site?")) return;
    setPending(true);
    const result = await deletePost(post.id);
    setPending(false);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    router.push("/admin/blog");
  }

  const roots = categories.filter((category) => category.parentId == null || !categories.some((item) => item.id === category.parentId));

  function categoryList(items: CategoryView[], depth: number) {
    if (items.length === 0) return null;
    return (
      <ul>
        {items.map((category) => (
          <li key={category.id} className={depth > 0 ? "pl-4" : undefined}>
            <label className="flex min-h-11 items-center gap-3 text-base text-ink">
              <input
                type="checkbox"
                checked={categoryIds.includes(category.id)}
                onChange={() =>
                  setCategoryIds((current) => (current.includes(category.id) ? current.filter((id) => id !== category.id) : [...current, category.id]))
                }
              />
              {category.name}
            </label>
            {categoryList(
              categories.filter((item) => item.parentId === category.id),
              depth + 1,
            )}
          </li>
        ))}
      </ul>
    );
  }

  const pickerKind: MediaKind | null = picker === "image" || picker === "featured" || picker === "og" ? "image" : picker === "video" ? "video" : picker === "document" ? "document" : null;
  const choices = pickerKind ? media.filter((item) => item.kind === pickerKind) : [];

  return (
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="border border-line bg-paper">
        <label className="sr-only" htmlFor="post-title">
          Title
        </label>
        <textarea
          id="post-title"
          value={title}
          onChange={(event) => onTitle(event.target.value)}
          placeholder="Post title"
          rows={2}
          className="w-full resize-none border-b border-line bg-transparent px-4 py-5 text-3xl font-semibold leading-tight text-ink sm:text-4xl"
        />
        <div className="border-b border-line px-4 py-3">
          <label className="block text-sm font-semibold text-muted" htmlFor="post-slug">
            Web address
          </label>
          <div className="mt-1 flex items-center gap-2 text-base text-ink">
            <span className="text-muted">/blog/</span>
            <input
              id="post-slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              className="min-h-11 w-full border border-line bg-paper px-3 text-base text-ink"
            />
          </div>
        </div>
        <div className="sticky top-0 z-10 flex flex-wrap border-b border-line bg-panel">
          <ToolButton label="H2" pressed={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolButton label="H3" pressed={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
          <ToolButton label="Bold" pressed={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
          <ToolButton label="Italic" pressed={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
          <ToolButton label="List" pressed={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
          <ToolButton label="Numbers" pressed={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
          <ToolButton label="Quote" pressed={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
          <ToolButton label="Code" pressed={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
          <ToolButton
            label="Link"
            pressed={editor?.isActive("link")}
            onClick={() => {
              setLinkUrl((editor?.getAttributes("link").href as string) || "https://");
              setLinkOpen((open) => !open);
            }}
          />
          <ToolButton label="Photo" onClick={() => openPicker("image")} />
          <ToolButton label="Video" onClick={() => openPicker("video")} />
          <ToolButton label="PDF" onClick={() => openPicker("document")} />
        </div>
        {linkOpen ? (
          <form
            className="flex flex-wrap items-center gap-2 border-b border-line bg-mist px-4 py-3"
            onSubmit={(event) => {
              event.preventDefault();
              applyLink();
            }}
          >
            <label className="sr-only" htmlFor="post-link">
              Link address
            </label>
            <input id="post-link" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} className="min-h-11 min-w-0 flex-1 border border-line bg-paper px-3 text-base text-ink" />
            <button type="submit" className="inline-flex min-h-11 items-center bg-navy px-4 text-sm font-semibold text-white">
              Apply link
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ink"
              onClick={() => {
                setLinkUrl("");
                applyLink();
              }}
            >
              Remove
            </button>
          </form>
        ) : null}
        <div className="post-editor post-content">
          {editor ? <EditorContent editor={editor} /> : <p className="px-4 py-8 text-base text-muted">Loading the editor…</p>}
        </div>
        <div className="border-t border-line px-4 py-4">
          <label className="block text-sm font-semibold text-muted" htmlFor="post-excerpt">
            Excerpt
          </label>
          <textarea id="post-excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} className={fieldClass} />
          <p className="mt-2 text-sm leading-6 text-muted">Shown on the blog index. Leave it blank and we use the opening of the article.</p>
        </div>
      </div>

      <aside className="grid gap-4 lg:sticky lg:top-4">
        <SideCard title="Publish">
          <label className="block text-sm font-semibold text-muted" htmlFor="post-status">
            Status
          </label>
          <select id="post-status" value={status} onChange={(event) => setStatus(event.target.value === "published" ? "published" : "draft")} className={fieldClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button type="button" disabled={pending || !editor} onClick={onSave} className="mt-4 inline-flex min-h-11 w-full items-center justify-center bg-navy px-4 text-base font-semibold text-white disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
          {post ? (
            <button type="button" disabled={pending} onClick={onDelete} className="mt-2 inline-flex min-h-11 w-full items-center justify-center border border-line px-4 text-base font-semibold text-ink">
              Remove post
            </button>
          ) : null}
          {message ? (
            <p className="mt-3 text-sm leading-6 text-ink" role="status">
              {message}
            </p>
          ) : null}
        </SideCard>

        <SideCard title="Featured image">
          {featuredImageUrl ? <img src={featuredImageUrl} alt={featuredImageAlt || ""} className="mb-3 w-full border border-line" /> : <p className="text-sm leading-6 text-muted">No featured image yet.</p>}
          <button type="button" onClick={() => openPicker("featured")} className="mt-3 inline-flex min-h-11 items-center border border-line px-3 text-sm font-semibold text-ink">
            Choose from library
          </button>
          {featuredImageUrl ? (
            <button type="button" onClick={() => { setFeaturedImageUrl(""); setFeaturedImageAlt(""); }} className="ml-2 inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ink">
              Clear
            </button>
          ) : null}
          <label className="mt-3 block text-sm font-semibold text-muted" htmlFor="featured-alt">
            Alt text
          </label>
          <input id="featured-alt" value={featuredImageAlt} onChange={(event) => setFeaturedImageAlt(event.target.value)} className={fieldClass} />
        </SideCard>

        <SideCard title="Categories">
          {categories.length === 0 ? (
            <p className="text-sm leading-6 text-muted">
              No categories yet. <Link href="/admin/blog/categories" className="font-semibold text-link">Add one</Link>.
            </p>
          ) : (
            categoryList(roots, 0)
          )}
        </SideCard>

        <SideCard title="Tags">
          <label className="sr-only" htmlFor="post-tags">
            Tags
          </label>
          <input id="post-tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="cash offer, Phoenix" className={fieldClass} />
          <p className="mt-2 text-sm leading-6 text-muted">Separate tags with commas.</p>
        </SideCard>

        <SideCard title="SEO">
          <label className="block text-sm font-semibold text-muted" htmlFor="meta-title">
            Meta title
          </label>
          <input id="meta-title" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} className={fieldClass} />
          <label className="mt-3 block text-sm font-semibold text-muted" htmlFor="meta-description">
            Meta description
          </label>
          <textarea id="meta-description" value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} rows={4} className={fieldClass} />
          <label className="mt-3 block text-sm font-semibold text-muted" htmlFor="canonical-url">
            Canonical
          </label>
          <input id="canonical-url" value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} placeholder="/blog/your-post" className={fieldClass} />
          <p className="mt-4 text-sm font-semibold text-muted">Social image</p>
          {ogImageUrl ? <img src={ogImageUrl} alt="" className="mt-2 w-full border border-line" /> : null}
          <button type="button" onClick={() => openPicker("og")} className="mt-3 inline-flex min-h-11 items-center border border-line px-3 text-sm font-semibold text-ink">
            Choose social image
          </button>
          {ogImageUrl ? (
            <button type="button" onClick={() => setOgImageUrl("")} className="ml-2 inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ink">
              Clear
            </button>
          ) : null}
        </SideCard>
      </aside>

      {picker ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-navy/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Media library">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto border border-line bg-paper p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-ink">Media library</h2>
              <button type="button" onClick={() => setPicker(null)} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ink">
                Close
              </button>
            </div>
            {choices.length === 0 ? (
              <p className="mt-4 text-base leading-7 text-muted">
                Nothing in the library for this yet. <Link href="/admin/media" className="font-semibold text-link">Upload it first</Link>.
              </p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {choices.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => chooseMedia(item)} className="w-full border border-line p-3 text-left">
                      {item.kind === "image" ? <img src={item.url} alt={item.alt || ""} className="mb-2 h-36 w-full object-cover" /> : null}
                      {item.kind === "video" ? <video src={item.url} className="mb-2 h-36 w-full object-cover" preload="metadata" /> : null}
                      <span className="block text-sm font-semibold text-ink">{item.fileName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
