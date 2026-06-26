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

export async function readDirectoryData(): Promise<McsDirectoryData> {
  const supabase = getSupabase();
  const { data, error } = await fetchInstallers(supabase);

  if (error) throw error;

  const rows = (data ?? []) as unknown as InstallerRow[];
  const installers: McsInstaller[] = rows.map((row) => ({
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
