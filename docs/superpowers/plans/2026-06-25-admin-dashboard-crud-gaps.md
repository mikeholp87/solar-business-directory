# Admin Dashboard CRUD Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new admin pages (Documents, Territory Requests, Notifications, Audit Log) and enhance 3 existing pages (Installers, Leads, Territories) to cover all database entities in the admin UI.

**Architecture:** Additive-only changes following the existing server component + server action pattern. Each page uses server-side data fetching, form-based mutations via server actions, and `revalidatePath` for cache invalidation. No client components, no new dependencies.

**Tech Stack:** Next.js 14 App Router, React 18, Supabase (PostgreSQL), Tailwind CSS, lucide-react, TypeScript

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `app/admin/documents/page.tsx` | Document verification page — list/installer documents, toggle verified |
| `app/admin/territory-requests/page.tsx` | Territory request management — approve/reject installer territory requests |
| `app/admin/notifications/page.tsx` | Notification outbox — read-only view of queued/sent/failed notifications |
| `app/admin/audit-log/page.tsx` | Audit trail — read-only view of all admin actions |

### Modified Files
| File | Responsibility |
|------|---------------|
| `lib/types.ts` | Add missing fields to `Installer` and `Lead` types |
| `lib/repositories/admin.ts` | Add 6 new query functions + extend `updateInstallerAdmin` |
| `lib/repositories/shared.ts` | Add `mergeDocumentRecord` helper + extend `mergeLeadRecord` |
| `app/admin/layout.tsx` | Add 4 new navigation tabs |
| `app/admin/installers/page.tsx` | Add territory display + financial fields to edit form |
| `app/admin/leads/page.tsx` | Add financial/date read-only fields |
| `app/admin/territories/page.tsx` | Add installer membership list per territory |

---

## Task 1: Add missing type fields

**Files:**
- Modify: `lib/types.ts`

- [ ] **Step 1: Add missing fields to Installer type**

Add these fields to the `Installer` type in `lib/types.ts` after the existing `internalNotes` field:

```ts
export type Installer = {
  // ... existing fields ...
  internalNotes?: string;
  installerFeeType?: "monthly_directory" | "pay_per_lead" | "pay_per_install" | "hybrid";
  referralFeeTotal?: number;
  busAcceptanceFee?: number;
  completionFee?: number;
  vatApplicable?: boolean;
  maximumMonthlyLeadAllocation?: number;
  leadCount?: number;
};
```

- [ ] **Step 2: Add missing fields to Lead type**

Add these fields to the `Lead` type in `lib/types.ts` after the existing `notes` field:

```ts
export type Lead = {
  // ... existing fields ...
  leadValue?: number;
  leadCost?: number;
  busAcceptancePaymentDue?: number;
  completionPaymentDue?: number;
  vatApplicable?: boolean;
  surveyDate?: string;
  busApplicationDate?: string;
  busAcceptanceDate?: string;
  installDate?: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
};
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add missing financial and date fields to Installer and Lead types"
```

---

## Task 2: Extend mergeLeadRecord with new fields

**Files:**
- Modify: `lib/repositories/shared.ts:107-131`

- [ ] **Step 1: Add missing field mappings to mergeLeadRecord**

In `lib/repositories/shared.ts`, extend the `mergeLeadRecord` function to map the new fields. Add these lines inside the function, before the `return` statement:

```ts
  leadValue: row.lead_value === null || row.lead_value === undefined ? fallback.leadValue : Number(row.lead_value),
  leadCost: row.lead_cost === null || row.lead_cost === undefined ? fallback.leadCost : Number(row.lead_cost),
  busAcceptancePaymentDue: row.bus_acceptance_payment_due === null || row.bus_acceptance_payment_due === undefined ? fallback.busAcceptancePaymentDue : Number(row.bus_acceptance_payment_due),
  completionPaymentDue: row.completion_payment_due === null || row.completion_payment_due === undefined ? fallback.completionPaymentDue : Number(row.completion_payment_due),
  vatApplicable: asBoolean(row.vat_applicable, fallback.vatApplicable ?? true),
  surveyDate: typeof row.survey_date === "string" ? row.survey_date : fallback.surveyDate,
  busApplicationDate: typeof row.bus_application_date === "string" ? row.bus_application_date : fallback.busApplicationDate,
  busAcceptanceDate: typeof row.bus_acceptance_date === "string" ? row.bus_acceptance_date : fallback.busAcceptanceDate,
  installDate: typeof row.install_date === "string" ? row.install_date : fallback.installDate,
  completionDate: typeof row.completion_date === "string" ? row.completion_date : fallback.completionDate,
```

