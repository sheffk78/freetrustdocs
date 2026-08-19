# FreeTrustDocs — Design Foundation Audit

**Date:** 2026-08-19
**Scope:** Full repository — all routes, components, CSS, fonts, images, logos, patterns
**Method:** Source-code inspection of every file in `src/`, `public/`, and existing design documentation in `brands/FreeTrustDocs/`
**Goal:** Document the current state before evolving the visual system

---

## 1. Existing Visual Tokens

All tokens are defined in `src/styles/global.css :root` (lines 9–46).

### Color tokens

| Token | Value | Used for | Notes |
|---|---|---|---|
| `--color-primary` | `#1a3c34` | Headers, links, buttons, borders, SVG fills | Deep forest green — the brand anchor |
| `--color-primary-light` | `#2d5a4e` | Hover states, callout-tip accent | |
| `--color-primary-dark` | `#0f2620` | Footer background, proof-cta, heading text | |
| `--color-accent` | `#8b6914` | Bronze accent — borders, rules, dots, SVG strokes | |
| `--color-accent-light` | `#8b6914` | Header/footer link hover | **Identical to `--color-accent` — redundant token** |
| `--color-cream` | `#f8f5ef` | Body background, button text on green | |
| `--color-cream-dark` | `#ede7da` | Section backgrounds, code blocks, callout fills | |
| `--color-text` | `#1a1a1a` | Body text | |
| `--color-text-muted` | `#555` | Subtitles, meta text, labels | |
| `--color-border` | `#d4cfc4` | All 1px borders | |
| `--color-white` | `#ffffff` | Card backgrounds, wizard steps | |
| `--color-error` | `#8b2020` | Validation errors | |
| `--color-success` | `#1a3c34` | Success states | **Identical to `--color-primary` — redundant** |

### Typography tokens

| Token | Value | Usage |
|---|---|---|
| `--font-heading` | `'Crimson Pro', 'Crimson Text', Georgia, serif` | All h1–h6, doc-sheet titles, gallery card titles |
| `--font-body` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Body text, buttons, labels, nav |
| `--font-mono` | `'JetBrains Mono', 'Courier New', monospace` | Code blocks, mono labels/kickers, SVG text, field values |

### Spacing tokens

| Token | Value |
|---|---|
| `--space-xs` | `0.25rem` |
| `--space-sm` | `0.5rem` |
| `--space-md` | `1rem` |
| `--space-lg` | `1.5rem` |
| `--space-xl` | `2.5rem` |
| `--space-2xl` | `4rem` |
| `--space-3xl` | `6rem` |

### Layout tokens

| Token | Value |
|---|---|
| `--max-width` | `1100px` |
| `--max-width-narrow` | `720px` |
| `--border-radius` | `4px` |
| `--transition` | `150ms ease` |

### Missing tokens

- **No font-size scale.** 25+ distinct hardcoded font-size values across the CSS (see §5).
- **No shadow token.** Shadows are used in 2 places with hardcoded values.
- **No z-index scale.** Skip-link uses `9999` inline.
- **No line-height token.** Values range from 1.25 to 1.7 hardcoded.

---

## 2. Fonts — Loaded and Used

### Loading mechanism

