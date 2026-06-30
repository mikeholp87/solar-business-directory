import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import {
  formatScrapedAt,
  formatWebsite,
  getListingKey,
  readDirectoryListingData,
} from "@/lib/mcs-directory";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/runtime";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { listingKey: string } }) {
  let installer;
  try {
    installer = (await readDirectoryListingData(params.listingKey)).installer;
  } catch {
    notFound();
  }
  const title = installer?.companyName ?? "MCS installer listing";
  return pageMetadata(
    title,
    `Full scraped listing details for ${installer?.companyName ?? "an MCS installer"} from the MCS directory.`,
    `/directory/${params.listingKey}`
  );
}

export default async function DirectoryListingPage({ params }: { params: { listingKey: string } }) {
  let data;
  try {
    data = await readDirectoryListingData(params.listingKey);
  } catch {
    notFound();
  }
  const installer = data.installer;

  const website = formatWebsite(installer.website);
  const addressParts = installer.addressParts;
  const detailKey = getListingKey(installer);
  const summaryItems = [
    { label: "Installer ID", value: installer.installerId?.toLocaleString("en-GB") ?? "Not listed" },
    { label: "Source page", value: installer.sourcePage?.toString() ?? "Not listed" },
    { label: "Certification body", value: installer.certificationBody ?? "Not listed" },
    { label: "Certification number", value: installer.certificationNumber ?? "Not listed" },
  ];

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link className="button-secondary" href="/directory">
            <ArrowLeft size={18} />
            Back to directory
          </Link>
          <span className="eyebrow">MCS certified record</span>
        </div>

        <section className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative border-b border-navy/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent to-navy" />
              <p className="eyebrow">Installer dossier</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.96] sm:text-5xl">{installer.companyName ?? "Unknown company"}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-navy/72">{installer.address ?? "No address listed"}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                {installer.boilerUpgradeSchemeRegistered ? <span className="chip chip-success">BUS registered</span> : <span className="chip chip-warning">Not BUS registered</span>}
                <span className="chip chip-soft">{installer.certificationBody ?? "Certification body not listed"}</span>
                <span className="chip">Record {detailKey}</span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {summaryItems.map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-navy/10 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">{item.label}</p>
                    <p className="mt-2 text-base font-bold leading-7 text-navy/85">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="grid gap-0 bg-[linear-gradient(180deg,rgba(247,243,234,0.92)_0%,rgba(255,255,255,0.82)_100%)]">
              <div className="border-b border-navy/10 p-8 sm:p-10">
                <p className="eyebrow">Quick contact</p>
                <div className="mt-5 grid gap-4">
                  <MetaRow icon={<Globe size={17} />} label="Website" value={website ? <a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline"><span>{website}</span><ExternalLink size={14} /></a> : "Not listed"} />
                  <MetaRow icon={<Mail size={17} />} label="Email" value={installer.email ? <a href={`mailto:${installer.email}`} className="hover:underline">{installer.email}</a> : "Not listed"} />
                  <MetaRow icon={<Phone size={17} />} label="Phone" value={installer.phone ? <a href={`tel:${installer.phone}`} className="hover:underline">{installer.phone}</a> : "Not listed"} />
                  <MetaRow icon={<Search size={17} />} label="Source page" value={installer.sourcePage?.toString() ?? "Not listed"} />
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p className="eyebrow">Coverage</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {installer.regionsCovered.length > 0 ? installer.regionsCovered.map((region) => <span key={region} className="chip chip-soft">{region}</span>) : <span className="text-sm text-navy/62">No regions listed</span>}
                </div>

                <div className="mt-7 rounded-[24px] border border-navy/10 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">Record source</p>
                  <p className="mt-2 text-sm leading-7 text-navy/72">
                    Pulled from{" "}
                    <a href={data.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">
                      the MCS directory
                    </a>{" "}
                    on {formatScrapedAt(data.scrapedAt)}.
                  </p>
                  <div className="mt-4 grid gap-3 text-sm text-navy/72">
                    <MetaLine label="Technology" value={data.query.technology} />
                    <MetaLine label="Region" value={data.query.region} />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.66fr_0.34fr]">
          <div className="grid gap-6">
            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Full listing</p>
                  <h2 className="mt-3 text-2xl font-black">Everything scraped for this record</h2>
                </div>
                <span className="chip chip-soft">{installer.category.length} type tags</span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <DetailField label="Company name" value={installer.companyName} />
                <DetailField label="Installer ID" value={installer.installerId?.toString()} />
                <DetailField label="Address" value={installer.address} />
                <DetailField
                  label="Website"
                  value={website ? <a href={website} target="_blank" rel="noreferrer" className="text-accent hover:underline">{website}</a> : null}
                />
                <DetailField label="Email" value={installer.email ? <a href={`mailto:${installer.email}`} className="hover:underline">{installer.email}</a> : null} />
                <DetailField label="Phone" value={installer.phone ? <a href={`tel:${installer.phone}`} className="hover:underline">{installer.phone}</a> : null} />
                <DetailField label="Certification body" value={installer.certificationBody} />
                <DetailField label="Certification number" value={installer.certificationNumber} />
                <DetailField label="Boiler Upgrade Scheme" value={installer.boilerUpgradeSchemeRegistered ? "Registered" : "Not listed as registered"} />
                <DetailField label="Source page" value={installer.sourcePage?.toString()} />
              </div>
            </article>

            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Address breakdown</p>
                  <h2 className="mt-3 text-2xl font-black">Structured location data</h2>
                </div>
                <span className="chip">Exact record fields</span>
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailField label="Line 1" value={addressParts?.line1} />
                <DetailField label="Line 2" value={addressParts?.line2} />
                <DetailField label="Line 3" value={addressParts?.line3} />
                <DetailField label="County" value={addressParts?.county} />
                <DetailField label="Postcode" value={addressParts?.postcode} />
                <DetailField label="Country" value={addressParts?.country} />
              </dl>
            </article>

            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Regions covered</p>
                  <h2 className="mt-3 text-2xl font-black">Coverage chips from the source record</h2>
                </div>
                <MapPin className="text-accent" size={18} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {installer.regionsCovered.length > 0 ? installer.regionsCovered.map((region) => <span key={region} className="chip chip-soft">{region}</span>) : <span className="text-sm text-navy/62">No regions listed</span>}
              </div>
              {installer.category.length > 0 ? (
                <>
                  <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-navy/48">Type tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {installer.category.map((item) => (
                      <span key={item} className="chip">{item}</span>
                    ))}
                  </div>
                </>
              ) : null}
            </article>
          </div>

          <aside className="grid gap-6 lg:self-start">
            <article className="surface-card surface-card-cream p-6">
              <p className="eyebrow">How to read this page</p>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-navy/74">
                <p>
                  This page shows the raw directory record rather than a marketing profile. If a field is blank here, it was blank in the source listing.
                </p>
                <p>
                  Use the website, email, or phone fields to contact the installer directly. The source page and record ID help you cross-check the original MCS entry.
                </p>
              </div>
            </article>

            <LeadForm compact />
          </aside>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: installer.companyName,
          url: `${siteUrl()}/directory/${detailKey}`,
          telephone: installer.phone ?? undefined,
          email: installer.email ?? undefined,
          areaServed: installer.regionsCovered,
        })}
      />
    </main>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-navy/10 bg-white p-4">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">{label}</p>
        <div className="mt-1 break-words text-sm font-bold leading-6 text-navy/84">{value}</div>
      </div>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className="flex items-start justify-between gap-4 border-b border-navy/10 pb-2">
      <span className="font-semibold text-navy/58">{label}</span>
      <span className="text-right font-bold text-navy/84">{value ?? "Not listed"}</span>
    </p>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-navy/82">{value ?? "Not listed"}</dd>
    </div>
  );
}
