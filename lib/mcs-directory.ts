import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type McsInstaller = {
  installerId: number | null;
  companyName: string | null;
  address: string | null;
  addressParts?: {
    line1: string | null;
    line2: string | null;
    line3: string | null;
    county: string | null;
    postcode: string | null;
    country: string | null;
  };
  category: string[];
  regionsCovered: string[];
  boilerUpgradeSchemeRegistered: boolean;
  certificationBody: string | null;
  certificationNumber: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  sourcePage: number | null;
};

export type McsDirectoryData = {
  sourceUrl: string;
  query: {
    technology: string;
    region: string;
  };
  totalCount: number;
  totalPages: number;
  scrapedAt: string;
  installers: McsInstaller[];
};

export const PER_PAGE = 15;
export const DATA_PATH = resolve(process.cwd(), "data/mcscertified-air-source-heat-pump-england.json");

export function readDirectoryData() {
  const raw = readFileSync(DATA_PATH, "utf8");
  const parsed = JSON.parse(raw) as McsDirectoryData;

  return {
    ...parsed,
    installers: parsed.installers.map((installer) => ({
      ...installer,
      category: Array.isArray(installer.category) ? installer.category : [],
      regionsCovered: Array.isArray(installer.regionsCovered) ? installer.regionsCovered : [],
      addressParts: installer.addressParts ?? undefined,
    })),
  };
}

export function parsePage(page: string | string[] | undefined) {
  const value = Array.isArray(page) ? page[0] : page;
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function normalizeSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function parseFlag(value: string | string[] | undefined) {
  const normalized = normalizeSearchParam(value).toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "on" || normalized === "yes";
}

export function formatWebsite(url: string | null) {
  if (!url) return null;
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

export function slugifyListingName(value: string | null) {
  return (value ?? "listing")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "listing";
}

export function getListingKey(installer: McsInstaller) {
  if (installer.installerId != null) return String(installer.installerId);
  return `${installer.sourcePage ?? "page"}-${slugifyListingName(installer.companyName)}`;
}

export function findListingByKey(installers: McsInstaller[], key: string) {
  const normalized = key.trim();
  if (!normalized) return null;

  const byId = installers.find((installer) => installer.installerId != null && String(installer.installerId) === normalized);
  if (byId) return byId;

  return installers.find((installer) => getListingKey(installer) === normalized) ?? null;
}

export function formatScrapedAt(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(new Date(value));
}
