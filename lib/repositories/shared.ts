import { installers as fallbackInstallers, leads as fallbackLeads, reviews as fallbackReviews, territories as fallbackTerritories } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/runtime";
import type { Installer, Lead, Review, Territory } from "@/lib/types";

type MaybeRecord = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") as string[] : fallback;
}

function asJsonArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string") as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") as string[] : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function asDateString(value: unknown, fallback = new Date().toISOString()) {
  return typeof value === "string" ? value : fallback;
}

export async function getSupabaseOrNull() {
  if (!isSupabaseConfigured()) return null;
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase");
    return await createServerSupabaseClient();
  } catch {
    return null;
  }
}

export function mergeInstallerRecord(row: MaybeRecord | undefined, fallback: Installer): Installer {
  if (!row) return fallback;
  return {
    ...fallback,
    id: asString(row.id, fallback.id),
    companyName: asString(row.company_name, fallback.companyName),
    slug: asString(row.slug, fallback.slug),
    contactName: asString(row.contact_name, fallback.contactName ?? ""),
    email: asString(row.email, fallback.email ?? ""),
    phone: asString(row.phone, fallback.phone ?? ""),
    website: asString(row.website, fallback.website ?? ""),
    companyNumber: asString(row.company_number, fallback.companyNumber ?? ""),
    vatNumber: asString(row.vat_number, fallback.vatNumber ?? ""),
    logoUrl: asString(row.logo_url, fallback.logoUrl),
    coverImageUrl: asString(row.cover_image_url, fallback.coverImageUrl),
    description: asString(row.description, fallback.description),
    mcsNumber: asString(row.mcs_number, fallback.accreditations?.mcsNumber ?? ""),
    busRegistered: asBoolean(row.bus_registered, fallback.accreditations?.busRegistered ?? false),
    accreditationsVerified: asBoolean(row.accreditations_verified, fallback.accreditations?.verified ?? false),
    reccNumber: asString(row.recc_number, fallback.accreditations?.reccNumber ?? ""),
    hiesNumber: asString(row.hies_number, fallback.accreditations?.hiesNumber ?? ""),
    trustmarkNumber: asString(row.trustmark_number, fallback.accreditations?.trustMarkNumber ?? ""),
    services: asJsonArray(row.services, fallback.services),
    areasCovered: asJsonArray(row.areas_covered, fallback.areasCovered),
    monthlyInstallCapacity: asNumber(row.monthly_install_capacity, fallback.monthlyInstallCapacity),
    surveyTurnaroundDays: asNumber(row.survey_turnaround_days, fallback.surveyTurnaroundDays),
    warranty: asString(row.warranty, fallback.warranty ?? ""),
    rating: asNumber(row.rating, fallback.rating ?? 0),
    status: (asString(row.status, fallback.status) as Installer["status"]),
    subscriptionStatus: (asString(row.subscription_status, fallback.subscriptionStatus) as Installer["subscriptionStatus"]),
    leadPrice: row.lead_price === null || row.lead_price === undefined ? fallback.leadPrice : Number(row.lead_price),
    gallery: asJsonArray(row.gallery, fallback.gallery ?? []),
    territoryIds: asJsonArray(row.territory_ids, fallback.territoryIds),
    internalNotes: asString(row.internal_notes, fallback.internalNotes ?? ""),
    leadCount: asNumber(row.lead_count, fallback.leadCount ?? 0)
  };
}

export function mergeTerritoryRecord(row: MaybeRecord | undefined, fallback: Territory): Territory {
  if (!row) return fallback;
  return {
    ...fallback,
    id: asString(row.id, fallback.id),
    name: asString(row.name, fallback.name),
    slug: asString(row.slug, fallback.slug ?? fallback.id),
    region: asString(row.region, fallback.region),
    counties: asJsonArray(row.counties, fallback.counties),
    postcodePrefixes: asJsonArray(row.postcode_prefixes, fallback.postcodePrefixes),
    maxInstallerSlots: asNumber(row.max_installer_slots, fallback.maxInstallerSlots),
    status: (asString(row.status, fallback.status) as Territory["status"]),
    priority: asBoolean(row.priority, fallback.priority ?? false),
    leadVolume: asNumber(row.lead_volume, fallback.leadVolume),
    activeInstallerCount: asNumber(row.active_installer_count, fallback.activeInstallerCount),
    notes: asString(row.notes, fallback.notes ?? "")
  };
}

export function mergeLeadRecord(row: MaybeRecord | undefined, fallback: Lead): Lead {
  if (!row) return fallback;
  return {
    ...fallback,
    id: asString(row.id, fallback.id),
    firstName: asString(row.first_name, fallback.firstName),
    lastName: asString(row.last_name, fallback.lastName),
    email: asString(row.email, fallback.email),
    phone: asString(row.phone, fallback.phone),
    postcode: asString(row.postcode, fallback.postcode),
    propertyType: asString(row.property_type, fallback.propertyType),
    bedrooms: row.bedrooms === null || row.bedrooms === undefined ? fallback.bedrooms : Number(row.bedrooms),
    bestTimeToContact: asString(row.best_time_to_contact, fallback.bestTimeToContact),
    interests: asJsonArray(row.interests, fallback.interests),
    stage: asString(row.stage, fallback.stage) as Lead["stage"],
    territoryId: typeof row.territory_id === "string" ? row.territory_id : fallback.territoryId,
    preferredInstallerId: typeof row.preferred_installer_id === "string" ? row.preferred_installer_id : fallback.preferredInstallerId,
    assignedInstallerId: typeof row.assigned_installer_id === "string" ? row.assigned_installer_id : fallback.assignedInstallerId,
    source: asString(row.source, fallback.source),
    campaign: asString(row.campaign, fallback.campaign ?? ""),
    referralFeeDue: row.referral_fee_due === null || row.referral_fee_due === undefined ? fallback.referralFeeDue : Number(row.referral_fee_due),
    referralFeePaid: asBoolean(row.referral_fee_paid, fallback.referralFeePaid),
    invoiceStatus: asString(row.invoice_status, fallback.invoiceStatus) as Lead["invoiceStatus"],
    notes: asString(row.notes, fallback.notes ?? ""),
    createdAt: asDateString(row.created_at, fallback.createdAt)
  };
}

export function mergeReviewRecord(row: MaybeRecord | undefined, fallback: Review): Review {
  if (!row) return fallback;
  return {
    ...fallback,
    id: asString(row.id, fallback.id ?? ""),
    installerId: asString(row.installer_id, fallback.installerId),
    customerName: asString(row.customer_name, fallback.customerName),
    rating: asNumber(row.rating, fallback.rating),
    reviewText: asString(row.review_text, fallback.reviewText),
    approved: asBoolean(row.approved, fallback.approved ?? false)
  };
}

export function getFallbackInstallerBySlug(slug: string) {
  return fallbackInstallers.find((installer) => installer.slug === slug);
}

export function getFallbackTerritoryBySlug(slug: string) {
  return fallbackTerritories.find((territory) => territory.slug === slug || territory.id === slug);
}

export function getFallbackReviewList() {
  return fallbackReviews;
}

export function getFallbackLeadList() {
  return fallbackLeads;
}
