import Link from "next/link";

const links = [
  { href: "/admin/blog", id: "posts", label: "Posts" },
  { href: "/admin/blog/categories", id: "categories", label: "Categories and tags" },
  { href: "/admin/blog/comments", id: "comments", label: "Comments" },
] as const;

export function BlogDeskNav({ current }: { current: (typeof links)[number]["id"] }) {
  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Blog desk">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          aria-current={current === link.id ? "page" : undefined}
          className={`inline-flex min-h-11 items-center px-3 text-sm font-semibold ${current === link.id ? "bg-navy text-white" : "border border-line text-ink"}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
