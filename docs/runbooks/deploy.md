# Deploy Runbook

## Purpose

Use this when shipping a new release to Vercel or recovering from a bad deploy.

## Preconditions

- Main branch is green locally.
- `npm test` passes.
- `npm run build` passes.
- Required environment variables are present in Vercel.

## Normal Deploy

1. Merge the approved changes to the main branch.
2. Confirm the Vercel production deployment starts automatically.
3. Watch the build logs for Next.js type or runtime errors.
4. Verify the production URL loads:
   - `/`
   - `/directory`
   - `/apply`
   - `/login`
   - `/admin`
   - `/installer-dashboard`
5. Validate a homeowner lead submission and an installer application in production or preview.
6. Re-run `npm test` and `npm run build` locally if the deploy introduces a runtime issue.

## Rollback

1. Identify the last known good Vercel deployment.
2. Promote the previous deployment if the current one breaks critical flows.
3. Confirm the rollback by checking homepage, directory search, and form submission paths.

## Post-Deploy Checklist

- Stripe webhook endpoint still points to the live domain.
- Supabase environment variables are set correctly.
- Admin and installer login redirects work.
- Sitemap and robots output are available.
- Notification outbox writes are happening on lead or application submission.
