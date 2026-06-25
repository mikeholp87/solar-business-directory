import Link from "next/link";
import { BadgePoundSterling, Download, MapPinned, Users, Wrench, type LucideIcon } from "lucide-react";
import { leadStages } from "@/lib/data";
import { getLeadDashboardSummary } from "@/lib/repositories/leads";

export default async function AdminPage() {
  const summary = await getLeadDashboardSummary();
  const { activeInstallers, pendingApplications, busAccepted, completedInstalls, leadsThisMonth, fullTerritories, availableTerritories, commissionDue, installers, leads, territories } = summary;
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
    <section className="grid gap-8">
      <div className="surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Overview</h2>
            <p className="mt-2 text-sm leading-6 text-navy/65">Use the tabs above to manage installers, territories, applications, leads and reviews.</p>
          </div>
          <Link className="button-secondary" href="/admin/export"><Download size={18} /> Export leads CSV</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([Icon, label, value]) => (
          <div key={label} className="surface-card p-5">
            <Icon className="text-accent" size={24} />
            <p className="mt-4 text-sm font-bold text-navy/55">{label}</p>
            <p className="mt-1 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="text-2xl font-black">Installer Management</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy/10 bg-white/72">
            <table className="data-table w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pl-4">Company</th>
                  <th>Status</th>
                  <th>Subscription</th>
                  <th>Lead price</th>
                  <th className="pr-4">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {installers.map((installer) => (
                  <tr key={installer.id}>
                    <td className="py-3 pl-4 font-bold">{installer.companyName}</td>
                    <td>{installer.status}</td>
                    <td>{installer.subscriptionStatus}</td>
                    <td>{installer.leadPrice ? `£${installer.leadPrice}` : "Internal"}</td>
                    <td className="pr-4">{installer.monthlyInstallCapacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="surface-card p-5">
            <h2 className="text-2xl font-black">Territory Management</h2>
            <div className="mt-4 grid gap-3">
              {territories.map((territory) => (
                <div key={territory.id} className="surface-card bg-white/72 flex items-center justify-between gap-4 p-3">
                  <div>
                    <p className="font-bold">{territory.name}</p>
                    <p className="text-sm text-navy/60">{territory.activeInstallerCount}/{territory.maxInstallerSlots} active installers · {territory.leadVolume} leads</p>
                </div>
                <span className="chip chip-soft capitalize">{territory.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card p-5">
        <h2 className="text-2xl font-black">Lead Management</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {leadStages.map((stage) => <span key={stage} className="chip">{stage}</span>)}
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-navy/10 bg-white/72">
          <table className="data-table w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr>
                <th className="py-3 pl-4">Lead</th>
                <th>Postcode</th>
                <th>Stage</th>
                <th>Territory</th>
                <th>Installer</th>
                <th className="pr-4">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-3 pl-4 font-bold">{lead.firstName} {lead.lastName}</td>
                  <td>{lead.postcode}</td>
                  <td>{lead.stage.replaceAll("_", " ")}</td>
                  <td>{territories.find((item) => item.id === lead.territoryId)?.name ?? "Unmatched"}</td>
                  <td>{installers.find((item) => item.id === lead.assignedInstallerId)?.companyName ?? "Unassigned"}</td>
                  <td className="pr-4">{lead.invoiceStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-navy/60">Commercial tracking is admin-only and includes lead cost, pay-per-install fees, VAT and invoice status.</p>
      </section>
    </section>
  );
}
