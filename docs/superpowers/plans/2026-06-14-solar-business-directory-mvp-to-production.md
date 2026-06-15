# Solar Business Directory MVP to Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current static MVP into a production-ready multi-role web app for homeowners, installers, and admins with real auth, database-backed workflows, Stripe billing, notifications, and deployable operations.

**Architecture:** Keep Next.js App Router as the UI and server layer, use Supabase PostgreSQL as the system of record, and move all business logic into small typed server-side modules that can be tested independently. Preserve the current public pages and form UX, but replace the hardcoded arrays in `lib/data.ts` with repository/query functions, then add role-aware dashboards, background workflows, and Stripe synchronization on top.

**Tech Stack:** Next.js 14 App Router, TypeScript, React, Supabase Postgres/Auth/Storage, Stripe, Tailwind CSS, Vitest. Add Playwright later for end-to-end coverage once the core flows are wired.

---

## Current State And Target

The repo already has a good MVP shell:

- Public home, directory, installer profile, location landing pages, installer application page, admin dashboard scaffold, installer dashboard scaffold, and legal pages.
- API route shells for leads, installer applications, and Stripe checkout/webhook.
- Supabase schema and seed files with the core entities.
- Unit tests for postcode matching and territory assignment.

What is still MVP-only:

- Most pages render from static arrays in `lib/data.ts`.
- `app/admin/page.tsx` and `app/installer-dashboard/page.tsx` are not authenticated or data-driven.
- The Stripe webhook is a stub.
- There is no real auth/session routing, no storage workflow, no notifications, and no audit trail.
- Search, filters, and dashboards are mostly presentation-only.

The plan below converts each of those gaps into a production subsystem without over-refactoring unrelated parts of the app.

---

## Phase 1: Make Supabase the source of truth

**Outcome:** Every public page and dashboard reads from Supabase or a typed data-access layer instead of mock arrays.

**Files:**

- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/admin.ts`
- Create: `lib/repositories/territories.ts`
- Create: `lib/repositories/installers.ts`
- Create: `lib/repositories/leads.ts`
- Create: `lib/repositories/applications.ts`
- Create: `lib/repositories/reviews.ts`
- Create: `lib/validators/territory.ts`
- Create: `lib/validators/installer.ts`
- Create: `lib/validators/lead.ts`
- Modify: `lib/data.ts`
- Modify: `app/page.tsx`
- Modify: `app/directory/page.tsx`
- Modify: `app/heat-pump-installers/[location]/page.tsx`
- Modify: `app/installers/[slug]/page.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/installer-dashboard/page.tsx`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/applications/route.ts`
- Modify: `tests/lead-assignment.test.ts`
- Create: `tests/repositories/installers.test.ts`
- Create: `tests/repositories/leads.test.ts`
- Create: `tests/repositories/territories.test.ts`

**Roadmap:**

- [ ] Lock the canonical schema-to-TypeScript mapping first. Define exact Supabase row shapes and map them into app-facing types so the UI stops depending on `lib/data.ts` object literals.
- [ ] Move postcode matching, territory lookup, installer search, and lead assignment into repository/service functions that can be tested without React.
- [ ] Keep `lib/data.ts` only as seed/demo data for local development and tests, not runtime UI data.
- [ ] Update the public home page, directory, installer profile page, and location pages to fetch real records server-side.
- [ ] Replace the admin and installer dashboards with query-backed summaries that read from the database, even if the editing actions are still read-only at this stage.
- [ ] Add test coverage for search matching, territory status, installer eligibility, and payload validation before changing the UI wiring.

**Validation gate:**

- Run `npm test`
- Run `npm run build`
- Confirm the public pages still render with seeded Supabase data

**Acceptance criteria:**

- The app works with Supabase enabled and does not require `lib/data.ts` for production rendering.
- Search results, installer profiles, and dashboard counts are all derived from persisted data.
- Tests cover the core matching and filtering logic.

---

## Phase 2: Add real authentication and role-based access

**Outcome:** Admins and installers can sign in, and the app routes users to the correct experience based on role.

**Files:**

