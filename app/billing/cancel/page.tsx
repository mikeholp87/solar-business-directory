import Link from "next/link";

export default function BillingCancelPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Checkout cancelled</p>
          <h1 className="mt-4 text-4xl font-black">No subscription changes were made.</h1>
          <p className="mt-4 leading-7 text-navy/70">You can return to billing whenever you are ready.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/billing">Back to billing</Link>
            <Link className="button-secondary" href="/installer-dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
