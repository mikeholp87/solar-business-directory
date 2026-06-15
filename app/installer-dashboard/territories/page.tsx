import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { getInstallerDashboardData, requestTerritory } from "@/lib/repositories/installer-dashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Territories", "Request additional territory coverage.", "/installer-dashboard/territories");

async function requestTerritoryAction(formData: FormData) {
  "use server";
  await requireRole(["installer", "admin"]);
  const installerId = String(formData.get("installer_id") ?? "");
  const territoryId = String(formData.get("territory_id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  await requestTerritory(installerId, territoryId, notes);
  revalidatePath("/installer-dashboard");
  revalidatePath("/installer-dashboard/territories");
}

export default async function InstallerTerritoriesPage() {
  const { installer, territories, allocatedTerritories, territoryRequests } = await getInstallerDashboardData();
  const availableTerritories = territories.filter((territory) => !allocatedTerritories.some((item) => item.id === territory.id));

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Territories</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">See where you are currently live and request additional areas without automatically changing access.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="text-xl font-black">Allocated territories</h3>
          <div className="mt-4 grid gap-3">
            {allocatedTerritories.map((territory) => (
              <div key={territory.id} className="surface-card bg-white/72 p-4">
                <p className="font-black">{territory.name}</p>
                <p className="mt-1 text-sm text-ink/65">{territory.region} · {territory.counties.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-xl font-black">Request more coverage</h3>
          <form action={requestTerritoryAction} className="mt-4 grid gap-4">
            <input type="hidden" name="installer_id" value={installer.id} />
            <label>Territory
              <select name="territory_id" required>
                <option value="">Select a territory</option>
                {availableTerritories.map((territory) => <option key={territory.id} value={territory.id}>{territory.name}</option>)}
              </select>
            </label>
            <label>Notes<textarea name="notes" rows={4} placeholder="Why this territory is relevant" /></label>
            <button className="button-primary" type="submit">Request territory</button>
          </form>
        </div>
      </div>

      <div className="surface-card p-5">
        <h3 className="text-xl font-black">Pending requests</h3>
        <div className="mt-4 grid gap-3">
          {territoryRequests.length === 0 ? (
            <p className="text-sm text-ink/65">No territory requests yet.</p>
          ) : territoryRequests.map((request) => (
            <div key={request.id} className="surface-card bg-white/72 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-black">{territories.find((territory) => territory.id === request.territoryId)?.name ?? request.territoryId}</p>
                <span className="chip chip-soft capitalize">{request.status}</span>
              </div>
              {request.notes ? <p className="mt-2 text-sm text-ink/65">{request.notes}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