- Create: `lib/auth/session.ts`
- Create: `lib/auth/roles.ts`
- Create: `middleware.ts`
- Modify: `app/login/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/installer-dashboard/page.tsx`
- Modify: `app/api/stripe/webhook/route.ts`
- Modify: `supabase/schema.sql`
- Create: `tests/auth/roles.test.ts`
- Create: `tests/auth/middleware.test.ts`

**Roadmap:**

- [ ] Define the minimum auth contract: email/password or magic-link sign-in, a `users.role` value that drives routing, and a server helper for the current session.
- [ ] Add middleware so unauthenticated users can reach public pages but cannot access `/admin` or `/installer-dashboard`.
- [ ] Make the login page perform real session establishment and redirect admins and installers to the correct destination.
- [ ] Add a server-side role guard for pages and route handlers so API access follows the same rule as the UI.
- [ ] Update the schema and seed logic so user-role creation is reproducible in a fresh environment.

**Validation gate:**

- Run `npm test`
- Manually verify login/logout routing locally
- Confirm unauthenticated requests to protected pages redirect instead of rendering data

**Acceptance criteria:**

- Role gating is enforced in both the UI and server routes.
- Admins and installers land on different dashboards after sign-in.
- Public pages remain accessible without auth.

---

## Phase 3: Turn the lead-gen funnel into a real operational flow

**Outcome:** Homeowner enquiries and installer applications create durable database records, trigger assignment logic, and surface success/error states to users.

**Files:**

