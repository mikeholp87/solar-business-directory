import Link from "next/link";

export default function EnquirySuccessPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-2xl">
        <div className="surface-card p-8">
          <p className="eyebrow">Enquiry received</p>
          <h1 className="mt-4 text-4xl font-black">Thanks, your survey request has been received.</h1>
          <p className="mt-4 leading-7 text-navy/70">Renewable Directory will review the postcode, territory fit, and installer availability before following up.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/directory">Back to directory</Link>
            <Link className="button-secondary" href="/">Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
