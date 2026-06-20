import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgePoundSterling, ClipboardCheck, MapPinned, UsersRound, type LucideIcon } from "lucide-react";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { TerritoryList } from "@/components/territory-list";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

export default async function HomePage() {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const featuredInstallers = installers.filter((installer) => installer.status === "active").slice(0, 3);
  const proofPoints = [
    ["MCS", "verified installer records"],
    ["BUS", "scheme eligibility guidance"],
    ["3", "active listings per territory"]
  ];
  const benefits: Array<[LucideIcon, string, string]> = [
    [MapPinned, "Search by territory", "Use postcode, town, county, or region to find installers that cover your area."],
    [ClipboardCheck, "Check the details", "Review certification body, certification number, contact info, and regions covered before you enquire."],
    [UsersRound, "Compare by type", "Filter by technology type to narrow the directory to the installers you actually need."],
    [BadgePoundSterling, "For homeowners and installers", "Homeowners can find help fast, and installers can receive qualified enquiries."]
  ];

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=2200&auto=format&fit=crop"
            alt="Modern UK home with renewable energy upgrades"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/66 to-ink/18" />
        </div>
        <div className="container-page grid min-h-[760px] items-center gap-8 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div className="surface-card surface-card-cream max-w-3xl p-8 sm:p-10 lg:p-12">
            <p className="eyebrow">Renewable installer directory</p>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] text-black sm:text-5xl lg:text-6xl">Find the right renewable installer without digging through every listing</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/75">
              Renewable Directory helps homeowners and installers compare MCS-certified businesses, filter by technology type, and check coverage, contact details, and Boiler Upgrade Scheme eligibility in one place.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {proofPoints.map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-ink/10 bg-white/75 p-4">
                  <p className="text-2xl font-black tracking-tight text-black">{value}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/65">{label}</p>
                </div>
              ))}
            </div>
            <form action="/directory" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[22px] border border-ink/10 bg-white/92 p-2 shadow-soft sm:flex-row">
              <input name="q" placeholder="Enter postcode, town or county" className="border-0 bg-transparent" />
              <button className="button-primary shrink-0" type="submit">Search the Directory <ArrowRight size={18} /></button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-secondary" href="/apply">Join the Directory</Link>
              <Link className="button-secondary" href="/heat-pump-installers/wales">Browse Wales pages</Link>
            </div>
          </div>
          <div className="lg:pl-4">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-4">
            {benefits.map(([Icon, title, text]) => (
              <div key={title} className="surface-card p-5">
                <Icon className="text-fern" size={26} />
                <h3 className="mt-4 text-lg font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">{text as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-black">Why people use the directory</h2>
            <p className="mt-4 leading-7 text-ink/70">
              The Boiler Upgrade Scheme can contribute up to £7,500 towards eligible air source heat pump installations in England and Wales, but eligibility depends on the property, technology, installer accreditation, and current scheme rules.
            </p>
            <p className="mt-4 leading-7 text-ink/70">
              Renewable Directory makes that first step simpler: find installers that cover your area, compare technology tags, and open the record with the phone number, email, website, and certification details you need to follow up.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-black">Featured listings</h2>
            <div className="mt-5 grid gap-5">
              {featuredInstallers.map((installer) => <InstallerCard key={installer.id} installer={installer} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="container-page">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Installer territories</h2>
              <p className="mt-2 text-ink/65">Each territory keeps the directory focused so visitors can see who actually covers their area.</p>
            </div>
            <Link className="button-secondary" href="/apply">Add your business</Link>
          </div>
          <TerritoryList items={territories} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Renewable Directory",
          url: siteUrl(),
          description: "Directory for renewable installers, technology filters, and MCS and BUS listing details."
        })}
      />
    </main>
  );
}