- [ ] **Step 2: Add mergeDocumentRecord helper**

Add this function at the end of `lib/repositories/shared.ts`:

```ts
export function mergeDocumentRecord(row: MaybeRecord, fallback?: { id: string; installerId: string; documentType: string; fileUrl: string; verified: boolean; uploadedAt: string }): DocumentRecord {
  const fb = fallback ?? { id: "", installerId: "", documentType: "", fileUrl: "", verified: false, uploadedAt: new Date().toISOString() };
  return {
    id: asString(row.id, fb.id),
    installerId: asString(row.installer_id, fb.installerId),
    documentType: asString(row.document_type, fb.documentType),
    fileUrl: asString(row.file_url, fb.fileUrl),
    verified: asBoolean(row.verified, fb.verified),
    uploadedAt: asDateString(row.uploaded_at, fb.uploadedAt)
  };
}
```

Also add the `DocumentRecord` import at the top of the file:

```ts
import type { DocumentRecord, Installer, Lead, Review, Territory } from "@/lib/types";
```

- [ ] **Step 3: Commit**

```bash
git add lib/repositories/shared.ts
git commit -m "feat: extend mergeLeadRecord with financial/date fields and add mergeDocumentRecord"
```

---

## Task 3: Add repository functions to admin.ts

**Files:**
- Modify: `lib/repositories/admin.ts`

- [ ] **Step 1: Add listDocumentsForAdmin function**

Add this function to `lib/repositories/admin.ts` after the existing `exportLeadsCsv` function:

```ts
export async function listDocumentsForAdmin() {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];

  const { data: docs } = await supabase.from("documents").select("*").order("uploaded_at", { ascending: false });
  const { data: installers } = await supabase.from("installers").select("id,company_name");

  const installerMap = new Map<string, string>();
  for (const inst of installers ?? []) {
    installerMap.set(inst.id, inst.company_name);
  }

  return (docs ?? []).map((row) => ({
    ...mergeDocumentRecord(row),
    installerName: installerMap.get(row.installer_id) ?? "Unknown"
  }));
}
```

- [ ] **Step 2: Add updateDocumentVerification function**

```ts
export async function updateDocumentVerification(docId: string, verified: boolean) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("documents").update({ verified }).eq("id", docId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: verified ? "document.verified" : "document.unverified",
    entityType: "document",
    entityId: docId,
    payload: { verified }
  });
  return { ok: true as const };
}
```

- [ ] **Step 3: Add listTerritoryRequestsForAdmin function**

```ts
export async function listTerritoryRequestsForAdmin() {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];

  const { data: requests } = await supabase.from("territory_requests").select("*").order("requested_at", { ascending: false });
  const { data: installers } = await supabase.from("installers").select("id,company_name");
  const { data: territories } = await supabase.from("territories").select("id,name");

  const installerMap = new Map<string, string>();
  for (const inst of installers ?? []) installerMap.set(inst.id, inst.company_name);
  const territoryMap = new Map<string, string>();
  for (const terr of territories ?? []) territoryMap.set(terr.id, terr.name);

  return (requests ?? []).map((row) => ({
    id: row.id,
    installerId: row.installer_id,
    installerName: installerMap.get(row.installer_id) ?? "Unknown",
    territoryId: row.territory_id,
    territoryName: territoryMap.get(row.territory_id) ?? "Unknown",
    notes: row.notes ?? "",
    status: row.status,
    requestedAt: row.requested_at
  }));
}
```

- [ ] **Step 4: Add updateTerritoryRequestStatus function**

```ts
export async function updateTerritoryRequestStatus(
  requestId: string,
  status: "pending" | "approved" | "rejected"
) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };

  const { data: request } = await supabase.from("territory_requests").select("*").eq("id", requestId).maybeSingle();
  const { error } = await supabase.from("territory_requests").update({ status }).eq("id", requestId);
  if (error) return { ok: false as const, error: error.message };

  if (status === "approved" && request) {
    const { data: existing } = await supabase
      .from("installer_territories")
      .select("id")
      .eq("installer_id", request.installer_id)
      .eq("territory_id", request.territory_id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("installer_territories").insert({
        installer_id: request.installer_id,
        territory_id: request.territory_id,
        status: "active"
      });
    }
  }

  await logAuditEvent({
    action: `territory_request.${status}`,
    entityType: "territory_request",
    entityId: requestId,
    payload: { status }
  });
  return { ok: true as const };
}
```

