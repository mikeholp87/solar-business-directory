import { territories as fallbackTerritories } from "@/lib/data";
import { getPublicTerritoryStatus, matchTerritoryByPostcode } from "@/lib/lead-assignment";
import { mergeTerritoryRecord, getSupabaseOrNull } from "@/lib/repositories/shared";
import type { Territory } from "@/lib/types";

export async function listTerritories(): Promise<Territory[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) {
    return fallbackTerritories.map((territory) => ({
      ...territory,
      status: getPublicTerritoryStatus(territory),
    }));
  }

  const [{ data: territoriesData }, { data: installersData }] = await Promise.all([
    supabase.from("territories").select("*").order("name"),
    supabase.from("installer_territories").select("territory_id,status")
  ]);

  const activeCounts = new Map<string, number>();
  for (const row of installersData ?? []) {
    if ((row as { status?: string }).status === "active") {
      const territoryId = (row as { territory_id?: string }).territory_id;
      if (territoryId) activeCounts.set(territoryId, (activeCounts.get(territoryId) ?? 0) + 1);
    }
  }

  return (territoriesData ?? []).map((row) => {
    const fallback = fallbackTerritories.find((item) => item.slug === (row as { slug?: string }).slug || item.id === row.id) ?? fallbackTerritories[0];
    return mergeTerritoryRecord({ ...row, active_installer_count: activeCounts.get(row.id) ?? 0 }, fallback);
  });
}

export async function getTerritoryBySlug(slug: string) {
  const items = await listTerritories();
  return items.find((territory) => territory.slug === slug || territory.id === slug);
}

export async function getTerritoryByPostcode(postcode: string) {
  const items = await listTerritories();
  return matchTerritoryByPostcode(postcode, items);
}

export async function getPublicTerritories() {
  return listTerritories();
}
