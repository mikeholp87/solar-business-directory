# UKSD BUS Installer Directory

Production-ready Next.js app for a UK Solar Direct / First Time Central Heating Wales installer directory.

## What it does

- Public directory and location pages for BUS and MCS approved installers.
- Homeowner lead capture and installer application flows.
- Admin console for applications, installers, territories, leads, reviews, and CSV exports.
- Installer portal for profile edits, assigned leads, documents, and territory requests.
- Supabase-backed schema, seed data, RLS policies, audit logs, notification outbox, and territory allocation rules.
- Stripe subscription checkout and webhook synchronization.
- SEO, sitemap, robots, and manifest generation.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, and Storage
- Stripe
- Vitest

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local` with the required values.

```bash
cp .env.example .env.local
```

3. Fill in the environment variables listed below.
4. Start the app.

```bash
npm run dev
```

## Required environment variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_TERRITORY_PRICE_ID`
- `STRIPE_REGIONAL_PRICE_ID`

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.
4. Create admin users in Supabase Auth.
5. Insert admin rows into `public.users` with `role = 'admin'`.
6. Create installer auth users.
7. Link `public.installers.user_id` to the matching `public.users.id`.

## Stripe setup

1. Create three recurring prices for the supported tiers.
2. Add the price IDs to the environment.
3. Set the webhook URL to `https://your-domain.com/api/stripe/webhook`.
4. Listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Tests

```bash
npm test
```

```bash
npm run build
```

## Runbooks

- [Deploy](docs/runbooks/deploy.md)
- [Support](docs/runbooks/support.md)
- [Stripe](docs/runbooks/stripe.md)
- [Supabase](docs/runbooks/supabase.md)

## Notes

- The app falls back to local seed data when Supabase is not configured.
- The installer documents screen currently records document URLs; file storage upload wiring is the remaining gap.
- The notification system queues outbound messages in the database for later delivery.
