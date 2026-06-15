# Supabase Runbook

## Purpose

Use this when provisioning a new Supabase project or troubleshooting database access.

## Setup Order

1. Create the Supabase project.
2. Run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.
4. Create admin users in Supabase Auth.
5. Insert matching rows into `public.users` with `role = 'admin'`.
6. Create installer auth users.
7. Link `public.installers.user_id` to the matching `public.users.id`.

## Required Checks

- RLS policies are enabled on all public tables.
- Public read access is limited to active installers, live territories, and approved reviews.
- Installers can only see their own dashboard data.
- Admin-only actions use the service role on the server side.
- Notification and audit tables are writable by service-role server code.

## Common Issues

- If public pages are empty, confirm the seed data loaded successfully.
- If dashboards show fallback demo data, check the Supabase environment variables.
- If inserts fail, inspect RLS and the role used by the route handler.
- If territory allocation is wrong, inspect the `installer_territories` rows and the postcode matching helper.

## Recovery

- Re-run schema and seed scripts in a fresh project when the database drifts too far from the expected state.
- Use the admin dashboard export to confirm live data matches expectations after repairs.
