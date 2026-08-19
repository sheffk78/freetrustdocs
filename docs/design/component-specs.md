# FreeTrustDocs — Component Specifications

**Direction:** The Clear Guide (approved August 19, 2026)
**Date:** August 19, 2026
**Status:** Canonical reference for all FreeTrustDocs components

---

## How to Read This Document

Each component is specified with: purpose, user problem solved, when to use, when not to use, anatomy, variants, content rules, interaction states, responsive behavior, accessibility requirements, and source file location.

Components are grouped by function. All components must use tokens from `tokens.md` — no hardcoded values.

---

## 1. Buttons

### Primary Button

| Field | Value |
|---|---|
| **Purpose** | The single most important action on a page or step |
| **User problem** | "What should I do next?" |
| **When to use** | One per page or wizard step — the primary action |
| **When not to use** | Secondary actions, navigation back, or when another primary button already exists on the same screen |
| **Source** | `.btn.btn-primary` in `global.css` |

**Anatomy:** Forest green background, cream text, 4px radius, `0.5rem 1.5rem` padding, Inter 400 weight, 1rem font-size.

**Variants:**
- `.btn-lg`: Larger padding (`0.75rem 2rem`), 1.1rem font-size — hero CTA only

**States:**
| State | Visual | Token |
|---|---|---|
| Default | `--color-primary` bg, `--color-cream` text | — |
| Hover | `--color-primary-light` bg | `--transition` |
| Pressed | translateY(1px) | — |
| Focus | `2px solid --color-primary`, offset 2px | `--focus-ring` |
| Disabled | opacity 0.5, cursor not-allowed | — |
| Loading | Same as disabled + pulsing dot prefix | — |

**Content rules:** Action verb + object. "Start Certificate of Trust" not "Click Here." Sentence case, not title case.

**Accessibility:** Minimum 44px tap target on mobile. `aria-disabled` when disabled. Focus ring visible at all times.

### Secondary (Outline) Button

Same anatomy as primary but: transparent background, `--color-primary` text, `--color-border` border. Hover: border shifts to `--color-primary`, background fills to `--color-cream-dark`. Used for "Back" in wizard, "Learn more" links, secondary CTAs.

### Quiet Link-Button

No border, no background. Underlined text link in `--color-primary`. Hover: `--color-accent`. Used for "Back" in wizard when space is tight, "Edit" links in review step, and inline actions.

### Destructive Button

| Field | Value |
|---|---|
| **Purpose** | Irreversible destructive action (clear all answers, delete saved document) |
| **When to use** | Only in confirmation dialogs or clear/reset actions |
| **When not to use** | Navigation, secondary actions, or anything recoverable |

