# Support Runbook

## Purpose

Use this for day-to-day operational support after launch.

## Common Triage

- Lead submission failures:
  - Check `/api/leads` logs.
  - Confirm Supabase insert permissions.
  - Validate the postcode and consent fields in the request payload.
- Installer application failures:
  - Check `/api/applications` logs.
  - Confirm the form payload includes the required accreditations and contact fields.
- Dashboard access issues:
  - Confirm the user has the correct role in `public.users`.
  - Confirm the login cookie or Supabase session exists.
- Billing issues:
  - Check the Stripe webhook logs.
  - Confirm the installer has a Stripe customer and subscription ID in `public.installers`.

## Escalation

- If data is missing in Supabase, inspect the RLS policy and the service-role usage in server routes.
- If Stripe events are received but not reflected in the app, replay the webhook event with Stripe CLI.
- If emails are not sending, inspect the notification outbox rows first, then the email provider configuration.

## Support Checks

- New leads appear in the admin lead table.
- Installer applications appear in the admin applications table.
- Notification outbox receives queued records on submissions and approvals.
- Admin audit log entries exist for updates.
