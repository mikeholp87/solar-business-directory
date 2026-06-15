import { NextResponse } from "next/server";
import Stripe from "stripe";

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
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/installer-dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/installer-dashboard?checkout=cancelled`,
    metadata: { installer_id: installerId ?? "" }
  });

  return NextResponse.json({ url: session.url });
}