`src/layouts/Base.astro` (line 38) loads three Google Font families via a single `<link>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- **No `<link rel="preconnect">` for fonts.gstatic.com** — present for fonts.googleapis.com only (line 36).
- **No `<link rel="preload">`** — all three families FOUT on every navigation.
- **11 web font files** loaded (Crimson Pro: 4 weights, Inter: 3, JetBrains Mono: 4).
- **No self-hosting or subsetting.** All fonts fetched from Google CDN.
- **No `font-display: optional`** — `swap` means layout shift on slow connections.

### Usage map

| Font | Where used | Weights actually used |
|---|---|---|
| **Crimson Pro** | h1–h6, `.doc-sheet-title`, `.gallery-card-title`, `.wizard-section-title`, `.anatomy-label`, `.atg__title`, logo text, TierBadge glyph | 600, 700 (400/500 loaded but unused) |
| **Inter** | Body, buttons, labels, nav, form inputs, wizard labels, eyebrows, callout body | 400, 500, 600 (all three used) |
| **JetBrains Mono** | Code blocks, mono kickers (`.eyebrow`, `.gallery-kicker`, `.document-mini-kicker`), SVG network labels, `.doc-field-value`, `.doc-field-label`, `.section-count`, registration lines | 400, 500, 600, 700 (all four used) |

### PDF font stack (wizard)

The PDF generator (`CertOfTrustWizard.tsx` line 230) uses `pdfmake` with built-in `Helvetica` and `Times` — **not** the web fonts. This is a known limitation of client-side pdfmake (no custom font embedding without bundling VFS files).

---

## 3. All Repeated UI Components and Their Variants

### 3.1 Buttons (`.btn`)

| Variant | Class | Where used | Count |
|---|---|---|---|
| Primary | `.btn.btn-primary` | Homepage CTAs, wizard continue, create pages, state pages | ~15 instances |
| Primary large | `.btn.btn-primary.btn-lg` | Hero CTA, proof-cta | 3 |
| Outline | `.btn.btn-outline` | Secondary CTAs, wizard back, "Learn more" | ~10 |
| Outline (on dark) | `.proof-cta-actions .btn-outline` | Proof CTA section | 2 (overridden) |

**Inconsistencies:** The `.btn` base has `border-radius: var(--border-radius)` (4px), but focus-visible override uses `border-radius: 2px`. No active state. No disabled state (wizard uses `disabled` attribute on progress labels but not on buttons). No loading state.

### 3.2 Callouts (`.callout`)

| Variant | Class | Visual difference | Where used |
|---|---|---|---|
| Info | `.callout-info` | Green left border, green-tinted fill | Declaration of Trust page, state pages |
| Warning | `.callout-warning` | Bronze left border, warm fill | Land Trust "coming soon" |
| Important | `.callout-important` | Dark green left border, stronger fill | StateAtAGlance provenance warning |
| Tip | `.callout-tip` | Light green left border, lightest fill | Certificate of Trust page, homepage privacy |

**Inconsistencies:** The `.callout` and `.callout-label` rules are **defined twice** — once at lines 429–501 (the documented system) and again at lines 1490–1521 (homepage-scoped redefinition). The homepage version overrides `margin-top` to `0` and changes `color` of body paragraphs to `--color-text-muted`. These duplicate blocks should be consolidated.

### 3.3 UPL Notice (`.upl-notice`)

| Variant | Class | Where used |
|---|---|---|
| Standard | `.upl-notice` | Homepage, disclaimer, legal pages |
| Compact | `.upl-notice-compact` | Wizards (defined but not used in any page) |

**Consistent.** Single definition, single use pattern. No drift.

### 3.4 Document Cards

| Component | Class | Where used | Visual treatment |
|---|---|---|---|
| Generic doc card | `.doc-card` | Homepage "Available Trust Documents" section | White bg, 1px border, hover changes border color + adds bronze top border |
| Gallery card | `.gallery-card` | Homepage hero gallery | White bg, 2px border, 3px bronze top border, selected state has ring shadow |
| Document mini | `.document-mini` | Homepage document stack | White bg, 1px border, 3px bronze top border, no hover |
| Cross-link card | `.cross-link-card` | Wizard download success | White bg, 1px border, no accent |

**Inconsistencies:** Four card components with overlapping visual language but different border widths (1px vs 2px), different hover treatments, and different accent placements. The `.doc-card` is the only one that changes border on hover without a permanent bronze top border. The `.gallery-card` is the only one with a `box-shadow` ring on selected state.

### 3.5 Wizard Step Container (`.wizard-step`)

| Component | Class | Where used |
|---|---|---|
| Wizard step | `.wizard-step` | Both wizards (CertOfTrust, DeclarationOfTrust) |
| Wizard review group | `.wizard-review-group` | Review step in both wizards |
| Question row | `.question-row` | Homepage showcase "before" panel |

**Consistent.** All use `border: 1px solid var(--color-border)` + `border-radius: var(--border-radius)` + white/cream background.

### 3.6 Document Preview Sheet (`.doc-sheet`)

| Component | Class | Where used |
|---|---|---|
| Full doc sheet | `.doc-sheet` | Homepage showcase "after" panel |
| Mini sheet | `.gallery-card-sheet` | Homepage hero gallery cards |
| Preview doc | `.certificate-preview-doc` | Certificate wizard live preview |

**Inconsistencies:** `.gallery-card-sheet` uses `border-radius: 2px` while the design token is `4px`. `.doc-sheet` has `min-height: 430px` which conflicts with `aspect-ratio: auto` on mobile.

### 3.7 Registration Lines / Tech Ribbon

| Component | Class | Where used |
|---|---|---|
| Tech ribbon | `.ftd-tech-ribbon` | Homepage (above hero) |
| Registration line | `.ftd-registration-line` | State pages (above h1) |

**Consistent.** Same visual language — thin lines, bronze dots, mono text. Good.

### 3.8 State Directory

| Component | Class | Where used |
|---|---|---|
| Directory grid | `.state-directory` | `all-states.astro` |
| Search tools | `.state-directory-tools` | `all-states.astro` |
| State card | `.state-directory a` | `all-states.astro` |

**Inconsistencies:** First state card (California) has no inline styles, but all subsequent cards have `style="font-size: 0.9rem;"` inline. UTC badge spans have inline `style="color: var(--color-accent); font-size: 0.75rem;"`. These should be classes.

### 3.9 At-a-Glance Panel (`.atg`)

| Component | Class | Where used |
|---|---|---|
| Panel | `.atg` | All 51 state pages via `StateAtAGlance.astro` |
| Fields | `.atg__field` | 4 fields per panel |
| Flag | `.atg__flag` | Provenance/caveat flags |

**Self-contained.** Has its own `<style>` block with scoped CSS variables (`--atg-border`, `--atg-bg`, etc.) that duplicate the global tokens. Uses `border-radius: 6px` (not the 4px token) and `box-shadow: 0 1px 2px rgba(0,0,0,0.04)` — the only shadow in the system besides the wizard focus ring.

### 3.10 Tier Badge (`.tier-badge`)

Used only on `best-states-for-trusts.astro`. Custom shield SVG with Roman numerals. Self-contained with scoped `<style>`. Consistent with the brand language.

---

## 4. Hard-coded Values (Colors, Spacing, Radii, Shadows)

### Hard-coded colors

| Location | Value | Should be token |
|---|---|---|
| `Base.astro` skip-link style | `#c9a86a`, `#1a3c34` | `--color-accent`, `--color-primary` |
| `Base.astro` skip-link | `var(--color-accent, #c9a86a)` | Fallback doesn't match actual accent |
| `StateAtAGlance.astro` scoped vars | `#d4cfc4`, `#ffffff`, `#1a1a1a`, `#555`, `#8b6914`, `#1a3c34` | All duplicate global tokens |
| `StateAtAGlance.astro` field bg | `#fbf7ee` | No token for this — a custom warm tint |
| `index.astro` inline | `var(--color-text-muted)` repeated | Should use classes |
| 50 state pages inline | `var(--color-primary)`, `var(--color-cream)`, `var(--color-text-muted)` | Repeated inline instead of classes |
| `CertOfTrustWizard.tsx` PDF | `#888888` footer color | Hardcoded in PDF definition |
| `all-states.astro` inline | `var(--color-accent)` for UTC badges | Should be a `.utc-badge` class |

