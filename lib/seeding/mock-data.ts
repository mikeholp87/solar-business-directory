import { randomUUID } from "node:crypto";
import { installers as mockInstallers, leads as mockLeads, reviews as mockReviews, territories as mockTerritories } from "@/lib/data";
import type { SupabaseClient } from "@supabase/supabase-js";

type SeedUser = {
  email: string;
  role: "admin" | "installer";
  password?: string;
  userMetadata?: Record<string, unknown>;
};

const seedApplications = [
  {
    company_name: "Severn Green Homes",
    contact_name: "Alex Price",
    email: "alex@severn.example",
    phone: "07000 000101",
    mcs_number: "MCS-APP-101",
    bus_registered: true,
    services: ["Air source heat pumps", "Solar PV"],
    areas_covered: ["Gloucester", "Bristol"],
    preferred_territories: ["south-west-england"],
    monthly_install_capacity: 9,
    survey_turnaround_days: 6,
    handles_bus_applications: true,
    completes_heat_loss_calculations: true,
    offers_solar: true,
    offers_battery: false,
    open_to_monthly_listing: true,
    open_to_pay_per_install: true,
    notes: "Interested in South West priority campaigns."
  },
  {
    company_name: "Peak District Renewables",
    contact_name: "Morgan Hill",
    email: "morgan@peak.example",
    phone: "07000 000102",
    mcs_number: "MCS-APP-102",
    bus_registered: true,
    services: ["Air source heat pumps", "Battery storage"],
    areas_covered: ["Derby", "Sheffield"],
    preferred_territories: ["midlands", "yorkshire"],
    monthly_install_capacity: 11,
    survey_turnaround_days: 7,
    handles_bus_applications: true,
    completes_heat_loss_calculations: true,
    offers_solar: false,
    offers_battery: true,
    open_to_monthly_listing: true,
    open_to_pay_per_install: false,
    notes: "Can take overflow leads."
  }
];

function seedEmail(value: string) {
  return value.toLowerCase();
}

function buildInstallerRows() {
  return mockInstallers.map((installer) => ({
    company_name: installer.companyName,
    slug: installer.slug,
    contact_name: installer.contactName ?? null,
    email: installer.email ?? `${installer.slug}@example.com`,
    phone: installer.phone ?? null,
    website: installer.website ?? null,
    company_number: installer.companyNumber ?? null,
    vat_number: installer.vatNumber ?? null,
    logo_url: installer.logoUrl,
    cover_image_url: installer.coverImageUrl,
    description: installer.description,
    mcs_number: installer.accreditations.mcsNumber ?? null,
    bus_registered: installer.accreditations.busRegistered,
    accreditations_verified: installer.accreditations.verified,
    recc_number: installer.accreditations.reccNumber ?? null,
    hies_number: installer.accreditations.hiesNumber ?? null,
    trustmark_number: installer.accreditations.trustMarkNumber ?? null,
    services: installer.services,
    areas_covered: installer.areasCovered,
    monthly_install_capacity: installer.monthlyInstallCapacity,
    survey_turnaround_days: installer.surveyTurnaroundDays,
    status: installer.status,
    subscription_status: installer.subscriptionStatus,
    lead_price: installer.leadPrice ?? null,
    installer_fee_type: installer.slug === "northline-heat-partners" ? "pay_per_lead" : installer.slug === "valley-renewables-group" || installer.slug === "thames-clean-heat" ? "hybrid" : "monthly_directory",
    referral_fee_total: 1250,
    bus_acceptance_fee: 250,
    completion_fee: 1000,
    vat_applicable: true,
    internal_notes: installer.internalNotes ?? null
  }));
}

function buildTerritoryRows() {
  return mockTerritories.map((territory) => ({
    name: territory.name,
    slug: territory.slug ?? territory.id,
    region: territory.region,
    counties: territory.counties,
    postcode_prefixes: territory.postcodePrefixes,
    max_installer_slots: territory.maxInstallerSlots,
    status: territory.status,
    priority: territory.priority ?? false,
    lead_volume: territory.leadVolume,
    notes: territory.notes ?? null
  }));
}

