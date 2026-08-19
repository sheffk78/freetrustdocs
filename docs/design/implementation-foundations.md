# FreeTrustDocs — Implementation Foundations

**Direction:** The Clear Guide (approved August 19, 2026)
**Date:** August 19, 2026
**Status:** Staged implementation plan

---

## Overview

This document defines the order of work to implement The Clear Guide design system. The principle is simple: **foundations before pages, shared primitives before one-off components, tokens before styles.**

Every stage builds on the previous one. Do not skip ahead — a page built before tokens are consolidated will have to be redone.

---

## Stage 1 — Token Consolidation (must happen first)

**Why first:** Every component, page, and style decision depends on the token system. If tokens are inconsistent, every downstream artifact inherits the inconsistency. This is the highest-leverage work.

### Tasks

1. **Collapse the 25 hardcoded font-sizes to the modular scale.**
   - Map every `font-size` declaration in `global.css` to the nearest token (`--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-h4`, `--fs-body`, `--fs-small`, `--fs-mono`).
   - The 0.65/0.68/0.72/0.78/0.8 cluster collapses to `--fs-mono` (0.72rem).
   - Set the body base to `--fs-body` (1rem = 16px) and adjust leading to maintain the current 17px visual size, OR add a `--fs-body-lg: 1.0625rem` (17px) token.
   - Sweep all 51 state page files for inline `font-size` declarations and replace with classes.

