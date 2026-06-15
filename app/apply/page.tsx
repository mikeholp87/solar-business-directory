import { ApplicationForm } from "@/components/application-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Join the UKSD Approved Installer Directory", "Apply for territory-based exposure, qualified homeowner enquiries and reduced-cost lead opportunities.", "/apply");

export default function ApplyPage() {
  return (
    <main className="section-band">
      <div className="container-page grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div>
          <p className="eyebrow">Installer onboarding</p>
          <h1 className="mt-3 text-4xl font-black">Join the UKSD Approved Installer Directory</h1>
          <p className="mt-4 leading-7 text-ink/70">Secure territory-based exposure, receive qualified homeowner enquiries, and access reduced-cost lead opportunities.</p>
          <div className="surface-card mt-6 p-5">
            <h2 className="text-xl font-black">Commercial models supported</h2>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">
              <li>Monthly residual directory listing.</li>
              <li>Reduced-cost pay-per-lead for approved members.</li>
              <li>Hybrid pay-per-install tracking: £250 + VAT on BUS acceptance and £1,000 + VAT on completion.</li>
            </ul>
          </div>
        </div>
        <ApplicationForm />
      </div>
    </main>
  );
}
