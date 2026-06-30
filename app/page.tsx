import Image from "next/image";
import Link from "next/link";
import { CheckCircle, type LucideIcon } from "lucide-react";
import { HeroSearchForm } from "@/components/hero-search-form";
import { DirectoryResultCard } from "@/components/directory-result-card";
import { TerritoryList } from "@/components/territory-list";
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
      {/* Hero */}
      <section className="bg-surface">
        <div className="container-page grid items-center gap-6 py-10 sm:gap-8 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.06] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
              Find Trusted Solar &amp; Heat Pump Installers Across The UK
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted sm:mt-5 sm:text-base sm:leading-relaxed">
              Compare local MCS-certified installers, request quotes and connect with trusted renewable energy specialists in your area.
            </p>
            <HeroSearchForm />
            <p className="mt-4 max-w-lg text-xs leading-6 text-navy/55 sm:text-sm">
              Start with your postcode. You can refine by service before you leave the homepage.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card-hover sm:aspect-[16/10] lg:aspect-auto lg:h-[320px]">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&crop=center"
              alt="UK home with solar panels installed on roof"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-navy/72 p-3 text-white backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60">Quick start</p>
              <p className="mt-1 text-sm leading-6 text-white/86">Find installers near you, then compare services, coverage, and contact details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-white py-5">
        <div className="container-page grid gap-3 sm:grid-cols-3 sm:gap-4">
          {["MCS Certified Installers", "Free to Use", "No Obligation Quotes"].map((badge) => (
            <div key={badge} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-center">
              <CheckCircle size={18} className="shrink-0 text-accent" />
              <span className="text-sm font-medium text-navy">{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-band bg-surface">
          <div className="container-page">
            <p className="eyebrow">Directory Categories</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {serviceFacets.map((facet) => (
              <Link
                key={facet.slug}
                href={`/services/${facet.slug}`}
                className="flex min-h-[140px] flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 text-center transition-all hover:border-accent hover:shadow-card sm:min-h-[166px] sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
                  <CategoryIcon type={facet.type} />
                </div>
                <span className="text-sm font-semibold leading-tight text-navy">{facet.label}</span>
              </Link>
            ))}
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

      {/* Featured listings */}
      {featuredInstallers.length > 0 && (
        <section className="section-band">
          <div className="container-page">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <p className="eyebrow">Directory index</p>
              <h2 className="mt-3 text-2xl font-bold text-navy sm:mt-4 sm:text-3xl">Browse the MCS installer index</h2>
              <Link className="button-secondary text-sm sm:hidden" href="/directory">
                View all results
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
          description: "Find trusted solar PV, battery storage, heat pump, and EV charger installers across the UK.",
        })}
      />
    </main>
  );
}

function CategoryIcon({ type }: { type: string }) {
  const color = "#102A43";
  const accent = "#00A651";
  switch (type) {
    case "Solar PV":
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <rect x="8" y="18" width="32" height="20" rx="2" />
          <line x1="8" y1="26" x2="40" y2="26" />
          <line x1="8" y1="34" x2="40" y2="34" />
          <line x1="18" y1="18" x2="18" y2="38" />
          <line x1="28" y1="18" x2="28" y2="38" />
          <circle cx="36" cy="12" r="4" stroke={accent} fill="none" />
        </svg>
      );
    case "Battery Storage":
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <rect x="12" y="12" width="24" height="28" rx="3" />
          <rect x="18" y="8" width="12" height="4" rx="1" />
          <path d="M20 26l4-6 4 6" stroke={accent} />
          <line x1="24" y1="20" x2="24" y2="32" stroke={accent} />
        </svg>
      );
    case "Air Source Heat Pump":
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <rect x="8" y="16" width="20" height="24" rx="3" />
          <circle cx="18" cy="28" r="6" />
          <path d="M32 20l8-4v20l-8-4" />
          <path d="M34 18c2 2 2 6 0 8" stroke={accent} />
          <path d="M37 16c3 3 3 10 0 14" stroke={accent} />
        </svg>
      );
    case "Ground/Water Source Heat Pump":
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <rect x="8" y="8" width="18" height="18" rx="3" />
          <circle cx="17" cy="17" r="5" />
          <path d="M17 26v10" />
          <path d="M12 36h10" />
          <path d="M14 30c0 0 2 6 6 6" stroke={accent} />
          <path d="M30 14l6-4v24l-6-4" />
          <path d="M32 12c2 2 2 6 0 8" stroke={accent} />
        </svg>
      );
    case "Biomass":
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <path d="M24 6c0 8-10 12-10 20a10 10 0 0 0 20 0C34 18 24 14 24 6z" />
          <path d="M24 18c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" stroke={accent} />
          <line x1="24" y1="38" x2="24" y2="44" />
          <line x1="18" y1="44" x2="30" y2="44" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
          <rect x="8" y="14" width="32" height="26" rx="2" />
          <path d="M8 14l16-6 16 6" stroke={accent} />
          <rect x="12" y="18" width="8" height="8" rx="1" />
          <rect x="24" y="18" width="8" height="8" rx="1" />
        </svg>
      );
  }
}
