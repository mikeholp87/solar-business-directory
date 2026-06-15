import { describe, expect, it } from "vitest";
import { getLeadDashboardSummary } from "@/lib/repositories/leads";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories, getTerritoryByPostcode } from "@/lib/repositories/territories";

describe("repository fallback data", () => {
  it("returns installer and territory seed data when Supabase is not configured", async () => {
    const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);
    expect(installers.length).toBeGreaterThan(0);
    expect(territories.length).toBeGreaterThan(0);
    expect(installers.some((installer) => installer.status === "active")).toBe(true);
  });

  it("matches fallback postcodes to territories", async () => {
    expect((await getTerritoryByPostcode("LL57 1AA"))?.id).toBe("north-wales");
    expect((await getTerritoryByPostcode("SW1A 1AA"))?.id).toBe("london");
  });

  it("builds a dashboard summary from fallback data", async () => {
    const summary = await getLeadDashboardSummary();
    expect(summary.leads.length).toBeGreaterThan(0);
    expect(summary.activeInstallers.length).toBeGreaterThan(0);
    expect(summary.commissionDue).toBeGreaterThanOrEqual(0);
  });
});
