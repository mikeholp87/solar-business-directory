import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgePoundSterling, ClipboardCheck, MapPinned, UsersRound, type LucideIcon } from "lucide-react";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { TerritoryList } from "@/components/territory-list";
import { installers, territories } from "@/lib/data";
import { jsonLd } from "@/lib/seo";

export default function HomePage() {
  const featuredInstallers = installers.filter((installer) => installer.status === "active").slice(0, 3);
  const benefits: Array<[LucideIcon, string, string]> = [
    [MapPinned, "Search by territory", "Use postcode, town, county or region to find available installers."],
    [ClipboardCheck, "Check qualification", "Capture property details, interest areas and contact consent."],
    [UsersRound, "Compare approved firms", "View MCS, BUS and trust credentials before requesting a survey."],
    [BadgePoundSterling, "Lower-cost leads", "Paying directory members can access qualified homeowner enquiries."]
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
          <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/72 to-ink/20" />
        </div>
        <div className="container-page grid min-h-[680px] items-center gap-10 py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl text-white">
            <p className="mb-4 inline-flex rounded bg-white/12 px-3 py-1 text-sm font-bold backdrop-blur">BUS / MCS approved installer directory</p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Find Trusted BUS & MCS Approved Heat Pump Installers Near You</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">Compare approved local installers and check whether you could qualify for up to £7,500 towards an air source heat pump through the Boiler Upgrade Scheme.</p>
            <form action="/directory" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg bg-white p-2 sm:flex-row">
              <input name="q" placeholder="Enter postcode, town or county" className="border-0" />
              <button className="button-primary shrink-0" type="submit">Find an Installer <ArrowRight size={18} /></button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-secondary" href="/apply">Apply to Join as an Installer</Link>
              <Link className="button-secondary" href="/heat-pump-installers/wales">Wales installer pages</Link>
            </div>
          </div>
          <LeadForm compact />
        </div>
      </section>

      <section className="section-band">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-4">
            {benefits.map(([Icon, title, text]) => (
              <div key={title} className="rounded-lg border border-emerald-950/10 bg-white p-5">
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
            <h2 className="text-3xl font-black">What is the Boiler Upgrade Scheme?</h2>
            <p className="mt-4 leading-7 text-ink/70">The Boiler Upgrade Scheme can contribute up to £7,500 towards eligible air source heat pump installations in England and Wales. Eligibility depends on the property, technology, installer accreditation and current scheme rules.</p>
            <p className="mt-4 leading-7 text-ink/70">UKSD-approved directory listings help homeowners reach independent installers who can survey, design and advise on BUS suitability.</p>
          </div>
          <div>
            <h2 className="text-3xl font-black">Featured approved installers</h2>
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
              <p className="mt-2 text-ink/65">Each territory has a default cap of three active installer listings.</p>
            </div>
            <Link className="button-secondary" href="/apply">Join the Directory</Link>
          </div>
          <TerritoryList items={territories} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "UKSD BUS Installer Directory",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
          description: "Directory for approved BUS and MCS heat pump installers across UK territories."
        })}
      />
    </main>
  );
}
