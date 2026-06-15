import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated") {
      // Update installers.stripe_subscription_id and subscription_status here with a service-role Supabase client.
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
