import Link from "next/link";
import type { Metadata } from "next";

const plans = [
  {
    name: "Starter",
    price: "£149",
    summary: "For smaller teams that want a clean public profile and a simple place to receive enquiries.",
    features: [
      "Public installer profile",
      "Directory visibility",
      "Lead enquiry routing",
      "Email support"
    ]
  },
  {
    name: "Growth",
    price: "£299",
    summary: "For active installers who want more territory visibility and a stronger flow of leads.",
    features: [
      "Everything in Starter",
      "Extra territory visibility",
      "Priority placement in search",
      "Profile and territory updates"
    ]
  },
  {
    name: "Scale",
    price: "£499",
    summary: "For larger operators that need the strongest visibility and a more hands-on commercial setup.",
    features: [
      "Everything in Growth",
      "Featured profile styling",
      "Dedicated territory review",
      "Commercial onboarding support"
    ]
  }
] as const;

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare three simple pricing tiers for installer listings, visibility, and support."
};

export default function PricingPage() {
  return (
    <main>
      <section className="section-band bg-surface">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Pricing</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">
              Simple pricing for installers that want more qualified enquiries
            </h1>
            <p className="mt-5 text-base leading-7 text-muted">
              Choose a tier that fits your current volume, territory coverage, and the amount of support you want from the directory team.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <article
                key={plan.name}
                className={`surface-card flex h-full flex-col p-6 transition-all ${index === 1 ? "border-accent shadow-soft" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-navy">{plan.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-navy/65">{plan.summary}</p>
                  </div>
                  {index === 1 ? <span className="chip chip-soft">Most popular</span> : null}
                </div>

                <div className="mt-6 border-y border-border py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-navy/55">Monthly price</p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-navy">{plan.price}</p>
                  <p className="mt-2 text-sm text-navy/60">Billed monthly. No setup fee.</p>
                </div>

                <ul className="mt-6 grid gap-3 text-sm leading-6 text-navy/75">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex-1" />

                <Link
                  href="/apply"
                  className={index === 1 ? "button-primary w-full" : "button-secondary w-full"}
                >
                  Get started
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Included everywhere</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">A public profile, enquiries from homeowners, and access to the same directory audience.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Upgrade path</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">Move up when you want more territory visibility, stronger placement, or hands-on support.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Need a custom fit?</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">Use the application form and note the coverage or commercial setup you need.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
