import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { installers as fallbackInstallers } from "@/lib/data";
import { SERVICE_TYPES } from "@/lib/service-types";

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
  slug?: string;
  type?: string[];
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

export const DEFAULT_PER_PAGE = 15;
export const PER_PAGE_OPTIONS = [15, 30, 45, 60, 75, 90] as const;

export type DirectorySearchFilters = {
  query: string;
  postcode: string;
  allowedSlugs: string[] | null;
  type: string;
  sort: "relevance" | "name" | "type";
  page: number;
  perPage: number;
  bus: boolean;
  website: boolean;
  email: boolean;
};

let _supabase: ReturnType<typeof createClient> | null = null;

function slugifyServiceType(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SERVICE_TYPE_ALIASES: Record<string, string[]> = {
  "Air Source Heat Pump": ["air source heat pump", "air source heat pumps"],
  "Ground/Water Source Heat Pump": [
    "ground source heat pump",
    "ground source heat pumps",
    "water source heat pump",
    "water source heat pumps",
    "ground/water source heat pump",
    "ground/water source heat pumps",
  ],
  "Solar PV": ["solar pv"],
  "Battery Storage": ["battery storage"],
  Biomass: ["biomass"],
  "Technical surveys": ["technical surveys", "technical survey"],
  "Heat loss calculations": ["heat loss calculations", "heat loss calculation"],
};

export function normalizeServiceType(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";

  if (normalized.endsWith(" installers")) {
    const withoutSuffix = normalized.slice(0, -11).trim();
    const matchedSuffix = normalizeServiceType(withoutSuffix);
    if (matchedSuffix) return matchedSuffix;
  }

  const canonical = SERVICE_TYPES.find((serviceType) => {
    const label = serviceType.toLowerCase();
    return label === normalized || slugifyServiceType(serviceType) === normalized;
  });

  if (canonical) return canonical;

  for (const [serviceType, aliases] of Object.entries(SERVICE_TYPE_ALIASES)) {
    const aliasSet = [serviceType.toLowerCase(), slugifyServiceType(serviceType), ...aliases];
    if (aliasSet.some((alias) => alias === normalized)) return serviceType;
  }

  return value.trim();
}

function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _supabase = createClient(url, key);
  return _supabase;
}

function mapInstallerRows(rows: InstallerRow[]): McsInstaller[] {
  return rows.map((row) => ({
    installerId: row.mcs_installer_id ?? null,
    companyName: row.company_name,
    address: row.description,
    addressParts: row.address_line1 != null ? {
      line1: row.address_line1,
      line2: row.address_line2,
      line3: row.address_line3,
      county: row.address_county,
      postcode: row.address_postcode,
      country: row.address_country,
    } : undefined,
    category: parseJsonArray(row.services),
    regionsCovered: parseJsonArray(row.areas_covered),
    boilerUpgradeSchemeRegistered: row.bus_registered ?? false,
    certificationBody: row.certification_body ?? null,
    certificationNumber: row.mcs_number,
    website: row.website,
    email: row.email,
    phone: row.phone,
    sourcePage: row.source_page ?? null,
    slug: row.slug,
    type: Array.isArray(row.type) ? row.type : row.type ? [row.type] : [],
  }));
}

function fallbackDirectoryInstallers(): McsInstaller[] {
  return fallbackInstallers.map((installer) => ({
    installerId: null,
    companyName: installer.companyName,
    address: installer.description,
    category: [...installer.services],
    regionsCovered: [...installer.areasCovered],
    boilerUpgradeSchemeRegistered: installer.accreditations.busRegistered,
    certificationBody: null,
    certificationNumber: installer.accreditations.mcsNumber ?? null,
    website: null,
    email: null,
    phone: null,
    sourcePage: null,
    slug: installer.slug,
    type: [],
  }));
}

function filterDirectoryInstallers(installers: McsInstaller[], filters: DirectorySearchFilters) {
  const selectedType = normalizeServiceType(filters.type);
  const allowedSlugs = filters.allowedSlugs ? new Set(filters.allowedSlugs) : null;

  return installers
    .filter((installer) => {
      const haystack = [
        installer.companyName,
        installer.address,
        installer.category.join(" "),
        installer.certificationBody,
        installer.certificationNumber,
        installer.website,
        installer.email,
        installer.phone,
        installer.regionsCovered.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (filters.query && !haystack.includes(filters.query.toLowerCase())) return false;
      if (allowedSlugs && (!installer.slug || !allowedSlugs.has(installer.slug))) return false;
      if (selectedType && !matchesServiceType(installer.category, selectedType)) return false;
      if (filters.bus && !installer.boilerUpgradeSchemeRegistered) return false;
      if (filters.website && !installer.website) return false;
      if (filters.email && !installer.email) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "name" || filters.sort === "relevance") {
        return (a.companyName ?? "").localeCompare(b.companyName ?? "") || (a.address ?? "").localeCompare(b.address ?? "");
      }

      if (filters.sort === "type") {
        const aType = a.category.join(" / ");
        const bType = b.category.join(" / ");
        return aType.localeCompare(bType) || (a.companyName ?? "").localeCompare(b.companyName ?? "");
      }

      return 0;
    });
}

export function matchesServiceType(values: string[], selectedType: string) {
  const aliases = getServiceTypeAliases(selectedType);
  return values.some((value) => {
    const lower = value.toLowerCase();
    return aliases.some((alias) => lower.includes(alias));
  });
}

