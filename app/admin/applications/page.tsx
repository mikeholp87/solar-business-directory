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
            <div className="grid gap-3 md:grid-cols-2">
              <label>Preferred territories<textarea value={Array.isArray(application.preferred_territories) ? application.preferred_territories.join(", ") : ""} readOnly rows={2} /></label>
              <label>Notes<textarea value={application.notes ?? ""} readOnly rows={2} /></label>
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
