import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Sun, BatteryCharging, Fan, Leaf, FileText, Building2, type LucideIcon } from "lucide-react";
import { HeroSearchForm } from "@/components/hero-search-form";
import { DirectoryResultCard } from "@/components/directory-result-card";
import { TerritoryList } from "@/components/territory-list";
import { LeadForm } from "@/components/lead-form";
import { listTerritories } from "@/lib/repositories/territories";
import { readHomepageData } from "@/lib/mcs-directory";
import { serviceFacets } from "@/lib/seo/service-facets";
import { jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

const features: Array<{ title: string; text: string }> = [
  { title: "Trusted & Verified", text: "All installers are MCS certified and vetted for your peace of mind." },
  { title: "Local & Reliable", text: "Find trusted local installers in your area." },
  { title: "Compare Quotes", text: "Get multiple quotes and choose the right installer." },
  { title: "Rated & Reviewed", text: "See real reviews from real customers." },
  { title: "Cleaner Future", text: "Connecting you with experts building a sustainable future." },
];

export default async function HomePage() {
  const [homepageData, territories] = await Promise.all([readHomepageData(), listTerritories()]);
  const featuredInstallers = homepageData.featuredInstallers;

  return (
    <main>
      {/* Hero - Postcode-first search */}
      <section className="bg-white">
        <div className="container-page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.06] tracking-tight text-navy sm:text-4xl lg:text-[3.25rem]">
              Find Trusted MCS Certified Renewable Installers Near You
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:mt-5 sm:text-base sm:leading-relaxed">
              Compare local Solar PV, Battery Storage and Heat Pump installers. Free to use. No obligation.
            </p>
            <HeroSearchForm />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-hero sm:aspect-[16/10] lg:aspect-auto lg:h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&crop=center"
              alt="UK home with solar panels installed on roof"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-band bg-surface">
        <div className="container-page">
          <p className="eyebrow">Directory Categories</p>
          <h2 className="mt-3 text-2xl font-bold text-navy sm:mt-4 sm:text-3xl">
            Find trusted installers for your renewable project
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {serviceFacets.map((facet) => (
              <Link
                key={facet.slug}
                href={`/services/${facet.slug}`}
                className="flex min-h-[140px] flex-col items-center justify-between gap-3 rounded-card border border-border bg-white p-4 text-center transition-all hover:border-accent hover:shadow-card-hover sm:min-h-[166px] sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-light sm:h-14 sm:w-14">
                  <CategoryIcon type={facet.type} />
                </div>
                <span className="text-sm font-semibold leading-tight text-navy">{facet.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/directory" className="button-secondary text-sm">
              Browse all installer categories
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="section-band bg-navy">
        <div className="container-page grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-accent">
                <CheckCircle size={20} className="text-white" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">{f.title}</h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/65">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Homeowner lead capture */}
      <section className="section-band">
        <div className="container-page">
          <div className="mx-auto max-w-lg">
            <div className="text-center">
              <p className="eyebrow">Get free quotes</p>
              <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
                Get Free Quotes From Local Installers
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Fill in your details and we&apos;ll match you with MCS certified installers in your area. No obligation.
              </p>
            </div>
            <div className="mt-6">
              <LeadForm compact />
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      {featuredInstallers.length > 0 && (
        <section className="section-band bg-surface">
          <div className="container-page">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="eyebrow">Directory index</p>
                <h2 className="mt-3 text-2xl font-bold text-navy sm:mt-4 sm:text-3xl">Browse MCS certified installers</h2>
              </div>
              <Link className="button-secondary text-sm" href="/directory">
                View all listings
              </Link>
            </div>
            <div className="grid gap-5">
              {featuredInstallers.map((installer) => (
                <DirectoryResultCard key={installer.installerId ?? `${installer.companyName}-${installer.sourcePage}`} installer={installer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Installer CTA */}
      <section className="section-band border-t border-border">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">For installers</p>
            <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
              Claim your free listing on The Renewable Directory
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              We&apos;ve already created a free listing for your company. You can claim it free, update your details, add your website and logo, and choose whether you want homeowner quote enquiries for Solar PV, Battery Storage or Heat Pumps in your area.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link className="button-primary text-sm" href="/apply">
                Claim Your Free Listing
              </Link>
              <Link className="button-secondary text-sm" href="/pricing">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Territories */}
      {territories.length > 0 && (
        <section className="section-band bg-surface">
          <div className="container-page">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
              <div>
                <p className="eyebrow">Installer territories</p>
                <h2 className="mt-3 text-2xl font-bold text-navy sm:mt-4 sm:text-3xl">Coverage across the UK</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">Find installers that cover your area.</p>
              </div>
              <Link className="button-secondary w-full justify-center text-sm sm:w-auto" href="/directory">
                Browse the directory
              </Link>
            </div>
            <TerritoryList items={territories} />
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Renewable Directory",
          url: siteUrl(),
          description: "Find trusted MCS certified solar PV, battery storage and heat pump installers across the UK.",
        })}
      />
    </main>
  );
}

const categoryIcons: Record<string, LucideIcon> = {
  "Solar PV": Sun,
  "Battery Storage": BatteryCharging,
  "Air Source Heat Pump": Fan,
  "Ground/Water Source Heat Pump": Fan,
  Biomass: Leaf,
  "Technical surveys": FileText,
  "Heat loss calculations": FileText,
};

function CategoryIcon({ type }: { type: string }) {
  const Icon = categoryIcons[type] ?? Building2;
  return <Icon size={28} strokeWidth={2} className="text-accent" aria-hidden="true" />;
}
