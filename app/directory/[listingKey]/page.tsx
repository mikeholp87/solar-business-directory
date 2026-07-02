import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { ClaimForm } from "@/components/claim-form";
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
    `View ${installer?.companyName ?? "an MCS certified installer"}'s profile on The Renewable Directory.`,
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
  const detailKey = getListingKey(installer);
  const hasBus = installer.boilerUpgradeSchemeRegistered;
  const certBody = installer.certificationBody;
  const regions = installer.regionsCovered.filter((r) => r && r.trim() !== "" && r.toLowerCase() !== "n/a");
  const categoryTags = installer.category.filter((c) => c && c.trim() !== "" && c.toLowerCase() !== "n/a");

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link className="button-secondary" href="/directory">
            <ArrowLeft size={18} />
            Back to directory
          </Link>
          <span className="eyebrow">MCS Certified Installer</span>
        </div>

        <section className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative border-b border-navy/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent to-navy" />
              <h1 className="mt-2 text-4xl font-bold leading-[0.96] sm:text-5xl">{installer.companyName ?? "Unknown company"}</h1>
              {installer.address && (
                <p className="mt-4 flex items-center gap-2 text-lg leading-8 text-navy/72">
                  <MapPin size={18} className="text-accent" />
                  {installer.address}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {hasBus && <span className="chip chip-success">BUS registered</span>}
                {certBody && <span className="chip chip-soft">{certBody}</span>}
                <span className="chip">MCS Certified</span>
              </div>

              <div className="mt-6">
                {categoryTags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy/48">Services</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categoryTags.map((item) => (
                        <span key={item} className="chip">{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                {regions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-navy/48">Areas Covered</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {regions.map((region) => (
                        <span key={region} className="chip chip-soft">{region}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="grid gap-0 bg-[linear-gradient(180deg,rgba(247,243,234,0.92)_0%,rgba(255,255,255,0.82)_100%)]">
              <div className="border-b border-navy/10 p-8 sm:p-10">
                <p className="eyebrow">Contact details</p>
                <div className="mt-5 grid gap-4">
                  {website && (
                    <MetaRow icon={<Globe size={17} />} label="Website" value={<a href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline"><span>{website}</span><ExternalLink size={14} /></a>} />
                  )}
                  {installer.email && (
                    <MetaRow icon={<Mail size={17} />} label="Email" value={<a href={`mailto:${installer.email}`} className="hover:underline">{installer.email}</a>} />
                  )}
                  {installer.phone && (
                    <MetaRow icon={<Phone size={17} />} label="Phone" value={<a href={`tel:${installer.phone}`} className="hover:underline">{installer.phone}</a>} />
                  )}
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p className="eyebrow">Certifications</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {hasBus && <span className="chip chip-success">BUS registered</span>}
                  {certBody && <span className="chip chip-soft">{certBody}</span>}
                  {installer.certificationNumber && <span className="chip">MCS: {installer.certificationNumber}</span>}
                </div>

                <div className="mt-7 rounded-[24px] border border-navy/10 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">About this listing</p>
                  <p className="mt-2 text-sm leading-7 text-navy/72">
                    Data sourced from{" "}
                    <a href={data.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">
                      the MCS directory
                    </a>{" "}
                    on {formatScrapedAt(data.scrapedAt)}.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.64fr_0.36fr]">
          <div className="grid gap-6">
            <article className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Company profile</p>
                  <h2 className="mt-3 text-2xl font-bold">{installer.companyName ?? "Installer"}</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ProfileField label="Company name" value={installer.companyName} />
                {installer.address && <ProfileField label="Location" value={installer.address} />}
                {certBody && <ProfileField label="Certification body" value={certBody} />}
                {installer.certificationNumber && <ProfileField label="Certification number" value={installer.certificationNumber} />}
              </div>

              {(!installer.companyName || (!certBody && !installer.certificationNumber && !installer.website && !installer.email && !installer.phone)) && (
                <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
                  <p className="text-sm leading-6 text-navy/65">
                    This company is listed in The Renewable Directory. Contact details, services, and coverage areas may be updated when the company claims its listing.
                  </p>
                </div>
              )}
            </article>

            <ClaimForm companyName={installer.companyName ?? undefined} />
          </div>

          <aside className="grid gap-6 lg:self-start">
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

function ProfileField({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value || value === "n/a" || value === "null" || value === "undefined") return null;
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.18em] text-navy/48">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-navy/82">{value}</dd>
    </div>
  );
}
