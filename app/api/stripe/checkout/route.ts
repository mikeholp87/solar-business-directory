import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { deriveInstallerIdFromSession } from "@/lib/repositories/installer-dashboard";
import { siteUrl } from "@/lib/runtime";

const tierPriceEnv: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  territory: process.env.STRIPE_TERRITORY_PRICE_ID,
  regional: process.env.STRIPE_REGIONAL_PRICE_ID
};

export async function POST(request: Request) {
  const user = await getCurrentSessionUser();
  const installerId = await deriveInstallerIdFromSession();
  if (!user || !installerId) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const tier = body && typeof body === "object" && "tier" in body && typeof body.tier === "string" ? body.tier : "territory";
  if (!(tier in tierPriceEnv) || !["starter", "territory", "regional"].includes(tier)) {
    return NextResponse.json({ error: "Invalid billing tier" }, { status: 400 });
  }
  const price = tierPriceEnv[tier];
  if (!process.env.STRIPE_SECRET_KEY || !price) return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${siteUrl()}/billing/success`,
    cancel_url: `${siteUrl()}/billing/cancel`,
    customer_email: user.email,
    metadata: { installer_id: installerId },
    subscription_data: { metadata: { installer_id: installerId } },
    integration_identifier: `renewable-directory-${Array.from({ length: 8 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join("")}`
  });

  return NextResponse.json({ url: session.url });
}
