import Link from "next/link";
import type { ReactNode } from "react";
import { formatWebsite, getListingKey, type McsInstaller } from "@/lib/mcs-directory";

type DirectoryResultCardProps = {
  installer: McsInstaller;
};

export function DirectoryResultCard({ installer }: DirectoryResultCardProps) {
  return (
    <article className="index-card index-card--hover p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="eyebrow">Installer record</p>
          <h3 className="mt-2 text-xl font-black sm:mt-3 sm:text-2xl">
            <Link href={`/directory/${getListingKey(installer)}`} className="hover:text-accent">
              {installer.companyName ?? "Unknown company"}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-6 text-navy/72 sm:text-base sm:leading-7">{installer.address ?? "No address listed"}</p>
          {installer.category.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {installer.category.slice(0, 4).map((item) => (
                <span key={item} className="chip chip-soft">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {installer.boilerUpgradeSchemeRegistered ? (
            <span className="chip chip-success">BUS registered</span>
          ) : (
            <span className="chip chip-warning">Not BUS registered</span>
          )}
          <span className="chip chip-soft">{installer.certificationBody ?? "Unknown body"}</span>
          <span className="chip">Page {installer.sourcePage ?? "?"}</span>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-navy/10 pt-4 sm:mt-6 sm:pt-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Certification number" value={installer.certificationNumber} />
        <Field
          label="Website"
          value={
            installer.website ? (
              <a href={formatWebsite(installer.website) ?? installer.website} target="_blank" rel="noreferrer">
                {formatWebsite(installer.website) ?? installer.website}
              </a>
            ) : null
          }
        />
        <Field label="Email" value={installer.email ? <a href={`mailto:${installer.email}`}>{installer.email}</a> : null} />
        <Field label="Phone" value={installer.phone ? <a href={`tel:${installer.phone}`}>{installer.phone}</a> : null} />
        <Field label="Source page" value={installer.sourcePage?.toString() ?? null} />
        <Field label="Regions covered" value={installer.regionsCovered.length > 0 ? installer.regionsCovered.join(", ") : null} />
      </dl>

      <div className="mt-5 flex flex-col gap-3 border-t border-navy/10 pt-4 sm:mt-6 sm:flex-row sm:flex-wrap sm:pt-5">
        <Link className="button-primary w-full justify-center sm:w-auto" href={`/directory/${getListingKey(installer)}`}>
          View details
        </Link>
        {installer.website ? (
          <a className="button-secondary w-full justify-center sm:w-auto" href={formatWebsite(installer.website) ?? installer.website} target="_blank" rel="noreferrer">
            Open website
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-navy/48">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-navy/82">{value ?? "Not listed"}</dd>
    </div>
  );
}
