import Link from "next/link";
import { ArrowRight, ClipboardCheck, MapPinned, UsersRound, type LucideIcon } from "lucide-react";
import { CoverageRibbon } from "@/components/coverage-ribbon";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { TerritoryList } from "@/components/territory-list";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

export default async function HomePage() {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const activeInstallers = installers.filter((installer) => installer.status === "active");
  const featuredInstallers = activeInstallers.slice(0, 3);
  const proofs = [
    { value: `${activeInstallers.length}`, label: "active listings" },
    { value: `${territories.length}`, label: "territories" },
    { value: "3", label: "per territory" },
  ];
  const ribbonItems = [
    { value: `${activeInstallers.length}`, label: "active listings" },
    { value: `${territories.length}`, label: "territories" },
    { value: "MCS", label: "verified records" },
    { value: "BUS", label: "eligibility guidance" },
  ];
  const benefits: Array<[LucideIcon, string, string]> = [
    [MapPinned, "Coverage first", "Search by postcode, town, county, or region before you compare names."],
    [ClipboardCheck, "Record over rhetoric", "Open certification, website, email, phone, and coverage in one place."],
    [UsersRound, "Type-aware search", "Filter the directory by technology type instead of scrolling through every listing."],
  ];

  return (
    <main>
      <section className="section-band pt-8">
        <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="grid gap-6">
            <div className="surface-card surface-card-cream p-8 sm:p-10 lg:p-12">
              <p className="eyebrow">Renewable Directory</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.94] text-black sm:text-5xl lg:text-6xl">
                A curated index of renewable installers, by territory and technology type
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/74">
                Use Renewable Directory to compare MCS-certified businesses, check coverage, and open the record before you make contact. The site is built to help homeowners and installers move from search to action without wading through generic listings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="button-primary" href="/directory">
                  Search the Directory
                  <ArrowRight size={18} />
                </Link>
                <Link className="button-secondary" href="/apply">
                  Join the Directory
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {proofs.map((item) => (
                  <div key={item.label} className="rounded-[20px] border border-ink/10 bg-white/76 p-4">
                    <p className="text-2xl font-black tracking-tight text-black">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-ink/65">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {benefits.map(([Icon, title, text]) => (
                <div key={title} className="index-card p-5">
                  <Icon className="text-fern" size={26} />
                  <h2 className="mt-4 text-lg font-black">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <CoverageRibbon
              eyebrow="Coverage ribbon"
              title="A quick read on what the directory covers"
              description="The atlas band ties the site together: territory counts, listing counts, and the verification context visitors care about before they enquire."
              items={ribbonItems}
              footnote="The same visual language appears on location pages so the directory feels like one system, not a collection of unrelated pages."
            />
            <div className="surface-card-dossier rounded-[24px] p-6">
              <p className="eyebrow">How to use it</p>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/72">
                <li>Search by place, company, or certification number.</li>
                <li>Filter by technology type when you know the system you need.</li>
                <li>Open the record to see contact details, coverage, and certification body.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Why people use the directory</p>
            <h2 className="mt-4 text-3xl font-black">Find installers that actually cover your area</h2>
            <p className="mt-4 leading-7 text-ink/70">
              The Boiler Upgrade Scheme can contribute up to £7,500 towards eligible air source heat pump installations in England and Wales, but eligibility depends on the property, technology, installer accreditation, and current scheme rules.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              Renewable Directory turns that first step into a cleaner process: see who covers your area, compare technology tags, and move straight to the source record with the contact details and certification information you need.
            </p>
          </div>
          <div>
            <p className="eyebrow">Featured listings</p>
            <div className="mt-4 grid gap-5">
              {featuredInstallers.map((installer) => (
                <InstallerCard key={installer.id} installer={installer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Installer territories</p>
                <h2 className="mt-4 text-3xl font-black">Coverage stays visible throughout the site</h2>
                <p className="mt-2 max-w-2xl text-ink/65">Territory pages and the directory use the same editorial structure, so location context never feels buried.</p>
              </div>
              <Link className="button-secondary" href="/directory">
                Browse the directory
              </Link>
            </div>
            <TerritoryList items={territories} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Renewable Directory",
          url: siteUrl(),
          description: "Directory for renewable installers, technology filters, and MCS and BUS listing details.",
        })}
      />
    </main>
  );
}