- Modify: `components/lead-form.tsx`
- Modify: `components/application-form.tsx`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/applications/route.ts`
- Modify: `app/thank-you/page.tsx`
- Create: `app/apply/success/page.tsx`
- Create: `app/enquiry/success/page.tsx`
- Create: `lib/notifications/outbox.ts`
- Create: `tests/api/leads.test.ts`
- Create: `tests/api/applications.test.ts`

**Roadmap:**

- [ ] Tighten the request validation schema so each form submits predictable payloads and the server can reject malformed or incomplete records.
- [ ] Persist homeowner leads with territory assignment, preferred-installer logic, and source attribution.
- [ ] Persist installer applications with the exact service flags, territory preferences, and commercial intent needed for admin review.
- [ ] Add explicit success pages so the funnel does not rely on client-only state after submit.
- [ ] Introduce an outbox or notification queue table so lead/application events can trigger email and admin alerts without coupling those side effects to the request transaction.

**Validation gate:**

- Run `npm test`
- Submit sample lead and application forms locally
- Verify new rows appear in Supabase with the expected territory and source values

**Acceptance criteria:**

- Every form submission creates a durable record.
- Lead assignment is deterministic and test-covered.
- Users see a real post-submit destination instead of an in-memory success flag.

---

## Phase 4: Build the installer portal

**Outcome:** Installers can manage their profile, see assigned leads, update lead stages, upload documents, and request territory changes.

**Files:**

- Modify: `app/installer-dashboard/page.tsx`
- Create: `app/installer-dashboard/profile/page.tsx`
- Create: `app/installer-dashboard/leads/page.tsx`
- Create: `app/installer-dashboard/documents/page.tsx`
- Create: `app/installer-dashboard/territories/page.tsx`
- Create: `components/installer-dashboard-shell.tsx`
- Create: `components/lead-stage-form.tsx`
- Create: `components/document-uploader.tsx`
- Create: `components/territory-request-form.tsx`
- Create: `lib/repositories/installer-dashboard.ts`
- Create: `lib/storage/documents.ts`
- Create: `tests/installer-dashboard.test.ts`

**Roadmap:**

- [ ] Split the dashboard into focused subpages so profile editing, lead management, documents, and territory requests do not compete for the same screen.
- [ ] Load the signed-in installer profile from the server and show only the data that installer is allowed to edit.
- [ ] Add lead-stage transitions and internal notes so installers can update the lifecycle of each assigned enquiry.
- [ ] Add file upload support for accreditation and compliance documents, backed by Supabase Storage and a database row per upload.
- [ ] Add a territory request workflow that records interest without auto-granting access.

**Validation gate:**

- Run `npm test`
- Manually verify an installer cannot see another installer’s leads or documents
- Confirm uploads land in the intended storage bucket and create database rows

**Acceptance criteria:**

- An installer can manage the day-to-day workflow without using the admin panel.
- Sensitive fields remain hidden or read-only.
- Document uploads and lead status updates persist across refreshes.

---

## Phase 5: Build the admin operating console

**Outcome:** Admins can approve installers, manage territory capacity, review leads, moderate reviews, and export commercial data.

**Files:**

- Modify: `app/admin/page.tsx`
- Create: `app/admin/applications/page.tsx`
- Create: `app/admin/installers/page.tsx`
- Create: `app/admin/territories/page.tsx`
- Create: `app/admin/leads/page.tsx`
- Create: `app/admin/reviews/page.tsx`
- Create: `app/admin/export/page.tsx`
- Create: `components/admin-stats-cards.tsx`
- Create: `components/admin-data-table.tsx`
- Create: `lib/repositories/admin.ts`
- Create: `tests/admin/access.test.ts`
- Create: `tests/admin/export.test.ts`

**Roadmap:**

- [ ] Replace the summary-only dashboard with a real operations console that links to dedicated management pages.
- [ ] Add approve/reject flows for installer applications and tie those actions back to installer status and territory allocation.
- [ ] Add territory capacity controls, including manual override paths and a visible audit trail for each change.
- [ ] Add lead assignment overrides, invoice status edits, and commission tracking in an admin-only area.
- [ ] Add review moderation controls so customer reviews can be approved before appearing publicly.
- [ ] Implement CSV export for leads and installer records using a server route rather than client-side table scraping.

**Validation gate:**

- Run `npm test`
- Verify admin-only access with a non-admin account
- Export a sample CSV and confirm the columns match the schema

**Acceptance criteria:**

- An admin can run the business from the console without editing the database directly.
- Commercial and territory fields are protected from installer self-edit.
- Auditability exists for the core operational changes.

---

## Phase 6: Finish Stripe billing and subscription sync

**Outcome:** Installer sign-up, subscription management, and webhook synchronization work end-to-end.

**Files:**

- Modify: `app/api/stripe/checkout/route.ts`
- Modify: `app/api/stripe/webhook/route.ts`
- Create: `app/billing/page.tsx`
- Create: `app/billing/success/page.tsx`
- Create: `app/billing/cancel/page.tsx`
- Create: `lib/stripe/client.ts`
- Create: `lib/repositories/billing.ts`
- Create: `tests/stripe/checkout.test.ts`
- Create: `tests/stripe/webhook.test.ts`

**Roadmap:**

- [ ] Replace the checkout placeholder with a subscription start flow that is aware of the installer account and the chosen tier.
- [ ] Complete the webhook handler so subscription state, Stripe customer IDs, and entitlement changes are written back to Supabase.
- [ ] Add a billing page for installers to view their current plan, invoice state, and next action.
- [ ] Define the mapping between subscription status and app entitlements so access control is deterministic.
- [ ] Add webhook fixture tests so Stripe event handling does not regress when the payload shape changes.

**Validation gate:**

- Run `npm test`
- Use Stripe CLI to replay `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`
- Confirm installer status changes in Supabase after webhook delivery

**Acceptance criteria:**

- Checkout creates the intended subscription.
- Webhooks update the database correctly.
- The app can explain billing state inside the installer portal.

---

## Phase 7: Add notifications, moderation, and operational automation

**Outcome:** Important events notify the right people, and the app stops depending on manual follow-up for routine work.

**Files:**

- Create: `lib/notifications/email.ts`
- Create: `lib/notifications/templates/lead-received.ts`
- Create: `lib/notifications/templates/application-received.ts`
- Create: `lib/notifications/templates/installer-approved.ts`
- Create: `lib/notifications/templates/payment-failed.ts`
- Create: `lib/audit/log-event.ts`
- Create: `lib/repositories/notifications.ts`
- Create: `tests/notifications/lead-received.test.ts`
- Create: `tests/notifications/application-received.test.ts`
- Create: `tests/notifications/payment-failed.test.ts`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/applications/route.ts`
- Modify: `app/api/stripe/webhook/route.ts`

**Roadmap:**

