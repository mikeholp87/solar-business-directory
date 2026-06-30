import { getPublicTerritoryStatus } from "@/lib/lead-assignment";
import type { Territory } from "@/lib/types";

export function TerritoryList({ items }: { items: Territory[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((territory) => {
        const status = getPublicTerritoryStatus(territory);
        return (
          <div key={territory.id} className="index-card p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{territory.name}</h3>
                <p className="mt-1 text-sm leading-6 text-navy/65">{territory.counties.slice(0, 4).join(", ")}</p>
              </div>
              <span className="chip chip-soft capitalize">{status.replace("_", " ")}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-navy/70">
              {territory.activeInstallerCount} of {territory.maxInstallerSlots} installer slots active
            </p>
          </div>
        );
      })}
    </div>
  );
}
