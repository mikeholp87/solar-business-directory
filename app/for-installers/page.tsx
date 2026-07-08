import Link from "next/link";
import {
  CheckCircle,
  MapPin,
  Star,
  Phone,
  Globe,
  ShieldCheck,
  BadgeCheck,
  PlugZap,
  Sun,
  BatteryCharging,
  Thermometer,
  Wrench,
  Building2,
  ArrowRight,
  TrendingUp,
  Search,
  Users,
  FileText,
  Award,
  Clock,
} from "lucide-react";
import { InstallerClaimForm } from "@/components/installer-claim-form";
import { InstallerStickyCta } from "@/components/installer-sticky-cta";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

export const metadata = pageMetadata(
  "For Installers | Claim Your Free Listing",
  "Claim your free renewable installer listing. Verify your details, get found by homeowners, and upgrade for featured visibility and priority leads. Solar, battery, heat pump and EV installers.",
  "/for-installers"
);

export default function ForInstallersPage() {
  return (
    <main>
      <InstallerStickyCta />

      {/* Section 1: Hero */}
      <section className="bg-navy text-white">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
              For renewable energy installers
            </p>
            <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-[1.06] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              Claim Your Free Renewable Installer Listing
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:mt-5 sm:text-base">
              We&rsquo;re launching The Renewable Directory across the UK. Claim your free installer listing, verify your company details and get found by homeowners searching for trusted solar, battery, EV charger and heat pump specialists.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <Link
                href="#claim-form"
                className="button-primary text-sm"

              >
                Claim Your Free Listing
              </Link>
              <Link
                href="#pricing-ladder"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"

              >
                View Installer Packages
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              {[
                "Free listing claim",
                "Verified installer profile",
                "Featured regional visibility",
                "Priority homeowner enquiries",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-semibold text-white/80"
                >
                  <CheckCircle size={16} className="shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:ml-auto">
            <InstallerProfileMockup />
          </div>
        </div>
      </section>

      {/* Section 2: Problem and Opportunity */}
      <section className="section-band bg-surface">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Why list with us</p>
            <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
              Homeowners Are Searching. Make Sure They Find You First.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Most installers rely on referrals, word of mouth or expensive ads. The Renewable Directory gives your business a trusted profile where homeowners can compare local renewable specialists and request quotes directly.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Get found by local homeowners",
                text: "Homeowners searching for renewable installers in your region see your profile and services.",
              },
              {
                icon: ShieldCheck,
                title: "Build trust before the first call",
                text: "A verified profile with reviews and credentials gives homeowners confidence to contact you.",
              },
              {
                icon: MapPin,
                title: "Show services and coverage areas",
                text: "Display your services, certifications and the regions you cover so homeowners know you work in their area.",
              },
              {
                icon: Star,
                title: "Display reviews and credentials",
                text: "Collect and show real customer reviews alongside your accreditations and company details.",
              },
              {
                icon: BadgeCheck,
                title: "Use your Approved Installer badge",
                text: "Verified installers can display the Renewable Directory badge on their website, vans and materials.",
              },
              {
                icon: TrendingUp,
                title: "Upgrade for more visibility and enquiries",
                text: "Move up the ladder when you&rsquo;re ready for featured placement and priority lead access.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="surface-card flex flex-col gap-3 p-5 sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light">
                  <Icon size={20} className="text-navy" />
                </div>
                <h3 className="text-base font-bold text-navy">{title}</h3>
                <p className="text-sm leading-6 text-navy/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Free Listing Claim */}
      <section className="section-band bg-white">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Early launch opportunity</p>
              <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
                Your Free Installer Listing May Already Be Waiting
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                We are creating free listings for renewable installers across the UK. Claim yours now, check your company details and decide whether you want extra visibility in your region before the homeowner launch.
              </p>

              <ul className="mt-6 grid gap-3">
                {[
                  "Basic directory record",
                  "Service categories shown",
                  "Region shown",
                  "Claim option",
                  "Upgrade options available",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-navy"
                  >
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="#claim-form"
                  className="button-primary text-sm"

                >
                  Check My Free Listing
                </Link>
                <p className="text-xs text-navy/50">
                  Claiming your listing is free. Upgrades are optional.
                </p>
              </div>
            </div>

            <div className="surface-card p-6 sm:p-8">
              <div className="rounded-xl border-2 border-border bg-surface p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
                  <Search size={24} className="text-accent" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">
                  Is your company already listed?
                </h3>
                <p className="mt-2 text-sm leading-6 text-navy/65">
                  We&rsquo;re building the directory now. Claim your free listing early to secure your position before competitors in your region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Installer Offer Ladder */}
      <section className="section-band bg-surface" id="pricing-ladder">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Installer packages</p>
            <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
              Installer Offer Ladder
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Start free. Build trust. Get seen locally. Become first in line for enquiries.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pricingCards.map((card, i) => (
              <article
                key={card.name}
                className={`surface-card flex h-full flex-col p-6 transition-all ${
                  card.highlighted
                    ? "border-accent shadow-soft ring-1 ring-accent/20 lg:-mt-4 lg:mb-4"
                    : ""
                }`}
              >
                {card.badge && (
                  <div className="mb-3">
                    <span className="chip chip-soft">{card.badge}</span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-navy">{card.name}</h3>

                <div className="mt-3 border-y border-border py-3">
                  <p className="text-2xl font-black tracking-tight text-navy">
                    {card.price}
                  </p>
                  {card.positioning && (
                    <p className="mt-1 text-xs font-medium text-muted">
                      {card.positioning}
                    </p>
                  )}
                </div>

                <ul className="mt-4 grid gap-2 text-sm leading-6 text-navy/70">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-accent"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex-1" />

                <Link
                  href="#claim-form"
                  className={
                    card.highlighted
                      ? "button-primary w-full text-sm"
                      : "button-secondary w-full text-sm"
                  }
                  data-event={
                    i === 0
                      ? "installer_claim_cta_click"
                      : i === 1
                        ? "installer_verified_click"
                        : i === 2
                          ? "featured_installer_click"
                          : "priority_partner_click"
                  }
                >
                  {card.cta}
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-navy/60">
            Free gets you listed. Verified builds trust. Featured gets you seen. Priority gets you enquiries.
          </p>
        </div>
      </section>

      {/* Section 5: Featured Installer Focus */}
      <section className="section-band bg-white">
        <div className="container-page">
          <div className="surface-card overflow-hidden border-accent shadow-soft ring-1 ring-accent/20">
            <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div>
                <div className="flex items-center gap-3">
                  <span className="chip chip-soft">Recommended Starting Point</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
                  Featured Installer: The Best Starting Point For Growth
                </h2>
                <p className="mt-1 text-lg font-black tracking-tight text-accent">
                  £199/month
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Get seen locally before homeowner enquiries go live.
                </p>

                <ul className="mt-5 grid gap-2.5">
                  {[
                    "Featured category placement",
                    "Featured regional placement",
                    "Quote request button",
                    "Enhanced profile written for you",
                    "Logo and website link",
                    "Monthly visibility report",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium text-navy"
                    >
                      <CheckCircle size={18} className="shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href="#claim-form"
                    className="button-primary text-sm"

                  >
                    Secure Featured Installer Position
                  </Link>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 rounded-xl bg-surface p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-navy/50">
                  Why Featured works
                </h3>
                {[
                  {
                    icon: TrendingUp,
                    text: "Positions you above free listings",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Builds trust before the call",
                  },
                  {
                    icon: Clock,
                    text: "Helps homeowners choose faster",
                  },
                  {
                    icon: Award,
                    text: "Gives you early launch advantage",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light">
                      <Icon size={18} className="text-navy" />
                    </div>
                    <span className="text-sm font-medium text-navy">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Priority Lead Partner Focus */}
      <section className="section-band bg-navy">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                Premium
              </p>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                Priority Lead Partner: First In Line For Homeowner Enquiries
              </h2>
              <p className="mt-1 text-lg font-black tracking-tight text-accent">
                £499/month
              </p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                For installers actively taking on more work in their chosen region.
              </p>

              <ul className="mt-5 grid gap-2.5">
                {[
                  "Priority placement",
                  "First access to homeowner enquiries",
                  "Call tracking included",
                  "Discounted exclusive leads",
                  "Approved Installer badge use",
                  "Priority region visibility",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-white/80"
                  >
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  href="#claim-form"
                  className="button-primary text-sm"

                >
                  Reserve Priority Lead Partner Position
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl bg-white/5 p-6 backdrop-blur">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white/50">
                Why Priority works
              </h3>
              {[
                {
                  icon: TrendingUp,
                  text: "Built for installers ready to take on work",
                },
                {
                  icon: Award,
                  text: "Creates early launch advantage",
                },
                {
                  icon: Building2,
                  text: "Reduces reliance on expensive ad agencies",
                },
                {
                  icon: ShieldCheck,
                  text: "Positions you as a trusted local choice",
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                    <Icon size={18} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Trust and Badge Section */}
      <section className="section-band bg-surface">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Trust &amp; credibility</p>
              <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
                Built To Help Good Installers Stand Out
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                A verified profile gives homeowners confidence before they enquire. Installers can use their badge across their website, email signature, vans, social media and sales material.
              </p>

              <ul className="mt-5 grid gap-2.5">
                {[
                  "Verified company profile",
                  "Review collection support",
                  "Fair review dispute process",
                  "Challenge fake or unfair reviews",
                  "Display real accreditations where applicable",
                  "Build credibility before the first call",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-navy"
                  >
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-lg border border-border bg-white p-4 text-xs leading-5 text-navy/55">
                The Renewable Directory badge confirms that your directory profile has been reviewed. Official accreditations such as MCS, RECC and NICEIC are displayed separately where verified.
              </p>
            </div>

            <div className="flex justify-center">
              <ApprovedInstallerBadge />
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: How It Works */}
      <section className="section-band bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Getting started</p>
            <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
              How It Works
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                icon: FileText,
                title: "Claim Your Free Listing",
                text: "Confirm your company details, services and coverage area.",
              },
              {
                step: "2",
                icon: ShieldCheck,
                title: "Get Verified",
                text: "We check your business information and relevant accreditations.",
              },
              {
                step: "3",
                icon: TrendingUp,
                title: "Choose Your Visibility Level",
                text: "Stay free, upgrade to Verified, become Featured or secure Priority Lead Partner status.",
              },
              {
                step: "4",
                icon: Users,
                title: "Get Found By Homeowners",
                text: "Your profile goes live for homeowners searching in your region.",
              },
            ].map(({ step, icon: Icon, title, text }) => (
              <article
                key={step}
                className="surface-card relative flex flex-col gap-3 p-5 pt-12 sm:p-6 sm:pt-14"
              >
                <div className="absolute left-5 top-0 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-sm font-black text-white sm:left-6">
                  {step}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-light">
                  <Icon size={20} className="text-navy" />
                </div>
                <h3 className="text-base font-bold text-navy">{title}</h3>
                <p className="text-sm leading-6 text-navy/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA and Lead Form */}
      <section className="section-band bg-surface">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr]">
            <div>
              <p className="eyebrow">Get started</p>
              <h2 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
                Ready To Claim Your Installer Listing?
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                Claim your free listing today and see if Featured Installer or Priority Lead Partner positions are still available in your region.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#claim-form"
                  className="button-primary text-sm"

                >
                  Claim My Free Listing
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/apply"
                  className="button-secondary text-sm"

                >
                  Book A 10-Minute Installer Call
                </Link>
              </div>

              <div className="mt-8 rounded-xl border border-border bg-white p-5">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-navy/50">
                  What happens next
                </h3>
                <ul className="mt-3 grid gap-2">
                  {[
                    "Submit the claim form with your company details.",
                    "Our team reviews your information within 1\u20132 working days.",
                    "Your free listing goes live on the directory.",
                    "Upgrade to Featured or Priority Lead Partner when you&rsquo;re ready.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-navy/70"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-black text-white">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <InstallerClaimForm />

            <p className="mt-4 text-center text-sm text-muted-subtle">
              <Link href="/example-installer-profile" className="underline hover:text-navy">
                View an example premium installer profile
              </Link>{" "}
              to see what your upgraded listing could look like.
            </p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "For Installers",
          description:
            "Claim your free renewable installer listing on The Renewable Directory.",
          url: `${siteUrl()}/for-installers`,
          isPartOf: {
            "@type": "WebSite",
            name: "The Renewable Directory",
            url: siteUrl(),
          },
        })}
      />
    </main>
  );
}

function InstallerProfileMockup() {
  return (
    <div className="surface-card overflow-hidden p-5 text-left text-navy shadow-card-hover sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy text-base font-black text-white">
            CE
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold">Clean Energy UK</h3>
              <span className="chip chip-soft flex items-center gap-1">
                <BadgeCheck size={12} />
                Approved Installer
              </span>
            </div>
            <div className="mt-1 flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
              <span className="ml-1 text-xs text-muted">4.9</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {[
          { icon: Sun, label: "Solar PV" },
          { icon: BatteryCharging, label: "Battery" },
          { icon: Thermometer, label: "Heat Pumps" },
          { icon: PlugZap, label: "EV Chargers" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-navy/70"
          >
            <Icon size={12} />
            {label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          South East, London
        </span>
        <span className="flex items-center gap-1">
          <Globe size={12} />
          cleanenergyuk.co.uk
        </span>
        <span className="flex items-center gap-1">
          <Phone size={12} />
          020 7946 0000
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="button-primary flex-1 justify-center text-xs">
          Request a Quote
        </button>
        <button className="button-secondary flex-1 justify-center text-xs">
          View Profile
        </button>
      </div>
    </div>
  );
}

function ApprovedInstallerBadge() {
  return (
    <div className="surface-card w-full max-w-sm p-8 text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent-light">
        <BadgeCheck size={48} className="text-accent" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-navy">
        Approved Installer
      </h3>
      <p className="mt-3 text-sm leading-6 text-navy/65">
        This badge confirms your directory profile has been reviewed and verified by The Renewable Directory. Use it on your website, vans, email and sales materials.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <span className="chip">MCS Certified</span>
        <span className="chip">RECC Member</span>
        <span className="chip">NICEIC Approved</span>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-navy/40">
        Official accreditations displayed where verified. The Renewable Directory badge represents directory verification, not official certification.
      </p>
    </div>
  );
}

const pricingCards = [
  {
    name: "Free Listing",
    price: "£0/month",
    positioning: "Gets you listed",
    features: [
      "Basic directory record",
      "Service categories shown",
      "Region shown",
      "Claim option",
    ],
    cta: "Claim Free Listing",
  },
  {
    name: "Verified Listing",
    price: "£99/month",
    positioning: "Look professional",
    features: [
      "Claimed company profile",
      "Logo and website link",
      "Phone and email displayed",
      "Profile description written for you",
      "Review collection support",
      "Fair review dispute process",
      "Approved Installer badge use",
      "Above free listings",
    ],
    cta: "Upgrade To Verified",
  },
  {
    name: "Featured Installer",
    price: "£199/month",
    positioning: "Get seen locally",
    badge: "Best Seller",
    highlighted: true,
    features: [
      "Everything in Verified Listing",
      "Featured category placement",
      "Featured regional placement",
      "Quote request button",
      "Enhanced profile written for you",
      "Monthly visibility report",
      "Positioned above free listings",
    ],
    cta: "Secure Featured Position",
  },
  {
    name: "Priority Lead Partner",
    price: "£499/month",
    positioning: "First in line for enquiries",
    features: [
      "Everything in Featured Installer",
      "Priority placement above standard listings",
      "First access to homeowner enquiries",
      "Featured region and category visibility",
      "Call tracking included",
      "Discounted exclusive leads",
      "Priority support",
    ],
    cta: "Reserve Priority Position",
  },
];
