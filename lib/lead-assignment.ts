import type { Installer, Territory } from "./types";

export function normalisePostcode(postcode: string) {
  return postcode.toUpperCase().replace(/\s+/g, "").trim();
}

export function postcodeOutwardCode(postcode: string) {
  const normalised = normalisePostcode(postcode);
  return normalised.match(/^[A-Z]{1,2}\d[A-Z\d]?/)?.[0] ?? normalised;
}

export function matchTerritoryByPostcode(postcode: string, territoryList: Territory[]) {
  const outward = postcodeOutwardCode(postcode);
  let bestMatch: Territory | undefined;
  let bestPrefixLength = 0;

  for (const territory of territoryList) {
    for (const prefix of territory.postcodePrefixes) {
      const normalisedPrefix = prefix.toUpperCase();
      if (!outward.startsWith(normalisedPrefix)) continue;

      if (normalisedPrefix.length > bestPrefixLength) {
        bestMatch = territory;
        bestPrefixLength = normalisedPrefix.length;
      }
    }
  }

  return bestMatch;
}

export function territoryHasPublicSpace(territory: Territory) {
  return territory.activeInstallerCount < territory.maxInstallerSlots;
}

export function getPublicTerritoryStatus(territory: Territory) {
  if (territory.activeInstallerCount >= territory.maxInstallerSlots) return "full";
  if (territory.activeInstallerCount === territory.maxInstallerSlots - 1) return "limited";
  return territory.status === "priority" ? "priority" : "available";
}

export function assignLeadToInstaller(params: {
  postcode: string;
  preferredInstallerId?: string;
  territories: Territory[];
  installers: Installer[];
  previousAssignments?: string[];
}) {
  const territory = matchTerritoryByPostcode(params.postcode, params.territories);
  if (!territory) return { territoryId: undefined, assignedInstallerId: params.preferredInstallerId };

  if (params.preferredInstallerId) {
    const preferred = params.installers.find((installer) => installer.id === params.preferredInstallerId);
    if (preferred?.territoryIds.includes(territory.id) && preferred.status === "active") {
      return { territoryId: territory.id, assignedInstallerId: preferred.id };
    }
  }

  const eligible = params.installers.filter((installer) => installer.status === "active" && installer.territoryIds.includes(territory.id));
  if (eligible.length === 0) return { territoryId: territory.id, assignedInstallerId: undefined };

  const assignments = params.previousAssignments ?? [];
  const lastAssignedId = [...assignments].reverse().find((id) => eligible.some((installer) => installer.id === id));
  const nextIndex = lastAssignedId ? (eligible.findIndex((installer) => installer.id === lastAssignedId) + 1) % eligible.length : 0;
  return { territoryId: territory.id, assignedInstallerId: eligible[nextIndex]?.id };
}
