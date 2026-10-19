# Vamos Properties LLC — database architecture

PostgreSQL 15 or newer. The app talks to it through Prisma ORM 8 (`@prisma/orm-postgres`), not the Prisma 5 client. The contract lives in `src/prisma/contract.prisma`. Generated types are `src/prisma/contract.json` and `src/prisma/contract.d.ts`.

`src/prisma/db.ts` opens one lazy client with `getDb()`. It reads `DATABASE_URL`, keeps the pool idle for 10 seconds, and fails the connect attempt after 5 seconds. Pages and actions never import a live client at module scope. Writes go through `lib/dal`. Callers get `{ id }`, never a Prisma row.

Tables are created with `npx prisma db init` after `DATABASE_URL` is set. That command has not been run in this repo yet, so a real lead row cannot be stored until the database exists.

## What is in the contract now

```text
Lead
  id                 int, primary key, autoincrement
  address            text, required
  unit               text, optional
  city               text, optional
  name               text, required
  phone              text, required (digits only, stored as entered after validation)
  email              text, optional
  situation          text  behind | trustee_sale | divorce | inheritance | job_loss | sell
  trusteeSaleDate    text, optional, YYYY-MM-DD when present
  preferredPath      text  cash | takeover | unsure
  language           text  en | es
  status             text, default "new"
  lostReason         text, optional
  sourcePath         text  the page that submitted the form
  utmSource          text, optional
  utmMedium          text, optional
  utmCampaign        text, optional
  createdAt          timestamptz, default now
  updatedAt          timestamptz, maintained by Prisma
  indexes            phone, status, createdAt

Consent
  id           int, primary key
  leadId       int, foreign key to Lead, indexed
  channel      text  sms | call
  textVersion  text  the exact consent sentence shown on the form
  pageUrl      text
  ipHash       text  hash of the submitter IP, not the raw address
  grantedAt    timestamptz, default now

LeadEvent
  id         int, primary key
  leadId     int, foreign key to Lead, indexed
  author     text, default "system"
  type       text  created | note, and later status | sms_out | sms_status | email_out | email_status
  body       text
  createdAt  timestamptz, default now
```

`Lead` owns `Consent` and `LeadEvent`. Deleting a lead is not part of the public site. There is no `User` table yet, so `LeadEvent.author` is a string (`"system"` until admin accounts exist).

## How a lead is written

`saveLead` in `lib/dal/leads.ts` runs one transaction.

1. Look up the newest lead with the same phone and address.
2. If that lead is still open (`status` is not `closed` or `lost`) and `createdAt` falls on the same calendar day in `America/Phoenix`, update the open row and append a `note` event: “Same-day form submitted again.”
3. Otherwise insert a `Lead` with `status = "new"`, two `Consent` rows (`sms` and `call`) that store the same consent text, and a `created` event.

Empty optional strings are stored as null. The honeypot and the rate limit run before this function. A honeypot hit never reaches the database.

Validation that must stay true:

- Address is at least 5 characters. Name is at least 2.
- Phone is 10 or 11 digits.
- Situation and preferred path are members of the lists in `lib/site.ts`.
- Consent is the literal `"yes"`. The stored sentence is `site.consentText`, not a shortened version.
- IP addresses are hashed with `IP_HASH_SALT` before they are written.

## Connection

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres URL for the Next.js runtime on Vercel |

Prisma 8 in this repo uses that single URL from `prisma.config.ts`. Do not add a second client. Do not log the URL, the phone number, or the consent body.

## Not created yet

These appear in `system-architecture.md` as later work. They are not in `contract.prisma`.

| Table | Phase | Purpose |
| --- | --- | --- |
| User | 2 | Owner and staff login for `/admin` |
| Lead.assignedTo | 2 | Who is working the file, once User exists |
| BlogPost | 3 | Locale, slug, body, FAQ JSON, publish status |
| Property | After phase 4 | Acquired-home inventory. Stays off the seller navigation |

Status values the admin queue will use, once Phase 2 exists: `new`, `no_answer`, `talking`, `visited`, `offer_sent`, `contract`, `closed`, `lost`. Only `new` is written today. A status change must update `Lead.status` and append a `LeadEvent` in the same transaction.
