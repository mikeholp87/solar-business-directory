import { FileUp, MapPinned, Plus, ReceiptText } from "lucide-react";
import { installers, leads, territories } from "@/lib/data";

export default function InstallerDashboardPage() {
  const installer = installers[0];
  const assignedLeads = leads.filter((lead) => lead.assignedInstallerId === installer.id);
  const allocatedTerritories = territories.filter((territory) => installer.territoryIds.includes(territory.id));

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-8">
          <p className="font-bold text-fern">Installer login area</p>
          <h1 className="mt-2 text-4xl font-black">{installer.companyName}</h1>
          <p className="mt-3 text-ink/65">Edit profile content, view assigned leads and request additional territories.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-emerald-950/10 bg-white p-5"><ReceiptText className="text-fern" /><p className="mt-3 text-sm font-bold text-ink/55">Subscription</p><p className="text-xl font-black">{installer.subscriptionStatus}</p></div>
          <div className="rounded-lg border border-emerald-950/10 bg-white p-5"><MapPinned className="text-fern" /><p className="mt-3 text-sm font-bold text-ink/55">Territories</p><p className="text-xl font-black">{allocatedTerritories.length}</p></div>
          <div className="rounded-lg border border-emerald-950/10 bg-white p-5"><Plus className="text-fern" /><p className="mt-3 text-sm font-bold text-ink/55">Assigned leads</p><p className="text-xl font-black">{assignedLeads.length}</p></div>
          <div className="rounded-lg border border-emerald-950/10 bg-white p-5"><FileUp className="text-fern" /><p className="mt-3 text-sm font-bold text-ink/55">Agreed lead price</p><p className="text-xl font-black">£{installer.leadPrice}</p></div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <section className="rounded-lg border border-emerald-950/10 bg-white p-5">
            <h2 className="text-2xl font-black">Profile</h2>
            <div className="mt-4 grid gap-4">
              <label>Company description<textarea defaultValue={installer.description} rows={5} /></label>
              <label>Areas covered<textarea defaultValue={installer.areasCovered.join(", ")} rows={3} /></label>
              <label>Survey turnaround days<input defaultValue={installer.surveyTurnaroundDays} type="number" /></label>
              <label>Upload accreditation document<input type="file" /></label>
              <button className="button-primary" type="button">Save profile</button>
            </div>
          </section>

          <section className="rounded-lg border border-emerald-950/10 bg-white p-5">
            <h2 className="text-2xl font-black">Assigned leads</h2>
            <div className="mt-4 grid gap-3">
              {assignedLeads.map((lead) => (
                <div key={lead.id} className="rounded border border-stone-200 p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <p className="font-black">{lead.firstName} {lead.lastName}</p>
                    <span className="rounded bg-skywash px-2 py-1 text-xs font-black text-fern">{lead.stage.replaceAll("_", " ")}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink/65">{lead.postcode} · {lead.propertyType} · {lead.interests.join(", ")}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label>Update status<select defaultValue={lead.stage}><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="survey_booked">Survey booked</option><option value="quote_issued">Quote issued</option></select></label>
                    <button className="button-secondary self-end" type="button">Add note</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