### Hard-coded spacing

| Location | Value | Context |
|---|---|---|
| `index.astro` inline | `margin-bottom: 2.5rem` | Should be `var(--space-xl)` |
| `index.astro` inline | `gap: 0.75rem` | Should be a token or class |
| 50 state pages inline | `margin-bottom: 2rem` repeated | Should be `var(--space-lg)` |
| `StateAtAGlance.astro` scoped | `1.25rem`, `0.85rem`, `0.9rem`, `0.35rem`, `0.15rem` | All hardcoded |
| `CertOfTrustWizard.tsx` inline | `margin-top: 1rem`, `padding: 0.75rem 2rem`, `font-size: 1.1rem` | Inline styles in JSX |

### Hard-coded radii

| Location | Value | Token value |
|---|---|---|
| `global.css` `code` | `3px` | `--border-radius: 4px` |
| `global.css` focus-visible | `2px` | `--border-radius: 4px` |
| `global.css` wizard segment | `2px` | `--border-radius: 4px` |
| `global.css` wizard progress active | `2px` | `--border-radius: 4px` |
| `StateAtAGlance.astro` panel | `6px` | `--border-radius: 4px` |
| `StateAtAGlance.astro` field | `4px` | Matches token but hardcoded |
| `StateAtAGlance.astro` flag | `3px` | Not tokenized |
| 50 state pages inline | `3px` for UTC badge | Not tokenized |
| `.gallery-card-sheet` | `2px` | Not tokenized |

