# Stripe Runbook

## Purpose

Use this when configuring Stripe or diagnosing billing sync.

## Required Configuration

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_TERRITORY_PRICE_ID`
- `STRIPE_REGIONAL_PRICE_ID`
- Production `NEXT_PUBLIC_SITE_URL`

## Webhook Events

Handle and verify:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Diagnostic Steps

1. Confirm the webhook endpoint in Stripe points to `/api/stripe/webhook`.
2. Replay the event with Stripe CLI.
3. Verify `public.installers` has the expected `stripe_customer_id`, `stripe_subscription_id`, and `subscription_status`.
4. Confirm the admin audit log received a billing event entry.
5. Check the notification outbox for payment failure notices when subscriptions move to `past_due`.

## Recovery

- If the app has the wrong subscription status, re-run the webhook event after fixing the installer metadata.
- If a checkout session was created with the wrong price ID, correct the environment variable and try again.
- If Stripe is misconfigured in production, temporarily disable checkout entry points until the secret and webhook secret are fixed.
