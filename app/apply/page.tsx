import { ApplicationForm } from "@/components/application-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Join Renewable Directory as an Installer", "Apply for territory-based exposure, qualified homeowner enquiries and reduced-cost lead opportunities.", "/apply");

export default function ApplyPage() {
  return (
    <main className="section-band">
      <div className="container-page grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="grid gap-6">
          <section className="surface-card surface-card-cream p-8 sm:p-10">
            <p className="eyebrow">Installer onboarding</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.96]">Join Renewable Directory as an installer</h1>
            <p className="mt-4 leading-7 text-navy/70">
              Secure territory-based exposure, receive qualified homeowner enquiries, and present your accreditation and coverage inside a premium public directory.
            </p>
          </section>

          <section className="surface-card-dossier p-6">
            <p className="eyebrow">Commercial models</p>
            <h2 className="mt-3 text-2xl font-black">Choose the relationship that fits your business</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-navy/70">
              <li>Monthly residual directory listing.</li>
              <li>Reduced-cost pay-per-lead for approved members.</li>
              <li>Hybrid pay-per-install tracking: £250 + VAT on BUS acceptance and £1,000 + VAT on completion.</li>
            </ul>
          </section>
        </div>
        <ApplicationForm />
      </div>
    </main>
  );
}
