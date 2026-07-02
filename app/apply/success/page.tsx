import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Claim submitted", "Your listing claim has been submitted.", "/apply/success", { noindex: true });

export default function ApplySuccessPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card surface-card-success p-8 text-center">
          <p className="eyebrow">Claim submitted</p>
          <h1 className="mt-4 text-3xl font-bold">Thanks. We&rsquo;ll review your claim and contact you shortly.</h1>
          <p className="mt-4 leading-7 text-navy/70">The team will verify your details and confirm territory availability.</p>

          <div className="mt-8 rounded-2xl border-2 border-accent bg-white p-5 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">Upgrade your listing</p>
            <h2 className="mt-2 text-xl font-bold text-navy">Get priority placement and more enquiries</h2>
            <p className="mt-2 text-sm leading-6 text-navy/65">
              Get priority placement, quote requests and featured visibility in your service areas.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <Link href="/pricing" className="button-primary text-sm">
                Upgrade Your Listing
              </Link>
              <Link href="/installer-dashboard" className="button-secondary text-sm">
                Installer dashboard
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="button-secondary" href="/">Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
