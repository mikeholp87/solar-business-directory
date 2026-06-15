import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listTerritories } from "@/lib/repositories/territories";
import { updateTerritoryAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Territories", "Manage territory capacity and availability.", "/admin/territories");

async function saveTerritoryAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const territoryId = String(formData.get("id") ?? "");
  await updateTerritoryAdmin(territoryId, {
    status: String(formData.get("status") ?? "available") as never,
    maxInstallerSlots: formData.get("max_installer_slots") ? Number(formData.get("max_installer_slots")) : undefined,
    leadVolume: formData.get("lead_volume") ? Number(formData.get("lead_volume")) : undefined,
    priority: formData.get("priority") === "on",
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/admin");
  revalidatePath("/admin/territories");
}

export default async function AdminTerritoriesPage() {
  const territories = await listTerritories();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Territories</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">Adjust slot caps, status and priority handling. Active installer membership is controlled from installer records.</p>
      </div>

      {territories.map((territory) => (
        <form key={territory.id} action={saveTerritoryAction} className="surface-card grid gap-4 p-5">
          <input type="hidden" name="id" value={territory.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{territory.name}</h3>
              <p className="mt-1 text-sm text-ink/65">{territory.region} · {territory.counties.join(", ")}</p>
            </div>
            <span className="chip chip-soft">{territory.activeInstallerCount}/{territory.maxInstallerSlots}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label>Status
              <select name="status" defaultValue={territory.status}>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="full">Full</option>
                <option value="priority">Priority</option>
              </select>
            </label>
            <label>Max slots<input name="max_installer_slots" type="number" defaultValue={territory.maxInstallerSlots} /></label>
            <label>Lead volume<input name="lead_volume" type="number" defaultValue={territory.leadVolume} /></label>
            <label className="flex items-start gap-2 pt-8">
              <input name="priority" type="checkbox" defaultChecked={territory.priority ?? false} className="size-4 w-auto" />
              <span>Priority territory</span>
            </label>
          </div>

          <label>Notes<textarea name="notes" rows={3} defaultValue={territory.notes ?? ""} /></label>
          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">Save territory</button>
          </div>
        </form>
      ))}
    </section>
  );
}