### Hard-coded shadows

| Location | Value | Context |
|---|---|---|
| `global.css:759` | `0 0 0 3px rgba(26, 60, 52, 0.1)` | Wizard input focus ring |
| `global.css:768` | `0 0 0 3px rgba(139, 32, 32, 0.12)` | Wizard invalid input focus ring |
| `global.css:1649` | `0 0 0 1px var(--color-primary)` | Gallery card selected ring |
| `StateAtAGlance.astro:297` | `0 1px 2px rgba(0, 0, 0, 0.04)` | Panel drop shadow |

No shadow tokens exist. All four shadows are unique values.

---

## 5. Font-size Audit

**25 distinct font-size values** found in `global.css` with no modular scale relationship:

| Size | Count | Where |
|---|---|---|
| `0.85rem` | 15 | Footer, wizard, callouts, various |
| `0.95rem` | 12 | Body text variants, callouts |
| `0.8rem` | 10 | Meta text, preview, labels |
| `0.9rem` | 8 | Wizard labels, review rows |
| `1rem` | 5 | Base body, buttons |
| `1.5rem` | 5 | h3, wizard section title |
| `0.82rem` | 4 | Preview rows, atg lists |
| `1.75rem` | 3 | Mobile h1, logo |
| `2rem` | 2 | h2 |
| `2.5rem` | 2 | h1, hero h1 |
| `1.25rem` | 2 | h4, atg title |
| `1.15rem` | 2 | Hero subtitle, transform title |
| `1.05rem` | 2 | Wizard section title, flow body h4 |
| `0.88rem` | 2 | Hero privacy, flow body |
| `0.78rem` | 2 | Eyebrow, doc-sheet meta |
| `0.68rem` | 2 | Doc field label, network legend |
| `11px` | 1 | Network core text |
| `9px` | 1 | Network core text (via SVG) |
| `10px` | 1 | Network node text (via SVG) |
| `0.6rem` | 1 | Mobile registration line |
| `0.53rem` | 1 | Mobile registration line |
| `17px` | 1 | Body base (html) |
| `1.55rem` | 1 | Doc sheet title |
| `1.4rem` | 1 | Mobile h1 (480px) |
| `0.65rem` | 1 | Gallery kicker |

The mono labels cluster at 0.65/0.68/0.72/0.78/0.8 — indistinguishable at render size. A modular scale with 6 steps would collapse these to 2 buckets.

---

## 6. Screens That Express the Desired Institutional Direction

### 6.1 Homepage hero + gallery + showcase (`index.astro`)

**Why it works:** The hero-gallery-showcase sequence is the most authored part of the site. The document selector uses a real ARIA radiogroup with roving tabindex. The before→after transformation grid communicates the product value visually. The anatomy list uses bronze top borders as section markers. The network SVG encodes real product relationships. The privacy flow uses numbered steps with bronze rules. No stock imagery, no gradients, no emoji.

**Preserve as visual anchor.**

### 6.2 Certificate of Trust wizard (`CertOfTrustWizard.tsx`)

**Why it works:** The wizard has a labeled progress system with segmented bars, inline validation with aria-invalid, localStorage persistence with visible save status, a structured review step with edit-back links, and a live document preview sidebar. The step labels use specific continue actions ("Continue to settlor") not generic "Next". The mobile sticky action bar keeps Continue reachable.

**Preserve as visual anchor.**

### 6.3 State at-a-glance panel (`StateAtAGlance.astro`)

**Why it works:** The panel is the most honest component on the site — it visibly marks missing data, flags unverified citations, and never invents facts. The shield-with-checkmark seal is custom SVG. The 4-field grid with labels, values, notes, and flags creates a real reference-card aesthetic. The scoped CSS variables keep it self-contained.

**Preserve as visual anchor.**

---

## 7. Screens That Drift Into Generic SaaS or Inconsistent Styles

