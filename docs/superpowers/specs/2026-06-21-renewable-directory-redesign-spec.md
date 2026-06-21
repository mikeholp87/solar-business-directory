# Renewable Directory Redesign Spec

## Goal
Redesign the site to feel premium, editorial, and curated while preserving the product’s core job: help visitors find renewable installers by territory, technology type, certification details, and contact information.

The redesign should make the homepage feel like a thesis, the directory feel like a refined index, and the listing pages feel like documentary records rather than generic cards.

## Principles
- Make the site feel like a curated publication, not a dashboard.
- Use renewable-installation language as the visual system: territory, coverage, certification, and type.
- Spend boldness in one signature place, then keep the rest disciplined.
- Preserve clarity and scanability for data-heavy pages.
- Keep the site responsive, keyboard accessible, and respectful of reduced-motion preferences.

## Visual Direction

### Design tokens
- Background: warm paper tones instead of flat white.
- Primary text: deep graphite.
- Primary accent: restrained renewable green.
- Secondary accent: solar amber or copper for highlights and callouts.
- Surface tint: misted sage or pale blue-green for soft panels.
- Rule / border color: soft warm gray with slightly stronger divider states.

### Typography
- Display face: `Fraunces` for hero lines, major section headings, and selected data moments.
- Body face: `Inter` for paragraphs, controls, cards, and form fields.
- Utility face: a mono or condensed treatment for counts, labels, source metadata, and other compact facts.

### Layout language
- Prefer framed sections and editorial spacing over repeated rounded cards.
- Reserve heavier card treatment for result entries and form blocks.
- Use dividers, section labels, and modest asymmetry to create rhythm.
- Introduce one signature motif that repeats across the site: a coverage ribbon or atlas band that visually connects territory, technology type, and certification.

## Page Modes

### 1. Homepage: Editorial thesis
The homepage should be the most expressive page.

Requirements:
- Strong hero with a clear editorial headline.
- Subheadline that explains the product in plain terms.
- One signature visual moment tied to territory coverage or an atlas-style index.
- Fewer generic feature cards.
- More curated, story-like sections that explain why the directory exists and how to use it.

Suggested structure:
- Hero
- Proof strip
- Signature coverage band
- Why the directory exists
- Featured listings
- Territory index

### 2. Directory: Refined index
The directory should feel like a premium reference tool.

Requirements:
- Search must be the primary action.
- Filters should feel compact and deliberate, not like a form stack.
- Sort and type controls should be visually grouped but secondary to search.
- Result cards should read like entries in an index, with clean metadata hierarchy.
- Pagination should remain clear and easy to scan.

Suggested structure:
- Search hero
- Refine bar
- Result index
- Pagination

### 3. Listing detail: Documentary dossier
The listing page should feel like a source record.

Requirements:
- Split the page into a strong identity / contact rail and a factual detail rail.
- Surface certification, coverage, and source metadata clearly.
- Make the page feel authoritative and document-like, not promotional.
- Use typography and spacing to separate summary facts from structured record fields.

### 4. Apply page: Calm conversion
The apply page should stay persuasive but quieter than the homepage.

Requirements:
- Keep the commercial offer easy to understand.
- Reduce decorative emphasis compared with the homepage.
- Make the form the visual center of the page.
- Present commercial models as a clean supporting panel, not the main spectacle.

## Components To Update

### Global styles
- Rework shared tokens in `app/globals.css` to support a premium editorial palette.
- Introduce clearer hierarchy between page background, section surfaces, cards, chips, and control surfaces.
- Reduce overuse of the same border radius and shadow on every surface.
- Keep accessible focus states and reduced-motion support.

### Header
- Preserve the logo area, but align the title treatment with the new editorial identity.
- Keep navigation restrained and premium.
- Use the header as an anchor, not a competing visual feature.

### Homepage sections
- Update the hero to feel more like a magazine opening spread.
- Replace generic feature-card repetition with one or two stronger editorial blocks.
- Add a signature coverage band or atlas strip.

### Directory page
- Redesign the search/filter area into a compact control rail.
- Separate the search input from secondary filters more clearly.
- Improve scanability of listing cards by emphasizing company name, type, and key metadata.

### Listing card
- Tune card spacing and hierarchy for a more refined index style.
- De-emphasize secondary metadata.
- Keep chips and status badges, but avoid letting them dominate the card.

### Territory and location pages
- Make territory pages feel like location indexes with editorial framing.
- Keep factual content, but bring in the same atlas motif so the site feels systemized.

## Signature Motif
The site’s memorable visual element should be a coverage ribbon or atlas band.

Behavior:
- Show territory names, coverage state, or technology type in a banded layout.
- Use it on the homepage as the hero companion.
- Reuse it on location pages and listing pages as a navigation or summary device.

Why this works:
- It is specific to the product.
- It ties directly to the data model.
- It creates a premium editorial identity without adding decorative noise.

## Copy And Tone
- Keep copy plain, direct, and trustworthy.
- Avoid generic startup phrasing like “streamline,” “optimize,” or “all-in-one platform.”
- Use the subject matter’s own language: territory, coverage, certification, technology type, installer record.
- Headlines can be more lyrical, but supporting copy should stay concrete.

## Accessibility And Behavior
- Maintain visible keyboard focus states.
- Preserve reduced-motion support.
- Ensure contrast remains strong on warm backgrounds and tinted surfaces.
- Keep forms, chips, and pagination easy to operate with keyboard and touch.

## Rollout Order
1. Update global design tokens and shared component styling.
2. Redesign the homepage around the editorial thesis and coverage ribbon.
3. Rework the directory into a refined index.
4. Restyle detail, location, and apply pages to match the new system.
5. Normalize remaining branding and metadata references across the site.

## Success Criteria
- The site reads as a premium editorial directory, not a generic card grid.
- The homepage has one clear signature motif tied to the product.
- The directory remains easy to scan and filter.
- The design feels consistent across homepage, directory, detail, and apply pages.
- The visual identity is clearly distinct from the previous UKSD-branded treatment.

## Out Of Scope
- No data model changes.
- No new directory features.
- No changes to scraper logic unless needed to support presentation.
- No redesign of admin or internal tooling unless a shared component must change.
