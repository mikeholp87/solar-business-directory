import { describe, expect, it } from "vitest";
import { calculateSolarProposal } from "@/lib/solar-proposal";

describe("solar proposal calculator", () => {
  it("sizes a battery-backed system from annual usage and future loads", () => {
    const result = calculateSolarProposal({
      postcode: "IM4 6EE", address: "Baldrine", propertyType: "detached", ownership: "yes",
      roofType: "pitched", roofCovering: "tile", shading: "minimal", orientation: "south",
      consumptionMethod: "annual", annualConsumption: 4000, futureLoads: ["ev"],
      batteryPreference: "self_consumption", objective: "reduce_bills"
    });

    expect(result.projectedConsumptionKwh).toBe(6750);
    expect(result.panelCount).toBeGreaterThanOrEqual(6);
    expect(result.batteryCapacityKwh).toBeGreaterThan(0);
    expect(result.priceRange.max).toBeGreaterThan(result.indicativePrice);
  });
});
