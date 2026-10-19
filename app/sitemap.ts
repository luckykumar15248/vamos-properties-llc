import type { MetadataRoute } from "next";
import { areas } from "@/lib/content/areas";
import { guides } from "@/lib/content/guides";
import { listPublicSlugs } from "@/lib/dal/listings";
import { site, spanishForeclosurePath } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homes = await listPublicSlugs();
  const paths = [
    "",
    "/cash-offer",
    "/stop-foreclosure",
    "/take-over-payments",
    "/about",
    "/contact",
    "/listings",
    "/guides",
    ...guides.map((guide) => `/guides/${guide.slug}`),
    spanishForeclosurePath,
    ...areas.map((area) => `/areas/${area.slug}`),
    ...homes.map((home) => `/listings/${home.slug}`),
  ];

  return paths.map((path) => ({
    url: path === "" ? site.url : `${site.url}${path}`,
    lastModified: homes.find((home) => path === `/listings/${home.slug}`)?.updatedAt.slice(0, 10) ?? "2026-10-18",
  }));
}
