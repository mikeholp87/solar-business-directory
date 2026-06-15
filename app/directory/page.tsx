import { Search } from "lucide-react";
import { InstallerCard } from "@/components/installer-card";
import { LeadForm } from "@/components/lead-form";
import { serviceFilters } from "@/lib/data";
import { matchTerritoryByPostcode } from "@/lib/lead-assignment";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Find BUS & MCS Heat Pump Installers", "Search approved installers by postcode, town, county, region or territory.", "/directory");

export default async function DirectoryPage({ searchParams }: { searchParams: { q?: string; filter?: string | string[]; sort?: string } }) {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
  const query = searchParams.q?.toLowerCase().trim() ?? "";
  const filters = Array.isArray(searchParams.filter) ? searchParams.filter : searchParams.filter ? [searchParams.filter] : [];
  const postcodeTerritory = query ? matchTerritoryByPostcode(query, territories) : undefined;
  const results = installers
    .filter((installer) => installer.status === "active")
    .filter((installer) => {
      if (!query) return true;
      const territoryMatch = installer.territoryIds.includes(postcodeTerritory?.id ?? "");
      const text = [installer.companyName, installer.description, ...installer.areasCovered, ...installer.territoryIds, ...installer.services].join(" ").toLowerCase();
      return territoryMatch || text.includes(query);
    })
    .filter((installer) => {
      if (filters.length === 0) return true;
      return filters.every((filter) => {
        const normalised = filter.toLowerCase();
        if (normalised === "mcs accredited") return Boolean(installer.accreditations.mcsNumber);
        if (normalised === "bus registered") return installer.accreditations.busRegistered;
        if (normalised === "air source heat pumps") return installer.services.some((service) => service.toLowerCase().includes("air source"));
        if (normalised === "solar available") return installer.services.some((service) => service.toLowerCase().includes("solar"));
        if (normalised === "battery storage available") return installer.services.some((service) => service.toLowerCase().includes("battery"));
        if (normalised === "finance available") return installer.services.some((service) => service.toLowerCase().includes("finance"));
        if (normalised === "survey availability") return installer.surveyTurnaroundDays <= 7;
        return true;
      });
    });

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
          <div>
            <h1 className="text-4xl font-black">Directory Search</h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink/70">Search by postcode, town, county or territory, then request a survey from an approved installer.</p>
            <form className="surface-card mt-6 grid gap-3 p-4 md:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="directory-q">Search</label>
              <input id="directory-q" name="q" defaultValue={searchParams.q} placeholder="Postcode, town, county or territory" />
              <button className="button-primary" type="submit"><Search size={18} /> Search</button>
            </form>

            <div className="surface-card mt-5 grid gap-3 p-4 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-wrap gap-2">
              {serviceFilters.map((filter) => (
                <label key={filter} className="flex grid-cols-none flex-row items-center gap-2 rounded border border-stone-200 px-3 py-2 text-sm font-bold">
                  <input className="size-4 w-auto" type="checkbox" name="filter" value={filter} defaultChecked={filters.includes(filter)} /> {filter}
                </label>
              ))}
            </div>
            <label className="min-w-52">Sort by<select name="sort" defaultValue={searchParams.sort ?? "recommended"}><option value="recommended">Recommended</option><option value="closest">Closest</option><option value="highest-rated">Highest rated</option><option value="earliest">Earliest availability</option></select></label>
          </div>

            <div className="mt-6 grid gap-5">
              {results.length > 0 ? results.map((installer) => <InstallerCard key={installer.id} installer={installer} />) : (
                <div className="surface-card p-6">
                  <h2 className="text-xl font-black">No active installer found for that search yet.</h2>
                  <p className="mt-2 text-ink/65">Submit an enquiry and UKSD can review territory availability manually.</p>
                </div>
              )}
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm compact />
          </aside>
        </div>
      </div>
    </main>
  );
}
