import { createClient } from "@supabase/supabase-js";

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

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  _supabase = createClient(url, key);
  return _supabase;
}

type InstallerRow = {
  company_name: string;
  slug: string;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  mcs_number: string | null;
  bus_registered: boolean;
  services: string[];
  areas_covered: string[];
};

export async function readDirectoryData(): Promise<McsDirectoryData> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("installers")
    .select("company_name, slug, email, phone, website, description, mcs_number, bus_registered, services, areas_covered")
    .order("company_name")
    .range(0, 4999);

  if (error) throw error;

  const rows = (data ?? []) as unknown as InstallerRow[];
  const installers: McsInstaller[] = rows.map((row) => ({
    installerId: null,
    companyName: row.company_name,
    address: row.description,
    category: Array.isArray(row.services) ? row.services : [],
    regionsCovered: Array.isArray(row.areas_covered) ? row.areas_covered : [],
    boilerUpgradeSchemeRegistered: row.bus_registered ?? false,
    certificationBody: null,
    certificationNumber: row.mcs_number,
    website: row.website,
    email: row.email,
    phone: row.phone,
    sourcePage: null,
    slug: row.slug,
  }));

  return {
    sourceUrl: "https://mcscertified.com/find-an-installer/",
    query: { technology: "Air Source Heat Pump", region: "England" },
    totalCount: installers.length,
    totalPages: 1,
    scrapedAt: new Date().toISOString(),
    installers,
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
