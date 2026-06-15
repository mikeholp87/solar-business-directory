import { describe, expect, it } from "vitest";
import { installers, territories } from "@/lib/data";
import { assignLeadToInstaller, getPublicTerritoryStatus, matchTerritoryByPostcode } from "@/lib/lead-assignment";

describe("lead assignment", () => {
  it("matches a postcode to a territory", () => {
    expect(matchTerritoryByPostcode("LL57 1AA", territories)?.id).toBe("north-wales");
    expect(matchTerritoryByPostcode("SW1A 1AA", territories)?.id).toBe("london");
  });

  it("honours an active preferred installer in the matched territory", () => {
    const result = assignLeadToInstaller({
      postcode: "CF10 1AA",
      preferredInstallerId: "valley-renewables",
      territories,
      installers
    });
    expect(result).toEqual({ territoryId: "south-wales", assignedInstallerId: "valley-renewables" });
  });

  it("exposes full territories publicly", () => {
    const northWest = territories.find((territory) => territory.id === "north-west-england")!;
    expect(getPublicTerritoryStatus(northWest)).toBe("full");
  });
});
