import { SERVICE_TYPES } from "@/lib/service-types";

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
  "Air Source Heat Pump": "Find installers that support air source heat pump surveys, design, installation and BUS-ready projects.",
  "Ground/Water Source Heat Pump": "Compare installers with ground and water source heat pump experience for larger or more complex sites.",
  "Solar PV": "Browse solar PV installers with roof-mounted array, battery-ready and retrofit experience.",
  "Battery Storage": "Find battery storage installers that can add storage to solar or standalone retrofit projects.",
  Biomass: "Compare biomass installers for rural homes and larger properties that need a specialist heating solution.",
  "Technical surveys": "Find installers that offer technical surveys before design, quote and installation.",
  "Heat loss calculations": "Compare installers that can complete heat loss calculations for accurate low-carbon heating design."
};

export const serviceFacets: ServiceFacet[] = SERVICE_TYPES.map((type) => {
  const slug = `${slugifyFacet(type)}-installers`;
  return {
    label: `${type} installers`,
    title: `${type} installers`,
    slug,
    type,
    description: facetDescriptions[type] ?? `Compare ${type.toLowerCase()} installers across the UK.`
  };
});

export function getServiceFacetBySlug(slug: string) {
  return serviceFacets.find((facet) => facet.slug === slug);
}
