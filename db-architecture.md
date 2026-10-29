# Vamos Properties LLC — database architecture

MySQL 8 on AWS EC2. The app talks to it through Prisma 5 (`@prisma/client` with the `mysql` provider and `mysql2`). The schema lives in `prisma/schema.prisma`. `src/prisma/db.ts` opens one lazy client with `getDb()`.

Pages and actions never import a live client at module scope. Writes go through `lib/dal`. Callers get `{ id }` or DTOs, never a Prisma row.

## Connection

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | `mysql://user:password@host:3306/vamos` for the Next.js runtime on Vercel |
| `MYSQL_SSL_MODE` | `required`, `strict`, or `off` |

`lib/db/mysql-url.ts` adds serverless pool defaults when they are missing from the URL: `connection_limit=1`, `pool_timeout=10`, `connect_timeout=10`. Do not log the URL, the phone number, or the consent body.

Each Vercel serverless isolate gets its own pool. Limit 1 connection per isolate so a burst of lambdas cannot exhaust EC2 `max_connections` (often ~150 on a small instance). If traffic grows, put ProxySQL on the EC2 box and point `DATABASE_URL` at the proxy; keep `connection_limit=1` on the Prisma side.

Apply schema:

```bash
npx prisma generate
npx prisma db push
```

Or, once a baseline exists under `prisma/migrations`:

```bash
npx prisma migrate deploy
```

## What is in the schema now

User, Lead, Consent, LeadEvent, Listing, ListingPrice, MediaAsset, Post, Category, Tag, PostCategory, PostTag, Comment.

DateTime columns are MySQL `DATETIME(3)`. Long copy uses `TEXT` / `LONGTEXT`. Unique and indexed strings stay at `VARCHAR(191)` so utf8mb4 indexes fit InnoDB’s 767-byte limit.

A new lead write is one transaction: lead + consent rows + the `created` event. Status changes append a `LeadEvent` and update `Lead.status` together.
