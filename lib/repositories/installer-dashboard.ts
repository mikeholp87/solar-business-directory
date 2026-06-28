import { installers as fallbackInstallers } from "@/lib/data";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { getSupabaseOrNull, mergeInstallerRecord } from "@/lib/repositories/shared";
import { listInstallers } from "@/lib/repositories/installers";
import { listLeads } from "@/lib/repositories/leads";
import { listTerritories } from "@/lib/repositories/territories";
import type { Installer, Lead, Territory, TerritoryRequest, DocumentRecord } from "@/lib/types";

async function resolveCurrentInstaller() {
  const supabase = await getSupabaseOrNull();
  if (!supabase) {
    return fallbackInstallers.find((installer) => installer.status === "active") ?? fallbackInstallers[0];
  }

  const user = await getCurrentSessionUser();
  if (user) {
    const { data } = await supabase.from("installers").select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      const fallback = fallbackInstallers.find((installer) => installer.slug === data.slug) ?? fallbackInstallers[0];
      return mergeInstallerRecord(data, fallback);
    }
    return null;
  }

  return null;
}

export async function deriveInstallerIdFromSession(): Promise<string | null> {
  const user = await getCurrentSessionUser();
  if (!user) return null;
  const supabase = await getSupabaseOrNull();
  if (!supabase) return null;
  const { data } = await supabase.from("installers").select("id").eq("user_id", user.id).maybeSingle();
  return data?.id ?? null;
}

export async function getCurrentInstaller() {
  return resolveCurrentInstaller();
}

export async function getInstallerDashboardData() {
  const installer = await resolveCurrentInstaller();
  if (!installer) {
    return {
      installer: null,
      installers: [],
      territories: [],
      leads: [],
      allocatedTerritories: [],
      documents: [],
      territoryRequests: []
    };
  }
  const [installers, territories, leads, documents, territoryRequests] = await Promise.all([
    listInstallers(),
    listTerritories(),
    listLeads(),
    listInstallerDocuments(installer.id),
    listTerritoryRequests(installer.id)
  ]);
  const assignedLeads = leads.filter((lead) => lead.assignedInstallerId === installer.id);
  const allocatedTerritories = territories.filter((territory) => installer.territoryIds.includes(territory.id));
  return { installer, installers, territories, leads: assignedLeads, allocatedTerritories, documents, territoryRequests };
}

export async function updateInstallerProfile(installerId: string, payload: Partial<Installer>) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { error } = await supabase.from("installers").update({
    description: payload.description,
    areas_covered: payload.areasCovered,
    survey_turnaround_days: payload.surveyTurnaroundDays,
    website: payload.website,
    phone: payload.phone,
    contact_name: payload.contactName
  }).eq("id", installerId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function updateInstallerLead(installerId: string, leadId: string, payload: Partial<Lead>) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { error } = await supabase.from("leads").update({
    stage: payload.stage,
    notes: payload.notes
  }).eq("id", leadId).eq("assigned_installer_id", installerId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function listInstallerDocuments(installerId: string): Promise<DocumentRecord[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) {
    return [];
  }
  const { data } = await supabase.from("documents").select("*").eq("installer_id", installerId).order("uploaded_at", { ascending: false });
  return (data ?? []).map((row) => ({
    id: row.id,
    installerId: row.installer_id,
    documentType: row.document_type,
    fileUrl: row.file_url,
    verified: row.verified,
    uploadedAt: row.uploaded_at
  }));
}

export async function addInstallerDocument(installerId: string, payload: { documentType: string; fileUrl: string }) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { error } = await supabase.from("documents").insert({
    installer_id: installerId,
    document_type: payload.documentType,
    file_url: payload.fileUrl,
    verified: false
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function deleteInstallerDocument(installerId: string, documentId: string) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { error } = await supabase.from("documents").delete().eq("id", documentId).eq("installer_id", installerId);
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function deleteTerritoryRequest(installerId: string, requestId: string) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { error } = await supabase.from("territory_requests").delete().eq("id", requestId).eq("installer_id", installerId).eq("status", "pending");
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function listTerritoryRequests(installerId: string): Promise<TerritoryRequest[]> {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];
  const { data } = await supabase.from("territory_requests").select("*").eq("installer_id", installerId).order("requested_at", { ascending: false });
  return (data ?? []).map((row) => ({
    id: row.id,
    installerId: row.installer_id,
    territoryId: row.territory_id,
    notes: row.notes,
    status: row.status,
    requestedAt: row.requested_at
  }));
}

export async function requestTerritory(installerId: string, territoryId: string, notes?: string) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return { ok: true as const };
  const user = await getCurrentSessionUser();
  if (!user) return { ok: false as const, error: "Not authenticated" };
  const { data: ownerCheck } = await supabase.from("installers").select("id").eq("id", installerId).eq("user_id", user.id).maybeSingle();
  if (!ownerCheck) return { ok: false as const, error: "Not authorised" };
  const { data: existing } = await supabase.from("territory_requests").select("id").eq("installer_id", installerId).eq("territory_id", territoryId).in("status", ["pending", "approved"]).maybeSingle();
  if (existing) return { ok: false as const, error: "Already requested" };
  const { error } = await supabase.from("territory_requests").insert({
    installer_id: installerId,
    territory_id: territoryId,
    notes,
    status: "pending"
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}
