import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { getInstallerDashboardData, updateInstallerLead } from "@/lib/repositories/installer-dashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Assigned Leads", "Update the status of your assigned leads.", "/installer-dashboard/leads");

async function saveLeadAction(formData: FormData) {
  "use server";
  await requireRole(["installer", "admin"]);
  const installerId = String(formData.get("installer_id") ?? "");
  const leadId = String(formData.get("id") ?? "");
  await updateInstallerLead(installerId, leadId, {
    stage: String(formData.get("stage") ?? "contacted") as never,
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/installer-dashboard");
  revalidatePath("/installer-dashboard/leads");
}

export default async function InstallerLeadsPage() {
  const { installer, leads } = await getInstallerDashboardData();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Assigned leads</h2>
        <p className="mt-2 text-sm leading-6 text-ink/65">Track each enquiry and keep notes current for the admin team.</p>
      </div>

      {leads.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-ink/70">No leads are assigned to this installer.</p>
        </div>
      ) : (
        leads.map((lead) => (
          <form key={lead.id} action={saveLeadAction} className="surface-card grid gap-4 p-5">
            <input type="hidden" name="installer_id" value={installer.id} />
            <input type="hidden" name="id" value={lead.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{lead.firstName} {lead.lastName}</h3>
              <p className="mt-1 text-sm text-ink/65">{lead.postcode} · {lead.propertyType} · {lead.interests.join(", ")}</p>
            </div>
              <span className="chip chip-soft capitalize">{lead.stage.replaceAll("_", " ")}</span>
          </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label>Status
                <select name="stage" defaultValue={lead.stage}>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="survey_booked">Survey booked</option>
                  <option value="survey_completed">Survey completed</option>
                  <option value="quote_issued">Quote issued</option>
                  <option value="bus_application_submitted">BUS application submitted</option>
                  <option value="bus_accepted">BUS accepted</option>
                  <option value="installation_booked">Installation booked</option>
                  <option value="installation_completed">Installation completed</option>
                  <option value="lost">Lost</option>
                  <option value="not_eligible">Not eligible</option>
                </select>
              </label>
              <label>Notes<textarea name="notes" rows={3} defaultValue={lead.notes ?? ""} /></label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Save lead</button>
            </div>
          </form>
        ))
      )}
    </section>
  );
}