- [ ] **Step 5: Add listNotificationsForAdmin function**

```ts
export async function listNotificationsForAdmin(filter?: { status?: string }) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];

  let query = supabase.from("notification_outbox").select("*").order("created_at", { ascending: false });
  if (filter?.status) {
    query = query.eq("status", filter.status);
  }
  const { data } = await query;
  return (data ?? []).map((row) => ({
    id: row.id,
    eventType: row.event_type,
    channel: row.channel,
    recipientEmail: row.recipient_email ?? "",
    recipientRole: row.recipient_role ?? "",
    subject: row.subject,
    body: row.body,
    status: row.status,
    lastError: row.last_error ?? "",
    createdAt: row.created_at,
    sentAt: row.sent_at ?? ""
  }));
}
```

- [ ] **Step 6: Add listAuditLogsForAdmin function**

```ts
export async function listAuditLogsForAdmin(filter?: { entityType?: string }) {
  const supabase = await getSupabaseOrNull();
  if (!supabase) return [];

  let query = supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
  if (filter?.entityType) {
    query = query.eq("entity_type", filter.entityType);
  }
  const { data } = await query;
  return (data ?? []).map((row) => ({
    id: row.id,
    actorUserId: row.actor_user_id ?? "",
    actorRole: row.actor_role ?? "",
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id ?? "",
    payload: row.payload ?? {},
    createdAt: row.created_at
  }));
}
```

- [ ] **Step 7: Extend updateInstallerAdmin with new fields**

Update the `updateInstallerAdmin` function to accept and persist the new financial fields. Replace the existing `supabase.from("installers").update(...)` call with:

```ts
export async function updateInstallerAdmin(installerId: string, payload: Partial<Installer>) {
  const supabase = adminClient();
  if (!supabase) return { ok: true as const };
  const { error } = await supabase.from("installers").update({
    status: payload.status,
    subscription_status: payload.subscriptionStatus,
    lead_price: payload.leadPrice,
    monthly_install_capacity: payload.monthlyInstallCapacity,
    internal_notes: payload.internalNotes,
    description: payload.description,
    areas_covered: payload.areasCovered,
    survey_turnaround_days: payload.surveyTurnaroundDays,
    website: payload.website,
    phone: payload.phone,
    installer_fee_type: payload.installerFeeType,
    referral_fee_total: payload.referralFeeTotal,
    bus_acceptance_fee: payload.busAcceptanceFee,
    completion_fee: payload.completionFee,
    vat_applicable: payload.vatApplicable,
    maximum_monthly_lead_allocation: payload.maximumMonthlyLeadAllocation
  }).eq("id", installerId);
  if (error) return { ok: false as const, error: error.message };
  await logAuditEvent({
    action: "installer.updated",
    entityType: "installer",
    entityId: installerId,
    payload
  });
  return { ok: true as const };
}
```

- [ ] **Step 8: Commit**

```bash
git add lib/repositories/admin.ts
git commit -m "feat: add admin repository functions for documents, territory requests, notifications, audit logs"
```

---

## Task 4: Create Documents admin page

**Files:**
- Create: `app/admin/documents/page.tsx`

- [ ] **Step 1: Create the documents page**

Create `app/admin/documents/page.tsx`:

```tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listDocumentsForAdmin, updateDocumentVerification } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Documents", "Review and verify installer documents.", "/admin/documents");

async function saveDocumentAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const docId = String(formData.get("id") ?? "");
  const verified = formData.get("verified") === "on";
  await updateDocumentVerification(docId, verified);
  revalidatePath("/admin");
  revalidatePath("/admin/documents");
}

export default async function AdminDocumentsPage() {
  const documents = await listDocumentsForAdmin();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Documents</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Review and verify installer uploaded documents (MCS certificates, insurance, accreditations).</p>
      </div>

      {documents.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No documents have been uploaded yet.</p>
        </div>
      ) : (
        <div className="surface-card overflow-hidden p-5">
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pl-4">Installer</th>
                  <th>Document Type</th>
                  <th>Uploaded</th>
                  <th>Verified</th>
                  <th className="pr-4">File</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="py-3 pl-4 font-bold">{doc.installerName}</td>
                    <td>{doc.documentType}</td>
                    <td>{new Date(doc.uploadedAt).toLocaleDateString("en-GB")}</td>
                    <td>
                      <form action={saveDocumentAction} className="inline-flex items-center gap-2">
                        <input type="hidden" name="id" value={doc.id} />
                        <input name="verified" type="checkbox" defaultChecked={doc.verified} className="size-4 w-auto" onChange="this.form.requestSubmit()" />
                        <span className={doc.verified ? "chip chip-success" : "chip chip-soft"}>{doc.verified ? "Verified" : "Pending"}</span>
                      </form>
                    </td>
                    <td className="pr-4">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline">View file</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev` and navigate to `/admin/documents`