### 7.1 "Available Trust Documents" section (homepage, lines 357–380)

**Problem:** This section uses `.doc-grid` / `.doc-card` — a plain `auto-fit, minmax(300px,1fr)` card grid with white cards and hover border change. It duplicates content already shown in the hero gallery. Three inline `style` attributes bypass the design system. It reads as a stock template block dropped into an otherwise authored page.

### 7.2 Trust system panels (homepage, lines 383–400)

**Problem:** `.trust-panels-grid` is a plain `auto-fit, minmax(250px,1fr)` grid with top borders only. No bronze accent, no mono kicker, no relationship to the network or blueprint language. Reads as default "three columns of text."

### 7.3 All 50 state pages (template duplication)

**Problem:** Every state page (51 files) has the same structure with inline styles repeated identically: `style="font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: 2rem;"` for the subtitle, `style="display: flex; gap: 1rem; margin-bottom: 2rem;"` for the CTA row, `style="white-space: pre-wrap;"` for each content section. The UTC badge is an inline-styled `<span>` repeated 30+ times. None of these are classes.

### 7.4 All-states directory (`all-states.astro`)

**Problem:** Every state link after California has `style="font-size: 0.9rem;"` inline. UTC badges are inline-styled spans. The directory works functionally but the inline styling makes it unmaintainable.

### 7.5 Proof CTA (homepage)

**Problem:** `.proof-cta` uses `background: var(--color-primary-dark)` — the only dark surface in the main content area. It appears as an isolated dark island in the cream rhythm. Reads as a banner ad dropped into a quiet document.

---

## 8. Missing Interaction States

### Hover states

| Component | Has `:hover`? | Adequate? |
|---|---|---|
| Links (`a`) | ✅ `color: var(--color-accent)` | Yes |
| Buttons (`.btn-primary`) | ✅ Background lightens | Yes |
| Buttons (`.btn-outline`) | ✅ Border darkens, bg fills | Yes |
| Gallery cards | ✅ Border color changes | Yes |
| Doc cards | ✅ Border + bronze top border | Yes, but inconsistent with gallery |
| State directory links | ✅ Border + translateY | Yes |
| Nav links | ✅ Border-bottom appears | Yes |
| Wizard radio labels | ❌ No hover state | **Missing** |
| Wizard review edit | ✅ Color changes | Yes |
| Wizard clear button | ✅ Color changes to error | Yes |

### Focus states

| Component | Has `:focus-visible`? | Adequate? |
|---|---|---|
| Links & buttons | ✅ `2px solid var(--color-primary)` | Yes |
| Header/footer links | ✅ Cream-colored outline | Yes |
| Wizard inputs | ✅ Border + box-shadow ring | Yes |
| Wizard progress labels | ✅ Outline | Yes |
| Gallery cards | ✅ Outline | Yes |
| Certificate preview summary | ✅ Outline | Yes |
| Wizard review edit | ✅ Outline | Yes |
| State directory search input | ❌ No focus-visible override | **Missing** — browser default only |
| State directory links | ❌ No focus-visible override | **Missing** |

### Active states

| Component | Has `:active`? | Notes |
|---|---|---|
| All buttons | ❌ | **Missing** — no pressed/active visual feedback |
| Gallery cards | ❌ | **Missing** — no active state for keyboard activation |

### Disabled states

| Component | Has `:disabled`? | Notes |
|---|---|---|
| Wizard progress labels | ✅ `cursor: default` | Minimal — no visual dimming |
| Wizard buttons | ❌ | **Missing** — Continue button is never disabled during validation |
| Form inputs | ❌ | **Missing** — no disabled state for locked/processed fields |

### Error states

| Component | Has error state? | Notes |
|---|---|---|
| Wizard inputs | ✅ `.wizard-input--invalid` — red border + focus ring | Yes |
| Wizard checkboxes | ✅ `.wizard-checkbox--invalid` — label turns red | Yes |
| Wizard error text | ✅ `.wizard-error` — red, `role="alert"` | Yes |
| PDF generation failure | ❌ | **Missing** — if pdfmake fails to load, no error UI |
| localStorage failure | ✅ | Silent catch — correct behavior |

### Loading states

