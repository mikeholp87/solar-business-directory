# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a basic pricing page with three installer tiers, feature lists, and a header link to the new page.

**Architecture:** Keep the change small and local. Add a new server-rendered `/pricing` page that reuses the existing container, card, button, and surface styles, then update the shared header navigation so the page is reachable from the whole site. Avoid new dependencies or shared abstractions because this is a single marketing page.

**Tech Stack:** Next.js App Router, React server components, existing Tailwind utility classes and global CSS.

---

### Task 1: Add the pricing page

**Files:**
- Create: `app/pricing/page.tsx`

- [ ] **Step 1: Write the page component**

```tsx
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "£149",
    summary: "For small teams that want a simple public listing and a clean place to send leads.",
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
    summary: "For active installers who want more territory coverage and better lead volume.",
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
    summary: "For larger operators that need the strongest visibility and commercial support.",
    features: [
      "Everything in Growth",
      "Featured profile styling",
      "Dedicated territory review",
      "Commercial onboarding support"
    ]
  }
] as const;

export default function PricingPage() {
  return (
    <main className="bg-surface">
      <section className="section-band">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Pricing</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
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
                className={`surface-card flex h-full flex-col p-6 ${index === 1 ? "border-accent shadow-soft" : ""}`}
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
                  className={`button-primary w-full ${index === 1 ? "" : "bg-navy border-navy hover:bg-navy/90 hover:border-navy/90"}`}
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
```

- [ ] **Step 2: Run the build**

Run: `npm run build`
Expected: success with a `/pricing` route in the output.

### Task 2: Add pricing to the header

**Files:**
- Modify: `components/header.tsx:1-32`

- [ ] **Step 1: Update the nav**

```tsx
<nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
  <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/directory">Directory</Link>
  <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/pricing">Pricing</Link>
  <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/apply">Apply Now</Link>
  <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/installer-dashboard">Installer login</Link>
</nav>
```

- [ ] **Step 2: Run a quick route check**

Run: `curl -I http://localhost:3000/pricing`
Expected: `HTTP/1.1 200 OK`
