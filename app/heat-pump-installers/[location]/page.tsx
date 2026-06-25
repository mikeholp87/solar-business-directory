import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverageRibbon } from "@/components/coverage-ribbon";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { getLocationPageKeys, locationPages } from "@/lib/seo/location-pages";
import { jsonLd, pageMetadata } from "@/lib/seo";

const faqs = [
  ["Can I get BUS funding in this area?", "Potentially, if the property and installation meet the scheme criteria and the installer is appropriately accredited."],
  ["Are the installers independent?", "Yes. Directory installers are independent businesses, and Renewable Directory may receive referral or marketing fees."],
  ["How many installers can list in a territory?", "The default maximum is three active installers per territory, unless an admin override is applied."],
];

export function generateStaticParams() {
  return getLocationPageKeys().map((location) => ({ location }));
}

export function generateMetadata({ params }: { params: { location: string } }) {
  const page = locationPages[params.location];
  return pageMetadata(`BUS & MCS Heat Pump Installers in ${page?.label ?? "the UK"}`, page?.intro ?? "Search approved heat pump installers.", `/heat-pump-installers/${params.location}`);
}

export default async function LocationPage({ params }: { params: { location: string } }) {
  const page = locationPages[params.location] ?? locationPages.wales;
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const results = installers.filter((installer) => installer.status === "active" && installer.territoryIds.some((id) => page.territoryIds.includes(id)));
  const matchedTerritories = territories.filter((territory) => page.territoryIds.includes(territory.id));

  return (
    <main className="section-band">
      <div className="container-page grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
        <div className="grid gap-6">
          <nav className="text-sm font-bold text-navy/60">
            <Link href="/">Home</Link> / <Link href="/directory">Directory</Link> / {page.label}
          </nav>

          <section className="surface-card surface-card-cream p-8 sm:p-10">
            <p className="eyebrow">Location index</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.96] sm:text-5xl">Renewable installers in {page.label}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">{page.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {matchedTerritories.map((territory) => (
                <span key={territory.id} className="chip chip-soft">
                  {territory.name}
                </span>
              ))}
            </div>
          </section>

          <CoverageRibbon
            eyebrow="Coverage ribbon"
            title={`Installer coverage in ${page.label}`}
            description="This location page uses the same editorial system as the homepage and directory, so area, coverage, and records stay visible in one place."
            items={[
              { value: page.label, label: "location" },
              { value: `${results.length}`, label: "active installers" },
              { value: `${matchedTerritories.length}`, label: "territories" },
            ]}
            footnote="Use the directory record to compare coverage, certification, contact details, and the technology tags attached to each listing."
          />

          <div className="grid gap-5">
            {results.map((installer) => (
              <InstallerCard key={installer.id} installer={installer} />
            ))}
          </div>

          <section className="surface-card p-6">
            <p className="eyebrow">FAQs</p>
            <h2 className="mt-3 text-2xl font-black">Questions people ask before they enquire</h2>
            <div className="mt-4 grid gap-4">
              {faqs.map(([question, answer]) => (
                <details key={question} className="rounded-[20px] border border-border bg-white p-4">
                  <summary className="cursor-pointer font-bold">{question}</summary>
                  <p className="mt-2 text-navy/70">{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm compact />
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", itemListElement: ["Home", "Directory", page.label].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) },
            { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
            { "@type": "Organization", name: "Renewable Directory" },
          ],
        })}
      />
    </main>
  );
}
