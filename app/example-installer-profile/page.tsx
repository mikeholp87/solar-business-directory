import type { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  Clock,
  BadgeCheck,
  Star,
  MapPin,
  Phone,
  Globe,
  Sun,
  BatteryCharging,
  Thermometer,
  Zap,
  Wrench,
  ArrowUpCircle,
  Building2,
  FileText,
  Search,
  AlertTriangle,
  Send,
  CheckCircle,
  Shield,
} from "lucide-react";
import { EXAMPLE_COMPANY } from "@/data/profile-example";
import {
  ExampleProfileForm,
  ExampleProfileStickyCta,
  PostcodeChecker,
} from "@/components/example-profile-client";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

const C = EXAMPLE_COMPANY;

export const metadata: Metadata = pageMetadata(
  "GreenVolt Renewables Ltd | Example Installer Profile",
  "View an example premium renewable installer profile with verified reviews, accreditations, project gallery, service areas and free quote request.",
  "/example-installer-profile"
);

/* ── Icon Map ────────────────────────────────────────────────────── */

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={20} />,
  Award: <Award size={20} />,
  CheckCircle: <CheckCircle size={20} />,
  Shield: <Shield size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  Clock: <Clock size={20} />,
  Sun: <Sun size={22} />,
  BatteryCharging: <BatteryCharging size={22} />,
  Thermometer: <Thermometer size={22} />,
  Zap: <Zap size={22} />,
  Wrench: <Wrench size={22} />,
  ArrowUpCircle: <ArrowUpCircle size={22} />,
  Building2: <Building2 size={22} />,
  FileText: <FileText size={22} />,
  Star: <Star size={22} />,
  Search: <Search size={22} />,
  AlertTriangle: <AlertTriangle size={22} />,
  Send: <Send size={22} />,
};

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "Solar PV": ICON_MAP.Sun,
  "Battery Storage": ICON_MAP.BatteryCharging,
  "Air Source Heat Pumps": ICON_MAP.Thermometer,
  "EV Chargers": ICON_MAP.Zap,
};