function buildLeadRows(
  territoryIdsBySlug: Map<string, string>,
  installerIdsBySlug: Map<string, string>
) {
  return mockLeads.map((lead) => ({
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    postcode: lead.postcode,
    homeowner_status: lead.homeownerStatus ?? false,
    current_heating_source: lead.currentHeatingSource ?? null,
    monthly_bill: lead.monthlyBill ?? null,
    property_type: lead.propertyType,
    bedrooms: lead.bedrooms ?? null,
    interests: lead.interests,
    consent_contact: lead.consentContact ?? true,
    consent_marketing: lead.consentMarketing ?? false,
    gdpr_acceptance: lead.gdprAcceptance ?? true,
    territory_id: lead.territoryId ? territoryIdsBySlug.get(lead.territoryId) ?? null : null,
    preferred_installer_id: lead.preferredInstallerId ? installerIdsBySlug.get(lead.preferredInstallerId) ?? null : null,
    assigned_installer_id: lead.assignedInstallerId ? installerIdsBySlug.get(lead.assignedInstallerId) ?? null : null,
    source: lead.source,
    campaign: lead.campaign ?? null,
    stage: lead.stage,
    referral_fee_due: lead.referralFeeDue,
    referral_fee_paid: lead.referralFeePaid,
    invoice_status: lead.invoiceStatus,
    created_at: lead.createdAt,
    updated_at: lead.createdAt
  }));
}

function buildReviewRows(installerIdsBySlug: Map<string, string>) {
  return mockReviews.map((review) => ({
    installer_id: installerIdsBySlug.get(review.installerId) ?? null,
    customer_name: review.customerName,
    rating: review.rating,
    review_text: review.reviewText,
    approved: true
  })).filter((row) => row.installer_id);
}

async function ensureAuthUser(supabase: SupabaseClient, seedUser: SeedUser) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;

  const existing = data.users.find((user) => seedEmail(user.email ?? "") === seedEmail(seedUser.email));
  if (existing) return existing;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: seedUser.email,
    password: seedUser.password ?? randomUUID(),
    email_confirm: true,
    user_metadata: seedUser.userMetadata
  });
  if (createError) throw createError;
  if (!created.user) throw new Error(`Failed to create auth user for ${seedUser.email}`);
  return created.user;
}

async function ensureAuthUsers(supabase: SupabaseClient) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "admin@example.com";
  const targets: SeedUser[] = [
    { email: adminEmail, role: "admin", password: randomUUID(), userMetadata: { role: "admin" } },
    ...mockInstallers.map((installer) => ({
      email: installer.email ?? `${installer.slug}@example.com`,
      role: "installer" as const,
      password: randomUUID(),
      userMetadata: { role: "installer", installer_slug: installer.slug }
    }))
  ];

  const users = [];
  for (const target of targets) {
    const user = await ensureAuthUser(supabase, target);
    users.push({ user, role: target.role, email: target.email });
  }
  return users;
}

function buildDocuments(installerIdsBySlug: Map<string, string>) {
  const rows: Array<Record<string, unknown>> = [];
  for (const installer of mockInstallers) {
    const installerId = installerIdsBySlug.get(installer.slug);
    if (!installerId) continue;
    rows.push({
      installer_id: installerId,
      document_type: "mcs-certificate",
      file_url: `https://example.com/documents/mock/${installer.slug}/mcs-certificate.pdf`,
      verified: true,
      uploaded_at: new Date(Date.now() - 10 * 86400000).toISOString()
    });
    if (installer.slug === "cambrian-eco-heat" || installer.slug === "valley-renewables-group" || installer.slug === "thames-clean-heat") {
      rows.push({
        installer_id: installerId,
        document_type: "insurance-certificate",
        file_url: `https://example.com/documents/mock/${installer.slug}/insurance-certificate.pdf`,
        verified: false,
        uploaded_at: new Date(Date.now() - 7 * 86400000).toISOString()
      });
    }
  }
  return rows;
}

function buildTerritoryRequests(
  installerIdsBySlug: Map<string, string>,
  territoryIdsBySlug: Map<string, string>
) {
  return [
    {
      installer_id: installerIdsBySlug.get("cambrian-eco-heat"),
      territory_id: territoryIdsBySlug.get("south-west-england"),
      notes: "Requesting additional campaign coverage for the current quarter.",
      status: "pending",
      requested_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      installer_id: installerIdsBySlug.get("northline-heat-partners"),
      territory_id: territoryIdsBySlug.get("yorkshire"),
      notes: "Approved for overflow coverage while existing slot capacity is reviewed.",
      status: "approved",
      requested_at: new Date(Date.now() - 12 * 86400000).toISOString()
    },
    {
      installer_id: installerIdsBySlug.get("caledonia-heatworks"),
      territory_id: territoryIdsBySlug.get("london"),
      notes: "Expanding London availability after recent staffing changes.",
      status: "rejected",
      requested_at: new Date(Date.now() - 86400000).toISOString()
    }
  ].filter((row) => row.installer_id && row.territory_id);
}

