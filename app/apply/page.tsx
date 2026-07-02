import { ApplicationForm } from "@/components/application-form";
import { jsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata("Claim Your Free Listing on The Renewable Directory", "Claim your listing, update your details, add your website and logo, and choose whether you want homeowner quote enquiries.", "/apply");

const faqs = [
  ["What happens after I apply?", "We review your claim, verify your accreditations, and confirm territory fit before your listing goes live."],
  ["Can I upgrade after claiming?", "Yes. Once your free listing is live, you can upgrade to Verified Listing, Featured Region, or Lead Package anytime."],
  ["How quickly will I hear back?", "Claims are reviewed promptly and you will hear back within 1\u20132 working days."],
  ["Is this really free?", "Yes. The basic listing is free. You only pay if you choose to upgrade to a premium package."]
];

export default function ApplyPage() {
  return (
    <main className="section-band">
      <div className="container-page grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="grid gap-6">
          <section className="surface-card surface-card-cream p-8 sm:p-10">
            <p className="eyebrow">For installers</p>
            <h1 className="mt-3 text-4xl font-bold leading-[0.96]">Claim Your Free Listing</h1>
            <p className="mt-4 leading-7 text-navy/70">
              We&rsquo;ve already created a free listing for your company on The Renewable Directory. You can claim it free, update your details, add your website and logo, and choose whether you want homeowner quote enquiries for Solar PV, Battery Storage or Heat Pumps in your area.
            </p>
          </section>

          <section className="surface-card-dossier p-6">
            <p className="eyebrow">What you get</p>
            <h2 className="mt-3 text-2xl font-bold">Benefits of claiming your listing</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-navy/70">
              <li>Free basic listing with your company details, services and certifications.</li>
              <li>Get found by homeowners searching for renewable installers in your area.</li>
              <li>Option to upgrade for priority placement and exclusive leads.</li>
              <li>Update your profile anytime through the installer dashboard.</li>
            </ul>
            <div className="mt-5">
              <Link href="/pricing" className="button-secondary text-sm">
                View pricing
              </Link>
            </div>
          </section>
        </div>
        <ApplicationForm />

        <section className="surface-card-dossier p-6 lg:col-span-2">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-2xl font-bold">Common questions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-[20px] border border-border bg-white p-4">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-2 text-navy/70">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
        })}
      />
    </main>
  );
}