| Component | Has loading state? | Notes |
|---|---|---|
| PDF generation | ❌ | **Missing** — no spinner or "Generating..." while pdfmake loads/renders |
| Wizard save | ✅ Pulsing dot + "Saving…" text | Yes |
| Font loading | ❌ | **Missing** — FOUT on every navigation, no fallback metrics |

### Empty states

| Component | Has empty state? | Notes |
|---|---|---|
| Wizard review | ✅ | Empty rows filtered out (`.filter(r => r.v.trim() !== '')`) |
| State search | ✅ | `[hidden]` attribute on non-matching states |
| Certificate preview | ✅ | "Not entered yet" for blank fields |
| All-states directory | ❌ | **Missing** — no "no states found" message when search returns nothing |

### Success states

| Component | Has success state? | Notes |
|---|---|---|
| PDF download | ✅ | Checkmark icon + "Your PDF has been downloaded" + cross-link card |
| Wizard save | ✅ | "Saved in this browser" text |

### Mobile states

| Component | Mobile behavior | Notes |
|---|---|---|
| Wizard nav | ✅ Sticky bottom bar with safe-area padding | Good |
| Certificate preview | ✅ Collapses to `<details>` disclosure | Good |
| Hero gallery | ✅ Single column | Good |
| Network figure | ✅ Full width, reduced padding | Good |
| Nav | ✅ Wraps, centered | Good but could be a hamburger menu at <480px |
| Tables (best-states) | ⚠️ Horizontal scroll wrapper | Works but no mobile-optimized layout |

### `prefers-reduced-motion`

| Component | Respects reduced motion? | Notes |
|---|---|---|
| `scroll-behavior: smooth` | ❌ | **Missing** — unconditional on `html` |
| `wizard-pulse` animation | ❌ | **Missing** — no reduced-motion guard |
| `atg-draw` animation | ✅ | Wrapped in `@media (prefers-reduced-motion: no-preference)` |

---

## 9. Texture / Pattern System

### Current state (after 2026-08-19 refactor)

| Pattern | File | Where applied | Opacity | Technique |
|---|---|---|---|---|
| Paper grain | `public/patterns/paper-grain.svg` | Body background | N/A (SVG-inherent) | SVG `feTurbulence` fractalNoise, 4% alpha |
| Registration grid (light) | `public/patterns/reg-grid.svg` | Network figure | 4% | SVG pattern: thin grid lines + crop marks |
| Registration grid (dark) | `public/patterns/reg-grid-dark.svg` | Header, footer | 3–4% | Same as above, bronze on dark green |
| Heraldic pattern (legacy) | `public/patterns/heraldic-pattern*.svg` | **Unused** — no CSS references | — | Repeated shield/key/scroll/seal motifs |

**Assessment:** The new paper grain + registration grid system is aligned with the style guide. The legacy heraldic SVGs should be archived. The `feTurbulence` approach is the right call for body texture — it reads as paper quality, not decoration. The registration grid is used sparingly (header, footer, one figure) which is correct.

---

## 10. Logo and Brand Assets

### Logo files

| File | Format | Purpose |
|---|---|---|
| `public/images/logo/logo.svg` | SVG, forest green | Primary mark — key + scroll |
| `public/images/logo/logo-mark-white.svg` | SVG, white | Header (on green background) |
| `public/images/logo/logo-white.svg` | SVG, white | Footer |
| `public/images/logo/logo-full.svg` | SVG | Full logo with text |
| `public/images/logo/logo-full-white.svg` | SVG | Full logo, white variant |
| `public/favicon.svg` | SVG | Favicon (same as logo.svg) |

**Assessment:** The logo is a custom key-and-scroll mark, not a generic icon. It renders at 48×48 in the header and 44×44 in the footer. The mark is complex — it contains interior detail that may be hard to read at small sizes. The white variant is used on dark backgrounds (header/footer).

---

## 11. Five Highest-Impact Improvements

### 1. Define a modular font-size scale and collapse 25 values to 6

The 25 hardcoded font-sizes are the strongest "machine-iterated, not hand-directed" signal. Define `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-body`, `--fs-small`, `--fs-mono` in `:root` and map every existing declaration to the nearest bucket. The 0.65/0.68/0.72/0.78/0.8 cluster collapses to one `--fs-mono` (≈0.72rem). This is the single highest-leverage cleanup.

