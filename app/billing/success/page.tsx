import Link from "next/link";

export default function BillingSuccessPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Billing updated</p>
          <h1 className="mt-4 text-4xl font-black">Your subscription is active.</h1>
          <p className="mt-4 leading-7 text-ink/70">Stripe will synchronize subscription status back to your installer account after webhook processing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/installer-dashboard">Back to dashboard</Link>
            <Link className="button-secondary" href="/billing">Billing</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
