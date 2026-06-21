# Renewable Directory Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public site to feel premium and editorial while preserving fast scanning, clear filtering, and trustworthy directory detail.

**Architecture:** Treat the redesign as one shared visual system with three page modes: editorial homepage, refined directory index, and documentary detail pages. Build the system around a small set of reusable surfaces, typography rules, and one signature coverage ribbon that can appear on the homepage and location pages without turning the site into a dashboard.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, existing `Fraunces` and `Inter` font setup, existing directory data and page components.

---

### Task 1: Rebuild the shared visual foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/header.tsx`
- Modify: `app/manifest.ts`
- Modify: `lib/seo.ts`
- Modify: `components/lead-form.tsx`

- [ ] **Step 1: Review the current shared styles and replace the generic card stack with an editorial token set**

Use the existing warm-paper base, but sharpen the hierarchy:
- keep a light background
- introduce a deeper graphite text color
- add one restrained renewable green accent
- add one amber or copper highlight accent
- reduce the default roundness on most surfaces so cards, chips, and controls no longer all read the same

- [ ] **Step 2: Update the shared layout branding and metadata**

Make these strings consistent across the app:
- site title: `Renewable Directory`
- open graph site name: `Renewable Directory`
- manifest name: `Renewable Directory`
- manifest short name: `Renewable`

Keep the existing `Fraunces` display face and `Inter` body face, but ensure all page-level metadata now uses the renamed brand.

- [ ] **Step 3: Restyle the header and lead form to match the new identity**

Make the header quieter and more editorial:
- keep the logo lockup
- reduce the feeling of a generic nav bar
- make the brand name read as `Renewable Directory`

Update the lead form and submission messaging so the old `UKSD` name no longer appears in public-facing copy.

- [ ] **Step 4: Verify the shared foundation in a production build**

Run: `npm run build`
Expected: build succeeds with no type errors or missing metadata references.

### Task 2: Add the coverage ribbon signature component

**Files:**
- Create: `components/coverage-ribbon.tsx`
- Modify: `app/page.tsx`
- Modify: `app/heat-pump-installers/[location]/page.tsx`

- [ ] **Step 1: Introduce a reusable coverage ribbon component**

Create a focused component that renders a territory-and-type summary strip using existing directory data. The component should:
- accept a heading and a small list of labels
- display them in a banded, atlas-like layout
- feel like a signature motif rather than a generic stats row
- work on the homepage and on location pages

- [ ] **Step 2: Place the ribbon into the homepage hero area**

Use the ribbon as the visual anchor next to or beneath the hero thesis so the homepage has one memorable editorial feature.

- [ ] **Step 3: Reuse the ribbon on location pages**

Use the same component on location pages to connect the public pages into one system and reinforce territory coverage as the central product idea.

- [ ] **Step 4: Verify the new component in the app shell**

Run: `npm run build`
Expected: the new component compiles and the pages still render.