function buildNotificationRows() {
  const now = Date.now();
  return [
    {
      event_type: "seed.lead_received",
      channel: "email",
      recipient_email: "hello@cambrian.example",
      recipient_role: "installer",
      subject: "New lead assigned",
      body: "A new homeowner lead was assigned to your team.",
      payload: { leadEmail: mockLeads[0]?.email, installerSlug: "cambrian-eco-heat" },
      status: "queued",
      created_at: new Date(now - 2 * 3600000).toISOString(),
      sent_at: null
    },
    {
      event_type: "seed.lead_received",
      channel: "email",
      recipient_email: "admin@example.com",
      recipient_role: "admin",
      subject: "New lead captured",
      body: "A homeowner lead was captured from the directory.",
      payload: { leadEmail: mockLeads[0]?.email },
      status: "sent",
      created_at: new Date(now - 24 * 3600000).toISOString(),
      sent_at: new Date(now - 24 * 3600000 + 180000).toISOString()
    },
    {
      event_type: "seed.application_received",
      channel: "email",
      recipient_email: "admin@example.com",
      recipient_role: "admin",
      subject: "New installer application",
      body: "A new installer application is waiting for review.",
      payload: { applicationCompany: "Severn Green Homes" },
      status: "queued",
      created_at: new Date(now - 6 * 3600000).toISOString(),
      sent_at: null
    },
    {
      event_type: "seed.installer_approved",
      channel: "email",
      recipient_email: "hello@valley.example",
      recipient_role: "installer",
      subject: "Application approved",
      body: "Your installer application has been approved.",
      payload: { installerSlug: "valley-renewables-group" },
      status: "sent",
      created_at: new Date(now - 4 * 86400000).toISOString(),
      sent_at: new Date(now - 4 * 86400000 + 240000).toISOString()
    }
  ];
}

function buildAuditRows() {
  return [
    ...mockTerritories.map((territory) => ({
      actor_role: "admin",
      action: "seed.imported",
      entity_type: "territory",
      entity_id: null,
      payload: { slug: territory.slug ?? territory.id, source: "lib/data.ts" },
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    })),
    ...mockInstallers.map((installer) => ({
      actor_role: "admin",
      action: "seed.imported",
      entity_type: "installer",
      entity_id: null,
      payload: { slug: installer.slug, source: "lib/data.ts" },
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    })),
    ...mockLeads.slice(0, 5).map((lead) => ({
      actor_role: "admin",
      action: "seed.imported",
      entity_type: "lead",
      entity_id: null,
      payload: { email: lead.email, stage: lead.stage, source: "lib/data.ts" },
      created_at: new Date(Date.now() - 20 * 86400000).toISOString()
    }))
  ];
}