Expected: Page renders with the documents table (or empty state message)

- [ ] **Step 3: Commit**

```bash
git add app/admin/documents/page.tsx
git commit -m "feat: add admin documents verification page"
```

---

## Task 5: Create Territory Requests admin page

**Files:**
- Create: `app/admin/territory-requests/page.tsx`

- [ ] **Step 1: Create the territory requests page**

Create `app/admin/territory-requests/page.tsx`:

```tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listTerritoryRequestsForAdmin, updateTerritoryRequestStatus } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Territory Requests", "Review and process installer territory requests.", "/admin/territory-requests");

async function saveTerritoryRequestAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const requestId = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending") as "pending" | "approved" | "rejected";
  await updateTerritoryRequestStatus(requestId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/territory-requests");
  revalidatePath("/admin/territories");
}

export default async function AdminTerritoryRequestsPage() {
  const requests = await listTerritoryRequestsForAdmin();

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Territory Requests</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Approve or reject installer requests to join territories. Approving creates an active territory membership.</p>
      </div>

      {requests.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No territory requests found.</p>
        </div>
      ) : (
        requests.map((request) => (
          <form key={request.id} action={saveTerritoryRequestAction} className="surface-card grid gap-4 p-5">
            <input type="hidden" name="id" value={request.id} />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{request.installerName}</h3>
                <p className="mt-1 text-sm text-navy/65">Requesting: {request.territoryName}</p>
              </div>
              <span className={`chip ${request.status === "approved" ? "chip-success" : request.status === "rejected" ? "chip-warning" : "chip-soft"} capitalize`}>{request.status}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>Status
                <select name="status" defaultValue={request.status}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label>Notes<textarea value={request.notes} readOnly rows={2} /></label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Save decision</button>
            </div>
          </form>
        ))
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev` and navigate to `/admin/territory-requests`
Expected: Page renders with territory requests (or empty state)

- [ ] **Step 3: Commit**

```bash
git add app/admin/territory-requests/page.tsx
git commit -m "feat: add admin territory requests management page"
```

---

## Task 6: Create Notifications admin page

**Files:**
- Create: `app/admin/notifications/page.tsx`

- [ ] **Step 1: Create the notifications page**

Create `app/admin/notifications/page.tsx`:

```tsx
import Link from "next/link";
import { requireRole } from "@/lib/auth/roles";
import { listNotificationsForAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Notifications", "View notification outbox status.", "/admin/notifications");

export default async function AdminNotificationsPage({ searchParams }: { searchParams: { status?: string } }) {
  await requireRole(["admin"]);
  const status = searchParams.status;
  const notifications = await listNotificationsForAdmin(status ? { status } : undefined);

  const statuses = ["", "queued", "sent", "failed"] as const;
  const statusLabels: Record<string, string> = { "": "All", queued: "Queued", sent: "Sent", failed: "Failed" };

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Notifications</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Read-only view of the notification outbox. Filter by delivery status.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s ? `/admin/notifications?status=${s}` : "/admin/notifications"}
            className={`chip ${(!status && !s) || status === s ? "chip-soft" : ""}`}
          >
            {statusLabels[s]}
          </Link>
        ))}
      </div>

      {notifications.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No notifications found.</p>
        </div>
      ) : (
        <div className="surface-card overflow-hidden p-5">
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pl-4">Event</th>
                  <th>Channel</th>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="pr-4">Error</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id}>
                    <td className="py-3 pl-4 font-bold">{n.eventType}</td>
                    <td><span className="chip capitalize">{n.channel}</span></td>
                    <td>{n.recipientEmail || n.recipientRole}</td>
                    <td className="max-w-[200px] truncate">{n.subject}</td>
                    <td>
                      <span className={`chip ${n.status === "sent" ? "chip-success" : n.status === "failed" ? "chip-warning" : "chip-soft"} capitalize`}>
                        {n.status}
                      </span>
                    </td>
                    <td>{new Date(n.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="pr-4 max-w-[150px] truncate text-red-600">{n.lastError}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev` and navigate to `/admin/notifications`
Expected: Page renders with notifications table and filter chips

