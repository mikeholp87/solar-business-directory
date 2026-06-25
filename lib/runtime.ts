import { hasSupabasePublicEnv } from "@/lib/env";

export function isSupabaseConfigured() {
  return hasSupabasePublicEnv();
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
