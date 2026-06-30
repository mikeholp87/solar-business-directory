import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { serviceFacets } from "@/lib/seo/service-facets";

export const metadata = pageMetadata("Installer services", "Browse the main installer service landing pages.", "/services");

export default function ServicesPage() {
  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Service hub</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">
            Installer service landing pages
          </h1>
          <p className="mt-5 text-base leading-7 text-muted">
            Use these pages to find focused results for the most common renewable installation services.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceFacets.map((facet) => (
            <Link key={facet.slug} href={`/services/${facet.slug}`} className="surface-card p-6 transition hover:border-accent hover:shadow-soft">
              <p className="eyebrow">Service page</p>
              <h2 className="mt-3 text-2xl font-black">{facet.title}</h2>
              <p className="mt-3 text-sm leading-6 text-navy/70">{facet.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
