"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { site, spanishForeclosurePath } from "@/lib/site";

const englishLinks = [
  { href: "/listings", label: "See available homes" },
  { href: "/stop-foreclosure", label: "Stop a foreclosure" },
  { href: "/take-over-payments", label: "Take over payments" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
];

const spanishLinks = [
  { href: spanishForeclosurePath, label: "Ejecución hipotecaria" },
  { href: "/stop-foreclosure", label: "Ver en inglés" },
];

export function SiteHeader({ spanish }: { spanish: boolean }) {
  const links = spanish ? spanishLinks : englishLinks;

  return (
    <header className="bg-navy text-white">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-panel focus:px-3 focus:py-2">
        {spanish ? "Saltar al contenido" : "Skip to content"}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href={spanish ? spanishForeclosurePath : "/"} className="inline-flex h-11 shrink-0 items-center gap-2">
          <Image
            src="/brand/vamos-bull.webp"
            alt=""
            width={336}
            height={168}
            sizes="72px"
            priority
            className="h-9 w-[4.5rem] object-contain"
          />
          <span className="flex flex-col justify-center leading-none">
            <span className="text-[0.95rem] font-semibold tracking-[0.16em] text-amber">VAMOS</span>
            <span className="mt-1 text-[0.58rem] font-medium tracking-[0.2em] text-white/70">PROPERTIES LLC</span>
          </span>
        </Link>
        <nav className="hidden items-center justify-end gap-x-4 lg:flex" aria-label={spanish ? "Principal" : "Primary"}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap text-sm text-white/85 hover:text-white">
              {link.label}
            </Link>
          ))}
          <a href={site.phoneTel} className="inline-flex min-h-11 items-center whitespace-nowrap bg-amber px-4 text-sm font-semibold text-amber-ink">
            {site.phoneDisplay}
          </a>
          <ThemeToggle spanish={spanish} />
        </nav>
        <div className="flex items-center lg:hidden">
          <ThemeToggle spanish={spanish} />
          <details className="relative">
            <summary className="min-h-11 cursor-pointer list-none px-3 py-3 text-sm text-white [&::-webkit-details-marker]:hidden">
              {spanish ? "Menú" : "Menu"}
            </summary>
            <nav className="absolute right-0 z-30 w-56 bg-navy-soft p-3" aria-label={spanish ? "Móvil" : "Mobile"}>
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="block min-h-11 py-2 text-white">
                  {link.label}
                </Link>
              ))}
              <a href={site.phoneTel} className="block min-h-11 py-2 font-semibold text-amber">
                {site.phoneDisplay}
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteHeaderLive() {
  const spanish = usePathname().startsWith("/es");
  return <SiteHeader spanish={spanish} />;
}
