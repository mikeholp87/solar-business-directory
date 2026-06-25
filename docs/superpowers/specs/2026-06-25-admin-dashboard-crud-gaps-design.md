# Admin Dashboard — Fill All CRUD Gaps

## Context

The admin dashboard at `/admin` currently has 6 pages (Overview, Applications, Installers, Territories, Leads, Reviews, Export). The database schema includes additional tables — `documents`, `territory_requests`, `notification_outbox`, and `audit_logs` — that have no admin UI. Several existing pages also omit available data fields. This spec fills all gaps so every database entity is manageable from the admin console.

## Approach

**Additive only.** Follow the existing server component + server action pattern. No client-side state, no new libraries, no refactoring of existing pages into shared components. Each new page mirrors the structure of the current ones: server component fetches data, renders a form/table, server action handles mutation with `requireRole(["admin"])`, then `revalidatePath`.

## New Pages

### 1. `/admin/documents` — Document Verification

**Route:** `app/admin/documents/page.tsx`

**What it shows:**
- Table of all documents joined with installer company name
- Columns: Installer, Document Type, Uploaded, Verified, File Link
- Toggle verified/unverified checkbox per row
- Save button per document

**Server action:** `saveDocumentAction(formData)` → calls `updateDocumentVerification(docId, verified)`

**Repository additions to `lib/repositories/admin.ts`:**
- `listDocumentsForAdmin()` — query `documents` table, join with `installers` on `installer_id` to get company name
- `updateDocumentVerification(docId: string, verified: boolean)` — update `documents.verified` + audit log

### 2. `/admin/territory-requests` — Territory Request Management

**Route:** `app/admin/territory-requests/page.tsx`

**What it shows:**
- Table of all territory requests joined with installer name and territory name
- Columns: Installer, Territory, Status, Notes, Requested, Actions
- Status dropdown: pending / approved / rejected
- Save button per request

**Server action:** `saveTerritoryRequestAction(formData)` → calls `updateTerritoryRequestStatus(requestId, status)`

**Repository additions to `lib/repositories/admin.ts`:**
- `listTerritoryRequestsForAdmin()` — query `territory_requests`, join with `installers` and `territories`
- `updateTerritoryRequestStatus(requestId: string, status: "pending" | "approved" | "rejected")`:
  - Update `territory_requests.status`
  - If approving: insert into `installer_territories` (with `status = 'active'`) if not already present
  - Audit log the action
  - Queue notification to installer

### 3. `/admin/notifications` — Notification Outbox

**Route:** `app/admin/notifications/page.tsx`

**What it shows:**
- Read-only table of all `notification_outbox` records
- Columns: Event, Channel, Recipient, Subject, Status, Created, Last Error
- Status filter chips at top (All / Queued / Sent / Failed) using URL search params
- Click to expand body text (via `<details>` element, no client JS needed)

**No server actions** — read-only view.

**Repository additions to `lib/repositories/admin.ts`:**
- `listNotificationsForAdmin(filter?: { status?: string })` — query `notification_outbox` with optional status filter, order by `created_at` desc

### 4. `/admin/audit-log` — Audit Trail

**Route:** `app/admin/audit-log/page.tsx`

**What it shows:**
- Read-only table of all `audit_logs` records
- Columns: Actor, Role, Action, Entity, Entity ID, Payload, Time
- Filter chips for entity type (All / installer / lead / territory / review / etc.) using URL search params
- Payload displayed as formatted JSON

**No server actions** — read-only view.

**Repository additions to `lib/repositories/admin.ts`:**
- `listAuditLogsForAdmin(filter?: { entityType?: string })` — query `audit_logs` with optional entity_type filter, order by `created_at` desc

## Enhanced Existing Pages

### 5. `/admin/installers` — Add territory and financial fields

**Changes to `app/admin/installers/page.tsx`:**
- Show territory names under each installer header (fetch from `installer_territories` via existing `listInstallers()` which already includes `territoryIds`)
- Add fields to the edit form:
  - `installer_fee_type` (select: monthly_directory / pay_per_lead / pay_per_install / hybrid)
  - `referral_fee_total` (number)
  - `bus_acceptance_fee` (number)
  - `completion_fee` (number)
  - `vat_applicable` (checkbox)
  - `maximum_monthly_lead_allocation` (number)
- Pass these through `updateInstallerAdmin()` in the server action

**Repository change:** Extend `updateInstallerAdmin()` to accept and persist the new fields.

### 6. `/admin/leads` — Add financial and date detail

**Changes to `app/admin/leads/page.tsx`:**
- Add read-only fields under each lead: `lead_value`, `lead_cost`, `bus_acceptance_payment_due`, `completion_payment_due`, `vat_applicable`, `source`, `campaign`
- Add date fields (read-only): `survey_date`, `bus_application_date`, `bus_acceptance_date`, `install_date`, `completion_date`
- Render as a secondary row of read-only inputs below the existing form fields

**Repository change:** Ensure `mergeLeadRecord` in `lib/repositories/shared.ts` maps the new date and financial fields (most already exist but some may be missing).

### 7. `/admin/territories` — Add installer membership list

**Changes to `app/admin/territories/page.tsx`:**
- Under each territory form, show a list of installers currently in that territory (from `installer_territories` join)
- Show installer name and status
- Show count of pending territory requests for that territory

**Repository change:** Extend `listTerritories()` or add a helper to include installer membership detail.

## Layout Update

**Changes to `app/admin/layout.tsx`:**

Update the `tabs` array:
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

## Files to Create

| File | Type |
|------|------|
| `app/admin/documents/page.tsx` | New page |
| `app/admin/territory-requests/page.tsx` | New page |
| `app/admin/notifications/page.tsx` | New page |
| `app/admin/audit-log/page.tsx` | New page |

## Files to Modify

| File | Change |
|------|--------|
| `app/admin/layout.tsx` | Add 4 new tabs |
| `app/admin/installers/page.tsx` | Add territory display + financial fields |
| `app/admin/leads/page.tsx` | Add financial/date read-only fields |
| `app/admin/territories/page.tsx` | Add installer membership list |
| `lib/repositories/admin.ts` | Add 6 new functions + extend 2 existing |
| `lib/repositories/shared.ts` | Add missing field mappings for leads |
| `lib/types.ts` | Add missing fields to `Installer` type: `installerFeeType`, `referralFeeTotal`, `busAcceptanceFee`, `completionFee`, `vatApplicable`, `maximumMonthlyLeadAllocation`. Add missing fields to `Lead` type: `leadValue`, `leadCost`, `busAcceptancePaymentDue`, `completionPaymentDue`, `vatApplicable`, `surveyDate`, `busApplicationDate`, `busAcceptanceDate`, `installDate`, `completionDate` |

## Design Constraints

- **No client components.** All pages are server components with server actions.
- **No new dependencies.** Uses existing lucide-react icons, Tailwind classes, and the established design system.
- **Audit logging.** All mutations go through `logAuditEvent()`.
- **Auth.** All pages and actions use `requireRole(["admin"])`.
- **Fallback data.** New repository functions should return empty arrays when Supabase is not configured (matching existing pattern).
- **Styling.** Use existing CSS classes: `surface-card`, `chip`, `chip-soft`, `chip-success`, `chip-warning`, `data-table`, `button-primary`, `button-secondary`, `eyebrow`.

## Testing

- Verify each new page renders without errors in dev mode
- Verify server actions trigger revalidation
- Verify audit logs are created for mutations
- Verify notification outbox entries appear in the notifications page
- Verify document verification toggle persists
- Verify territory request approval creates installer_territories record
- Verify existing pages still work after modifications
