import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listLeads } from "@/lib/repositories/leads";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { updateLeadAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Leads", "Review and update homeowner leads.", "/admin/leads");

async function saveLeadAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const leadId = String(formData.get("id") ?? "");
  await updateLeadAdmin(leadId, {
    stage: String(formData.get("stage") ?? "new_enquiry") as never,
    invoiceStatus: String(formData.get("invoice_status") ?? "not_invoiced") as never,
    assignedInstallerId: String(formData.get("assigned_installer_id") ?? "") || undefined,
    referralFeePaid: formData.get("referral_fee_paid") === "on",
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export default async function AdminLeadsPage() {
  const [leads, installers, territories] = await Promise.all([listLeads(), listInstallers(), listTerritories()]);

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Leads</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Track stage progress, invoice status and assignment.</p>
      </div>

      {leads.map((lead) => (
        <form key={lead.id} action={saveLeadAction} className="surface-card grid gap-4 p-5">
          <input type="hidden" name="id" value={lead.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{lead.firstName} {lead.lastName}</h3>
              <p className="mt-1 text-sm text-navy/65">{lead.email} · {lead.phone} · {lead.postcode}</p>
            </div>
            <span className="chip chip-soft capitalize">{lead.stage.replaceAll("_", " ")}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label>Stage
              <select name="stage" defaultValue={lead.stage}>
                <option value="new_enquiry">New enquiry</option>
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
            <label>Invoice
              <select name="invoice_status" defaultValue={lead.invoiceStatus}>
                <option value="not_invoiced">Not invoiced</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </label>
            <label>Installer
              <select name="assigned_installer_id" defaultValue={lead.assignedInstallerId ?? ""}>
                <option value="">Unassigned</option>
                {installers.map((installer) => <option key={installer.id} value={installer.id}>{installer.companyName}</option>)}
              </select>
            </label>
            <label className="flex items-start gap-2 pt-8">
              <input name="referral_fee_paid" type="checkbox" defaultChecked={lead.referralFeePaid} className="size-4 w-auto" />
              <span>Referral paid</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>Territory<input value={territories.find((territory) => territory.id === lead.territoryId)?.name ?? "Unmatched"} readOnly /></label>
            <label>Notes<textarea name="notes" rows={3} defaultValue={lead.notes ?? ""} /></label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">Save lead</button>
          </div>
        </form>
      ))}
    </section>
  );
}
