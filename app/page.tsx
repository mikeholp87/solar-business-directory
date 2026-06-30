import Image from "next/image";
import Link from "next/link";
import { CheckCircle, type LucideIcon } from "lucide-react";
import { HeroSearchForm } from "@/components/hero-search-form";
import { DirectoryResultCard } from "@/components/directory-result-card";
import { TerritoryList } from "@/components/territory-list";
import { listTerritories } from "@/lib/repositories/territories";
import { readDirectoryData } from "@/lib/mcs-directory";
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
  const [directoryData, territories] = await Promise.all([readDirectoryData(), listTerritories()]);
  const featuredInstallers = directoryData.installers.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="bg-surface">
        <div className="container-page grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
              Find Trusted Solar &amp; Heat Pump Installers Across The UK
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Compare local MCS-certified installers, request quotes and connect with trusted renewable energy specialists in your area.
            </p>
            <HeroSearchForm />
          </div>
          <div className="relative hidden h-[320px] overflow-hidden rounded-lg shadow-card-hover lg:block">
            <Image
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop&crop=center"
              alt="UK home with solar panels installed on roof"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 0px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-white py-5">
        <div className="container-page flex flex-wrap items-center justify-center gap-8">
          {["MCS Certified Installers", "Free to Use", "No Obligation Quotes"].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-accent" />
              <span className="text-sm font-medium text-navy">{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-band bg-surface">
          <div className="container-page">
            <p className="eyebrow">Directory Categories</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {serviceFacets.map((facet) => (
              <Link
                key={facet.slug}
                href={`/services/${facet.slug}`}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-white p-6 text-center transition-all hover:border-accent hover:shadow-card"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  <CategoryIcon type={facet.type} />
                </div>
                <span className="text-sm font-semibold text-navy leading-tight">{facet.label}</span>
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
            <div className="mb-8">
              <p className="eyebrow">Directory index</p>
              <h2 className="mt-4 text-3xl font-bold text-navy">Browse the MCS installer index</h2>
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
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Installer territories</p>
                <h2 className="mt-4 text-3xl font-bold text-navy">Coverage across the UK</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">Find installers that cover your area.</p>
              </div>
              <Link className="button-secondary text-sm" href="/directory">
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
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
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
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
          <rect x="12" y="12" width="24" height="28" rx="3" />
          <rect x="18" y="8" width="12" height="4" rx="1" />
          <path d="M20 26l4-6 4 6" stroke={accent} />
          <line x1="24" y1="20" x2="24" y2="32" stroke={accent} />
        </svg>
      );
    case "Air Source Heat Pump":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
          <rect x="8" y="16" width="20" height="24" rx="3" />
          <circle cx="18" cy="28" r="6" />
          <path d="M32 20l8-4v20l-8-4" />
          <path d="M34 18c2 2 2 6 0 8" stroke={accent} />
          <path d="M37 16c3 3 3 10 0 14" stroke={accent} />
        </svg>
      );
    case "Ground/Water Source Heat Pump":
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
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
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
          <path d="M24 6c0 8-10 12-10 20a10 10 0 0 0 20 0C34 18 24 14 24 6z" />
          <path d="M24 18c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" stroke={accent} />
          <line x1="24" y1="38" x2="24" y2="44" />
          <line x1="18" y1="44" x2="30" y2="44" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke={color} strokeWidth="1.5">
          <rect x="8" y="14" width="32" height="26" rx="2" />
          <path d="M8 14l16-6 16 6" stroke={accent} />
          <rect x="12" y="18" width="8" height="8" rx="1" />
          <rect x="24" y="18" width="8" height="8" rx="1" />
        </svg>
      );
  }
}
