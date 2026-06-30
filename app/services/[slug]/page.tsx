import Link from "next/link";
import { notFound } from "next/navigation";
import { DirectoryResultCard } from "@/components/directory-result-card";
import { matchesServiceType, readDirectoryData } from "@/lib/mcs-directory";
import { pageMetadata, jsonLd } from "@/lib/seo";
import { getServiceFacetBySlug, serviceFacets } from "@/lib/seo/service-facets";

export function generateStaticParams() {
  return serviceFacets.map((facet) => ({ slug: facet.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const facet = getServiceFacetBySlug(params.slug);
  if (!facet) {
    return pageMetadata("Installers", "Browse installer services.", "/services");
  }

  return pageMetadata(
    facet.title,
    facet.description,
    `/services/${facet.slug}`
  );
}

export default async function ServiceFacetPage({ params }: { params: { slug: string } }) {
  const facet = getServiceFacetBySlug(params.slug);
  if (!facet) notFound();

  const data = await readDirectoryData();
  const installers = data.installers.filter((installer) => matchesServiceType(installer.category, facet.type));
  const featured = installers.slice(0, 3);

  return (
    <main className="section-band">
      <div className="container-page grid gap-8 lg:grid-cols-[0.66fr_0.34fr]">
        <section className="surface-card surface-card-cream p-8 sm:p-10">
          <p className="eyebrow">Service landing page</p>
          <h1 className="mt-3 text-4xl font-black leading-[0.96] sm:text-5xl">{facet.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">{facet.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="button-primary" href="/directory">Browse the directory</Link>
            <Link className="button-secondary" href="/apply">Apply as installer</Link>
          </div>
        </section>

        <aside className="surface-card-dossier p-6">
          <p className="eyebrow">Why it matters</p>
          <h2 className="mt-3 text-2xl font-black">High-intent search landing page</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-navy/70">
            <li>Matches a specific installer service intent.</li>
            <li>Targets a clean search phrase with its own URL.</li>
            <li>Links back into the main directory listing for deeper filtering.</li>
          </ul>
        </aside>

        <section className="grid gap-5 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured listings</p>
              <h2 className="mt-3 text-3xl font-black">Installers offering {facet.type}</h2>
            </div>
            <p className="text-sm text-navy/60">{installers.length} matching listings</p>
          </div>
          <div className="grid gap-5">
            {featured.length > 0 ? featured.map((installer) => (
              <DirectoryResultCard key={installer.installerId ?? `${installer.companyName}-${installer.sourcePage}`} installer={installer} />
            )) : (
              <div className="surface-card p-6 text-navy/65">No listings are available for this service yet.</div>
            )}
          </div>
        </section>

        <section className="surface-card lg:col-span-2 p-6">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-2xl font-black">Common questions about {facet.type}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              [`Why use a dedicated ${facet.label}?`, `It gives search engines and visitors a focused page for this service rather than relying only on a query-string filter.`],
              ["Can I still filter further?", "Yes. The main directory keeps postcode, certification, and availability filters for deeper comparison."],
              ["Does this page replace the directory?", "No. It is an entry point into the directory and a better landing page for service-specific searches."],
              ["Who should use the apply page?", "Installers that want to be listed for this service and receive enquiries from the directory."]
            ].map(([question, answer]) => (
              <details key={question} className="rounded-[20px] border border-border bg-white p-4">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-2 text-navy/70">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                { "@type": "ListItem", position: 2, name: "Services", item: "/services" },
                { "@type": "ListItem", position: 3, name: facet.title, item: `/services/${facet.slug}` }
              ]
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                [`Why use a dedicated ${facet.label}?`, `It gives search engines and visitors a focused page for this service rather than relying only on a query-string filter.`],
                ["Can I still filter further?", "Yes. The main directory keeps postcode, certification, and availability filters for deeper comparison."],
                ["Does this page replace the directory?", "No. It is an entry point into the directory and a better landing page for service-specific searches."],
                ["Who should use the apply page?", "Installers that want to be listed for this service and receive enquiries from the directory."]
              ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }))
            }
          ]
        })}
      />
    </main>
  );
}
