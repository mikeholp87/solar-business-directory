import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { queueEmailNotification } from "@/lib/notifications/email";
import { paymentFailedTemplate } from "@/lib/notifications/templates/payment-failed";
import { logAuditEvent } from "@/lib/audit/log-event";

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
    const supabase = createAdminSupabaseClient();
    if (supabase && (event.type === "checkout.session.completed" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted")) {
      const subscription = event.data.object as Stripe.Subscription | Stripe.Checkout.Session;
      const metadata = "metadata" in subscription ? subscription.metadata : {};
      const installerId = metadata?.installer_id;
      const customerId = "customer" in subscription && subscription.customer ? String(subscription.customer) : undefined;
      const subscriptionId = "id" in subscription ? String(subscription.id) : undefined;
      const status = event.type === "customer.subscription.deleted" ? "cancelled" : "active";
      const subscriptionStatusRaw = event.type === "customer.subscription.updated" && "status" in subscription ? String(subscription.status) : status;
      const subscriptionStatus = ["trialing", "active", "past_due", "offline_active", "cancelled"].includes(subscriptionStatusRaw)
        ? subscriptionStatusRaw
        : subscriptionStatusRaw === "unpaid"
          ? "past_due"
          : status;

      if (installerId || customerId || subscriptionId) {
        const update = {
          stripe_customer_id: customerId ?? null,
          stripe_subscription_id: subscriptionId ?? null,
          subscription_status: subscriptionStatus
        };

        if (installerId) {
          await supabase.from("installers").update(update).eq("id", installerId);
        } else if (customerId) {
          await supabase.from("installers").update(update).eq("stripe_customer_id", customerId);
        } else if (subscriptionId) {
          await supabase.from("installers").update(update).eq("stripe_subscription_id", subscriptionId);
        }

        const lookup = installerId
          ? await supabase.from("installers").select("id,company_name,email").eq("id", installerId).maybeSingle()
          : customerId
            ? await supabase.from("installers").select("id,company_name,email").eq("stripe_customer_id", customerId).maybeSingle()
            : subscriptionId
              ? await supabase.from("installers").select("id,company_name,email").eq("stripe_subscription_id", subscriptionId).maybeSingle()
              : { data: null };

        const installer = lookup.data;
        if (installer && (subscriptionStatus === "past_due" || subscriptionStatus === "unpaid")) {
          const notification = paymentFailedTemplate({ companyName: installer.company_name, email: installer.email ?? undefined });
          await queueEmailNotification({
            eventType: "billing.payment_failed",
            recipientEmail: notification.recipientEmail,
            recipientRole: "installer",
            subject: notification.subject,
            body: notification.body,
            payload: { installer_id: installer.id, subscription_status: subscriptionStatus }
          });
        }
      }

      await logAuditEvent({
        action: `stripe.${event.type}`,
        entityType: "stripe_subscription",
        entityId: subscriptionId ?? installerId ?? customerId ?? undefined,
        payload: { installerId, customerId, subscriptionId, status: subscriptionStatus }
      });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
