import Link from "next/link";
import type { Metadata } from "next";
import { jsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

const plans = [
  {
    name: "Free Listing",
    price: "Free",
    summary: "Basic company listing on The Renewable Directory. Claim it, verify your details, and be found by homeowners.",
    highlighted: false,
    features: [
      "Public company listing",
      "Directory visibility",
      "MCS certification displayed",
      "Services and areas covered shown",
    ]
  },
  {
    name: "Verified Listing",
    price: "\u00a349\u2013\u00a399/mo",
    summary: "Logo, website, description, priority profile and a quote button. Stand out from basic listings.",
    highlighted: true,
    features: [
      "Everything in Free",
      "Company logo and cover image",
      "Website link and full description",
      "Priority profile placement",
      "Quote button on your listing",
      "Profile updates included"
    ]
  },
  {
    name: "Featured Region",
    price: "\u00a3149\u2013\u00a3299/mo",
    summary: "Top placement in your chosen region and category. Get seen first by homeowners in your area.",
    highlighted: false,
    features: [
      "Everything in Verified",
      "Top 3 placement in chosen region",
      "Featured in one service category",
      "Region exclusivity options",
      "Priority lead routing"
    ]
  },
  {
    name: "Lead Package",
    price: "\u00a325\u2013\u00a375/lead",
    summary: "Exclusive homeowner enquiries matched to your services and coverage areas.",
    highlighted: false,
    features: [
      "Exclusive territory leads",
      "Qualified homeowner enquiries",
      "No long-term commitment",
      "Set your monthly lead cap",
      "Pay only for delivered leads"
    ]
  }
] as const;

const addOns = [
  {
    name: "Done-For-You Ads",
    price: "\u00a3500\u2013\u00a31,500/mo + ad spend",
    summary: "Facebook and Google lead generation campaigns with AI and SMS follow-up to convert more enquiries.",
  }
];

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare listing, visibility, and lead packages for renewable energy installers on The Renewable Directory.",
  openGraph: {
    title: "Pricing",
    description: "Compare listing, visibility, and lead packages for renewable energy installers on The Renewable Directory.",
    url: `${siteUrl()}/pricing`,
    siteName: "Renewable Directory",
    type: "website"
  }
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
              We&rsquo;ve already created a free listing for your company on The Renewable Directory. You can claim it free, update your details, add your website and logo, and choose whether you want homeowner quote enquiries for Solar PV, Battery Storage or Heat Pumps in your area.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`surface-card flex h-full flex-col p-6 transition-all ${plan.highlighted ? "border-accent shadow-soft ring-1 ring-accent/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-navy">{plan.name}</h2>
                  </div>
                  {plan.highlighted ? <span className="chip chip-soft">Recommended</span> : null}
                </div>

                <div className="mt-4 border-y border-border py-4">
                  <p className="text-3xl font-black tracking-tight text-navy">{plan.price}</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-navy/65">{plan.summary}</p>

                <ul className="mt-5 grid gap-2.5 text-sm leading-6 text-navy/75">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex-1" />

                <Link
                  href="/apply"
                  className={plan.highlighted ? "button-primary w-full" : "button-secondary w-full"}
                >
                  {plan.name === "Free Listing" ? "Claim Your Free Listing" : "Get started"}
                </Link>
              </article>
            ))}
          </div>

          {addOns.length > 0 && (
            <div className="mt-8">
              <div className="mx-auto max-w-2xl">
                {addOns.map((addon) => (
                  <article key={addon.name} className="surface-card surface-card-dossier p-6 text-center">
                    <h3 className="text-xl font-bold text-navy">{addon.name}</h3>
                    <p className="mt-2 text-3xl font-black tracking-tight text-navy">{addon.price}</p>
                    <p className="mt-2 text-sm leading-6 text-navy/65">{addon.summary}</p>
                    <Link href="/apply" className="button-primary mt-5 inline-flex">
                      Enquire now
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft sm:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Free to list</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">Every MCS certified installer has a free basic listing. Claim yours to keep details up to date.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Upgrade anytime</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">Move up when you want more visibility, stronger placement, or exclusive leads.</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Need a custom package?</p>
              <p className="mt-2 text-sm leading-6 text-navy/70">Contact us through the claim form and we&rsquo;ll build a plan for your coverage needs.</p>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Installer directory listings",
          description: "Installer listing and lead packages for The Renewable Directory.",
          brand: { "@type": "Brand", name: "The Renewable Directory" },
          url: `${siteUrl()}/pricing`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "GBP",
            lowPrice: 0,
            highPrice: 299,
            offerCount: 4
          }
        })}
      />
    </main>
  );
}
