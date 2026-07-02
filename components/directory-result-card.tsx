import Link from "next/link";
import { formatWebsite, getListingKey, type McsInstaller } from "@/lib/mcs-directory";
import { MapPin, Globe, Mail, Phone, ShieldCheck } from "lucide-react";

type DirectoryResultCardProps = {
  installer: McsInstaller;
};

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "" && value.toLowerCase() !== "n/a";
  return true;
}

export function DirectoryResultCard({ installer }: DirectoryResultCardProps) {
  const location = installer.address ?? null;
  const categoryTags = installer.category.filter((c) => hasValue(c));
  const regions = installer.regionsCovered.filter((r) => hasValue(r));
  const certBody = hasValue(installer.certificationBody) ? installer.certificationBody : null;
  const hasBus = installer.boilerUpgradeSchemeRegistered;

  return (
    <article className="index-card index-card--hover p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-3xl">
          <h2 className="text-xl font-bold sm:text-2xl">
            <Link href={`/directory/${getListingKey(installer)}`} className="hover:text-accent">
              {installer.companyName ?? "Unknown company"}
            </Link>
          </h2>
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-navy/60">
              <MapPin size={14} className="shrink-0" />
              {location}
            </p>
          )}
          {categoryTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {categoryTags.slice(0, 5).map((item) => (
                <span key={item} className="chip chip-soft">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {certBody && <span className="chip">{certBody}</span>}
          {hasBus && <span className="chip chip-success">BUS registered</span>}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-navy/10 pt-4 sm:mt-6 sm:grid-cols-2 sm:pt-5 lg:grid-cols-4">
        {hasValue(installer.website) && (
          <ContactItem
            icon={<Globe size={15} />}
            label="Website"
            value={
              <a href={formatWebsite(installer.website) ?? installer.website!} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {formatWebsite(installer.website) ?? installer.website}
              </a>
            }
          />
        )}
        {hasValue(installer.email) && (
          <ContactItem
            icon={<Mail size={15} />}
            label="Email"
            value={
              <a href={`mailto:${installer.email}`} className="text-accent hover:underline">
                {installer.email}
              </a>
            }
          />
        )}
        {hasValue(installer.phone) && (
          <ContactItem
            icon={<Phone size={15} />}
            label="Phone"
            value={
              <a href={`tel:${installer.phone}`} className="text-accent hover:underline">
                {installer.phone}
              </a>
            }
          />
        )}
        {regions.length > 0 && (
          <ContactItem icon={<MapPin size={15} />} label="Areas Covered" value={regions.join(", ")} />
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-navy/10 pt-4 sm:mt-6 sm:flex-row sm:flex-wrap sm:pt-5">
        <Link className="button-primary w-full justify-center sm:w-auto" href={`/directory/${getListingKey(installer)}`}>
          View Profile
        </Link>
        <Link className="button-secondary w-full justify-center sm:w-auto" href={`/directory/${getListingKey(installer)}`}>
          Request Quote
        </Link>
      </div>
    </article>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-navy/45">{label}</p>
        <div className="mt-0.5 truncate text-sm font-medium text-navy/80">{value}</div>
      </div>
    </div>
  );
}
