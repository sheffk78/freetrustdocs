# FreeTrustDocs — Component Inventory

**Date:** 2026-08-19
**Scope:** All repeated UI components across all routes

---

## Component Table

| Component | Variants found | Locations used | Inconsistencies | Recommended canonical version |
|---|---|---|---|---|
| **Button** (`.btn`) | `primary`, `primary btn-lg`, `outline`, `outline` (on dark) | Homepage (6), wizard (4), create pages (4), state pages (51×2), all-states (1), declaration (1), land-trust (1), legal (0) | No `:active` state. No `:disabled` state. No loading state. Focus-visible uses `2px` radius vs `4px` token. Outline-on-dark has separate override block. | Single `.btn` base with `--btn-primary`, `--btn-outline`, `--btn-lg` modifiers. Add `:active` (inset shadow), `:disabled` (opacity 0.5, cursor not-allowed), and `.is-loading` (spinner). |
| **Callout** (`.callout`) | `info`, `warning`, `important`, `tip` | Homepage (1), declaration (1), land-trust (1), certificate-of-trust (1), 51 state pages (conditional) | **Defined twice** in global.css (lines 429–501 and 1490–1521). Homepage version overrides margin and text color. `.callout-label` duplicated. | One definition at the original location (429–501). Delete the homepage-scoped duplicate (1490–1521). Homepage callouts inherit the standard styles. |
| **UPL Notice** (`.upl-notice`) | `standard`, `compact` (defined, unused) | Homepage (1), disclaimer (1), declaration (1), legal pages (2) | Compact variant defined but never used. Otherwise consistent. | Keep as-is. Remove `.upl-notice-compact` if confirmed unused. |
| **Doc Card** (`.doc-card`) | Single variant | Homepage "Available Trust Documents" (3 cards) | Hover adds bronze top border (3px) — same as gallery-card but without the permanent accent. No shadow (correct). Duplicates gallery content. | If kept: align to gallery-card treatment (permanent bronze top border, no hover border change). If removed: delete `.doc-card` and `.doc-grid` CSS. |
| **Gallery Card** (`.gallery-card`) | `default`, `--selected` | Homepage hero gallery (2 cards) | 2px border (others use 1px). Selected state uses `box-shadow: 0 0 0 1px` — only place this shadow appears. | Canonical card. Use as the base for a unified `.card` system. Selected state = `border-color: var(--color-primary)` + `box-shadow` ring. |
| **Document Mini** (`.document-mini`) | Single variant | Homepage document stack (2 items) | 3px bronze top border (matches gallery-card). No hover state. 1px border. | Merge into `.card--compact` if card system is unified. |
| **Cross-link Card** (`.cross-link-card`) | Single variant | Wizard download success (1) | No bronze accent. No hover. Plainest card variant. | Merge into `.card` base (no modifiers) if card system is unified. |
| **Wizard Step** (`.wizard-step`) | Single variant | CertOfTrustWizard, DeclarationOfTrustWizard | Consistent. White bg, 1px border, 4px radius. | Canonical step container. No changes needed. |
| **Wizard Review Group** (`.wizard-review-group`) | Single variant | Both wizards (review step) | Consistent. Cream-dark header, 1px border, 4px radius. | Keep as-is. |
| **Question Row** (`.question-row`) | Single variant | Homepage showcase "before" panel | Consistent with wizard step treatment. | Keep as-is. |
| **Doc Sheet** (`.doc-sheet`) | Single variant | Homepage showcase "after" panel | `min-height: 430px` conflicts with mobile. `aspect-ratio: auto` is set but ineffective. 3px bronze top border. | Canonical document preview. Remove `min-height` on mobile (already done via media query). |
| **Gallery Card Sheet** (`.gallery-card-sheet`) | Single variant | Homepage hero gallery cards | `border-radius: 2px` — not the 4px token. Only place 2px radius appears. | Change to `var(--border-radius)` or document the exception. |
| **Certificate Preview Doc** (`.certificate-preview-doc`) | Single variant | Certificate wizard live preview | Consistent with doc-sheet. 1px border, 4px radius, white bg. | Keep as-is. |
| **Registration Line** (`.ftd-registration-line`) | Single variant | All 51 state pages | Consistent. Bronze dots, mono text, thin lines. | Keep as-is. Good component. |
| **Tech Ribbon** (`.ftd-tech-ribbon`) | Single variant | Homepage (1) | Same visual language as registration line. Consistent. | Keep as-is. |
| **State Directory Link** (`.state-directory a`) | Single variant | all-states.astro (51 links) | First link (California) has no inline styles. All others have `style="font-size: 0.9rem;"`. UTC badges are inline-styled spans. | Extract `.state-card` class with font-size. Create `.utc-badge` class for the UTC indicator. |
| **State At-a-Glance** (`.atg`) | Single variant | All 51 state pages (via StateAtAGlance.astro) | Scoped CSS variables duplicate global tokens. Uses `border-radius: 6px` (not 4px token). Uses `box-shadow` (only shadow in system besides focus rings). Has its own `@keyframes atg-draw` animation. | Replace scoped vars with global tokens. Change `border-radius` to `var(--border-radius)`. Remove `box-shadow` (use border only, per design system). |
| **Tier Badge** (`.tier-badge`) | `tier-1`, `tier-2` | best-states-for-trusts.astro (6 instances) | Self-contained with scoped `<style>`. Custom shield SVG. Consistent. | Keep as-is. |
| **Network SVG** (`.network-svg`) | Single variant | Homepage (1) | `viewBox="0 0 720 300"` (2.4:1) squishes on wide screens. 10px/9px text in SVG — sub-10px at render scale. | Bump viewBox to `0 0 720 360` (2:1). Bump text to 12px/11px. Already noted in prior art-direction critique. |
| **Flow Step** (`.flow-step`) | Single variant | Homepage privacy flow (4 steps) | Uses `.process-num` and `.process-rule` classes — shared with dead `.process-spine` CSS. | Keep the classes, delete the dead `.process-spine` parent CSS. |
| **Sidebar Card** (`.sidebar-card`) | Single variant | Create pages (2) | Consistent. Cream-dark bg, bronze left border. | Keep as-is. |
| **Funnel Banner** (`.funnel-banner`) | Single variant | Defined in CSS but **not used in any page** | Dead CSS. | Remove if confirmed unused. |
| **Breadcrumbs** (`.breadcrumbs`) | Single variant | All content pages | Consistent. Muted text, `›` separators. | Keep as-is. |
| **Table** (`.table`) | Single variant | best-states-for-trusts.astro | Consistent. Green header, striped rows. | Keep as-is. |
| **Footer Grid** (`.footer-grid`) | Single variant | Base.astro (all pages) | Consistent. 2fr 1fr 1fr 1fr grid. | Keep as-is. |
| **Skip Link** (`.skip-link`) | Single variant | Base.astro (all pages) | Inline `<style>` in Base.astro. Uses `#c9a86a` fallback (doesn't match `--color-accent: #8b6914`). | Move to global.css. Fix fallback color. |

---

## Summary

- **26 distinct components** identified across the codebase
- **4 card variants** that should be unified into 1 canonical system
- **2 duplicate CSS blocks** (callout definitions) to consolidate
- **~200 lines of dead CSS** (`.doc-selector` family, `.process-spine` family, `.funnel-banner`)
- **492 inline style attributes** to extract into classes
- **25 hardcoded font-sizes** to collapse into a 6-step modular scale
- **3 components with shadows** (atg panel, gallery-card selected, wizard focus rings) — only focus rings are justified
- **Missing states across most components:** `:active`, `:disabled`, loading, empty (state search)
- **`prefers-reduced-motion` missing** on `scroll-behavior: smooth` and `wizard-pulse` animation