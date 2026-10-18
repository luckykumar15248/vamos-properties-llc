# Vamos Properties LLC — project roadmap

Phoenix metro site for homeowners who need to sell fast or get help with a delinquent mortgage. Stack: Next.js 16 (App Router, Cache Components), Tailwind CSS 4, PostgreSQL, Prisma, Vercel, Resend, Twilio.

Each phase ends when its acceptance checks pass. Later phases do not start by rewriting the seller pages.

## Phase 1 — Foundation and 15 public pages

Goal: a fast, honest seller site that captures a call or a short lead.

Pages:

| Route | Page |
| --- | --- |
| `/` | Home, both paths |
| `/stop-foreclosure` | Arizona foreclosure deep-dive |
| `/take-over-payments` | Payment takeover, including the risks |
| `/about` | Patrick and Jaime |
| `/contact` | Phone, hours, form |
| `/es/stop-foreclosure` | Spanish foreclosure page |
| `/areas/phoenix` | Phoenix |
| `/areas/mesa` | Mesa |
| `/areas/glendale` | Glendale |
| `/areas/chandler` | Chandler |
| `/areas/gilbert` | Gilbert |
| `/areas/peoria` | Peoria |
| `/areas/surprise` | Surprise |
| `/areas/avondale` | Avondale |
| `/areas/tempe` | Tempe |

Goodyear is the first extra city after these 15 are live.

Done when:

- Every page has one H1, unique metadata, a phone link, and the same short form.
- The form asks for address, name, mobile, situation, optional trustee-sale date, preferred path, and SMS/call consent.
- A honeypot and server-side validation are in place. Submitting creates a lead row.
- Founder photos use `next/image`. The mobile call bar stays visible and does not cover the form.
- Copy avoids “foreclosure stops immediately,” “we repair your credit,” and “full market value.”
- `sitemap.ts`, `robots.ts`, `LocalBusiness` JSON-LD, and FAQ JSON-LD for visible FAQs are shipped.
- Lighthouse on the home page, mobile: LCP and INP in the “good” range, CLS under 0.1, on a production build.

## Phase 2 — Lead CRM and admin dashboard

Goal: Patrick and Jaime can work the queue the same day a form arrives.

Done when:

- An authenticated `/admin` queue lists leads with address, name, phone, situation, language, sale date, status, and minutes since submit.
- A trustee sale inside 21 days sorts to the top.
- Statuses: New, No answer, Talking, Visited, Offer sent, Contract, Closed, Lost. Each change writes a note author and timestamp.
- Daytime target: first human reply within 5 minutes, 8:00–19:00 America/Phoenix.
- Twilio sends the seller a text from a founder name, and texts both founders. Resend emails the internal notification.
- Consent and source URL are visible on the lead. Lost reasons are a fixed list: price, timing, already listed, not a fit, no response.

## Phase 3 — Blog CMS

Goal: two articles a month without a deploy for body copy.

Done when:

- Editors can draft, preview, and publish a post with title, slug, description, body, FAQ, author, language, and related city.
- Public URLs are `/blog/[slug]` and `/es/blog/[slug]`.
- Publishing revalidates the post, the blog index, and the sitemap.
- The first cluster is the trustee-sale timeline, inherited houses, divorce, job loss, and cash versus takeover. The seller nav still leads with call and form.

## Phase 4 — Local SEO and Google Business Profile

Goal: the site, citations, and the Google Business Profile say the same thing.

Done when:

- Name, address, and phone match the Google Business Profile exactly on the site footer, JSON-LD, and contact page.
- Each suburb page has its own opening, a local fact, and its own FAQ, linked to `/stop-foreclosure` and `/take-over-payments`.
- The Spanish page is linked with `hreflang` from `/stop-foreclosure`.
- UTM and landing-page URL are stored on the lead so suburb pages can be judged by leads, not just rankings.
- A documented monthly checklist covers new reviews, a Business Profile post, and one new or refreshed article.
- Acquired-property listings stay out of this phase. They get a separate buyer page only after the seller funnel is converting.

## Working agreements

- Read `node_modules/next/dist/docs/` before using a Next.js API.
- An Arizona real estate attorney reviews foreclosure timelines and takeover language before Phase 1 copy is final.
- Secrets live in Vercel env vars: `DATABASE_URL` (pooled), `DIRECT_URL` (migrations), `RESEND_API_KEY`, `TWILIO_*`, admin session secret, webhook signing secrets.
