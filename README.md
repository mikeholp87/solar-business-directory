# UKSD BUS Installer Directory

Production-ready starter for a UK Solar Direct / First Time Central Heating Wales lead-generation directory for approved BUS and MCS air source heat pump installers.

## What is included

- Next.js app router frontend with Tailwind CSS.
- Public home page, directory search, installer profiles, installer application form and homeowner survey request form.
- Admin dashboard scaffold for installer, territory, lead and commercial tracking.
- Installer dashboard scaffold for profile edits, assigned leads, document upload and territory allocation.
- Supabase PostgreSQL schema, RLS policies, territory slot trigger and seed data.
- Stripe subscription checkout and webhook placeholders using price IDs from environment variables.
- SEO location pages for Wales, North Wales, South Wales, Manchester, Liverpool, Birmingham and London.
- Basic tests for postcode matching, territory status and lead assignment.

## File tree

```text
.
├── app
│   ├── admin/page.tsx
│   ├── api/applications/route.ts
│   ├── api/leads/route.ts
│   ├── api/stripe/checkout/route.ts
│   ├── api/stripe/webhook/route.ts
│   ├── apply/page.tsx
│   ├── directory/page.tsx
│   ├── heat-pump-installers/[location]/page.tsx
│   ├── installers/[slug]/page.tsx
│   ├── installer-dashboard/page.tsx
│   ├── login/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── application-form.tsx
│   ├── header.tsx
│   ├── installer-card.tsx
│   ├── lead-form.tsx
│   └── territory-list.tsx
├── lib
│   ├── data.ts
│   ├── lead-assignment.ts
│   ├── seo.ts
│   ├── supabase-client.ts
│   ├── supabase.ts
│   └── types.ts
├── supabase
│   ├── schema.sql
│   └── seed.sql
├── tests/lead-assignment.test.ts
├── middleware.ts
└── package.json
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env.local
```

3. Add Supabase, Stripe, Resend and site URL values to `.env.local`.

4. Start the app:

```bash
npm run dev
```

## Supabase setup

1. Create a new Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed.sql` for sample territories, installers, leads, reviews and applications.
4. Create admin users in Supabase Auth, then insert their profile into `public.users` with `role = 'admin'`.
5. Create installer users in Supabase Auth, then connect `public.installers.user_id` to the matching `public.users.id`.

## RLS policy summary

- Public users can read active, verified installers and live territories.
- Public users can insert homeowner leads and installer applications.
- Installers can read and update their own profile records and read assigned leads.
- Installers can upload/read their own documents.
- Admins can manage all installers, territories, applications, leads, documents and reviews.
- Commercial fields such as referral fees, pay-per-install fees, VAT and invoice state are only exposed through admin-managed records.
- The `prevent_territory_overfill` trigger blocks more than three active installers per territory unless `admin_override` is true.

## Stripe setup

Create three Stripe recurring prices and add the IDs to:

```env
STRIPE_STARTER_PRICE_ID=
STRIPE_TERRITORY_PRICE_ID=
STRIPE_REGIONAL_PRICE_ID=
```

Set a webhook endpoint to:

```text
https://your-domain.com/api/stripe/webhook
```

Listen for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The webhook route includes the verification shell. Add the service-role Supabase update after confirming the subscription mapping rules.

## Vercel deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
5. Deploy.
6. Configure Stripe webhook URL after the production domain is live.

## Manual configuration still needed

- Real Supabase project URL, anon key and service role key.
- Admin and installer auth accounts.
- Real Stripe products, recurring prices and webhook secret.
- Email notification provider wiring for admin and installer notifications.
- Production postcode lookup API.
- Real installer accreditation verification workflow.
- Full CRUD screens behind admin and installer dashboard scaffolds.
