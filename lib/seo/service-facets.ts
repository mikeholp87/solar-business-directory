import { SERVICE_TYPES, getServiceFacetLabel } from "@/lib/service-types";

function slugifyFacet(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ServiceFacet = {
  label: string;
  title: string;
  slug: string;
  type: string;
  description: string;
};

const facetDescriptions: Record<string, string> = {
  "Air Source Heat Pump": "Find MCS certified installers for air source heat pump surveys, design, installation and BUS-ready projects.",
  "Ground/Water Source Heat Pump": "Compare MCS certified ground and water source heat pump installers for larger or more complex sites.",
  "Solar PV": "Browse MCS certified solar PV installers with roof-mounted array, battery-ready and retrofit experience.",
  "Battery Storage": "Find MCS certified battery storage installers that can add storage to solar or standalone retrofit projects.",
  Biomass: "Compare MCS certified biomass installers for rural homes and larger properties that need a specialist heating solution.",
  "Technical surveys": "Find qualified technical surveyors for renewable energy assessments before design, quote and installation.",
  "Heat loss calculations": "Compare specialists that can complete heat loss calculations for accurate low-carbon heating design."
};

export const serviceFacets: ServiceFacet[] = SERVICE_TYPES.map((type) => {
  const slug = `${slugifyFacet(type)}-installers`;
  const label = getServiceFacetLabel(type);
  return {
    label,
    title: label,
    slug,
    type,
    description: facetDescriptions[type] ?? `Compare ${type.toLowerCase()} installers across the UK.`
  };
});

export function getServiceFacetBySlug(slug: string) {
  return serviceFacets.find((facet) => facet.slug === slug);
}
