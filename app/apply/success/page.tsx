import Link from "next/link";

export default function ApplySuccessPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Application received</p>
          <h1 className="mt-4 text-4xl font-black">Thanks, your installer application is in the queue.</h1>
          <p className="mt-4 leading-7 text-navy/70">The admin team can now review accreditations, territory fit, and commercial terms.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/apply">Back to application form</Link>
            <Link className="button-secondary" href="/">Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
