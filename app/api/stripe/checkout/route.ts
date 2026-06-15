import { NextResponse } from "next/server";
import Stripe from "stripe";
import { siteUrl } from "@/lib/runtime";

const tierPriceEnv: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  territory: process.env.STRIPE_TERRITORY_PRICE_ID,
  regional: process.env.STRIPE_REGIONAL_PRICE_ID
};

export async function POST(request: Request) {
  const { tier = "territory", installerId } = await request.json().catch(() => ({}));
  const price = tierPriceEnv[tier];
  if (!process.env.STRIPE_SECRET_KEY || !price) return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${siteUrl()}/billing/success`,
    cancel_url: `${siteUrl()}/billing/cancel`,
    metadata: { installer_id: installerId ?? "" }
  });

  return NextResponse.json({ url: session.url });
}
