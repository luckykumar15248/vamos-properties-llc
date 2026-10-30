# Vamos Properties LLC — database architecture

PostgreSQL via Prisma 5 (`@prisma/client`). The schema lives in `prisma/schema.prisma`. `src/prisma/db.ts` opens one lazy client with `getDb()`.

Pages and actions never import a live client at module scope. Writes go through `lib/dal`. Callers get `{ id }` or DTOs, never a Prisma row.

## Connection

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres URL for the Next.js runtime on Vercel |

`lib/db/database-url.ts` adds serverless pool defaults when they are missing from the URL: `connection_limit=1`, `pool_timeout=10`, `connect_timeout=10`. Do not log the URL, the phone number, or the consent body.

Apply schema:

```bash
npx prisma generate
npx prisma db push
```

## What is in the schema now

User, Lead, Consent, LeadEvent, Listing, ListingPrice, MediaAsset, Post, Category, Tag, PostCategory, PostTag, Comment.

Prisma `String` maps to Postgres `text`. Long copy (post body, listing description, consent text, comments) is `@db.Text`. There is no MySQL `LONGTEXT` or `VARCHAR(191)` in this schema.

A new lead write is one transaction: lead + consent rows + the `created` event. Status changes append a `LeadEvent` and update `Lead.status` together.