export async function seedMockData(supabase: SupabaseClient) {

  const seededUsers = await ensureAuthUsers(supabase);
  const adminUser = seededUsers.find((entry) => entry.role === "admin");
  const installerUsers = seededUsers.filter((entry) => entry.role === "installer");

  const userRows = seededUsers.map((entry) => ({
    id: entry.user.id,
    email: entry.email,
    role: entry.role
  }));
  const { error: userError } = await supabase.from("users").upsert(userRows, { onConflict: "id" });
  if (userError) throw userError;

  const territoryRows = buildTerritoryRows();
  const { data: territoryData, error: territoryError } = await supabase.from("territories").upsert(territoryRows, { onConflict: "slug" }).select("id,slug");
  if (territoryError) throw territoryError;
  const territoryIdsBySlug = new Map((territoryData ?? []).map((row) => [row.slug, row.id]));

  const installerRows = buildInstallerRows();
  const { data: installerData, error: installerError } = await supabase.from("installers").upsert(
    installerRows.map((row, index) => ({
      ...row,
      user_id: installerUsers[index]?.user.id ?? null
    })),
    { onConflict: "slug" }
  ).select("id,slug");
  if (installerError) throw installerError;
  const installerIdsBySlug = new Map((installerData ?? []).map((row) => [row.slug, row.id]));

  const installerTerritoryRows = mockInstallers.flatMap((installer) =>
    installer.territoryIds.map((territoryId) => ({
      installer_id: installerIdsBySlug.get(installer.slug),
      territory_id: territoryIdsBySlug.get(territoryId),
      status: "active",
      admin_override: false
    }))
  ).filter((row) => row.installer_id && row.territory_id);
  const { error: installerTerritoryError } = await supabase.from("installer_territories").upsert(installerTerritoryRows, {
    onConflict: "installer_id,territory_id"
  });
  if (installerTerritoryError) throw installerTerritoryError;

  const leadEmails = mockLeads.map((lead) => lead.email);
  const { error: deleteLeadsError } = await supabase.from("leads").delete().in("email", leadEmails);
  if (deleteLeadsError) throw deleteLeadsError;

  const leadRows = buildLeadRows(territoryIdsBySlug, installerIdsBySlug);
  const { error: leadError } = await supabase.from("leads").insert(leadRows);
  if (leadError) throw leadError;

  const reviewRows = buildReviewRows(installerIdsBySlug);
  if (reviewRows.length) {
    const { error: deleteReviewsError } = await supabase
      .from("reviews")
      .delete()
      .in("customer_name", mockReviews.map((review) => review.customerName));
    if (deleteReviewsError) throw deleteReviewsError;
    const { error: reviewError } = await supabase.from("reviews").insert(reviewRows);
    if (reviewError) throw reviewError;
  }

  const { error: deleteApplicationsError } = await supabase
    .from("installer_applications")
    .delete()
    .in("company_name", seedApplications.map((item) => item.company_name));
  if (deleteApplicationsError) throw deleteApplicationsError;
  const { error: applicationError } = await supabase.from("installer_applications").insert(
    seedApplications.map((application) => ({
      ...application,
      services: application.services,
      areas_covered: application.areas_covered,
      preferred_territories: application.preferred_territories,
      status: "pending"
    }))
  );
  if (applicationError) throw applicationError;

  const documentRows = buildDocuments(installerIdsBySlug);
  const documentUrls = documentRows.map((row) => row.file_url as string);
  const { error: deleteDocumentsError } = await supabase.from("documents").delete().in("file_url", documentUrls);
  if (deleteDocumentsError) throw deleteDocumentsError;
  const { error: documentError } = await supabase.from("documents").insert(documentRows);
  if (documentError) throw documentError;

  const territoryRequestRows = buildTerritoryRequests(installerIdsBySlug, territoryIdsBySlug);
  const territoryRequestNotes = territoryRequestRows.map((row) => row.notes as string);
  const { error: deleteTerritoryRequestsError } = await supabase.from("territory_requests").delete().in("notes", territoryRequestNotes);
  if (deleteTerritoryRequestsError) throw deleteTerritoryRequestsError;
  const { error: territoryRequestError } = await supabase.from("territory_requests").insert(territoryRequestRows);
  if (territoryRequestError) throw territoryRequestError;

  const notificationRows = buildNotificationRows();
  const { error: deleteNotificationError } = await supabase.from("notification_outbox").delete().in("event_type", notificationRows.map((row) => row.event_type));
  if (deleteNotificationError) throw deleteNotificationError;
  const { error: notificationError } = await supabase.from("notification_outbox").insert(notificationRows);
  if (notificationError) throw notificationError;

  const auditRows = buildAuditRows();
  const { error: deleteAuditError } = await supabase.from("audit_logs").delete().in("action", ["seed.imported"]);
  if (deleteAuditError) throw deleteAuditError;
  const { error: auditError } = await supabase.from("audit_logs").insert(
    auditRows.map((row) => ({
      actor_user_id: adminUser?.user.id ?? null,
      actor_role: row.actor_role,
      action: row.action,
      entity_type: row.entity_type,
      entity_id: null,
      payload: row.payload,
      created_at: row.created_at
    }))
  );
  if (auditError) throw auditError;

  return {
    users: userRows.length,
    territories: territoryRows.length,
    installers: installerRows.length,
    installerTerritories: installerTerritoryRows.length,
    leads: leadRows.length,
    reviews: reviewRows.length,
    applications: seedApplications.length,
    documents: documentRows.length,
    territoryRequests: territoryRequestRows.length,
    notifications: notificationRows.length,
    auditLogs: auditRows.length
  };
}
