import Link from "next/link";
import { requireRole } from "@/lib/auth/roles";
import { getCurrentInstaller } from "@/lib/repositories/installer-dashboard";
import { pageMetadata } from "@/lib/seo";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";

export const metadata = pageMetadata("Billing", "Installer billing and subscription status.", "/billing", { noindex: true });

export default async function BillingPage() {
  await requireRole(["installer", "admin"]);
  const installer = await getCurrentInstaller();

  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Billing</p>
          <h1 className="mt-4 text-4xl font-black">Installer billing</h1>
          <p className="mt-4 leading-7 text-navy/70">Current status: <span className="font-bold capitalize">{installer?.subscriptionStatus ?? "not linked"}</span>. Choose a plan to open secure Stripe Checkout.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StripeCheckoutButton tier="starter" label="Choose Starter" />
            <StripeCheckoutButton tier="territory" label="Choose Territory" />
            <StripeCheckoutButton tier="regional" label="Choose Regional" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/installer-dashboard">Back to dashboard</Link>
            <Link className="button-secondary" href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
