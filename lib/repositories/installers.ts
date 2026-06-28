import { installers as fallbackInstallers } from "@/lib/data";
import { mergeInstallerRecord, getSupabaseOrNull } from "@/lib/repositories/shared";
import type { Installer } from "@/lib/types";

export async function listInstallers(): Promise<Installer[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) {
    return fallbackInstallers;
  }

  const [{ data: installerRows }, { data: territoryRows }, { data: reviewRows }, { data: leadRows }] = await Promise.all([
    supabase.from("installers").select("*").order("company_name"),
    supabase.from("installer_territories").select("installer_id,territory_id,status"),
    supabase.from("reviews").select("installer_id,rating,approved"),
    supabase.from("leads").select("assigned_installer_id")
  ]);

  const territoryIdsByInstaller = new Map<string, string[]>();
  for (const row of territoryRows ?? []) {
    if ((row as { status?: string }).status !== "active") continue;
    const installerId = (row as { installer_id?: string }).installer_id;
    const territoryId = (row as { territory_id?: string }).territory_id;
    if (!installerId || !territoryId) continue;
    const current = territoryIdsByInstaller.get(installerId) ?? [];
    current.push(territoryId);
    territoryIdsByInstaller.set(installerId, current);
  }

  const statsByInstaller = new Map<string, { total: number; count: number }>();
  for (const row of reviewRows ?? []) {
    if ((row as { approved?: boolean }).approved !== true) continue;
    const installerId = (row as { installer_id?: string }).installer_id;
    const rating = Number((row as { rating?: unknown }).rating ?? 0);
    if (!installerId || !Number.isFinite(rating)) continue;
    const current = statsByInstaller.get(installerId) ?? { total: 0, count: 0 };
    current.total += rating;
    current.count += 1;
    statsByInstaller.set(installerId, current);
  }

  const leadCountByInstaller = new Map<string, number>();
  for (const row of leadRows ?? []) {
    const installerId = (row as { assigned_installer_id?: string }).assigned_installer_id;
    if (!installerId) continue;
    leadCountByInstaller.set(installerId, (leadCountByInstaller.get(installerId) ?? 0) + 1);
  }

  return (installerRows ?? []).map((row) => {
    const fallback = fallbackInstallers.find((item) => item.slug === (row as { slug?: string }).slug) ?? fallbackInstallers[0];
    const reviews = statsByInstaller.get((row as { id?: string }).id ?? "") ?? statsByInstaller.get(fallback.id) ?? { total: fallback.rating, count: 1 };
    const rating = reviews.count > 0 ? Number((reviews.total / reviews.count).toFixed(1)) : fallback.rating;
    const installerId = (row as { id?: string }).id ?? fallback.id;
    return mergeInstallerRecord(
      {
        ...row,
        territory_ids: territoryIdsByInstaller.get((row as { id?: string }).id ?? "") ?? fallback.territoryIds,
        rating,
        lead_count: leadCountByInstaller.get(installerId) ?? 0
      },
      fallback
    );
  });
}

export async function getInstallerBySlug(slug: string): Promise<Installer | undefined> {
  const items = await listInstallers();
  return items.find((installer) => installer.slug === slug);
}

export async function getActiveInstallers() {
  const items = await listInstallers();
  return items.filter((installer) => installer.status === "active");
}

export async function getInstallersForTerritory(territoryId: string) {
  const items = await getActiveInstallers();
  return items.filter((installer) => installer.territoryIds.includes(territoryId));
}
