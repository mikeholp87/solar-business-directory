import Link from "next/link";
import { BadgeCheck, CalendarDays, MapPin, Star } from "lucide-react";
import { territories } from "@/lib/data";
import type { Installer } from "@/lib/types";

export function InstallerCard({ installer }: { installer: Installer }) {
  const coveredTerritories = territories.filter((territory) => installer.territoryIds.includes(territory.id));

  return (
    <article className="rounded-lg border border-emerald-950/10 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-skywash text-lg font-black text-fern">{installer.logoUrl}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black">{installer.companyName}</h3>
            {installer.accreditations.verified ? <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-fern"><BadgeCheck size={14} /> Verified</span> : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-ink/70">{installer.description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <span className="flex items-center gap-2"><MapPin size={16} /> {coveredTerritories.map((item) => item.name).join(", ")}</span>
        <span className="flex items-center gap-2"><CalendarDays size={16} /> Survey in {installer.surveyTurnaroundDays} days</span>
        <span className="flex items-center gap-2"><Star size={16} /> {installer.rating.toFixed(1)} rating</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {installer.services.slice(0, 4).map((service) => (
          <span key={service} className="rounded bg-stone-100 px-2.5 py-1 text-xs font-bold text-ink/75">{service}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link className="button-primary" href={`/installers/${installer.slug}`}>Request Survey</Link>
        <Link className="button-secondary" href={`/installers/${installer.slug}`}>View Profile</Link>
      </div>
    </article>
  );
}
