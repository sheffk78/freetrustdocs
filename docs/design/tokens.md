# FreeTrustDocs — Design Tokens

**Status:** Reference specification
**Applies to:** `site/` (Astro SSG, hand-written CSS custom properties)
**Direction:** *The Clear Guide* — editorial, calm, reassuring

This document is the single source of truth for the visual tokens used across FreeTrustDocs. Every token here is a CSS custom property (`--*`) intended to live in `:root` in `global.css`. Designers and engineers must consume these tokens by name rather than re-hardcoding raw values.

Two operating rules run through every table below:

1. **Where used** — the canonical component or context that consumes the token.
2. **Where NOT used** — the contexts that are explicitly out of scope, to prevent semantic drift (e.g. using a brand color as an error color).

Where the current `global.css` contains a defect or gap, the table lists the **fix** inline and the *Existing* column marks it `—` or `REDUNDANT`.

---

## Table of contents

1. [Principles](#1-principles)
2. [Color — Brand](#2-color--brand)
3. [Color — Neutral](#3-color--neutral)
4. [Color — Semantic](#4-color--semantic)
5. [Interactive states](#5-interactive-states)
6. [Informational & reassurance states](#6-informational--reassurance-states)
7. [Typography — Family](#7-typography--family)
8. [Typography — Size (modular scale)](#8-typography--size-modular-scale)
9. [Typography — Weight, line-height, letter-spacing](#9-typography--weight-line-height-letter-spacing)
10. [Spacing scale](#10-spacing-scale)
11. [Content widths, gutters, grid](#11-content-widths-gutters-grid)
12. [Borders, dividers, focus rings](#12-borders-dividers-focus-rings)
13. [Corner radii](#13-corner-radii)
14. [Shadows & elevation](#14-shadows--elevation)
15. [Layer / z-index](#15-layer--z-index)
16. [Motion](#16-motion)
17. [Responsive breakpoints](#17-responsive-breakpoints)
18. [Migration notes (known issues)](#18-migration-notes-known-issues)

---

## 1. Principles

- **Semantic over raw.** A component references `--color-text-muted`, never `#555`. Raw hex values appear only in `:root`.
- **Compose, don't fork.** Interactive states derive from a base color plus a state modifier; they do not introduce new hues.
- **One modular scale.** All font-sizes are steps on a single 1.200 (minor third) scale rooted at 17px body text. The 25 hardcoded sizes in the current codebase collapse into the steps in §8.
- **Only add a token when it solves a repeatable problem.** Single-use values stay inline with a comment. This is why, for example, we define exactly four shadow tokens — one per elevation tier actually in use.
- **Reassurance over alarm.** *The Clear Guide* prefers muted, editorial tones. Semantic colors are desaturated and never used decoratively.

---

## 2. Color — Brand

The brand palette is a deep forest green (trust, longevity) paired with a muted bronze (civic, ceremonial). Both are intentionally desaturated so they read as editorial rather than corporate.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--color-primary` | `#1a3c34` | ✓ | Primary buttons, links, section accent rules, brand wordmark, progress fill | Body text, error states, large background fills |
| `--color-primary-light` | `#2d5a4e` | ✓ | Hover/active surfaces on primary-colored elements; secondary buttons; subtle primary tints | Headlines (use `--color-text`), borders (use `--color-border`) |
| `--color-primary-dark` | `#0f2620` | ✓ | Pressed state of primary buttons; footer background; high-contrast primary text on cream | Hover backgrounds for body text links (too heavy) |
| `--color-accent` | `#8b6914` | ✓ | Decorative bronze rules, pull-quote bars, "seal" badges, ordinal numbers in steps, small caps eyebrows | Interactive affordances (primary is the action color), error or success semantics |
| `--color-accent-light` | **merge into `--color-accent`** | REDUNDANT (identical `#8b6914`) | — | — |

**Fix — `--color-accent-light`:** remove. It is byte-identical to `--color-accent`. Any reference should be redirected to `--color-accent`. If a lighter bronze is ever needed for a hover tint, introduce it then as `--color-accent-hover` with a derived value (e.g. `#a17f1c`); do not reserve the name speculatively.

---

## 3. Color — Neutral

The neutral ramp is warm (cream-tinted) to match the paper metaphor of *The Clear Guide*. Cool grays are explicitly out of palette.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--color-cream` | `#f8f5ef` | ✓ | Page background, card surfaces, app shell | Text on white (insufficient contrast for muted text) |
| `--color-cream-dark` | `#ede7da` | ✓ | Alternating sections, table zebra rows, inset wells, disabled surfaces | Primary button backgrounds |
| `--color-white` | `#ffffff` | ✓ | Modal/dialog surfaces, input fields, elevated cards on cream, paper metaphor panels | Page background (cream is the page) |
| `--color-text` | `#1a1a1a` | ✓ | Body copy, headings, primary content | Muted/secondary text, disabled text |
| `--color-text-muted` | `#555` | ✓ | Secondary copy, captions, form hints, table secondary cells, breadcrumb text | Headlines, primary CTAs, links |
| `--color-border` | `#d4cfc4` | ✓ | Hairline rules, input borders, card outlines, table cell borders, dividers | Focus rings (use `--color-focus-ring`), heavy structural separators on dark surfaces |

---

## 4. Color — Semantic

Semantic colors signal state, never decoration. They are desaturated to stay calm.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--color-error` | `#8b2020` | ✓ | Inline validation errors, destructive action buttons, required-field asterisks, error banners | Warnings, informational notes, decorative accents |
| `--color-warning` | `#8a6d1a` | **new** | Caution callouts, "review this" flags, soft warnings before an irreversible step | Hard errors (use `--color-error`), success confirmation, brand decoration |
| `--color-info` | `#2d5a7a` | **new** | Informational callouts, "did you know" sidebars, help tooltips, neutral status pills | Error, warning, or success semantics; primary CTAs |
| `--color-success` | `#2a5f3e` | **fix** (was `#1a3c34`, identical to primary) | Success toasts, "document ready" confirmation, completed-step checkmarks, valid-field affordance | Brand/decorative use, primary buttons (use `--color-primary`), hyperlinks |
| `--color-reassurance` | `--color-primary-light` | **new** (alias) | "You're not alone" reassurance banners, trust signals, "we don't store your data" notices | Errors, warnings, or any context that implies risk |

**Fix — `--color-success`:** the current value `#1a3c34` is identical to `--color-primary`, which makes success indistinguishable from brand. Set it to `#2a5f3e` — a distinct, slightly brighter green that reads as "confirmed" without competing with the brand green. `--color-reassurance` is an alias of `--color-primary-light` (not a new hue): it exists so reassurance copy has a semantic name rather than borrowing a brand token, keeping the intent legible at the call site.

---

## 5. Interactive states

State tokens are modifiers applied *on top of* a base color. They are defined once so every interactive surface (buttons, links, inputs, nav items, toggles) shifts identically.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--color-primary-hover` | `--color-primary-light` | **new** | Hover background of primary buttons; hover text color of primary-tinted links | Default state (use `--color-primary`) |
| `--color-primary-pressed` | `--color-primary-dark` | **new** | Active/pressed background of primary buttons | Hover (use `--color-primary-hover`) |
| `--color-accent-hover` | `#a17f1c` | **new** | Hover state of bronze-accented decorative elements (seal badges, step ordinals) | Primary interactive elements |
| `--color-accent-pressed` | `#6f5410` | **new** | Pressed state of accent elements | Hover state |
| `--color-control-bg` | `--color-white` | **new** | Default background of form controls (inputs, selects, checkboxes surface) | Non-form surfaces |
| `--color-control-bg-hover` | `--color-cream-dark` | **new** | Hover background of non-primary controls (selects, toggles, subtle buttons) | Primary buttons |
| `--color-control-bg-disabled` | `--color-cream-dark` | **new** | Background of disabled inputs and buttons | Any enabled control |
| `--color-control-text-disabled` | `#9a958a` | **new** | Text/icon color on disabled controls | Enabled controls; muted but enabled secondary text (use `--color-text-muted`) |
| `--color-link` | `--color-primary` | **new** (alias) | Inline text links | Buttons (use `--color-primary` directly on the button surface) |
| `--color-link-hover` | `--color-primary-dark` | **new** (alias) | Inline link hover/active text color | Headlines, non-link text |
| `--color-focus-ring` | `#2d5a4e` | **new** | Visible focus outline on every focusable element (see §12) | Decorative borders, non-focus outlines |
| `--color-focus-ring-offset` | `--color-cream` | **new** | 2px gap between focus ring and the focused element on cream backgrounds | Focus rings on dark surfaces (use `--color-cream-dark` there) |

**Disabled** is a visual state, not an interaction: disabled controls use `--color-control-bg-disabled` + `--color-control-text-disabled` and **no** focus ring is drawn on them.

---

## 6. Informational & reassurance states

These map to the five callout/note moods used in *The Clear Guide* content. Each pairs a border, a tinted background, and an icon color so callouts are instantly distinguishable without bright, alarming hues.

| Mood | Border token | Background token | Icon/label token | Where used | Where NOT used |
|---|---|---|---|---|---|
| **Informational** | `--color-info` | `--color-info-tint` | `--color-info` | Neutral "note" callouts, help tooltips | Any state implying risk or success |
| **Reassurance** | `--color-reassurance` | `--color-reassurance-tint` | `--color-primary` | "We don't store your data", "You can redo this" notices | Warnings, errors |
| **Warning** | `--color-warning` | `--color-warning-tint` | `--color-warning` | "Review this before continuing", soft cautions | Hard validation errors |
| **Error** | `--color-error` | `--color-error-tint` | `--color-error` | Validation errors, destructive-action warnings | Cautions, informational notes |
| **Success** | `--color-success` | `--color-success-tint` | `--color-success` | "Document ready", completed steps | Brand decoration, primary CTAs |

**Tint tokens** (background fills at ~8–12% opacity of the semantic color, blended onto cream):

| Token | Value | Existing |
|---|---|---|
| `--color-info-tint` | `#eef2f6` | **new** |
| `--color-reassurance-tint` | `#eef3f0` | **new** |
| `--color-warning-tint` | `#f4efe2` | **new** |
| `--color-error-tint` | `#f3e6e6` | **new** |
| `--color-success-tint` | `#eef3ee` | **new** |

These tints are the **only** place a semantic color is used as a background. Never use a full-saturation semantic color as a large fill — it breaks the calm editorial tone.

---

## 7. Typography — Family

Three families, each with a single defined role. No family is used outside its role.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--font-heading` | `'Crimson Pro', serif` | ✓ | All headings (display, h2, h3, h4), pull-quotes, large editorial numerals | Body copy, UI labels, form controls, code |
| `--font-body` | `'Inter', sans-serif` | ✓ | Body copy, UI labels, buttons, form controls, navigation, captions | Headings (use `--font-heading`), code (use `--font-mono`) |
| `--font-mono` | `'JetBrains Mono', monospace` | ✓ | Code blocks, inline code, document-field keys, legal citations, keyboard hints | Headings, prose body, UI labels |

---

## 8. Typography — Size (modular scale)

**Fix — collapse 25 hardcoded sizes to a single modular scale.** The current `global.css` declares 7 named size tokens but components hardcode ~25 distinct `font-size` values. We replace all of them with a minor-third (ratio **1.200**) scale rooted at a **17px body base** (the actual current body size, which was previously off-scale at `1rem`).

Scale formula: `round(17px × 1.2^n)`.

| Token | rem (16px root) | px | Existing | Where used | Where NOT used |
|---|---|---|---|---|---|
| `--fs-3xs` | `0.72rem` | 12px | was `--fs-mono` | Inline code, keyboard hints, footnote markers, tiny legal | Body copy, UI labels |
| `--fs-2xs` | `0.85rem` | 14px | was `--fs-small` | Captions, table secondary cells, breadcrumbs, form hints | Headings, primary body |
| `--fs-xs` | `1.0625rem` | 17px→ **scale root** | **new** | **Body base.** All body copy, UI labels, form controls, buttons, nav | Headings (use scale steps above) |
| `--fs-sm` | `1.25rem` | 20px | **new** | Lead paragraphs, intro copy under section headers, card subheadings | Body copy, display headings |
| `--fs-md` | `1.5rem` | 24px | was `--fs-h3` | h4 within articles, sidebar headings, card titles | Body copy |
| `--fs-lg` | `1.75rem` | 28px | **new** | h3, major card headers, step-group titles | Body copy, small UI labels |
| `--fs-xl` | `2rem` | 32px | was `--fs-h2` | h2, section openers | Inline text, captions |
| `--fs-2xl` | `2.5rem` | 40px | was `--fs-display` | h1 / display, hero title | Anything below page-hero tier |
| `--fs-3xl` | `3rem` | 48px | **new** | Reserved: marketing hero only (not currently used in-app) | Article headings, UI labels |

**Scale integrity rule:** any `font-size` declaration in component CSS must reference one of these tokens. The prior aliases (`--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-h4`, `--fs-body`, `--fs-small`, `--fs-mono`) are kept as **deprecated aliases** mapping to the new scale during migration, then removed. Mapping:

| Old alias | New token |
|---|---|
| `--fs-display` (2.5rem) | `--fs-2xl` |
| `--fs-h2` (2rem) | `--fs-xl` |
| `--fs-h3` (1.5rem) | `--fs-md` |
| `--fs-h4` (1.25rem) | `--fs-sm` *(note: 1.25rem on a 16px root = 20px, matches `--fs-sm`)* |
| `--fs-body` (1rem) | `--fs-xs` *(17px, the real body base)* |
| `--fs-small` (0.85rem) | `--fs-2xs` |
| `--fs-mono` (0.72rem) | `--fs-3xs` |

**Body base is 17px, not 16px.** Because the scale root is 17px but CSS `rem` is rooted at the browser 16px, the `rem` values above are the `px/16` equivalents. This is why `--fs-xs` is `1.0625rem` (17px). Setting `:root { font-size: 16px; }` and using `--fs-xs` for body keeps `rem`-based spacing predictable while honoring the 17px editorial body size.

---

## 9. Typography — Weight, line-height, letter-spacing

No weight or line-height tokens currently exist. These are introduced to keep the editorial rhythm consistent.

### Weight

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--fw-regular` | `400` | **new** | Body copy, captions, form labels (default) | Headings (use `--fw-semibold` or `--fw-bold`) |
| `--fw-medium` | `500` | **new** | Buttons, nav items, table headers, small-caps eyebrows | Long body paragraphs (use `--fw-regular`) |
| `--fw-semibold` | `600` | **new** | h3, h4, card titles, form section headers | Display headings (use `--fw-bold`) |
| `--fw-bold` | `700` | **new** | h1 / display, h2, pull-quote attribution | Body copy, UI labels |

### Line-height

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--lh-tight` | `1.15` | **new** | Display/h1, h2 | Body copy (too tight for readability) |
| `--lh-snug` | `1.3` | **new** | h3, h4, card titles, lead paragraphs | Long body paragraphs |
| `--lh-body` | `1.6` | **new** | Body copy, list items, form labels | Headings (too loose) |
| `--lh-loose` | `1.75` | **new** | Long-form legal/prose blocks, footnotes, "about" copy | Headlines, UI labels |

### Letter-spacing

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--ls-tight` | `-0.01em` | **new** | Display/h1, h2 (Crimson Pro at large sizes) | Body copy, small UI text |
| `--ls-normal` | `0` | **new** | Body copy, headings h3/h4, form text (default) | Small-caps eyebrows |
| `--ls-wide` | `0.08em` | **new** | Small-caps eyebrows, overlines, table column headers, button labels in caps | Body copy, large headings |

---

## 10. Spacing scale

The existing scale is kept unchanged — it is already a clean 4px-rooted progression and serves the whole system. No new steps are added.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--space-xs` | `0.25rem` (4px) | ✓ | Inline gaps (icon↔label), tight field padding, list item internal spacing | Section gaps, page margins |
| `--space-sm` | `0.5rem` (8px) | ✓ | Input internal padding, button vertical padding, small card padding, row gaps in dense tables | Between major components |
| `--space-md` | `1rem` (16px) | ✓ | Default component padding, form field gaps, card padding, paragraph spacing | Inline text spacing (use `--space-xs`/`--space-sm`) |
| `--space-lg` | `1.5rem` (24px) | ✓ | Between cards, section sub-block gaps, input group spacing | Inline icon gaps |
| `--space-xl` | `2.5rem` (40px) | ✓ | Between major page sections, pre-footer spacing, article section gaps | Component-internal padding |
| `--space-2xl` | `4rem` (64px) | ✓ | Top/bottom of page sections on desktop, hero padding | Inline or component-internal |
| `--space-3xl` | `6rem` (96px) | ✓ | Page top/bottom breathing room, hero vertical rhythm on desktop | Anything below the section tier |

**Rule:** spacing values not on this scale are not permitted in component CSS. If a one-off is genuinely needed, add a token rather than hardcoding.

---

## 11. Content widths, gutters, grid

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--max-width` | `1100px` | ✓ | Default reading/layout width for most pages | Long-form legal docs (use `--max-width-narrow`), full-bleed marketing |
| `--max-width-narrow` | `720px` | ✓ | Long-form article body, legal document text, step-by-step guided flows, modals | Multi-column layouts, dashboards |
| `--max-width-wide` | `1280px` | **new** | App shell, dashboard, two-column "guidance + form" layouts | Article reading column |
| `--gutter` | `1.5rem` (24px) | **new** | Horizontal page margin at ≥720px viewport; space between grid columns | Vertical rhythm (use spacing scale) |
| `--gutter-sm` | `1rem` (16px) | **new** | Horizontal page margin below 720px viewport | Desktop gutters |
| `--grid-cols` | `12` | **new** | Base column count for the page grid (used in `grid-template-columns: repeat(var(--grid-cols), 1fr)`) | Simple reading layouts (use `--max-width-narrow` directly) |
| `--grid-gap` | `--space-lg` | **new** (alias) | Gap between grid columns | Vertical section gaps (use `--space-xl`) |

`--max-width-wide` is the only width token added: the current two-column guidance+form layout in the app has no defined width and falls back to ad-hoc values. `--gutter` / `--gutter-sm` formalize the responsive page margin, which is currently hardcoded per-layout.

---

## 12. Borders, dividers, focus rings

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--color-border` | `#d4cfc4` | ✓ | Hairline rules, input borders, card outlines, table cell borders | Focus rings, strong separators on dark surfaces |
| `--border-width` | `1px` | **new** | Default border thickness for all hairline borders, inputs, dividers | Decorative heavy rules (use `--border-width-strong`) |
| `--border-width-strong` | `2px` | **new** | Accent rules under section headers, pull-quote bars, active nav indicator | Default hairlines (use `--border-width`) |
| `--border-radius` | `4px` | ✓ | Default corner radius for cards, inputs, buttons, callouts | Pill-shaped controls (use `--border-radius-pill`) |
| `--border-radius-sm` | `2px` | **new** | Inline code chips, tags, small badges, table cell highlights | Cards, inputs, buttons (use `--border-radius`) |
| `--border-radius-pill` | `999px` | **new** | Status pills, filter chips, toggle tracks | Cards, inputs (use `--border-radius`) |
| `--color-focus-ring` | `#2d5a4e` | **new** | Visible focus outline on every focusable element | Decorative borders, non-focus outlines |
| `--focus-ring-width` | `3px` | **new** | Thickness of the focus outline | Any non-focus border |
| `--focus-ring-offset` | `2px` | **new** | Gap between the focused element and its ring | — |
| `--color-focus-ring-offset` | `--color-cream` | **new** | Ring gap fill color on cream backgrounds (so the gap reads as background, not as a second ring) | Dark-surface focus (use `--color-cream-dark`) |

**Focus ring contract:** every focusable element must show `outline: var(--focus-ring-width) solid var(--color-focus-ring); outline-offset: var(--focus-ring-offset);` on `:focus-visible`. The ring is **never** removed without a replacement visible focus style. Disabled and non-interactive elements do not draw a ring.

**Divider vs. border:** a *border* is structural (around a card, an input). A *divider* is a horizontal rule separating content within a column. Dividers use `--color-border` + `--border-width` and span the full content width; they are not the same as a card outline.

---

## 13. Corner radii

Consolidated from §12 for quick reference. The current single `--border-radius: 4px` is retained as the default; two additions cover real, repeated shapes (small chips and pills) that are currently hardcoded.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--border-radius-sm` | `2px` | **new** | Inline code chips, tags, badges, table highlights | Cards, inputs, buttons |
| `--border-radius` | `4px` | ✓ | Cards, inputs, buttons, callouts, modals | Pills, chips |
| `--border-radius-pill` | `999px` | **new** | Status pills, filter chips, toggle tracks | Cards, inputs |

No large/rounded radius token is defined: *The Clear Guide* is editorial and square-ish; 4px is the ceiling for structural surfaces. If a future marketing surface needs a larger radius, add it then.

---

## 14. Shadows & elevation

**Fix — no shadow tokens exist; 4 distinct shadows are hardcoded across components.** We define exactly four elevation tiers, one per real use. The shadows are soft and low-offset to stay calm.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--shadow-none` | `none` | **new** | Default — flat editorial surfaces, cards on cream, section blocks | Anything that should read as elevated |
| `--shadow-sm` | `0 1px 2px rgba(15, 38, 32, 0.08)` | **new** | Inputs on focus, subtle cards, sticky sub-headers, dropdown menus | Modals, hover-lifted cards (use `--shadow-md`) |
| `--shadow-md` | `0 2px 8px rgba(15, 38, 32, 0.12)` | **new** | Hovered cards, elevated panels, popovers, tooltips | Modals (use `--shadow-lg`), default surfaces |
| `--shadow-lg` | `0 8px 24px rgba(15, 38, 32, 0.16)` | **new** | Modals, dialogs, full-screen overlays | Inline cards, inputs |

**Rules:**
- Shadows use the primary-dark hue (`rgba(15, 38, 32, …)`) at low alpha, never pure black — pure black shadows clash with the warm cream background.
- A surface uses exactly one tier at a time; tiers are not combined.
- Elevation is not used decoratively. `--shadow-md` and `--shadow-lg` imply interaction (a card you can hover-lift, a dialog that floats). Static content stays at `--shadow-none`.

---

## 15. Layer / z-index

**Fix — no z-index scale exists.** Components currently use ad-hoc `z-index` values. We define a fixed 6-tier scale.

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--z-base` | `0` | **new** | Default stacking context for all in-flow content | Anything that must overlay |
| `--z-raised` | `10` | **new** | Sticky headers, sticky sub-nav, hover-lifted cards while hovered | Modals, dropdowns |
| `--z-dropdown` | `100` | **new** | Dropdown menus, popovers, tooltips, autocomplete lists | Modals, the sticky header (use `--z-raised`) |
| `--z-overlay` | `500` | **new** | Modal/dialog backdrops, full-screen guidance overlays | Dropdowns (they sit inside an overlay if one is open) |
| `--z-modal` | `1000` | **new** | Modal/dialog content, full-screen overlay content | Non-modal UI |
| `--z-toast` | `1100` | **new** | Toast/success notifications, transient banners | Modals (toasts appear above modals only when explicitly global) |

**Rules:**
- Use tokens, never raw integers.
- A new stacking context is created only when needed (`position: fixed/sticky`, or an explicit `z-index` on a positioned element). Do not sprinkle `z-index` on statically-positioned elements.
- `--z-toast` is the only tier permitted above `--z-modal`. If a toast must not cover a modal, scope it to the modal's stacking context instead of lowering the token.

---

## 16. Motion

| Token | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--transition` | `150ms ease` | ✓ | Default micro-interactions: hover/active color and background changes, border toggles, small displacements | Large layout transitions (use `--transition-slow`) |
| `--transition-slow` | `250ms ease` | **new** | Modal open/close, overlay fades, accordion expand, large panel transitions | Color hover states (use `--transition`) |
| `--transition-fast` | `75ms ease` | **new** | Focus ring appearance, tooltip show, instant feedback micro-states | Anything the user might miss at 75ms |

**Reduced motion:** all transitions must be wrapped by `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; } }` in `global.css`. The token values remain; they are zeroed for users who request reduced motion. This is a contract, not a token.

---

## 17. Responsive breakpoints

Breakpoints are defined as min-width (mobile-first). They are **not** emitted as CSS custom properties (breakpoints do not work inside `@media` queries in standard CSS); they are documented here as the canonical values to use in `@media (min-width: …)`.

| Token (reference name) | Value | Existing | Where used | Where NOT used |
|---|---|---|---|---|
| `--bp-sm` (reference) | `480px` | **new** | Small phone → large phone adjustments (gutter, single-column lockup tweaks) | Desktop layouts |
| `--bp-md` (reference) | `720px` | **new** | Phone → tablet; switch `--gutter-sm` → `--gutter`; introduce two-column guidance+form | Desktop-only features |
| `--bp-lg` (reference) | `1024px` | **new** | Tablet → desktop; full 12-column grid available, `--max-width` reading column, side navigation visible | Phone-specific layouts |
| `--bp-xl` (reference) | `1280px` | **new** | Desktop → wide desktop; switch `--max-width` → `--max-width-wide` for app shell layouts | Reading column (stays at `--max-width`/`--max-width-narrow`) |

**Rules:**
- Mobile-first: write base styles for the smallest viewport, then add `min-width` overrides.
- `--bp-md` (720px) is the primary breakpoint and aligns with `--max-width-narrow` — below it, single-column; at/above it, the editorial two-column layout is available.
- Do not invent intermediate breakpoints. If a layout needs one, the layout is too brittle; redesign at the nearest canonical breakpoint.

---

## 18. Migration notes (known issues)

Each known issue from the current `global.css`, with the resolution encoded above:

| Issue | Resolution | Section |
|---|---|---|
| 25 distinct hardcoded `font-size` values | Collapse to a single 1.200 modular scale rooted at 17px body (`--fs-xs`). Old `--fs-*` aliases map to new scale tokens and are removed after migration. | §8 |
| `--color-accent-light` redundant (identical to `--color-accent`) | Remove the token; redirect all references to `--color-accent`. Introduce `--color-accent-hover` only if a real hover tint is needed. | §2, §5 |
| `--color-success` redundant (identical to `--color-primary`) | Set `--color-success: #2a5f3e` — a distinct green so success reads as "confirmed", not brand. | §4 |
| No shadow tokens (4 hardcoded shadows) | Define `--shadow-none/sm/md/lg`, one per real elevation tier. Use primary-dark-tinted shadows, not pure black. | §14 |
| No z-index scale | Define `--z-base/raised/dropdown/overlay/modal/toast`. | §15 |
| No line-height tokens | Define `--lh-tight/snug/body/loose`. | §9 |
| No focus-ring token | Define `--color-focus-ring`, `--focus-ring-width`, `--focus-ring-offset`, `--color-focus-ring-offset`, with a `:focus-visible` contract. | §5, §12 |
| Body base is 17px (off the 16px-rem scale) | Make 17px the scale root: `--fs-xs: 1.0625rem` (17px at 16px root). Body copy uses `--fs-xs`. | §8 |

### Migration order

1. **Colors first.** Fix `--color-success`, remove `--color-accent-light`, add semantic + state + tint tokens. This is low-risk and unblocks callout components.
2. **Type scale.** Add the new `--fs-*` tokens, add the alias mappings, sweep component CSS for hardcoded `font-size` values and replace with tokens, then remove aliases.
3. **Line-height, weight, letter-spacing.** Add tokens; sweep headings and body.
4. **Shadows, z-index, focus ring.** Add tokens; sweep hardcoded `box-shadow`, `z-index`, and `outline`/`:focus` rules.
5. **Widths, gutters, breakpoints.** Add `--max-width-wide`, `--gutter*`, document breakpoints; normalize page margins.
6. **Motion.** Add `--transition-fast/slow`; add the reduced-motion media query.

Each step is independently shippable. No step depends on a later one.