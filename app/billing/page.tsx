import Link from "next/link";

export default function BillingPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Billing</p>
          <h1 className="mt-4 text-4xl font-black">Installer billing</h1>
          <p className="mt-4 leading-7 text-ink/70">Billing state is managed through Stripe and synced back into the dashboard after each webhook event.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/installer-dashboard">Back to dashboard</Link>
            <Link className="button-secondary" href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
