"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function CallBar() {
  const spanish = usePathname().startsWith("/es");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-navy md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-2">
        <a href={site.phoneTel} className="inline-flex min-h-14 items-center justify-center px-3 text-sm font-semibold text-white">
          {spanish ? "Llamar" : "Call or text"}
        </a>
        <a href="#offer" className="inline-flex min-h-14 items-center justify-center bg-amber px-3 text-sm font-semibold text-amber-ink">
          {spanish ? "Pedir mi oferta" : "Get your cash offer"}
        </a>
      </div>
    </div>
  );
}
