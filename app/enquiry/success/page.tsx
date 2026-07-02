import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Enquiry received", "Your enquiry has been received by The Renewable Directory.", "/enquiry/success", { noindex: true });

export default function EnquirySuccessPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card surface-card-success p-8 text-center">
          <p className="eyebrow">Enquiry received</p>
          <h1 className="mt-4 text-3xl font-bold">Thanks. We&rsquo;ll match you with suitable local installers.</h1>
          <p className="mt-4 leading-7 text-navy/70">Your enquiry has been received and we&rsquo;ll connect you with MCS certified installers in your area.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="button-primary" href="/directory">Find more installers</Link>
            <Link className="button-secondary" href="/">Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