- [ ] **Step 3: Commit**

```bash
git add app/admin/notifications/page.tsx
git commit -m "feat: add admin notifications outbox page with status filtering"
```

---

## Task 7: Create Audit Log admin page

**Files:**
- Create: `app/admin/audit-log/page.tsx`

- [ ] **Step 1: Create the audit log page**

Create `app/admin/audit-log/page.tsx`:

```tsx
import Link from "next/link";
import { requireRole } from "@/lib/auth/roles";
import { listAuditLogsForAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Audit Log", "View all admin actions and system events.", "/admin/audit-log");

const entityTypes = ["", "installer", "lead", "territory", "review", "document", "territory_request", "installer_application"];

export default async function AdminAuditLogPage({ searchParams }: { searchParams: { entityType?: string } }) {
  await requireRole(["admin"]);
  const entityType = searchParams.entityType;
  const logs = await listAuditLogsForAdmin(entityType ? { entityType } : undefined);

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Audit Log</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Read-only trail of all admin actions. Filter by entity type.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {entityTypes.map((et) => (
          <Link
            key={et}
            href={et ? `/admin/audit-log?entityType=${et}` : "/admin/audit-log"}
            className={`chip ${(!entityType && !et) || entityType === et ? "chip-soft" : ""}`}
          >
            {et || "All"}
          </Link>
        ))}
      </div>

      {logs.length === 0 ? (
        <div className="surface-card p-5">
          <p className="text-navy/70">No audit logs found.</p>
        </div>
      ) : (
        <div className="surface-card overflow-hidden p-5">
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-3 pl-4">Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th className="pr-4">Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 pl-4 whitespace-nowrap">{new Date(log.createdAt).toLocaleString("en-GB")}</td>
                    <td><span className="chip capitalize">{log.actorRole || "system"}</span></td>
                    <td className="font-bold">{log.action}</td>
                    <td>{log.entityType}</td>
                    <td className="max-w-[120px] truncate font-mono text-xs">{log.entityId}</td>
                    <td className="pr-4">
                      <pre className="max-w-[200px] overflow-auto text-xs text-navy/60">{JSON.stringify(log.payload, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify page loads**

Run: `npm run dev` and navigate to `/admin/audit-log`
Expected: Page renders with audit log table and entity type filter chips

- [ ] **Step 3: Commit**

```bash
git add app/admin/audit-log/page.tsx
git commit -m "feat: add admin audit log page with entity type filtering"
```

---

## Task 8: Update admin layout with new tabs

**Files:**
- Modify: `app/admin/layout.tsx:4-12`

- [ ] **Step 1: Update the tabs array**

Replace the existing `tabs` array in `app/admin/layout.tsx`:

```ts
const tabs = [
  ["/admin", "Overview"],
  ["/admin/applications", "Applications"],
  ["/admin/installers", "Installers"],
  ["/admin/territories", "Territories"],
  ["/admin/leads", "Leads"],
  ["/admin/documents", "Documents"],
  ["/admin/territory-requests", "Territory Requests"],
  ["/admin/reviews", "Reviews"],
  ["/admin/notifications", "Notifications"],
  ["/admin/audit-log", "Audit Log"],
  ["/admin/export", "Export"]
] as const;
```

- [ ] **Step 2: Verify navigation works**

Run: `npm run dev` and navigate to `/admin`
Expected: All 11 tabs appear in the navigation bar and each links to the correct page

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add Documents, Territory Requests, Notifications, and Audit Log tabs to admin layout"
```

---

## Task 9: Enhance Installers page with territory and financial fields

**Files:**
- Modify: `app/admin/installers/page.tsx`

- [ ] **Step 1: Add territory names display and financial fields to the installer form**

Replace the existing `app/admin/installers/page.tsx` with:

```tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { updateInstallerAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Installers", "Manage installer status, subscriptions and commercial fields.", "/admin/installers");

async function saveInstallerAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const installerId = String(formData.get("id") ?? "");
  await updateInstallerAdmin(installerId, {
    status: String(formData.get("status") ?? "pending") as never,
    subscriptionStatus: String(formData.get("subscription_status") ?? "trialing") as never,
    leadPrice: formData.get("lead_price") ? Number(formData.get("lead_price")) : undefined,
    monthlyInstallCapacity: formData.get("monthly_install_capacity") ? Number(formData.get("monthly_install_capacity")) : undefined,
    surveyTurnaroundDays: formData.get("survey_turnaround_days") ? Number(formData.get("survey_turnaround_days")) : undefined,
    website: String(formData.get("website") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    description: String(formData.get("description") ?? ""),
    internalNotes: String(formData.get("internal_notes") ?? ""),
    installerFeeType: String(formData.get("installer_fee_type") ?? "monthly_directory") as never,
    referralFeeTotal: formData.get("referral_fee_total") ? Number(formData.get("referral_fee_total")) : undefined,
    busAcceptanceFee: formData.get("bus_acceptance_fee") ? Number(formData.get("bus_acceptance_fee")) : undefined,
    completionFee: formData.get("completion_fee") ? Number(formData.get("completion_fee")) : undefined,
    vatApplicable: formData.get("vat_applicable") === "on",
    maximumMonthlyLeadAllocation: formData.get("maximum_monthly_lead_allocation") ? Number(formData.get("maximum_monthly_lead_allocation")) : undefined
  });
  revalidatePath("/admin");
  revalidatePath("/admin/installers");
}

export default async function AdminInstallersPage() {
  const [installers, territories] = await Promise.all([listInstallers(), listTerritories()]);

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Installers</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Edit status, subscription state and commercial controls. Territory membership is managed on the territories page.</p>
      </div>

      {installers.map((installer) => {
        const installerTerritories = territories.filter((t) => installer.territoryIds.includes(t.id));
        return (
          <form key={installer.id} action={saveInstallerAction} className="surface-card grid gap-4 p-5">
            <input type="hidden" name="id" value={installer.id} />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{installer.companyName}</h3>
                <p className="mt-1 text-sm text-navy/65">{installer.slug} · {installer.email ?? "No email"} · {installer.phone ?? "No phone"}</p>
                {installerTerritories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {installerTerritories.map((t) => (
                      <span key={t.id} className="chip chip-soft">{t.name}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="chip chip-soft capitalize">{installer.status}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Status
                <select name="status" defaultValue={installer.status}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>Subscription
                <select name="subscription_status" defaultValue={installer.subscriptionStatus}>
                  <option value="trialing">Trialing</option>
                  <option value="active">Active</option>
                  <option value="past_due">Past due</option>
                  <option value="offline_active">Offline active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>Lead price<input name="lead_price" type="number" step="0.01" defaultValue={installer.leadPrice ?? ""} /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Monthly capacity<input name="monthly_install_capacity" type="number" defaultValue={installer.monthlyInstallCapacity} /></label>
              <label>Survey days<input name="survey_turnaround_days" type="number" defaultValue={installer.surveyTurnaroundDays} /></label>
              <label>Website<input name="website" defaultValue={installer.website ?? ""} /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Fee type
                <select name="installer_fee_type" defaultValue={installer.installerFeeType ?? "monthly_directory"}>
                  <option value="monthly_directory">Monthly directory</option>
                  <option value="pay_per_lead">Pay per lead</option>
                  <option value="pay_per_install">Pay per install</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </label>
              <label>Referral fee total (£)<input name="referral_fee_total" type="number" step="0.01" defaultValue={installer.referralFeeTotal ?? 1250} /></label>
              <label>BUS acceptance fee (£)<input name="bus_acceptance_fee" type="number" step="0.01" defaultValue={installer.busAcceptanceFee ?? 250} /></label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label>Completion fee (£)<input name="completion_fee" type="number" step="0.01" defaultValue={installer.completionFee ?? 1000} /></label>
              <label>Max monthly leads<input name="maximum_monthly_lead_allocation" type="number" defaultValue={installer.maximumMonthlyLeadAllocation ?? ""} /></label>
              <label className="flex items-start gap-2 pt-8">
                <input name="vat_applicable" type="checkbox" defaultChecked={installer.vatApplicable ?? true} className="size-4 w-auto" />
                <span>VAT applicable</span>
              </label>
            </div>

            <div className="grid gap-4">
              <label>Phone<input name="phone" defaultValue={installer.phone ?? ""} /></label>
              <label>Description<textarea name="description" rows={4} defaultValue={installer.description} /></label>
              <label>Internal notes<textarea name="internal_notes" rows={3} defaultValue={installer.internalNotes ?? ""} /></label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Save installer</button>
            </div>
          </form>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 2: Verify enhanced installer page**

Run: `npm run dev` and navigate to `/admin/installers`
Expected: Each installer shows territory chips, fee type, financial fields, and VAT checkbox

- [ ] **Step 3: Commit**

```bash
git add app/admin/installers/page.tsx
git commit -m "feat: enhance installer page with territory display and financial fields"
```

---

## Task 10: Enhance Leads page with financial and date fields

**Files:**
- Modify: `app/admin/leads/page.tsx`

- [ ] **Step 1: Add read-only financial and date fields to leads**

Replace the existing `app/admin/leads/page.tsx`:

```tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listLeads } from "@/lib/repositories/leads";
import { listInstallers } from "@/lib/repositories/installers";
import { listTerritories } from "@/lib/repositories/territories";
import { updateLeadAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Leads", "Review and update homeowner leads.", "/admin/leads");

async function saveLeadAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const leadId = String(formData.get("id") ?? "");
  await updateLeadAdmin(leadId, {
    stage: String(formData.get("stage") ?? "new_enquiry") as never,
    invoiceStatus: String(formData.get("invoice_status") ?? "not_invoiced") as never,
    assignedInstallerId: String(formData.get("assigned_installer_id") ?? "") || undefined,
    referralFeePaid: formData.get("referral_fee_paid") === "on",
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export default async function AdminLeadsPage() {
  const [leads, installers, territories] = await Promise.all([listLeads(), listInstallers(), listTerritories()]);

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Leads</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Track stage progress, invoice status and assignment.</p>
      </div>

      {leads.map((lead) => (
        <form key={lead.id} action={saveLeadAction} className="surface-card grid gap-4 p-5">
          <input type="hidden" name="id" value={lead.id} />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">{lead.firstName} {lead.lastName}</h3>
              <p className="mt-1 text-sm text-navy/65">{lead.email} · {lead.phone} · {lead.postcode}</p>
            </div>
            <span className="chip chip-soft capitalize">{lead.stage.replaceAll("_", " ")}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label>Stage
              <select name="stage" defaultValue={lead.stage}>
                <option value="new_enquiry">New enquiry</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="survey_booked">Survey booked</option>
                <option value="survey_completed">Survey completed</option>
                <option value="quote_issued">Quote issued</option>
                <option value="bus_application_submitted">BUS application submitted</option>
                <option value="bus_accepted">BUS accepted</option>
                <option value="installation_booked">Installation booked</option>
                <option value="installation_completed">Installation completed</option>
                <option value="lost">Lost</option>
                <option value="not_eligible">Not eligible</option>
              </select>
            </label>
            <label>Invoice
              <select name="invoice_status" defaultValue={lead.invoiceStatus}>
                <option value="not_invoiced">Not invoiced</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </label>
            <label>Installer
              <select name="assigned_installer_id" defaultValue={lead.assignedInstallerId ?? ""}>
                <option value="">Unassigned</option>
                {installers.map((installer) => <option key={installer.id} value={installer.id}>{installer.companyName}</option>)}
              </select>
            </label>
            <label className="flex items-start gap-2 pt-8">
              <input name="referral_fee_paid" type="checkbox" defaultChecked={lead.referralFeePaid} className="size-4 w-auto" />
              <span>Referral paid</span>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>Territory<input value={territories.find((territory) => territory.id === lead.territoryId)?.name ?? "Unmatched"} readOnly /></label>
            <label>Notes<textarea name="notes" rows={3} defaultValue={lead.notes ?? ""} /></label>
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">Financial &amp; Date Details</p>
            <div className="grid gap-4 md:grid-cols-4">
              <label>Lead value (£)<input value={lead.leadValue ?? ""} readOnly /></label>
              <label>Lead cost (£)<input value={lead.leadCost ?? ""} readOnly /></label>
              <label>BUS payment due (£)<input value={lead.busAcceptancePaymentDue ?? ""} readOnly /></label>
              <label>Completion due (£)<input value={lead.completionPaymentDue ?? ""} readOnly /></label>
            </div>
            <div className="mt-3 grid gap-4 md:grid-cols-4">
              <label>Source<input value={lead.source} readOnly /></label>
              <label>Campaign<input value={lead.campaign ?? ""} readOnly /></label>
              <label className="flex items-start gap-2 pt-8">
                <input type="checkbox" defaultChecked={lead.vatApplicable ?? true} disabled className="size-4 w-auto" />
                <span>VAT applicable</span>
              </label>
            </div>
            <div className="mt-3 grid gap-4 md:grid-cols-5">
              <label>Survey date<input value={lead.surveyDate ?? ""} readOnly /></label>
              <label>BUS application<input value={lead.busApplicationDate ?? ""} readOnly /></label>
              <label>BUS accepted<input value={lead.busAcceptanceDate ?? ""} readOnly /></label>
              <label>Install date<input value={lead.installDate ?? ""} readOnly /></label>
              <label>Completion date<input value={lead.completionDate ?? ""} readOnly /></label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="button-primary" type="submit">Save lead</button>
          </div>
        </form>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Verify enhanced leads page**

Run: `npm run dev` and navigate to `/admin/leads`
Expected: Each lead shows financial details and date fields in a separate section below the main form

- [ ] **Step 3: Commit**

```bash
git add app/admin/leads/page.tsx
git commit -m "feat: enhance leads page with financial and date detail fields"
```

---

## Task 11: Enhance Territories page with installer membership

**Files:**
- Modify: `app/admin/territories/page.tsx`

- [ ] **Step 1: Add installer membership list to territories**

Replace the existing `app/admin/territories/page.tsx`:

```tsx
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/roles";
import { listTerritories } from "@/lib/repositories/territories";
import { listInstallers } from "@/lib/repositories/installers";
import { updateTerritoryAdmin } from "@/lib/repositories/admin";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Territories", "Manage territory capacity and availability.", "/admin/territories");

async function saveTerritoryAction(formData: FormData) {
  "use server";
  await requireRole(["admin"]);
  const territoryId = String(formData.get("id") ?? "");
  await updateTerritoryAdmin(territoryId, {
    status: String(formData.get("status") ?? "available") as never,
    maxInstallerSlots: formData.get("max_installer_slots") ? Number(formData.get("max_installer_slots")) : undefined,
    leadVolume: formData.get("lead_volume") ? Number(formData.get("lead_volume")) : undefined,
    priority: formData.get("priority") === "on",
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/admin");
  revalidatePath("/admin/territories");
}

export default async function AdminTerritoriesPage() {
  const [territories, installers] = await Promise.all([listTerritories(), listInstallers()]);

  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Territories</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Adjust slot caps, status and priority handling. Active installer membership is controlled from installer records.</p>
      </div>

      {territories.map((territory) => {
        const territoryInstallers = installers.filter((i) => i.territoryIds.includes(territory.id));
        return (
          <form key={territory.id} action={saveTerritoryAction} className="surface-card grid gap-4 p-5">
            <input type="hidden" name="id" value={territory.id} />
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black">{territory.name}</h3>
                <p className="mt-1 text-sm text-navy/65">{territory.region} · {territory.counties.join(", ")}</p>
              </div>
              <span className="chip chip-soft">{territory.activeInstallerCount}/{territory.maxInstallerSlots}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label>Status
                <select name="status" defaultValue={territory.status}>
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="full">Full</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
              <label>Max slots<input name="max_installer_slots" type="number" defaultValue={territory.maxInstallerSlots} /></label>
              <label>Lead volume<input name="lead_volume" type="number" defaultValue={territory.leadVolume} /></label>
              <label className="flex items-start gap-2 pt-8">
                <input name="priority" type="checkbox" defaultChecked={territory.priority ?? false} className="size-4 w-auto" />
                <span>Priority territory</span>
              </label>
            </div>

            <label>Notes<textarea name="notes" rows={3} defaultValue={territory.notes ?? ""} /></label>

            {territoryInstallers.length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted">Assigned Installers</p>
                <div className="flex flex-wrap gap-2">
                  {territoryInstallers.map((inst) => (
                    <span key={inst.id} className="chip chip-soft">
                      {inst.companyName}
                      <span className="ml-1 text-navy/40">· {inst.status}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button className="button-primary" type="submit">Save territory</button>
            </div>
          </form>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 2: Verify enhanced territories page**

Run: `npm run dev` and navigate to `/admin/territories`
Expected: Each territory shows assigned installer chips with status below the form

- [ ] **Step 3: Commit**

```bash
git add app/admin/territories/page.tsx
git commit -m "feat: enhance territories page with installer membership display"
```

---

## Task 12: Final verification and lint

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Verify all admin pages load**

Navigate to each page in the browser:
- `/admin` — Overview with stats
- `/admin/applications` — Application list
- `/admin/installers` — Enhanced with financial fields and territory chips
- `/admin/territories` — Enhanced with installer membership
- `/admin/leads` — Enhanced with financial/date details
- `/admin/documents` — New document verification page
- `/admin/territory-requests` — New territory request management
- `/admin/reviews` — Review moderation
- `/admin/notifications` — New notification outbox
- `/admin/audit-log` — New audit trail
- `/admin/export` — CSV export

- [ ] **Step 4: Commit any lint fixes**

```bash
git add -A
git commit -m "fix: lint and build fixes for admin dashboard"
```
