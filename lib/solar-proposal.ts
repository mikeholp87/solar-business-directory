export type SolarProposalInput = {
  postcode: string;
  address: string;
  propertyType: string;
  ownership: string;
  roofType: string;
  roofCovering: string;
  shading: string;
  orientation: string;
  consumptionMethod: "annual" | "monthly" | "profile";
  annualConsumption?: number;
  monthlySpend?: number;
  householdProfile?: string;
  futureLoads: string[];
  batteryPreference: string;
  objective: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredContactMethod?: string;
  preferredContactTime?: string;
  consentTransactional?: boolean;
  consentMarketing?: boolean;
};

export type SolarProposal = {
  projectedConsumptionKwh: number;
  panelCount: number;
  panelWattage: number;
  solarCapacityKwp: number;
  batteryCapacityKwh: number;
  annualGenerationKwh: number;
  firstYearSaving: number;
  tenYearSaving: number;
  twentyYearSaving: number;
  paybackYears: number;
  indicativePrice: number;
  priceRange: { min: number; max: number };
  assumptions: string[];
};

const PROFILE_USAGE: Record<string, number> = {
  low: 2000,
  average: 3000,
  above_average: 4500,
  high: 6000,
  very_high: 8000
};

const FUTURE_LOADS: Record<string, number> = {
  ev: 2750,
  heat_pump: 4500,
  electric_heating: 3500,
  air_conditioning: 1250,
  hot_tub: 2000,
  extension: 750,
  home_office: 650,
  additional_occupants: 900
};

const ORIENTATION_FACTOR: Record<string, number> = {
  south: 1,
  south_east: 0.95,
  south_west: 0.95,
  east: 0.85,
  west: 0.85,
  north: 0.72,
  multiple: 0.9,
  unsure: 0.85
};

const SHADING_FACTOR: Record<string, number> = {
  minimal: 1,
  some: 0.9,
  significant: 0.75,
  unsure: 0.9
};

export function calculateSolarProposal(input: SolarProposalInput): SolarProposal {
  const baseConsumption = input.consumptionMethod === "annual"
    ? input.annualConsumption ?? 3000
    : input.consumptionMethod === "monthly"
      ? ((input.monthlySpend ?? 150) * 12) / 0.30
      : PROFILE_USAGE[input.householdProfile ?? "average"] ?? 3000;
  const futureUsage = input.futureLoads.reduce((sum, load) => sum + (FUTURE_LOADS[load] ?? 0), 0);
  const projectedConsumptionKwh = Math.max(1000, Math.round(baseConsumption + futureUsage));
  const yieldFactor = 900 * (ORIENTATION_FACTOR[input.orientation] ?? 0.85) * (SHADING_FACTOR[input.shading] ?? 0.9);
  const targetKwp = projectedConsumptionKwh / yieldFactor;
  const panelCount = Math.min(20, Math.max(6, Math.ceil(targetKwp / 0.47)));
  const panelWattage = 470;
  const solarCapacityKwp = Number((panelCount * panelWattage / 1000).toFixed(2));
  const annualGenerationKwh = Math.round(solarCapacityKwp * yieldFactor);
  const dailyConsumption = projectedConsumptionKwh / 365;
  const batteryRequested = input.batteryPreference !== "none";
  const batteryCapacityKwh = batteryRequested
    ? Math.min(20, Math.max(5, Math.round(dailyConsumption / 4) * 5))
    : 0;
  const selfConsumptionRate = batteryRequested ? 0.72 : 0.42;
  const solarUsedOnSite = annualGenerationKwh * selfConsumptionRate;
  const firstYearSaving = Math.round(solarUsedOnSite * 0.30 + (annualGenerationKwh - solarUsedOnSite) * 0.075);
  const tenYearSaving = Math.round(firstYearSaving * 8.7);
  const twentyYearSaving = Math.round(firstYearSaving * 15.6);
  const indicativePrice = Math.round((solarCapacityKwp * 1250 + batteryCapacityKwh * 520 + 2600) / 250) * 250;
  const priceRange = { min: indicativePrice - 750, max: indicativePrice + 1000 };

  return {
    projectedConsumptionKwh,
    panelCount,
    panelWattage,
    solarCapacityKwp,
    batteryCapacityKwh,
    annualGenerationKwh,
    firstYearSaving,
    tenYearSaving,
    twentyYearSaving,
    paybackYears: Number((indicativePrice / Math.max(firstYearSaving, 1)).toFixed(1)),
    indicativePrice,
    priceRange,
    assumptions: [
      "Indicative estimate using a 470 W panel and a blended electricity rate of £0.30/kWh.",
      "Generation uses a standard 900 kWh per installed kWp before orientation and shading adjustments.",
      "Final panel quantity, price and system specification are subject to a technical assessment."
    ]
  };
}
