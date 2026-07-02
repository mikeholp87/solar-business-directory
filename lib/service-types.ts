export const SERVICE_TYPES = [
  "Air Source Heat Pump",
  "Ground/Water Source Heat Pump",
  "Solar PV",
  "Battery Storage",
  "Biomass",
  "Technical surveys",
  "Heat loss calculations",
] as const;

export const SERVICE_DISPLAY_LABELS: Record<string, string> = {
  "Air Source Heat Pump": "Air Source Heat Pump",
  "Ground/Water Source Heat Pump": "Ground & Water Source Heat Pump",
  "Solar PV": "Solar PV",
  "Battery Storage": "Battery Storage",
  Biomass: "Biomass",
  "Technical surveys": "Technical Surveyors",
  "Heat loss calculations": "Heat Loss Calculations",
};

export const SERVICE_FACET_LABELS: Record<string, string> = {
  "Air Source Heat Pump": "Air Source Heat Pump Installers",
  "Ground/Water Source Heat Pump": "Ground & Water Source Heat Pump Installers",
  "Solar PV": "Solar PV Installers",
  "Battery Storage": "Battery Storage Installers",
  Biomass: "Biomass Installers",
  "Technical surveys": "Technical Surveyors",
  "Heat loss calculations": "Heat Loss Calculations",
};

export function getServiceDisplayLabel(type: string): string {
  return SERVICE_DISPLAY_LABELS[type] ?? type;
}

export function getServiceFacetLabel(type: string): string {
  return SERVICE_FACET_LABELS[type] ?? `${type} Installers`;
}