**Anatomy:** `--color-error` (#8b2020) text, `--color-error` border, transparent background. Hover: light error-tinted fill. Never a red solid fill — red borders + text signal danger without being alarming.

---

## 2. Links

### Text Link

Inline link in body copy. `--color-primary`, underline, 2px offset. Hover: `--color-accent`. Focus: `2px solid --color-primary` outline.

### Inline Legal Link

Links to legal pages (disclaimer, terms, privacy) within body copy or disclaimers. Same as text link but `--font-mono`, `--fs-mono`, no underline (style distinguishes from content links). Hover: `--color-accent` + underline appears.

### Footer Link

Cream text on dark green. No underline. Hover: `--color-accent`, underline appears. Focus: cream-colored outline (2px).

---

## 3. Header, Navigation, Footer

### Site Header

| Field | Value |
|---|---|
| **Purpose** | Brand identification + primary navigation |
| **Source** | `Base.astro` header element |

**Anatomy:** Forest green (`--color-primary`) background. Bronze (`--color-accent`) 3px bottom border. Subtle registration-grid pattern at 4% opacity. Logo (48px mark + Crimson Pro wordmark) left, nav links right.

**Nav links:** Inter `--fs-small`, cream text, no underline. Hover: bronze underline appears (1px). Active page: persistent bronze underline. Focus: cream outline.

**Mobile:** Hamburger toggle (already implemented). Nav collapses to vertical list below 768px. Button has `aria-expanded` and `aria-controls`.

### Site Footer

Dark green (`--color-primary-dark`) background. Bronze 3px top border. Registration-grid pattern at 3% opacity. 4-column grid: brand + description, Documents, Resources, Legal. Footer disclaimer at bottom — bold UPL statement + two-sentence explanation.

**Content rules:** Footer disclaimer is mandatory on every page. Exact text: "FreeTrustDocs.com is not a law firm and does not provide legal advice." + standard explanation. Never modified per-page.

---

## 4. Document Cards

### Document Type Card

| Field | Value |
|---|---|
| **Purpose** | Present a document type for selection on homepage or library page |
| **User problem** | "Which document do I need?" |
| **When to use** | Homepage document grid, document library page |
| **When not to use** | Inside the wizard flow (use radio cards instead), or when comparing documents (use document rows) |
| **Source** | Replace `.doc-card`, `.gallery-card`, `.document-mini` with unified `.doc-type-card` |

**Anatomy:** White surface, 1px `--color-border`, 4px radius, 1.5rem padding. Structure:
1. Mono kicker (uppercase, `--fs-mono`, `--color-primary`) — document category
2. H3 title (Crimson Pro, `--fs-h3`) — document name
3. Body description (Inter, `--fs-body`) — plain-language explanation, 1-2 sentences
4. Metadata row (Inter `--fs-small`, muted) — questions count, time estimate, statute citation
5. "Last reviewed" stamp (JetBrains Mono, `--fs-mono`, muted) — date
6. Line icon (1.5px stroke, forest green) — document/shield/lock icon positioned top-right
7. "Start →" text link — right-aligned, `--color-primary`

**States:**
| State | Visual |
|---|---|
| Default | White bg, 1px border |
| Hover | Border → `--color-primary`, translateY(-1px), `--shadow-card` |
| Focus | `--focus-ring` outline |
| Selected | 2px `--color-primary` border |

**Content rules:** Description must be plain language first. "Prove your trust exists to banks and title companies" not "Certification of trust pursuant to UTC §1013." Statute citation goes in metadata, not in the description.

### Document Library Row

Alternative to cards when users are comparing documents. Horizontal layout with registration-line dividers between rows. Each row: title (H3), description, metadata, "Start →" link. Hover: row background shifts to `--color-cream-dark`.

---

## 5. Progress Stepper

### Wizard Progress

| Field | Value |
|---|---|
| **Purpose** | Show the user where they are in the document generation flow |
| **User problem** | "How much longer? Am I almost done?" |
| **When to use** | Every multi-step wizard — Certificate of Trust, Declaration of Trust, Land Trust |
| **When not to use** | Single-step forms or non-linear content |
| **Source** | `.wizard-progress` family in `global.css` — preserve existing pattern |

**Anatomy (dual indicator — approved):**
1. Text label: "Step 2 of 5" in JetBrains Mono, uppercase, `--color-primary`
2. Progress bar: Segmented (one segment per step). Complete = `--color-primary`. Current = `--color-accent`. Incomplete = `--color-border`. 4px height, 4px gap, 2px radius per segment.
3. Step labels: Clickable text labels below the bar, showing step names. Completed steps: `--color-primary`. Current: `--color-primary-dark`, bold, with bronze underline. Incomplete: `--color-text-muted`.

**Interaction:** Clicking a completed step navigates back. Clicking the current step does nothing. Clicking incomplete steps does nothing (not disabled — just no-op, to avoid cluttered disabled states). Only safe backward navigation allowed.

**Accessibility:** `aria-current="step"` on current step. `aria-label` on the progress container: "Step 2 of 5: Settlor Information." Step labels are `<button>` elements with `aria-disabled` on incomplete steps.

---

## 6. Form Controls

### Text Input

| Field | Value |
|---|---|
| **Source** | `.wizard-input` in `global.css` |
| **When to use** | Free-text answers in the wizard (names, addresses, trust names) |

**Anatomy:** Full width, `--space-sm` `--space-md` padding, Inter `--fs-body`, 1px `--color-border`, 4px radius, white background. Label is ALWAYS visible above the input (never placeholder-as-label). Helper text below input in `--fs-small`, `--color-text-muted`.

**States:**
| State | Visual |
|---|---|
| Default | White bg, `--color-border` border |
| Focus | `--color-primary` border, `0 0 0 3px rgba(26,60,52,0.1)` ring |
| Invalid | `--color-error` border, `0 0 0 3px rgba(139,32,32,0.12)` ring, error text below |
| Disabled | opacity 0.6, `not-allowed` cursor |

**Content rules:** Placeholder shows an example, not a label. "e.g., John Smith" — not "Enter your name." Helper text explains what the field is for or why it's needed.

### Select Dropdown

Same anatomy as text input. Trigger shows selected value or "Select…" placeholder. Uses native `<select>` for accessibility. `accent-color: --color-primary` on the dropdown arrow.

### Radio Group (as cards)

| Field | Value |
|---|---|
| **Source** | `.wizard-radio-label` in `global.css` |
| **When to use** | Choice between 2-4 options (Revocable/Irrevocable, Yes/No, General/Specific) |

**Anatomy:** Each option is a full-width card: 1px border, 4px radius, `--space-sm` `--space-md` padding, label + one-line description. Selected: 2px `--color-primary` border, subtle green-tinted background. Unselected: 1px `--color-border`.

**Interaction:** Hover on unselected: border → `--color-primary-light`. Click selects. Keyboard: Tab to group, arrow keys to move between options.

**Accessibility:** `role="radiogroup"`, `aria-label` with question text. Each option is `role="radio"` with `aria-checked`. Roving tabindex.

### Checkbox Group

Standard checkboxes with `accent-color: --color-primary`. Label always visible to the right. Helper text below the group. Invalid state: label turns `--color-error`.

### Checkbox (Acknowledgment)

Special variant for UPL acknowledgment before download. Larger tap target (min 48px), label in `--fs-body` (not small), with helper text explaining what the user is acknowledging. Must be a real `<input type="checkbox">`, not a styled div.

---

## 7. Callouts and Notices

### Callout (Educational)

| Field | Value |
|---|---|
| **Purpose** | Provide contextual education, tips, or important notes within content |
| **Source** | `.callout` + variants in `global.css` — consolidate duplicate definitions |

**Anatomy:** Left accent bar (3px), `--color-cream-dark` background, 4px radius (right side only). Label in Crimson Pro, uppercase, small-caps. Body in Inter, `--fs-small`, muted color.

**Variants:**
| Variant | Bar color | Use for |
|---|---|---|
| Info | `--color-primary` | Neutral explanation, context |
| Tip | `--color-primary-light` | Helpful guidance, best practice |
| Warning | `--color-accent` | Cautions, things to verify |
| Important | `--color-primary-dark` | Critical context that affects the decision |

**When not to use:** For legal disclaimers (use `.upl-notice`). For errors (use validation error pattern). For marketing content (use body copy).

### UPL Notice

| Field | Value |
|---|---|
| **Purpose** | "Not legal advice" disclaimers |
| **Source** | `.upl-notice` in `global.css` |

**Anatomy:** `--color-cream-dark` background, 3px bronze (`--color-accent`) left border, 4px radius (right side). `--fs-small` text, `--color-text-muted` body, `--color-primary-dark` bold text.

**Placement rules:** Must appear (1) in footer on every page, (2) on a dedicated `/legal/disclaimer` page, (3) as checkbox gate before PDF download, (4) as final page in generated PDF. Never alarming — bronze accent, never red.

### Validation Error

| Field | Value |
|---|---|
| **Purpose** | Tell the user what went wrong and how to fix it |
| **Source** | `.wizard-error` in `global.css` |

**Anatomy:** `--color-error` text, `--fs-small`, `role="alert"`, positioned directly below the invalid field. Prefixed with nothing (no "Error:" label needed if the message is clear).

**Content rules:** Say what happened AND how to fix it. "Trust name is required — enter the full name of your trust." Not "Error: field required." Not "Please fix this field."

---

## 8. Document Preview

### Document Preview Card

| Field | Value |
|---|---|
| **Purpose** | Show the user what their finished document will look like |
| **User problem** | "What am I going to get?" |
| **When to use** | In the wizard (live preview sidebar on desktop, collapsible `<details>` on mobile), on document landing pages |
| **Source** | Replace `.doc-sheet`, `.gallery-card-sheet`, `.certificate-preview-doc` with unified `.doc-preview` |

**Anatomy:** White card, 1px `--color-border`, 4px radius, `--shadow-card`. Content rendered as styled HTML showing:
1. Document title in Crimson Pro, centered
2. Subtitle/preamble in Inter, muted
3. Field labels in JetBrains Mono, `--fs-mono`, muted
4. Field values in Inter, `--fs-body` — either filled (user input) or showing a thin underline for empty fields
5. Section/article markers
6. Signature block placeholder

**Responsive:** Desktop: sticky sidebar alongside wizard. Mobile: collapsible `<details>` element below the current step, summary text "Preview your document."

**Content rules:** Preview shows real user input as it's entered. Empty fields show as blank lines (underline only), never as "Lorem ipsum" or placeholder text. The preview IS the document — no mockups or fake content.

---

## 9. Review and Confirm

### Review Panel

| Field | Value |
|---|---|
| **Purpose** | Let the user verify all answers before generating the document |
| **Source** | `.wizard-review` family in `global.css` — preserve existing pattern |

**Anatomy:** Grouped by section (Trust Information, Parties, Governing Law). Each group: header bar (`--color-cream-dark` bg, section name in `--color-primary-dark` bold, "Edit" link on right). Rows: label (muted, `--fs-small`) + value (`--color-primary-dark`, bold), separated by 1px dashed border.

**Interaction:** "Edit" link navigates back to the relevant wizard step. Values update when the user returns. Empty values are filtered out (not shown as blank rows).

**Accessibility:** Review groups use `<dl>` (definition list) semantics. "Edit" links have `aria-label` with the section name: "Edit trust information."

---

## 10. Download and Completion

### Download Success State

| Field | Value |
|---|---|
| **Purpose** | Confirm the document is ready and guide next steps |
| **When to use** | After PDF generation completes successfully |

**Anatomy:**
1. H2 "Your document is ready" in Crimson Pro, centered
2. Checkmark line icon (forest green, 24px) above the heading
3. Document summary line: "Certificate of Trust | California | Generated [date]" in JetBrains Mono, muted
4. Download button (primary) — "Download PDF"
5. TrustMinutes cross-link card (subtle, approved prominence): white card, 1px border, "Keep your trust records organized — try TrustMinutes, free" + link
6. "Create another document" quiet link

**Loading state:** While pdfmake generates: button shows "Generating…" with pulsing dot, disabled. No full-screen spinner.

**Error state:** If generation fails: "Something went wrong creating your PDF. Your answers are saved — try downloading again." + retry button. Error details in collapsed `<details>` for debugging.

---

## 11. FAQ and Accordion

### FAQ Accordion

| Field | Value |
|---|---|
| **Purpose** | Answer common questions without overwhelming the page |
| **When to use** | Homepage FAQ section, document landing pages, guide pages |

**Anatomy:** Native `<details>` / `<summary>` elements. Summary: Inter `--fs-body`, `--color-primary-dark`, bold, no marker (custom triangle indicator). Content: Inter `--fs-body`, normal weight, `--space-md` padding.

**Interaction:** Click summary to toggle. `aria-expanded` via native `<details>` semantics. Only one open at a time is NOT enforced — users can open multiple.

**Styling:** Open summary has a bronze bottom border (1px). Closed: no border. No card or background — the accordion is inline in the page, not boxed.

---

## 12. Trust and Credibility Markers

### Statute Citation

| Field | Value |
|---|---|
| **Purpose** | Show that a document template is based on real law |
| **When to use** | Document cards (metadata row), document landing pages, trust/proof section |

**Anatomy:** JetBrains Mono, `--fs-mono`, `--color-accent` (bronze). Format: "UTC §1013" or "Prob. Code §18100.5" — real statute references.

**Content rules:** Only cite statutes that have been verified in the research files. Never cite a statute that hasn't been checked. The citation is a promise — it must be true.

### "Last Reviewed" Date Stamp

JetBrains Mono, `--fs-mono`, `--color-text-muted`. Format: "Last reviewed 2026-08-18." Placed on document cards and in the trust/proof section. Requires a maintenance process to update.

### Privacy Statement

Inline on homepage trust section, repeated on `/legal/privacy`. Short version: "Nothing leaves your browser. Your answers are never sent to a server." Full version on privacy page. Bronze accent, never alarmist.

---

## 13. Tables and Structured Lists

### Data Table

| Field | Value |
|---|---|
| **Source** | `.table` in `global.css` |
| **When to use** | State comparison tables, statute reference tables, best-states-for-trusts |

**Anatomy:** `--color-primary` header row with cream text. Body rows: alternating cream/white stripes. 1px `--color-border` row separators. `--fs-small` throughout. `font-feature-settings: "tnum"` on all numeric cells.

**Responsive:** On mobile, wrap in horizontal scroll container. Never let table break the viewport. Consider a card-list alternative for 3+ column tables on mobile.

### Structured List

Alternative to tables for simple key-value pairs. `<dl>` semantics. Label (dt) in muted, `--fs-small`. Value (dd) in `--color-primary-dark`, `--fs-body`. 1px dashed border between items. Used in StateAtAGlance panel and review step.

---

## 14. States (Empty, Loading, Error, Success, Saved)

### Empty State

| Context | Message |
|---|---|
| State search no results | "No states found. Try a different search term." |
| Saved documents (future) | "You haven't created any documents yet. [Start a document →]" |

**Anatomy:** Centered text, `--color-text-muted`, `--fs-body`, with a quiet link to the primary action. No illustration. No large icon. Just text and a link.

### Loading State

Pulsing dot animation (already implemented for wizard save status). For PDF generation: button text changes to "Generating…" with pulsing dot. No full-screen spinners. No skeleton screens (pages are static HTML — no async loading needed).

### Error State

Always paired with a retry action. Error message in `--color-error`, `--fs-small`, `role="alert"`. Never blame the user. "Something went wrong" not "You entered invalid data."

### Success State

Checkmark line icon (forest green) + confirmation heading + next-step guidance. Not celebratory — calm. The user completed a task, not won a prize.

### Saved Progress State

Pulsing bronze dot + "Saving…" text while writing to localStorage. "Saved in this browser" when complete. Already implemented in wizard — preserve.

---

## 15. Modals and Dialogs

### Confirmation Dialog

| Field | Value |
|---|---|
| **Purpose** | Confirm an irreversible action (clear all answers, start over) |
| **When to use** | Only for genuinely irreversible actions |

**Anatomy:** Centered card on a semi-transparent overlay (`rgba(15, 38, 32, 0.4)`). White background, 1px border, 4px radius. Heading (H3), body text, two buttons: "Cancel" (secondary) + "Confirm" (destructive variant).

**Accessibility:** `role="alertdialog"`, `aria-labelledby` pointing to heading, `aria-describedby` pointing to body. Focus trapped inside dialog. Escape closes. Return focus to triggering element on close.

### Drawer

Not currently used. If needed in the future (e.g., mobile filter panel): slide-in from right, full height, cream-dark background, 1px left border. `role="dialog"`. Focus trap. Escape closes.

**When not to use modals:** For legal disclaimers (use inline UPL notice). For educational content (use callout). For navigation (use page transition). For form errors (use inline validation). Modals are for interruptions only.

---

## Component Consolidation Plan

The audit identified 4 overlapping card components. The canonical system replaces them:

| Current | Replaced by | Notes |
|---|---|---|
| `.doc-card` | `.doc-type-card` | Unified card with icon, metadata, statute |
| `.gallery-card` | `.doc-type-card` + `.doc-type-card--selectable` | Adds selected state for radiogroup |
| `.document-mini` | `.doc-type-card --compact` | Smaller padding, no description |
| `.cross-link-card` | `.cross-link` | Not a card — a structured link block |

| Current | Replaced by | Notes |
|---|---|---|
| `.doc-sheet` | `.doc-preview` | Unified preview component |
| `.gallery-card-sheet` | `.doc-preview --mini` | Smaller variant for gallery |
| `.certificate-preview-doc` | `.doc-preview --live` | Live-updating variant for wizard |

Callout definitions (duplicated at lines 429–501 and 1490–1521) must be consolidated to one definition.