import { describe, expect, it } from "vitest";
import { getLeadDashboardSummary } from "@/lib/repositories/leads";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories, getTerritoryByPostcode } from "@/lib/repositories/territories";
import { matchesServiceType, normalizeServiceType } from "@/lib/mcs-directory";

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

  it("matches service filters across labels, slugs, and category suffixes", () => {
    expect(normalizeServiceType("solar-pv")).toBe("Solar PV");
    expect(normalizeServiceType("Solar PV installers")).toBe("Solar PV");
    expect(matchesServiceType(["Air source heat pumps"], "air-source-heat-pump")).toBe(true);
    expect(matchesServiceType(["Ground source heat pumps"], "Ground/Water Source Heat Pump")).toBe(true);
  });
});