### Task 3: Rewrite the homepage into an editorial thesis

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/installer-card.tsx`
- Modify: `components/territory-list.tsx`

- [ ] **Step 1: Reframe the hero as a magazine-style opening spread**

Keep the hero as the homepage thesis, but shift it from “feature card grid” to “curated opener”:
- stronger headline
- more concise supporting copy
- one main action
- one secondary action
- one signature visual moment from Task 2

- [ ] **Step 2: Reduce repeated card noise below the fold**

Replace the current generic feature-card repetition with fewer, stronger sections:
- proof strip
- why people use the directory
- featured listings
- territory index

- [ ] **Step 3: Tweak installer and territory presentation for a more editorial tone**

Update the cards so they feel more curated and less dashboard-like:
- more whitespace around the name and primary facts
- lower emphasis on secondary badges
- cleaner hierarchy for location and service metadata

- [ ] **Step 4: Verify homepage layout behavior**

Run: `npm run build`
Expected: homepage still renders, but with the new editorial structure and no broken imports.

### Task 4: Redesign the directory as a refined index

**Files:**
- Modify: `app/directory/page.tsx`
- Create: `components/directory-toolbar.tsx`
- Create: `components/directory-result-card.tsx`

- [ ] **Step 1: Extract the search and filter controls into a dedicated toolbar**

Create a compact toolbar component that clearly separates:
- primary search
- type filter
- sort control
- secondary toggles
- per-page selector

The toolbar should look like a deliberate editorial control rail instead of a stacked form.

- [ ] **Step 2: Extract the result presentation into a dedicated card component**

Move the result card markup into a focused component so the page can read like an index and the card can be refined independently.

- [ ] **Step 3: Adjust the page hierarchy**

Make search visually dominant and keep filter controls secondary. The results should read like entries in a curated reference list:
- company name first
- type second
- certification and coverage after that
- action links last

- [ ] **Step 4: Preserve pagination and query-string behavior**

Keep existing query-param behavior working, including:
- search term
- type
- sort
- per-page
- BUS / website / email filters

- [ ] **Step 5: Verify the directory in a production build**

Run: `npm run build`
Expected: directory page compiles and the extracted components do not break pagination or filter state.

### Task 5: Restyle listing and location pages as documentary pages

**Files:**
- Modify: `app/directory/[listingKey]/page.tsx`
- Modify: `app/heat-pump-installers/[location]/page.tsx`

- [ ] **Step 1: Make the listing detail page feel like a dossier**

Rebalance the layout so the page clearly separates:
- identity and quick contact
- certification and source facts
- structured address and coverage details

Keep the factual record prominent and reduce the marketing feel.

- [ ] **Step 2: Align location pages with the atlas motif**

Use the coverage ribbon and editorial framing so location pages feel like part of the same premium directory system.

- [ ] **Step 3: Normalize the remaining old brand references on public pages**

Replace any lingering `UKSD` labels that are visible to users with `Renewable Directory` while preserving the underlying product meaning.

- [ ] **Step 4: Verify the detail and location pages**

Run: `npm run build`
Expected: the documentary layout and atlas motif render without breaking JSON-LD or static generation.

### Task 6: Calm the apply page and unify remaining public copy

**Files:**
- Modify: `app/apply/page.tsx`
- Modify: `components/application-form.tsx`
- Modify: `app/page.tsx` if needed for any remaining public CTA wording

- [ ] **Step 1: Reduce decorative emphasis on the apply page**

Keep the commercial details, but make the form the visual focus and the pricing/commercial panel a supporting element.

- [ ] **Step 2: Harmonize public-facing terminology**

Use the same vocabulary across the site:
- territory
- coverage
- certification
- technology type
- installer record

- [ ] **Step 3: Verify the public CTA flow**

Run: `npm run build`
Expected: apply page remains clear, premium, and consistent with the rest of the redesign.

### Task 7: Final QA and cleanup

**Files:**
- Review: `app/globals.css`
- Review: `app/page.tsx`
- Review: `app/directory/page.tsx`
- Review: `app/directory/[listingKey]/page.tsx`
- Review: `app/heat-pump-installers/[location]/page.tsx`
- Review: `app/apply/page.tsx`
- Review: `components/coverage-ribbon.tsx`

- [ ] **Step 1: Run a final build**

Run: `npm run build`
Expected: pass.

- [ ] **Step 2: Check the main public pages for visual consistency**

Confirm the homepage, directory, listing detail, location page, and apply page all share the same premium editorial language without collapsing into identical cards.

- [ ] **Step 3: Commit the redesign**

Use a single commit with a message that reflects the redesign scope, for example:

```bash
git add app/globals.css app/page.tsx app/directory/page.tsx app/directory/[listingKey]/page.tsx app/heat-pump-installers/[location]/page.tsx app/apply/page.tsx components docs
git commit -m "feat: redesign renewable directory visuals"
```

---

## Coverage Check

This plan covers:
- the shared design tokens and typography
- the homepage editorial redesign
- the signature atlas / coverage ribbon motif
- the directory index redesign
- the listing detail and location page treatment
- the apply page cleanup
- final build verification

It intentionally does not add new data models, new directory features, or admin-tooling redesign.
