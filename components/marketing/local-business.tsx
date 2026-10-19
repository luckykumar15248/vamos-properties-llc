import { JsonLd } from "@/components/marketing/json-ld";
import { areas } from "@/lib/content/areas";
import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: site.name,
        url: site.url,
        telephone: site.phoneDisplay,
        areaServed: areas.map((area) => ({
          "@type": "City",
          name: area.name,
          addressRegion: "AZ",
          addressCountry: "US",
        })),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Phoenix",
          addressRegion: "AZ",
          addressCountry: "US",
        },
        openingHours: "Mo-Su 08:00-19:00",
      }}
    />
  );
}
