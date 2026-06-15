import Link from "next/link";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { installers, territories } from "@/lib/data";
import { jsonLd, pageMetadata } from "@/lib/seo";

const pages: Record<string, { label: string; territoryIds: string[]; intro: string }> = {
  wales: { label: "Wales", territoryIds: ["north-wales", "south-wales", "mid-wales"], intro: "Compare BUS and MCS approved heat pump installers covering Welsh homes, including rural properties, coastal areas and urban retrofit projects." },
  "north-wales": { label: "North Wales", territoryIds: ["north-wales"], intro: "Find approved heat pump installers covering North Wales towns, counties and LL postcode areas." },
  "south-wales": { label: "South Wales", territoryIds: ["south-wales"], intro: "Search approved installers for Cardiff, Swansea, Newport, Bridgend and surrounding South Wales areas." },
  manchester: { label: "Manchester", territoryIds: ["north-west-england"], intro: "Request surveys from BUS and MCS approved installers covering Manchester and Greater Manchester." },
  liverpool: { label: "Liverpool", territoryIds: ["north-west-england"], intro: "Find territory-approved installers for Liverpool and Merseyside heat pump enquiries." },
  birmingham: { label: "Birmingham", territoryIds: ["midlands"], intro: "Compare Midlands installers for Birmingham homeowners considering air source heat pumps and BUS funding." },
  london: { label: "London", territoryIds: ["london"], intro: "Find London heat pump installers experienced with compact homes, terraces and fast survey turnaround." }
};

const faqs = [
  ["Can I get BUS funding in this area?", "Potentially, if the property and installation meet the scheme criteria and the installer is appropriately accredited."],
  ["Are the installers independent?", "Yes. Directory installers are independent businesses, and UKSD may receive referral or marketing fees."],
  ["How many installers can list in a territory?", "The default maximum is three active installers per territory, unless an admin override is applied."]
];

export function generateStaticParams() {
  return Object.keys(pages).map((location) => ({ location }));
}

export function generateMetadata({ params }: { params: { location: string } }) {
  const page = pages[params.location];
  return pageMetadata(`BUS & MCS Heat Pump Installers in ${page?.label ?? "the UK"}`, page?.intro ?? "Search approved heat pump installers.", `/heat-pump-installers/${params.location}`);
}

export default function LocationPage({ params }: { params: { location: string } }) {
  const page = pages[params.location] ?? pages.wales;
  const results = installers.filter((installer) => installer.status === "active" && installer.territoryIds.some((id) => page.territoryIds.includes(id)));
  const matchedTerritories = territories.filter((territory) => page.territoryIds.includes(territory.id));

  return (
    <main className="section-band">
      <div className="container-page">
        <nav className="mb-5 text-sm font-bold text-ink/60"><Link href="/">Home</Link> / <Link href="/directory">Directory</Link> / {page.label}</nav>
        <div className="grid gap-8 lg:grid-cols-[0.68fr_0.32fr]">
          <div>
            <h1 className="text-4xl font-black">BUS & MCS Heat Pump Installers in {page.label}</h1>
            <p className="mt-4 max-w-3xl leading-7 text-ink/70">{page.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {matchedTerritories.map((territory) => <span key={territory.id} className="rounded bg-skywash px-3 py-1 text-sm font-bold text-fern">{territory.name}</span>)}
            </div>
            <div className="mt-8 grid gap-5">
              {results.map((installer) => <InstallerCard key={installer.id} installer={installer} />)}
            </div>
            <section className="mt-8 rounded-lg border border-emerald-950/10 bg-white p-6">
              <h2 className="text-2xl font-black">FAQs</h2>
              <div className="mt-4 grid gap-4">
                {faqs.map(([question, answer]) => (
                  <details key={question} className="rounded border border-stone-200 p-4">
                    <summary className="cursor-pointer font-bold">{question}</summary>
                    <p className="mt-2 text-ink/70">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm compact />
          </aside>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "BreadcrumbList", itemListElement: ["Home", "Directory", page.label].map((name, index) => ({ "@type": "ListItem", position: index + 1, name })) },
            { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) },
            { "@type": "Organization", name: "UKSD BUS Installer Directory" }
          ]
        })}
      />
    </main>
  );
}
