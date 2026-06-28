import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listInstallersForAdmin } from "@/lib/repositories/installers";
import { updateInstallerAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Installers", "Manage installer status, subscriptions and commercial fields.", "/admin/installers");

async function saveInstallerAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const installerId = String(formData.get("id") ?? "");
  await updateInstallerAdmin(installerId, {
    status: String(formData.get("status") ?? "pending") as never,
    subscriptionStatus: String(formData.get("subscription_status") ?? "trialing") as never,
    leadPrice: formData.get("lead_price") ? Number(formData.get("lead_price")) : undefined,
    monthlyInstallCapacity: formData.get("monthly_install_capacity") ? Number(formData.get("monthly_install_capacity")) : undefined,
    surveyTurnaroundDays: formData.get("survey_turnaround_days") ? Number(formData.get("survey_turnaround_days")) : undefined,
    website: String(formData.get("website") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    description: String(formData.get("description") ?? ""),
    internalNotes: String(formData.get("internal_notes") ?? "")
  });
  revalidatePath("/admin");
  revalidatePath("/admin/installers");
}

export default async function AdminInstallersPage() {
  const installers = await listInstallersForAdmin();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Installers</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Edit status, subscription state and commercial controls. Territory membership is managed on the territories page.</p>
      </div>

      {installers.map((installer) => (
        <form key={installer.id} action={saveInstallerAction} className="surface-card grid gap-4 p-5">
          <input type="hidden" name="id" value={installer.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{installer.companyName}</h3>
              <p className="mt-1 text-sm text-navy/65">{installer.slug} · {installer.email ?? "No email"} · {installer.phone ?? "No phone"}</p>
            </div>
            <span className="chip chip-soft capitalize">{installer.status}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label>Lead count<input value={installer.leadCount ?? 0} readOnly /></label>
            <label>Territories<input value={installer.territoryIds.length} readOnly /></label>
            <label>Public profile<input value={installer.status === "active" && installer.accreditationsVerified ? "Visible" : "Hidden"} readOnly /></label>
            <label>Subscription<input value={installer.subscriptionStatus} readOnly /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>Status
              <select name="status" defaultValue={installer.status}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label>Subscription
              <select name="subscription_status" defaultValue={installer.subscriptionStatus}>
                <option value="trialing">Trialing</option>
                <option value="active">Active</option>
                <option value="past_due">Past due</option>
                <option value="offline_active">Offline active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label>Lead price<input name="lead_price" type="number" step="0.01" defaultValue={installer.leadPrice ?? ""} /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>Monthly capacity<input name="monthly_install_capacity" type="number" defaultValue={installer.monthlyInstallCapacity} /></label>
            <label>Survey days<input name="survey_turnaround_days" type="number" defaultValue={installer.surveyTurnaroundDays} /></label>
            <label>Website<input name="website" defaultValue={installer.website ?? ""} /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>Contact name<input value={installer.contactName ?? ""} readOnly /></label>
            <label>Company number<input value={installer.companyNumber ?? ""} readOnly /></label>
            <label>VAT number<input value={installer.vatNumber ?? ""} readOnly /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label>MCS number<input value={installer.mcsNumber ?? ""} readOnly /></label>
            <label>RECC number<input value={installer.reccNumber ?? ""} readOnly /></label>
            <label>HIES number<input value={installer.hiesNumber ?? ""} readOnly /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>TrustMark number<input value={installer.trustmarkNumber ?? ""} readOnly /></label>
            <label>Accreditations verified<input value={installer.accreditationsVerified ? "Yes" : "No"} readOnly /></label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>Services<textarea value={Array.isArray(installer.services) ? installer.services.join(", ") : ""} readOnly rows={2} /></label>
            <label>Areas covered<textarea value={Array.isArray(installer.areasCovered) ? installer.areasCovered.join(", ") : ""} readOnly rows={2} /></label>
          </div>

          <div className="grid gap-4">
            <label>Phone<input name="phone" defaultValue={installer.phone ?? ""} /></label>
            <label>Description<textarea name="description" rows={4} defaultValue={installer.description} /></label>
            <label>Internal notes<textarea name="internal_notes" rows={3} defaultValue={installer.internalNotes ?? ""} /></label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">Save installer</button>
          </div>
        </form>
      ))}
    </section>
  );
}