2. **Fix redundant color tokens.**
   - Merge `--color-accent-light` into `--color-accent` (they are identical). Remove the alias.
   - Give `--color-success` its own value: `#2d7a5f` (a lighter, distinct green — not the same as primary). Success states must be visually distinguishable from primary buttons.
   - Remove the `--color-accent-light` fallback in `Base.astro` skip-link (`#c9a86a` — doesn't match actual accent).

3. **Add missing tokens.**
   - Shadow: `--shadow-card: 0 1px 3px rgba(26, 60, 52, 0.08)` — brand-tinted card shadow.
   - Shadow: `--shadow-focus: 0 0 0 3px rgba(26, 60, 52, 0.1)` — input focus ring.
   - Shadow: `--shadow-focus-error: 0 0 0 3px rgba(139, 32, 32, 0.12)` — error focus ring.
   - Z-index: `--z-base: 1`, `--z-sticky: 10`, `--z-header: 50`, `--z-overlay: 100`, `--z-modal: 200`.
   - Line-height: `--lh-tight: 1.25`, `--lh-normal: 1.5`, `--lh-relaxed: 1.7`, `--lh-loose: 1.75`.
   - Focus ring: `--focus-ring: 2px solid var(--color-primary)`, `--focus-ring-offset: 2px`.
   - Breakpoints: `--bp-mobile: 480px`, `--bp-tablet: 768px`, `--bp-desktop: 1024px` (document only — CSS custom properties can't be used in media queries, but documenting them creates a shared reference).

4. **Consolidate the duplicate callout definitions.**
   - Remove the homepage-scoped `.callout` redefinition (lines 1490–1521 in `global.css`).
   - Keep the primary definition (lines 429–501).
   - Apply the homepage-specific overrides as modifier classes if needed.

5. **Delete dead CSS.**
   - Remove `.doc-selector` family (~70 lines, no page references).
   - Remove `.process-spine` family (~56 lines, no page references).
   - Archive (don't delete) the heraldic pattern SVGs in `public/patterns/archive/`.

### Deliverable

Updated `global.css` with a clean, complete token set. All downstream work uses these tokens exclusively.

---

## Stage 2 — Shared Primitives (smallest set, most consistency)

**Why second:** These are the building blocks every page uses. If buttons, links, borders, and callouts are consistent and token-driven, 80% of the design system is enforced automatically.

### Tasks

1. **Normalize the button system.**
   - Add `:active` state (translateY(1px)) to `.btn`.
   - Add `:disabled` / `[disabled]` state (opacity 0.5, cursor not-allowed, pointer-events none) — already partially defined, verify it works.
   - Add loading state pattern (pulsing dot prefix, disabled appearance).
   - Fix `:focus-visible` border-radius to match `--border-radius` (currently 2px, should be 4px).
   - Remove any inline button styles from pages.

2. **Consolidate the four card components into one `.doc-type-card` system.**
   - Create `.doc-type-card` base class with modifiers: `--selectable`, `--compact`.
   - Migrate `.doc-card`, `.gallery-card`, `.document-mini`, `.cross-link-card` to the new system.
   - Update all pages that reference the old classes.

3. **Consolidate the three document preview components into one `.doc-preview` system.**
   - Create `.doc-preview` base with modifiers: `--mini`, `--live`.
   - Migrate `.doc-sheet`, `.gallery-card-sheet`, `.certificate-preview-doc`.
   - Fix the `.gallery-card-sheet` 2px radius to use `--border-radius` (4px).

4. **Normalize the callout system.**
   - Ensure one definition (after Stage 1 consolidation).
   - Verify all four variants (info, tip, warning, important) have correct accent colors and backgrounds.
   - Remove any page-scoped overrides.

5. **Create utility classes for common patterns.**
   - `.lede` — introductory paragraph (Inter, 1.125rem, muted, max-width 65ch).
   - `.cta-row` — flex container for CTA buttons (gap, margin).
   - `.content-prewrap` — `white-space: pre-wrap` (replaces 51 inline styles).
   - `.utc-badge` — small bronze badge for UTC status on state pages.
   - `.text-muted` — `color: var(--color-text-muted)` (replaces inline styles).

6. **Add missing interaction states.**
   - Wizard radio labels: add `:hover` state (border → `--color-primary-light`).
   - State directory search input: add `:focus-visible` override.
   - State directory links: add `:focus-visible` override.
   - All interactive elements: add `:active` where missing.

7. **Add `prefers-reduced-motion` support.**
   - Wrap `scroll-behavior: smooth` in `@media (prefers-reduced-motion: no-preference)`.
   - Wrap `wizard-pulse` animation in the same media query.
   - Audit all transitions for motion sensitivity.

### Deliverable

A set of shared primitives in `global.css` that every page can use. No more inline styles, no more ad-hoc card variants.

---

## Stage 3 — Inline Style Extraction (492 inline styles → classes)

**Why third:** This is the largest mechanical task but doesn't require design decisions. It depends on Stages 1 and 2 (the utility classes must exist before the inline styles can be replaced).

### Tasks

1. **Update the state page generator** (`generate-state-pages.mjs`) to use utility classes instead of inline styles. This ensures future regenerations include the classes.

2. **Regenerate all 51 state pages** with the updated generator, OR patch each file to replace inline styles with classes. Generator approach is preferred — it fixes the root cause.

3. **Fix the all-states directory** (`all-states.astro`): replace inline `font-size` on state links, replace inline UTC badge styles with `.utc-badge` class.

4. **Fix the homepage** (`index.astro`): replace remaining inline styles with utility classes.

### Deliverable

Zero inline `style=` attributes across the codebase (except truly one-off cases that genuinely need inline styles). Search: `grep -r 'style=' src/` should return empty or near-empty.

---

## Stage 4 — Canonical Page Implementation

**Why fourth:** With tokens, primitives, and utility classes in place, building (or rebuilding) pages becomes fast and consistent.

### Recommended canonical page to build first: Homepage

The homepage is the right first page because:

1. **It exercises the most components** — hero, document cards, process flow, document preview, callouts, trust section, FAQ, footer. If the homepage works, every component has been tested.
2. **It's the highest-traffic page** — the entry point for every user. Improvements here have the most impact.
3. **The audit identified specific drift** — the "Available Trust Documents" section, trust panels, and proof CTA need rework. The homepage is where the design system's value is most visible.
4. **It's already the most authored page** — the hero→gallery→showcase flow is the visual anchor. The rework preserves what works and fixes what drifts.

### Homepage rework scope

1. **Hero:** Keep the text-first structure. Add a line icon to the CTA. Ensure H1 uses `--fs-display` (not hardcoded). Ensure subheading uses `.lede` utility class.
2. **Document cards:** Replace the 4 card variants with unified `.doc-type-card`. Add line icons (document/shield/lock) to each card. Add statute citation and "Last reviewed" date to metadata.
3. **Process flow:** Add line icons to each step. Ensure typography uses tokens.
4. **Document preview showcase:** Replace with unified `.doc-preview`. Fix the 2px radius issue.
5. **Trust section:** Restructure as narrative (per Clear Guide spec). Remove the dark `.proof-cta` band — replace with a cream-dark section using bronze accent rules.
6. **FAQ:** Convert to native `<details>` accordion. Remove any card boxing.
7. **Remove:** "Available Trust Documents" section (duplicates hero gallery), trust panels grid (generic, no bronze accent).

### Next two pages to build

1. **Certificate of Trust landing page** (`/certificate-of-trust/`) — this is the highest-traffic document page. It exercises the document landing pattern: two-column layout, document preview, statute citation, FAQ, CTA.

2. **Certificate of Trust wizard** (`/create/certificate-of-trust/`) — this is the core product. The wizard already works well (per audit, it's a visual anchor). The rework is lighter: normalize to new tokens, add line icons to step headers, ensure the document preview uses the unified component, and verify the download success state matches the component spec.

---

## Stage 5 — Remaining Pages

After the canonical three pages are done, apply the system to:

1. All 51 state pages (via generator update — automated)
2. Declaration of Trust landing page + wizard
3. Land Trust landing page
4. Best States for Trusts page
5. Legal pages (disclaimer, terms, privacy)
6. All-states directory

These should be fast — the patterns are established, the components exist, and the generator handles the bulk of the state pages.

---

## Components to Retire, Normalize, or Replace

| Component | Action | Reason |
|---|---|---|
| `.doc-card` | Replace with `.doc-type-card` | One of 4 overlapping card variants |
| `.gallery-card` | Replace with `.doc-type-card--selectable` | Overlapping card variant with selected state |
| `.document-mini` | Replace with `.doc-type-card--compact` | Overlapping card variant |
| `.cross-link-card` | Replace with `.cross-link` | Not a card — a structured link block |
| `.doc-sheet` | Replace with `.doc-preview` | One of 3 overlapping preview components |
| `.gallery-card-sheet` | Replace with `.doc-preview--mini` | Overlapping preview, wrong radius |
| `.certificate-preview-doc` | Replace with `.doc-preview--live` | Overlapping preview component |
| `.doc-selector` family | Delete | Dead CSS — no page references |
| `.process-spine` family | Delete | Dead CSS — no page references |
| Duplicate `.callout` definition | Consolidate | Defined twice — lines 429–501 and 1490–1521 |
| `.proof-cta` dark band | Redesign | Isolated dark island breaks cream rhythm |
| "Available Trust Documents" section | Remove | Duplicates hero gallery content |
| Trust panels grid | Remove or redesign | Generic 3-column, no brand language |
| Heraldic pattern SVGs | Archive | Unused, no CSS references |
| `--color-accent-light` | Merge into `--color-accent` | Redundant — identical value |
| `--color-success` | Give unique value | Currently identical to `--color-primary` |
| 492 inline `style=` attributes | Replace with classes | Bypasses design system |

---

## Decisions — approved by Jeff, August 19, 2026

1. **Font loading strategy:** Self-host subsetted woff2 files. ✅ Fastest load speed — no external CDN dependency, preload critical weights, no FOUT. Aligns with "nothing leaves your browser" positioning.

2. **PDF font embedding:** Yes — bundle Crimson Pro + Inter as VFS files in pdfmake. ✅ Generated PDFs will match the website's typography. +200KB bundle is justified by visual consistency.

3. **State page refactoring method:** Update the generator (`generate-state-pages.mjs`). ✅ Fixes root cause — future regenerations are clean. Then regenerate all 51 state pages.

4. **"Available Trust Documents" section:** Remove. ✅ Duplicates hero gallery content. Simplifies homepage.

5. **Proof CTA treatment:** Soften to cream rhythm. ✅ Replace dark `.proof-cta` band with `--color-cream-dark` section using bronze accent rules. Eliminates the isolated dark island.

6. **Mobile navigation:** Hamburger for <768px. ✅ Already coded in Base.astro — needs testing and activation.

7. **Email capture:** Not implementing now. ✅ Kit recommendation: keep 100% no-data-collection privacy positioning. "Nothing leaves your browser" is the strongest trust claim FreeTrustDocs has — collecting emails would undermine it. If email capture is needed later, it must be optional, non-blocking, and clearly explained. Design system does not need an email capture component.

8. **Body base font size:** Keep 17px. ✅ Kit recommendation: 17px provides reading comfort that 16px doesn't match, especially for legal content that users may be anxious about. Add `--fs-body-lg: 1.0625rem` (17px) token. The modular scale gets one additional step — justified by the reading-heavy nature of the product.

---

## Visual QA Checklist

Use this checklist for every page before marking it complete:

### Token compliance
- [ ] No hardcoded color values — all colors use `--color-*` tokens
- [ ] No hardcoded font-sizes — all sizes use `--fs-*` tokens
- [ ] No hardcoded spacing — all spacing uses `--space-*` tokens
- [ ] No hardcoded radii — all corners use `--border-radius`
- [ ] No hardcoded shadows — all shadows use `--shadow-*` tokens
- [ ] No inline `style=` attributes (except genuinely one-off cases)

### Typography
- [ ] H1 uses `--fs-display` and `--font-heading`
- [ ] Body uses `--font-body` at `--fs-body` (or `--fs-body-lg`)
- [ ] Labels/kickers use `--font-mono` at `--fs-mono`
- [ ] Line-height uses `--lh-*` tokens (no hardcoded values)
- [ ] Tabular figures (`font-feature-settings: "tnum"`) on all numeric content

### Color
- [ ] Forest green used for authority (headings, buttons, header) — not decoration
- [ ] Bronze used for accents only (rules, dots, citations, callout borders) — no large fills
- [ ] Cream is the dominant surface — white is for cards/previews only
- [ ] Error red used only for validation errors — never for disclaimers or warnings
- [ ] Text contrast meets WCAG AA (4.5:1 for body, 3:1 for large text)

### Layout
- [ ] Content width respects `--max-width` (1100px) or `--max-width-narrow` (720px)
- [ ] Section padding uses `--space-2xl` (4rem) for standard sections
- [ ] Page gutters use `--space-xl` (2.5rem) on desktop, `--space-md` (1rem) on mobile
- [ ] No content exceeds the viewport on mobile (no horizontal scroll)

### Components
- [ ] Cards use the unified `.doc-type-card` system (not legacy variants)
- [ ] Document previews use the unified `.doc-preview` system
- [ ] Callouts use the consolidated definition (no page-scoped overrides)
- [ ] Buttons have all states: default, hover, active, focus, disabled
- [ ] Links have visible focus rings

### Trust and legal
- [ ] Footer UPL disclaimer present and unmodified
- [ ] Statute citations are real and verified (check against research files)
- [ ] "Last reviewed" date is current (within 90 days)
- [ ] No unverified claims about legal effectiveness, attorney review, or validity
- [ ] UPL acknowledgment checkbox present before PDF download

### Accessibility
- [ ] Skip-to-content link present and functional
- [ ] All interactive elements keyboard-reachable
- [ ] Focus indicators visible on every interactive element
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-current` on active nav items and current wizard step
- [ ] `role="alert"` on validation errors
- [ ] Form labels are always visible (no placeholder-as-label)
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Color is not the sole indicator of state (text accompanies color changes)

### Mobile
- [ ] Single-column layout on mobile (no sidebars)
- [ ] Tap targets minimum 44px (preferably 48px)
- [ ] Body text stays at 16px+ on mobile (no shrinking below readable size)
- [ ] H1 reduces appropriately for viewport (max 2rem at 375px)
- [ ] Wizard navigation is reachable (sticky bar or bottom-of-card)
- [ ] Content is reprioritized, not just stacked (primary action first, secondary below)

### Performance
- [ ] No render-blocking resources
- [ ] Fonts preloaded or self-hosted
- [ ] No unnecessary JavaScript (Astro islands only where interactivity is needed)
- [ ] Images are SVG (no raster images except ads)
- [ ] Page loads in under 2 seconds on a 3G connection