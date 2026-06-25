import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { getInstallerDashboardData, updateInstallerProfile } from "@/lib/repositories/installer-dashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Installer Profile", "Edit your public installer profile.", "/installer-dashboard/profile");

async function saveProfileAction(formData: FormData) {
  "use server";
  await requireRole(["installer", "admin"]);
  const installerId = String(formData.get("id") ?? "");
  await updateInstallerProfile(installerId, {
    description: String(formData.get("description") ?? ""),
    areasCovered: String(formData.get("areas_covered") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    surveyTurnaroundDays: formData.get("survey_turnaround_days") ? Number(formData.get("survey_turnaround_days")) : undefined,
    website: String(formData.get("website") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    contactName: String(formData.get("contact_name") ?? "")
  });
  revalidatePath("/installer-dashboard");
  revalidatePath("/installer-dashboard/profile");
}

export default async function InstallerProfilePage() {
  const { installer } = await getInstallerDashboardData();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Profile</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Keep your public profile accurate so homeowners see the right contact and service details.</p>
      </div>

      <form action={saveProfileAction} className="surface-card grid gap-4 p-5">
        <input type="hidden" name="id" value={installer.id} />
        <div className="flex flex-wrap gap-2">
          <span className="chip chip-soft">{installer.status}</span>
          <span className="chip chip-soft">{installer.subscriptionStatus}</span>
          <span className="chip chip-soft">{installer.territoryIds.length} territories</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label>Contact name<input name="contact_name" defaultValue={installer.contactName ?? ""} /></label>
          <label>Website<input name="website" defaultValue={installer.website ?? ""} /></label>
          <label>Phone<input name="phone" defaultValue={installer.phone ?? ""} /></label>
          <label>Survey turnaround days<input name="survey_turnaround_days" type="number" defaultValue={installer.surveyTurnaroundDays} /></label>
        </div>
        <label>Description<textarea name="description" rows={5} defaultValue={installer.description} /></label>
        <label>Areas covered<textarea name="areas_covered" rows={4} defaultValue={installer.areasCovered.join(", ")} /></label>
        <div className="flex flex-wrap gap-3">
          <button className="button-primary" type="submit">Save profile</button>
        </div>
      </form>
    </section>
  );
}
