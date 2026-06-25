import Link from "next/link";
import { BadgeCheck, CalendarDays, MapPin, Star } from "lucide-react";
import { territories } from "@/lib/data";
import type { Installer } from "@/lib/types";

export function InstallerCard({ installer }: { installer: Installer }) {
  const coveredTerritories = territories.filter((territory) => installer.territoryIds.includes(territory.id));

  return (
    <article className="index-card p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-[18px] border border-navy/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,239,228,0.92))] text-lg font-black text-accent shadow-[0_10px_26px_rgba(23,33,29,0.08)]">
          {installer.logoUrl}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black">{installer.companyName}</h3>
            {installer.accreditations.verified ? (
              <span className="chip chip-success">
                <BadgeCheck size={14} />
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-navy/70">{installer.description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 border-t border-navy/10 pt-4 text-sm sm:grid-cols-3">
        <span className="flex items-start gap-2">
          <MapPin className="mt-0.5 shrink-0 text-accent" size={16} />
          <span>{coveredTerritories.map((item) => item.name).join(", ")}</span>
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="text-accent" size={16} />
          Survey in {installer.surveyTurnaroundDays} days
        </span>
        <span className="flex items-center gap-2">
          <Star className="text-amber-600" size={16} />
          {installer.rating.toFixed(1)} rating
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {installer.services.slice(0, 4).map((service) => (
          <span key={service} className="chip chip-soft">
            {service}
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3 border-t border-navy/10 pt-4">
        <Link className="button-primary" href={`/installers/${installer.slug}`}>
          Request Survey
        </Link>
        <Link className="button-secondary" href={`/installers/${installer.slug}`}>
          View Profile
        </Link>
      </div>
    </article>
  );
}
