# Vamos Properties LLC — system architecture

Next.js 16 App Router on Vercel. MySQL on AWS EC2 via Prisma 5 (`@prisma/client` + `mysql2`). Email through Resend. SMS through Twilio. Marketing pages are cached Server Components. Leads, admin, and webhooks stay dynamic.

`cacheComponents` and `partialPrefetching` are already enabled in `next.config.ts`. Caching uses `use cache` and `cacheLife`. Request interception, if needed later, uses root `proxy.ts` (Next.js 16 renamed Middleware to Proxy).

## Request map

```text
Seller browser
  ├─ Server Component pages (cached marketing shell)
  ├─ Server Action: submitLead
  └─ tel: link (no server)

submitLead
  ├─ schema + honeypot + rate limit
  ├─ Prisma transaction: Lead, Consent, LeadEvent
  ├─ Twilio: seller SMS + founder SMS
  └─ Resend: internal email

Twilio / Resend
  └─ POST /api/webhooks/*  → verify signature → LeadEvent

Admin browser
  └─ session check in lib/dal → Server Actions → Prisma
```

## Client and server

| Surface | Where it runs | Notes |
| --- | --- | --- |
| Home, situation, suburb, Spanish pages | Server Components | `use cache` + `cacheLife('hours')` once content is stable |
| Header, footer, comparison, FAQ | Server Components | Shared from `components/marketing` |
| Lead form | Server-rendered `<form action={submitLead}>` | Client JS only if a field must show or hide (trustee-sale date) |
| Mobile call bar | Server Component | `tel:` link, fixed, safe-area padding |
| Thank-you page | Server Component | Dynamic; confirms the number to call |
| `/admin` | Server Components + Server Actions | Session required inside the data layer |
| Webhooks | `app/api/webhooks/*/route.ts` | POST only, signature required |

Public forms do not call Prisma from the component. The action calls `lib/dal`. Admin UI receives DTOs: no raw rows, no secrets.

## Data model

```text
User
  id, email, name, role (owner | staff), password hash or auth subject

Lead
  id, createdAt, updatedAt
  address, unit, city, name, phone, email?
  situation (behind | trustee_sale | divorce | inheritance | job_loss | sell)
  trusteeSaleDate?
  preferredPath (cash | takeover | unsure)
  language (en | es)
  status (new | no_answer | talking | visited | offer_sent | contract | closed | lost)
  lostReason?
  sourcePath, utmSource, utmMedium, utmCampaign
  assignedToId?

Consent
  id, leadId, channel (sms | call), textVersion, grantedAt, pageUrl, ipHash

LeadEvent
  id, leadId, authorId? | "system"
  type (created | status | note | sms_out | sms_status | email_out | email_status)
  body, createdAt

BlogPost (Phase 3)
  id, slug, locale, title, description, body, faqJson, status, publishedAt, citySlug?

Property (later, not in the four phases)
  id, slug, status, price, summary
```

Indexes: `Lead.phone`, `Lead.status`, `Lead.trusteeSaleDate`, `Lead.createdAt`, unique `BlogPost (locale, slug)`.

A new lead write is one transaction: lead + consent rows + the `created` event. Status changes append a `LeadEvent` and update `Lead.status` together.

## Third parties

### Twilio

- Outbound: seller confirmation (“This is Jaime at Vamos Properties…”) and a founder alert with address, situation, and sale date.
- Persist the message SID on the `sms_out` event.
- `POST /api/webhooks/twilio` receives status callbacks. Validate `X-Twilio-Signature` with the auth token and the exact URL. Update or append an `sms_status` event. Ignore unknown SIDs.

### Resend

- Outbound internal mail to the founders on each lead. The seller email is optional and is not required to submit.
- `POST /api/webhooks/resend` verifies the Svix signature (`svix-id`, `svix-timestamp`, `svix-signature`) before writing an `email_status` event.
- Failed SMS or email does not roll back the lead. The event records the failure so the queue still shows the person.

## Environments

| Name | Use |
| --- | --- |
| `DATABASE_URL` | MySQL URL for the Vercel runtime and for `prisma migrate` / `db push` |
| `MYSQL_SSL_MODE` | `required` (TLS, self-signed OK), `strict` (verify cert), or `off` |
| `RESEND_API_KEY` | Sending |
| `RESEND_WEBHOOK_SECRET` | Inbound verification |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | Sending and signature checks |
| `ADMIN_SESSION_SECRET` | Admin session |

Local development uses MySQL and test Twilio/Resend credentials. Production webhooks point at the Vercel domain only.

## MySQL on EC2, called from Vercel

`getDb()` in `src/prisma/db.ts` builds one PrismaClient per serverless instance and stores it on `globalThis` so hot reload and warm lambdas reuse it. Missing pool params are filled in: `connection_limit=1`, `pool_timeout=10`, `connect_timeout=10`. That keeps each function from opening a pile of sockets against EC2 `max_connections`.

TLS: set `MYSQL_SSL_MODE=required` on Vercel. Put `sslaccept=strict` on the URL (or `MYSQL_SSL_MODE=strict`) once the instance has a real certificate. Until then `required` encrypts the session and skips hostname checks, which is the usual self-signed EC2 setup.

EC2 side:

1. Security group: do not leave `3306` open to `0.0.0.0/0`. Allow the Vercel IP ranges you actually use, or put ProxySQL / stunnel on the instance and expose only that port.
2. MySQL user: a dedicated app user, not `root`. Grant only the `vamos` database.
3. `require_secure_transport=ON` so the server refuses plaintext.
4. Bind-address and firewall still matter; TLS is not a substitute for a closed port.

Schema lives in `prisma/schema.prisma`. Apply it with `npx prisma db push` on a fresh instance, or `npx prisma migrate deploy` once `prisma/migrations` is the source of truth. `npx prisma generate` runs on `postinstall` so Vercel builds the Linux query engine.

## Failure behavior

- Validation errors return field messages. The seller stays on the page.
- Database or provider failures return a single sentence plus the phone number, and log an error id server-side.
- Duplicate phone + address on the same day updates the open lead and adds a note, instead of opening a second card.
