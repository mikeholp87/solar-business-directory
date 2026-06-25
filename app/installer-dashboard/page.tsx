import { FileUp, MapPinned, Plus, ReceiptText } from "lucide-react";
import { getInstallerDashboardData } from "@/lib/repositories/installer-dashboard";

export default async function InstallerDashboardPage() {
  const { installer, leads: assignedLeads, allocatedTerritories } = await getInstallerDashboardData();

  return (
    <section className="grid gap-8">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">{installer.companyName}</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Edit profile content, view assigned leads and request additional territories.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card p-5"><ReceiptText className="text-accent" /><p className="mt-3 text-sm font-bold text-navy/55">Subscription</p><p className="mt-1 text-xl font-black">{installer.subscriptionStatus}</p></div>
        <div className="surface-card p-5"><MapPinned className="text-accent" /><p className="mt-3 text-sm font-bold text-navy/55">Territories</p><p className="mt-1 text-xl font-black">{allocatedTerritories.length}</p></div>
        <div className="surface-card p-5"><Plus className="text-accent" /><p className="mt-3 text-sm font-bold text-navy/55">Assigned leads</p><p className="mt-1 text-xl font-black">{assignedLeads.length}</p></div>
        <div className="surface-card p-5"><FileUp className="text-accent" /><p className="mt-3 text-sm font-bold text-navy/55">Agreed lead price</p><p className="mt-1 text-xl font-black">£{installer.leadPrice}</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <section className="surface-card p-5">
          <h2 className="text-2xl font-black">Profile</h2>
          <div className="mt-4 grid gap-4">
            <label>Company description<textarea defaultValue={installer.description} rows={5} /></label>
            <label>Areas covered<textarea defaultValue={installer.areasCovered.join(", ")} rows={3} /></label>
            <label>Survey turnaround days<input defaultValue={installer.surveyTurnaroundDays} type="number" /></label>
            <label>Upload accreditation document<input type="file" /></label>
            <button className="button-primary" type="button">Save profile</button>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-2xl font-black">Assigned leads</h2>
          <div className="mt-4 grid gap-3">
            {assignedLeads.map((lead) => (
              <div key={lead.id} className="surface-card bg-white/72 p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <p className="font-black">{lead.firstName} {lead.lastName}</p>
                  <span className="chip chip-soft capitalize">{lead.stage.replaceAll("_", " ")}</span>
                </div>
                <p className="mt-2 text-sm text-navy/65">{lead.postcode} · {lead.propertyType} · {lead.interests.join(", ")}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <label>Update status<select defaultValue={lead.stage}><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="survey_booked">Survey booked</option><option value="quote_issued">Quote issued</option></select></label>
                  <button className="button-secondary self-end" type="button">Add note</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
