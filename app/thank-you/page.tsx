import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="section-band">
      <div className="container-page max-w-3xl">
        <div className="rounded-lg border border-emerald-950/10 bg-white p-8 shadow-soft">
          <h1 className="text-4xl font-black">Thanks, we have your details.</h1>
          <p className="mt-4 leading-7 text-ink/70">The enquiry will be reviewed against the relevant territory and installer availability. Accreditation details should always be verified before signing a contract.</p>
          <Link className="button-primary mt-6" href="/directory">Back to directory</Link>
        </div>
      </div>
    </main>
  );
}
