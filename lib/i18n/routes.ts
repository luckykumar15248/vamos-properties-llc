/**
 * Bidirectional URL mapping between English and Spanish pages.
 * Add entries here when a new Spanish page is created.
 * All paths are canonical (no trailing slash, no query string).
 */

export type Locale = "en" | "es";

/** English path → Spanish equivalent */
export const enToEs: Record<string, string> = {
  "/": "/es",
  "/stop-foreclosure": "/es/ejecucion-hipotecaria",
  "/cash-offer": "/es/oferta-en-efectivo",
  "/take-over-payments": "/es/tomar-los-pagos",
  "/about": "/es/nosotros",
  "/contact": "/es/contacto",
  // Guides map to the nearest Spanish equivalent
  "/guides": "/es",
  "/guides/cash-sale": "/es/oferta-en-efectivo",
  "/guides/trustee-sale": "/es/ejecucion-hipotecaria",
  "/guides/life-events": "/es",
  // Blog/listings stay in English; switcher goes to Spanish home
  "/blog": "/es",
  "/listings": "/es",
};

/** Spanish path → English equivalent (reverse of the map above) */
export const estoEn: Record<string, string> = Object.fromEntries(
  Object.entries(enToEs).map(([en, es]) => [es, en]),
);

/**
 * Returns the alternate-language path for a given pathname.
 * Strips query/hash before lookup; always returns a valid path.
 */
export function getAlternatePath(pathname: string): string {
  const base = pathname.split("?")[0].split("#")[0];
  if (base.startsWith("/es")) {
    return estoEn[base] ?? "/";
  }
  return enToEs[base] ?? "/es";
}

/** True when pathname is a Spanish URL */
export function isSpanish(pathname: string): boolean {
  return pathname.startsWith("/es");
}

/** Locale for a pathname */
export function localeOf(pathname: string): Locale {
  return isSpanish(pathname) ? "es" : "en";
}

/**
 * Generates the `metadata.alternates.languages` object for a page.
 * Pass both the English and Spanish canonical paths.
 *
 * @example
 * alternates: { canonical: "/stop-foreclosure", ...hreflang("/stop-foreclosure", "/es/ejecucion-hipotecaria") }
 */
export function hreflang(enPath: string, esPath: string) {
  return {
    languages: {
      en: enPath,
      "es-US": esPath,
      "es-MX": esPath,
      es: esPath,
      "x-default": enPath,
    } as Record<string, string>,
  };
}
