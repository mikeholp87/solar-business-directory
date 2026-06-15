import { getPublicTerritoryStatus } from "@/lib/lead-assignment";
import type { Territory } from "@/lib/types";

export function TerritoryList({ items }: { items: Territory[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {items.map((territory) => {
        const status = getPublicTerritoryStatus(territory);
        return (
          <div key={territory.id} className="rounded-lg border border-emerald-950/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">{territory.name}</h3>
                <p className="mt-1 text-sm text-ink/65">{territory.counties.slice(0, 4).join(", ")}</p>
              </div>
              <span className="rounded bg-skywash px-2 py-1 text-xs font-black capitalize text-fern">{status.replace("_", " ")}</span>
            </div>
            <p className="mt-3 text-sm text-ink/70">{territory.activeInstallerCount} of {territory.maxInstallerSlots} installer slots active</p>
          </div>
        );
      })}
    </div>
  );
}