export function getServiceTypeAliases(selectedType: string) {
  const canonicalType = normalizeServiceType(selectedType);
  const aliases = SERVICE_TYPE_ALIASES[canonicalType] ?? [canonicalType.toLowerCase()];
  return Array.from(new Set([canonicalType.toLowerCase(), slugifyServiceType(canonicalType), ...aliases]));
}

type InstallerRow = {
  company_name: string;
  slug: string;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  mcs_installer_id: number | null;
  mcs_number: string | null;
  certification_body: string | null;
  bus_registered: boolean;
  services: string[];
  areas_covered: string[];
  address_line1: string | null;
  address_line2: string | null;
  address_line3: string | null;
  address_county: string | null;
  address_postcode: string | null;
  address_country: string | null;
  source_page: number | null;
  type: string[];
};

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function fetchInstallers(supabase: ReturnType<typeof createClient>) {
  const PAGE_SIZE = 1000;
  let allRows: unknown[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from("installers")
      .select("company_name, slug, email, phone, website, description, mcs_installer_id, mcs_number, certification_body, bus_registered, services, areas_covered, address_line1, address_line2, address_line3, address_county, address_postcode, address_country, source_page, type")
      .order("company_name")
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      // Fallback if new columns don't exist yet
      const fallback = await supabase
        .from("installers")
        .select("company_name, slug, email, phone, website, description, mcs_number, bus_registered, services, areas_covered")
        .order("company_name")
        .range(offset, offset + PAGE_SIZE - 1);

      if (fallback.error) throw fallback.error;
      allRows = allRows.concat(fallback.data ?? []);
    } else {
      allRows = allRows.concat(data ?? []);
    }

    if (!data || data.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      offset += PAGE_SIZE;
    }
  }

  return { data: allRows, error: null };
}

async function loadDirectoryData(): Promise<McsDirectoryData> {
  const supabase = getSupabase();
  if (!supabase) {
    const installers = fallbackDirectoryInstallers();
    return {
      sourceUrl: "https://mcscertified.com/find-an-installer/",
      query: { technology: "Air Source Heat Pump", region: "England" },
      totalCount: installers.length,
      totalPages: 1,
      scrapedAt: new Date().toISOString(),
      installers,
    };
  }

  const { data, error } = await fetchInstallers(supabase);

  if (error) throw error;

  const rows = (data ?? []) as unknown as InstallerRow[];
  const installers = mapInstallerRows(rows);

  return {
    sourceUrl: "https://mcscertified.com/find-an-installer/",
    query: { technology: "Air Source Heat Pump", region: "England" },
    totalCount: installers.length,
    totalPages: 1,
    scrapedAt: new Date().toISOString(),
    installers,
  };
}

const getCachedDirectoryData = unstable_cache(loadDirectoryData, ["mcs-directory-data"], {
  revalidate: 300
});

export async function readDirectoryData(): Promise<McsDirectoryData> {
  return getCachedDirectoryData();
}

async function loadDirectorySearchData(filters: DirectorySearchFilters): Promise<McsDirectoryData> {
  const supabase = getSupabase();

  if (!supabase) {
    const installers = filterDirectoryInstallers(fallbackDirectoryInstallers(), filters);
    const totalCount = installers.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / filters.perPage));
    const start = (Math.max(filters.page, 1) - 1) * filters.perPage;
    const results = installers.slice(start, start + filters.perPage);
    return {
      sourceUrl: "https://mcscertified.com/find-an-installer/",
      query: { technology: "Air Source Heat Pump", region: "England" },
      totalCount,
      totalPages,
      scrapedAt: new Date().toISOString(),
      installers: results
    };
  }

  const { data, error } = await fetchInstallers(supabase);

  if (error) throw error;

  const installers = filterDirectoryInstallers(mapInstallerRows((data ?? []) as InstallerRow[]), filters);
  const totalCount = installers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.perPage));
  const start = (Math.max(filters.page, 1) - 1) * filters.perPage;
  const results = installers.slice(start, start + filters.perPage);
  return {
    sourceUrl: "https://mcscertified.com/find-an-installer/",
    query: { technology: "Air Source Heat Pump", region: "England" },
    scrapedAt: new Date().toISOString(),
    totalCount,
    totalPages,
    installers: results
  };
}

const getCachedDirectorySearchData = unstable_cache(loadDirectorySearchData, ["mcs-directory-search-data"], {
  revalidate: 300
});

export async function readDirectoryPageData(filters: DirectorySearchFilters): Promise<McsDirectoryData> {
  try {
    return await getCachedDirectorySearchData(filters);
  } catch (error) {
    if (error instanceof Error && error.message.includes("incrementalCache missing")) {
      return loadDirectorySearchData(filters);
    }
    throw error;
  }
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

export function parsePerPage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? String(DEFAULT_PER_PAGE), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_PER_PAGE;

  const allowed = [...PER_PAGE_OPTIONS];
  const closestAllowed = allowed.find((option) => option === parsed);
  return closestAllowed ?? DEFAULT_PER_PAGE;
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
  if (installer.slug) return installer.slug;
  if (installer.installerId != null) return String(installer.installerId);
  return `${installer.sourcePage ?? "page"}-${slugifyListingName(installer.companyName)}`;
}

export function findListingByKey(installers: McsInstaller[], key: string) {
  const normalized = key.trim();
  if (!normalized) return null;

  const bySlug = installers.find((installer) => installer.slug === normalized);
  if (bySlug) return bySlug;

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