### 2. Extract all inline styles into classes and remove the 492 inline `style=` attributes

492 inline style attributes across 51 state pages, the homepage, and the all-states directory. Every one of these bypasses the design system. Create utility classes (`.lede`, `.cta-row`, `.content-prewrap`, `.utc-badge`, `.text-muted`) and replace. This makes the design system enforceable and the pages maintainable.

### 3. Consolidate the four card components into one canonical card system

`.doc-card`, `.gallery-card`, `.document-mini`, and `.cross-link-card` share 80% of their visual DNA but differ in border width, hover treatment, and accent placement. Define one `.card` base with modifiers (`.card--accent-top`, `.card--selectable`, `.card--compact`) and migrate all four. This eliminates the "four different card languages" inconsistency.

### 4. Add missing interaction states (active, disabled, loading, empty, reduced-motion)

The wizard has no loading state during PDF generation. Buttons have no `:active` state. The state search has no empty state. `scroll-behavior: smooth` and `wizard-pulse` don't respect `prefers-reduced-motion`. These are correctness issues, not polish — they affect usability and accessibility compliance.

### 5. Remove the duplicate `.callout` definition and dead CSS

The `.callout` system is defined twice (lines 429–501 and 1490–1521). The `.doc-selector` family (70 lines) and `.process-spine` family (56 lines) are dead CSS — no page references them. Together that's ~200 lines of cruft that makes the stylesheet look LLM-iterated. Consolidate to one callout definition and delete the dead selectors.

---

## 12. Three Best Existing Screens/Components to Preserve as Visual Anchors

### 1. Homepage hero → gallery → showcase flow (`index.astro`)

The outcome-led structure (pick a document → see the before/after → understand the anatomy → act) is the most authored user experience on the site. The ARIA radiogroup, keyboard navigation, and the network SVG are all bespoke. This is the design language to extend, not replace.

### 2. Certificate of Trust wizard (`CertOfTrustWizard.tsx`)

The labeled progress segments, inline validation, localStorage persistence with visible save status, structured review with edit-back links, and the live preview sidebar together form the most complete interaction pattern on the site. The wizard is the product — its visual treatment should be the reference for all future interactive components.

### 3. State at-a-glance panel (`StateAtAGlance.astro`)

The panel's honest treatment of missing data — visibly marking unverified citations, showing "not stated in record" instead of inventing facts — is the ethical posture of the brand made visible. The scoped CSS, custom SVG seal, and 4-field grid layout make it self-contained and reusable. This is the reference for all data-display components.

---

## 13. Decisions Requiring Approval Before Implementation

1. **Font loading strategy:** Self-host subsetted woff2 files (better performance, no Google CDN dependency) vs. keep Google Fonts with `<link rel="preload">` (simpler, no build step). Self-hosting is the right call for an institutional brand but requires adding font files to the repo.

2. **PDF font embedding:** Currently pdfmake uses built-in Helvetica/Times, which don't match the web fonts (Crimson Pro/Inter). Should we bundle Crimson Pro + Inter as VFS files in pdfmake for visual consistency? This adds ~200KB to the bundle.

3. **Proof CTA treatment:** Should the dark `.proof-cta` band be softened to match the cream rhythm (use `--color-primary` with bronze top border instead of `--color-primary-dark`), or is the contrast intentional for conversion?

4. **"Available Trust Documents" section:** Remove it entirely (the hero gallery + showcase already cover the documents) or redesign it to match the gallery language? Removal simplifies the page but may affect SEO.

5. **Mobile navigation:** The current nav wraps to a centered row at 768px. At 480px with 5 nav items, it takes significant vertical space. Should we implement a hamburger/collapsible menu for <480px?

6. **State page template refactor:** Extracting 492 inline styles into classes requires touching all 51 state page files. Should this be done via the `generate-state-pages.mjs` generator (so future regenerations include the classes) or by patching each file directly?

7. **Legacy heraldic pattern SVGs:** Archive (move to `archive/`) or delete from `public/patterns/`? They're unreferenced but someone might expect them to exist.

8. **`--color-accent-light` redundancy:** It's identical to `--color-accent`. Merge into one token or keep the alias for future differentiation?