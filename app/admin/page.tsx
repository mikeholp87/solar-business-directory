import { BadgePoundSterling, Download, MapPinned, Users, Wrench, type LucideIcon } from "lucide-react";
import { installers, leads, leadStages, territories } from "@/lib/data";

export default function AdminPage() {
  const activeInstallers = installers.filter((installer) => installer.status === "active");
  const pendingApplications = installers.filter((installer) => installer.status === "pending");
  const busAccepted = leads.filter((lead) => lead.stage === "bus_accepted");
  const completedInstalls = leads.filter((lead) => lead.stage === "installation_completed");
  const leadsThisMonth = leads.filter((lead) => new Date(lead.createdAt).getMonth() === new Date().getMonth());
  const fullTerritories = territories.filter((territory) => territory.activeInstallerCount >= territory.maxInstallerSlots);
  const availableTerritories = territories.filter((territory) => territory.activeInstallerCount < territory.maxInstallerSlots);
  const commissionDue = leads.reduce((total, lead) => total + (lead.referralFeePaid ? 0 : lead.referralFeeDue), 0);
  const stats: Array<[LucideIcon, string, string | number]> = [
    [Users, "Total installers", installers.length],
    [Wrench, "Active installers", activeInstallers.length],
    [Users, "Pending applications", pendingApplications.length],
    [Users, "Leads this month", leadsThisMonth.length],
    [BadgePoundSterling, "BUS accepted leads", busAccepted.length],
    [Wrench, "Completed installs", completedInstalls.length],
    [BadgePoundSterling, "Commission due", `£${commissionDue.toLocaleString()}`],
    [Users, "Total homeowner leads", leads.length],
    [Wrench, "Territories full", fullTerritories.length],
    [MapPinned, "Territories available", availableTerritories.length]
  ];

  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-fern">Secure admin area</p>
            <h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1>
          </div>
          <button className="button-secondary"><Download size={18} /> Export leads CSV</button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map(([Icon, label, value]) => (
            <div key={label} className="rounded-lg border border-emerald-950/10 bg-white p-5">
              <Icon className="text-fern" size={24} />
              <p className="mt-4 text-sm font-bold text-ink/55">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-emerald-950/10 bg-white p-5">
            <h2 className="text-2xl font-black">Installer Management</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead><tr className="border-b"><th className="py-2">Company</th><th>Status</th><th>Subscription</th><th>Lead price</th><th>Capacity</th></tr></thead>
                <tbody>
                  {installers.map((installer) => (
                    <tr key={installer.id} className="border-b last:border-0">
                      <td className="py-3 font-bold">{installer.companyName}</td>
                      <td>{installer.status}</td>
                      <td>{installer.subscriptionStatus}</td>
                      <td>{installer.leadPrice ? `£${installer.leadPrice}` : "Internal"}</td>
                      <td>{installer.monthlyInstallCapacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-emerald-950/10 bg-white p-5">
            <h2 className="text-2xl font-black">Territory Management</h2>
            <div className="mt-4 grid gap-3">
              {territories.map((territory) => (
                <div key={territory.id} className="flex items-center justify-between gap-4 rounded border border-stone-200 p-3">
                  <div>
                    <p className="font-bold">{territory.name}</p>
                    <p className="text-sm text-ink/60">{territory.activeInstallerCount}/{territory.maxInstallerSlots} active installers · {territory.leadVolume} leads</p>
                  </div>
                  <span className="rounded bg-skywash px-2 py-1 text-xs font-black text-fern">{territory.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-lg border border-emerald-950/10 bg-white p-5">
          <h2 className="text-2xl font-black">Lead Management</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {leadStages.map((stage) => <span key={stage} className="rounded bg-stone-100 px-3 py-1 text-xs font-bold">{stage}</span>)}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead><tr className="border-b"><th className="py-2">Lead</th><th>Postcode</th><th>Stage</th><th>Territory</th><th>Installer</th><th>Invoice</th></tr></thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0">
                    <td className="py-3 font-bold">{lead.firstName} {lead.lastName}</td>
                    <td>{lead.postcode}</td>
                    <td>{lead.stage.replaceAll("_", " ")}</td>
                    <td>{territories.find((item) => item.id === lead.territoryId)?.name ?? "Unmatched"}</td>
                    <td>{installers.find((item) => item.id === lead.assignedInstallerId)?.companyName ?? "Unassigned"}</td>
                    <td>{lead.invoiceStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink/60">Commercial tracking is admin-only and includes lead cost, pay-per-install fees, VAT and invoice status.</p>
        </section>
      </div>
    </main>
  );
}
