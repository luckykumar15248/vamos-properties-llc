# Vamos Properties LLC — SEO strategy

Reviewed against doughopkins.com, valleyhomebuyer.com, and webuyhouses.com on 18 Oct 2026. Those sites already rank for generic “sell my house fast” terms with an address box, a three-step story, and city URLs. Doug Hopkins’s city pages largely repeat one template. None of the three homepages lead with a trustee-sale date or a Spanish foreclosure page.

Vamos should win the queries a distressed owner actually types, then let suburb pages collect the local variants.

## Priority queries

| Intent | Example query | Landing page |
| --- | --- | --- |
| Stop a sale | stop foreclosure Phoenix | `/stop-foreclosure` |
| Notice in hand | notice of trustee sale Arizona | `/stop-foreclosure` |
| Behind | behind on mortgage Phoenix | `/take-over-payments` |
| Spanish | evitar foreclosure Phoenix, ejecución hipotecaria Phoenix | `/es/stop-foreclosure` |
| Local cash sale | sell my house fast Mesa | `/areas/mesa` (and the other eight cities) |

Home still targets “sell my house fast Phoenix,” with internal links into the situation pages. Do not build a separate thin page for every keyword.

## On-page rules

- One H1 that states the city or the situation. Title and meta description are unique and include the city on suburb pages.
- Visible copy of at least a few hundred words that is actually about that place: a neighborhood or housing pattern, how the Maricopa process shows up there, and which of the two offers tends to fit. Swapping the city name inside one paragraph fails this test.
- Each suburb FAQ is written for that page. FAQ JSON-LD matches the visible questions only.
- Every seller page links to `/stop-foreclosure`, `/take-over-payments`, and the form. Situation pages link out to the nine cities.
- Canonical URLs are absolute. `/stop-foreclosure` and `/es/stop-foreclosure` reference each other with `alternates.languages` (`en` and `es`).
- `LocalBusiness` JSON-LD uses the same name, address, and phone as the Google Business Profile. `areaServed` lists the nine cities.
- Sitemap includes every indexable URL. Thank-you and admin routes stay out of the sitemap and use `noindex`.

## Spanish

`/es/stop-foreclosure` is a full page, not a widget. It explains the trustee-sale clock, the cash offer, and payment takeover with the same disclosures as the English page. The form sets `language` to `es` so the admin queue and the SMS template can match. A language switch on the English foreclosure page points here. Further Spanish URLs (`/es/blog/[slug]`) wait for Phase 3.

## Technical

- Cache the marketing shell. Keep the lead action out of the cached payload.
- Hero images: `next/image`, explicit dimensions, `priority` only on the first screen. Founder photos include names in `alt`.
- Fonts load through `next/font`. No third-party chat script on seller pages.
- Internal links use real `<a>` / `Link` elements with descriptive text (“Stop foreclosure in Mesa”), not “click here.”
- Track the landing path and UTM fields on the lead so a suburb page is judged by conversations, not only by Search Console clicks.

## Google Business Profile (Phase 4)

- NAP on the site footer, contact page, and JSON-LD matches the profile character for character.
- Categories and the profile description mention cash offers and help for owners behind on payments in Maricopa County, using the same limits as the site (no credit repair, no guaranteed stop).
- Ask for a review after a closed sale. Link the profile from the contact page once reviews exist.
- Monthly: one Business Profile post pointing at the newest article or the foreclosure page, and a check that the phone number still matches Twilio and the site.

## Content cadence (Phase 3)

Two posts a month, in this order:

1. What a Notice of Trustee’s Sale means in Arizona, and the 91-day clock
2. Selling an inherited house in Maricopa County
3. Selling during a divorce
4. Options after a job loss
5. Cash offer compared with taking over payments

Each post links to the matching service page and two suburb pages. Posts do not replace those pages.

## What we will not do

- Doorway pages that only change the city name
- Copying a competitor’s foreclosure wording where it overstates loan-modification law
- Marking FAQ schema up for questions the visitor cannot see
- Putting “Available Listings” in the seller header to chase extra URLs
