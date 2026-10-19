"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { areas } from "@/lib/content/areas";
import { site, spanishForeclosurePath } from "@/lib/site";

export function SiteFooter() {
  const spanish = usePathname().startsWith("/es");

  if (spanish) {
    return (
      <footer className="bg-navy text-white" lang="es">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold tracking-tight">{site.name}</p>
            <p className="mt-3 leading-7 text-white/75">
              Compradores locales para dueños de casa en el condado de Maricopa. Llame de 8:00 a.m. a 7:00 p.m., los siete días.
            </p>
            <a href={site.phoneTel} className="mt-3 inline-flex min-h-11 items-center font-semibold text-amber">
              {site.phoneDisplay}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">En español</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={spanishForeclosurePath} className="text-white/80 hover:text-white">
                  Detener la ejecución hipotecaria
                </Link>
              </li>
              <li>
                <Link href="/stop-foreclosure" className="text-white/80 hover:text-white">
                  Leer esta página en inglés
                </Link>
              </li>
              <li>
                <Link href="/cash-offer" className="text-white/80 hover:text-white">
                  Oferta de contado, en inglés
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Ciudades</p>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link href={`/areas/${area.slug}`} className="text-white/80 hover:text-white">
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-28 text-sm leading-6 text-white/60 md:pb-10">
          Pedir una oferta no lo obliga a vender. Un precio de contado suele ser menor que el de una casa listada, porque se compra tal como está y los costos de cierre van incluidos. Tomar los pagos puede dejar el préstamo a su nombre. Pida a un abogado que revise lo que firme. Este sitio no es un consejo legal.
        </p>
      </footer>
    );
  }

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{site.name}</p>
          <p className="mt-3 leading-7 text-white/75">
            Local buyers for homeowners in {site.area}. Call {site.hours}.
          </p>
          <a href={site.phoneTel} className="mt-3 inline-flex min-h-11 items-center font-semibold text-amber">
            {site.phoneDisplay}
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">How we can help</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/cash-offer" className="text-white/80 hover:text-white">
                Get a cash offer
              </Link>
            </li>
            <li>
              <Link href="/stop-foreclosure" className="text-white/80 hover:text-white">
                Stop a foreclosure in Phoenix
              </Link>
            </li>
            <li>
              <Link href="/take-over-payments" className="text-white/80 hover:text-white">
                Take over the payments
              </Link>
            </li>
            <li>
              <Link href="/guides" className="text-white/80 hover:text-white">
                Selling guides
              </Link>
            </li>
            <li>
              <Link href={spanishForeclosurePath} className="text-white/80 hover:text-white">
                Leer en español
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white/80 hover:text-white">
                Patrick and Jaime
              </Link>
            </li>
            <li>
              <Link href="/listings" className="text-white/80 hover:text-white">
                See available homes
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Cities</p>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={`/areas/${area.slug}`} className="text-white/80 hover:text-white">
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-28 text-sm leading-6 text-white/60 md:pb-10">
        Asking for an offer does not obligate you to sell. A cash price is usually below a listed price because the house is bought as-is and the closing costs are covered. Taking over payments can leave the loan in your name. Have a lawyer review anything you sign. This site is not legal advice.
      </p>
    </footer>
  );
}