/* ── Rating Stars ────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={i < Math.floor(rating) ? "size-4 text-amber-400" : "size-4 text-border"}
          fill="currentColor"
        >
          <path d="M10 1l2.39 4.84L18 7.27l-3.91 3.81.93 5.38L10 13.81 5.98 16.46l.93-5.38L3 7.27l5.61-.62L10 1z" />
        </svg>
      ))}
    </span>
  );
}

/* ── Section Wrapper ─────────────────────────────────────────────── */

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`section-band ${className ?? ""}`.trim()}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ExampleInstallerProfilePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy via-navy to-[#0d2338]">
        <div className="container-page py-10 sm:py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            {/* Left column */}
            <div className="space-y-5">
              {/* Featured badge */}
              {C.featured && (
                <span className="chip chip-success !bg-white/10 !border-white/15 !text-white">
                  <BadgeCheck size={14} />
                  Featured Installer
                </span>
              )}

              {/* Company name */}
              <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                {C.name}
              </h1>

              {/* Tagline */}
              <p className="max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                {C.tagline}
              </p>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2">
                <StarRating rating={C.rating} />
                <span className="text-sm font-bold text-white/80">
                  {C.rating}/5
                </span>
                <span className="text-sm text-white/50">
                  from {C.reviewCount} verified reviews
                </span>
              </div>

              {/* Trust statement */}
              <p className="max-w-lg text-sm leading-6 text-white/55">
                {C.trustStatement}
              </p>

              {/* Services badges */}
              <div className="flex flex-wrap gap-2">
                {C.services.map((service) => (
                  <span
                    key={service}
                    className="chip chip-soft !bg-white/10 !border-white/15 !text-white"
                  >
                    {SERVICE_ICONS[service]}
                    {service}
                  </span>
                ))}
              </div>

              {/* Location */}
              <p className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={16} />
                Based in {C.location} &middot; Covering {C.coverage}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#enquiry-form" className="button-primary">
                  Request a Free Quote
                </a>
                <a href={`tel:${C.phone}`} className="button-secondary !border-white/20 !bg-transparent !text-white hover:!bg-white/10">
                  <Phone size={16} />
                  {C.phone}
                </a>
                <a
                  href={C.website}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary !border-white/20 !bg-transparent !text-white hover:!bg-white/10"
                >
                  <Globe size={16} />
                  Visit Website
                </a>
              </div>
            </div>

            {/* Right column — hero visual */}
            <div className="hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-accent/20 via-navy to-accent/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-white/10">
                      <Sun size={40} className="text-accent" />
                    </div>
                    <p className="text-sm font-bold text-white/60">
                      Premium Renewable Installer
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Solar &middot; Battery &middot; Heat Pump &middot; EV
                    </p>
                  </div>
                </div>
                {/* Decorative top bar */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-accent via-accent/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust & Accreditation Strip */}
      <section className="border-b border-border bg-surface py-5">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {C.accreditations.map((acc) => (
              <div
                key={acc.label}
                className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-bold text-navy/70 sm:px-4"
              >
                <span className="text-accent">{ICON_MAP[acc.icon]}</span>
                <span className="hidden sm:inline">{acc.label}</span>
                <span className="sm:hidden">
                  {acc.label.length > 15
                    ? acc.label.slice(0, 15) + "..."
                    : acc.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quick Stats */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {C.stats.map((stat) => (
            <div
              key={stat.label}
              className="surface-card p-5 text-center sm:p-6"
            >
              <p className="text-3xl font-black tracking-tight text-accent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. About the Installer */}
      <Section className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <span className="eyebrow">About the installer</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {C.name}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              {C.about}
            </p>
            <ul className="mt-5 grid gap-2">
              {C.aboutBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-sm leading-6 text-navy/75">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Why choose card */}
          <div className="surface-card surface-card-cream p-6 sm:p-7 lg:self-start">
            <h3 className="text-lg font-bold">Why homeowners choose GreenVolt</h3>
            <div className="mt-4 grid gap-3">
              {C.whyChoose.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-bold text-navy">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 5. Services Provided */}
      <Section className="!pt-0">
        <span className="eyebrow">Services provided</span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          What we offer
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {C.services.map((service) => (
            <div
              key={service.name}
              className="surface-card index-card--hover grid gap-3 p-5 sm:p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-light text-accent">
                {ICON_MAP[service.icon]}
              </span>
              <div>
                <h3 className="text-base font-bold">{service.name}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Reviews */}
      <Section className="!pt-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Homeowner reviews</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              What our customers say
            </h2>
          </div>
          <div className="surface-card flex items-center gap-4 px-5 py-4">
            <div className="text-center">
              <p className="text-3xl font-black text-accent">{C.rating}</p>
              <StarRating rating={C.rating} />
            </div>
            <div className="text-sm">
              <p className="font-bold text-navy">{C.reviewCount} verified reviews</p>
              <p className="text-muted-subtle">from homeowners</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {C.reviews.map((review) => (
            <div key={review.name} className="surface-card grid gap-3 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-muted-subtle">{review.date}</span>
              </div>
              <p className="text-sm leading-6 text-navy/80">
                &ldquo;{review.text}&rdquo;
              </p>
              <div>
                <p className="text-sm font-bold text-navy">{review.name}</p>
                <p className="text-xs text-muted">
                  {review.location} &middot; {review.service}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-xl border border-border bg-surface px-4 py-3 text-xs leading-5 text-muted-subtle">
          Reviews are monitored by The Renewable Directory. Installers may
          respond to reviews and dispute unfair or unverifiable feedback.
        </p>
      </Section>

      {/* 7. Project Gallery */}
      <Section className="!pt-0">
        <span className="eyebrow">Project gallery</span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Recent installations
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {C.projects.map((project) => (
            <div
              key={project.type}
              className="surface-card overflow-hidden"
            >
              {/* Placeholder image */}
              <div
                className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-surface to-surface-alt"
                role="img"
                aria-label={`${project.type} in ${project.location}`}
              >
                <div className="text-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white text-accent shadow-soft">
                    <Sun size={22} />
                  </span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-subtle">
                    Renewable Installation
                  </p>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm font-bold text-navy">{project.type}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">
                  <span>{project.location}</span>
                  <span className="mx-1.5 text-border">|</span>
                  <span>{project.system}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 8. Service Area */}
      <Section className="!pt-0">
        <div className="surface-card surface-card-dossier grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="eyebrow">Service area</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Where we work
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Based in {C.location}, covering {C.coverage}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {C.coverage
                .replace(" and surrounding areas", "")
                .split(", ")
                .map((area) => (
                  <span key={area} className="chip chip-soft">
                    {area}
                  </span>
                ))}
            </div>
          </div>
          <div className="surface-card p-5 sm:p-6">
            <h3 className="text-base font-bold">Check your postcode</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              See if GreenVolt Renewables covers your area.
            </p>
            <div className="mt-4">
              <PostcodeChecker />
            </div>
          </div>
        </div>
      </Section>

      {/* 9. Why Use The Renewable Directory */}
      <Section className="!pt-0">
        <span className="eyebrow">The Renewable Directory</span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Why homeowners use The Renewable Directory
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          The Renewable Directory helps homeowners find trusted renewable energy
          installers with clear profiles, visible accreditations, homeowner
          reviews and simple quote requests.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {C.directoryBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="surface-card surface-card-cream flex items-start gap-3 p-5 sm:p-6"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-soft">
                {ICON_MAP[benefit.icon]}
              </span>
              <div>
                <h3 className="text-sm font-bold text-navy">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Lead Capture Form */}
      <Section className="!pt-0">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <span className="eyebrow">Get a quote</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Fill in the form below and GreenVolt Renewables or The Renewable
              Directory team will be in touch.
            </p>
          </div>
          <ExampleProfileForm />
        </div>
      </Section>

      {/* 11. Sticky Mobile CTA */}
      <ExampleProfileStickyCta />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: C.name,
          description: C.about,
          url: `${siteUrl()}/example-installer-profile`,
          telephone: C.phone,
          email: C.email,
          areaServed: C.coverage,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: C.rating,
            reviewCount: C.reviewCount,
          },
          review: C.reviews.map((r) => ({
            "@type": "Review",
            author: r.name,
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
          })),
          makesOffer: C.services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.desc,
            },
          })),
        })}
      />
    </>
  );
}
