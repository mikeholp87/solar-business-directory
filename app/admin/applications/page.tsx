import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listInstallerApplications } from "@/lib/repositories/applications";
import { updateInstallerApplicationStatus } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Installer Applications", "Review and process installer applications.", "/admin/applications");

async function saveApplicationAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const applicationId = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending") as "pending" | "approved" | "suspended" | "cancelled";
  await updateInstallerApplicationStatus(applicationId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
}

export default async function AdminApplicationsPage() {
  const applications = await listInstallerApplications();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Installer Applications</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Approve or reject installer applications after checking accreditations and territory fit.</p>
      </div>

      {applications.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No installer applications were found.</p>
        </div>
      ) : (
        applications.map((application) => (
          <form key={application.id} action={saveApplicationAction} className="surface-card grid gap-4 p-5">
            <input type="hidden" name="id" value={application.id} />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{application.company_name}</h3>
                <p className="mt-1 text-sm text-navy/65">{application.contact_name} · {application.email} · {application.phone}</p>
              </div>
              <span className="chip chip-soft capitalize">{application.status}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Application status
                <select name="status" defaultValue={application.status}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>MCS number<input value={application.mcs_number ?? ""} readOnly /></label>
              <label>Monthly capacity<input value={application.monthly_install_capacity ?? ""} readOnly /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Website<input value={application.website ?? ""} readOnly /></label>
              <label>Company number<input value={application.company_number ?? ""} readOnly /></label>
              <label>VAT number<input value={application.vat_number ?? ""} readOnly /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>RECC number<input value={application.recc_number ?? ""} readOnly /></label>
              <label>HIES number<input value={application.hies_number ?? ""} readOnly /></label>
              <label>TrustMark number<input value={application.trustmark_number ?? ""} readOnly /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>Survey turnaround (days)<input value={application.survey_turnaround_days ?? ""} readOnly /></label>
              <label>Applied at<input value={application.created_at ? new Date(application.created_at).toLocaleString() : ""} readOnly /></label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label>Services<textarea value={Array.isArray(application.services) ? application.services.join(", ") : ""} readOnly rows={2} /></label>
              <label>Areas covered<textarea value={Array.isArray(application.areas_covered) ? application.areas_covered.join(", ") : ""} readOnly rows={2} /></label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label>Preferred territories<textarea value={Array.isArray(application.preferred_territories) ? application.preferred_territories.join(", ") : ""} readOnly rows={2} /></label>
              <label>Notes<textarea value={application.notes ?? ""} readOnly rows={2} /></label>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <span className={application.bus_registered ? "font-bold text-green-700" : "text-navy/50"}>BUS registered</span>
              <span className={application.handles_bus_applications ? "font-bold text-green-700" : "text-navy/50"}>Handles BUS apps</span>
              <span className={application.completes_heat_loss_calculations ? "font-bold text-green-700" : "text-navy/50"}>Heat loss calcs</span>
              <span className={application.offers_solar ? "font-bold text-green-700" : "text-navy/50"}>Solar</span>
              <span className={application.offers_battery ? "font-bold text-green-700" : "text-navy/50"}>Battery</span>
              <span className={application.open_to_monthly_listing ? "font-bold text-green-700" : "text-navy/50"}>Monthly listing</span>
              <span className={application.open_to_pay_per_install ? "font-bold text-green-700" : "text-navy/50"}>Pay-per-install</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Save status</button>
            </div>
          </form>
        ))
      )}
    </section>
  );
}