- [ ] Send admin notifications when a new lead or installer application arrives.
- [ ] Send installer notifications when an assignment, approval, or payment event changes their status.
- [ ] Add an audit log table and helper so the important admin actions are traceable.
- [ ] Queue notifications instead of sending them inline when the workflow needs reliability over immediacy.
- [ ] Add review moderation and notification hooks so public testimonials do not require manual page edits.

**Validation gate:**

- Run `npm test`
- Confirm notification records are created even if email delivery is temporarily unavailable
- Verify the audit log captures admin mutations

**Acceptance criteria:**

- Notifications are generated from business events, not manually from the UI.
- Failed email delivery does not break the core user flow.
- Admin actions are traceable after the fact.

---

## Phase 8: Upgrade SEO, performance, analytics, and content depth

**Outcome:** The app is ready to compete for organic traffic and provide a fast, measurable user experience.

**Files:**

- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/directory/page.tsx`
- Modify: `app/heat-pump-installers/[location]/page.tsx`
- Modify: `app/installers/[slug]/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/manifest.ts`
- Create: `components/structured-data.tsx`
- Create: `lib/seo/location-pages.ts`
- Create: `lib/analytics/events.ts`
- Create: `tests/seo/metadata.test.ts`
- Create: `tests/seo/sitemap.test.ts`

**Roadmap:**

- [ ] Replace placeholder metadata with page-specific metadata, canonical URLs, and structured data for installers, territories, and organization pages.
- [ ] Expand the location page system so each territory and major city can be generated from a shared data model.
- [ ] Add XML sitemap and robots rules based on live canonical routes.
- [ ] Add analytics events for lead form start, lead form submit, application start, application submit, and billing actions.
- [ ] Audit image usage and server rendering so the home page and directory stay fast under real content.

**Validation gate:**

- Run `npm run build`
- Run Lighthouse or PageSpeed on the main landing pages
- Verify sitemap and robots output in the browser

**Acceptance criteria:**

- Each important page has canonical metadata and search-friendly markup.
- Core conversion events are measurable.
- The public experience remains fast as the data grows.

---

## Phase 9: Finish with hardening and launch readiness

**Outcome:** The app can be operated safely in production.

**Files:**

- Create: `docs/runbooks/deploy.md`
- Create: `docs/runbooks/support.md`
- Create: `docs/runbooks/stripe.md`
- Create: `docs/runbooks/supabase.md`
- Modify: `README.md`
- Create: `tests/e2e/lead-submission.spec.ts`
- Create: `tests/e2e/installer-application.spec.ts`
- Create: `tests/e2e/admin-review.spec.ts`
- Create: `tests/e2e/installer-login.spec.ts`
- Create: `tests/e2e/stripe-checkout.spec.ts`

**Roadmap:**

- [ ] Add end-to-end tests for the most important journeys: homeowner lead submission, installer application, installer login, admin review, and Stripe checkout.
- [ ] Write runbooks for deploys, rollback, Stripe webhook recovery, and Supabase maintenance so the operational steps are not tribal knowledge.
- [ ] Update `README.md` so local setup, env vars, and production setup match the real app instead of the starter scaffold.
- [ ] Do a final security pass on RLS, secret handling, file upload permissions, and admin-only data exposure.
- [ ] Ship with monitoring and backup checks in place before public launch.

**Validation gate:**

- Run `npm test`
- Run `npm run build`
- Run the key Playwright journeys against a preview deployment
- Verify the production checklist in the runbook is complete

**Acceptance criteria:**

- The app is ready for real users, not just internal demos.
- Recovery steps are documented.
- The launch surface is covered by automated tests and basic operational checks.

---

## Recommended Build Order

1. Phase 1: data layer and server queries.
2. Phase 2: auth and access control.
3. Phase 3: public lead/apply flows.
4. Phase 4: installer portal.
5. Phase 5: admin console.
6. Phase 6: Stripe billing.
7. Phase 7: notifications and automation.
8. Phase 8: SEO, performance, analytics.
9. Phase 9: hardening and launch.

That order minimizes rework because every later phase depends on the real data model, permissions, and event flow being in place first.
