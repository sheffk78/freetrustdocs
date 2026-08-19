# Visual Language — The Clear Guide

> Design system specification for FreeTrustDocs.
> Direction: **The Clear Guide** — editorial, calm, reassuring.
> Status: canonical reference. Implementation lives in `global.css` (CSS custom properties) and Astro/Preact components.

---

## 1. Design intent

FreeTrustDocs helps ordinary people create legally meaningful trust documents without a lawyer. The design must feel like a competent, patient friend who has done this a thousand times — not like a government form, not like a startup landing page, not like a law firm.

The visual language is called **The Clear Guide**. It is editorial in structure, restrained in decoration, and warm in tone. Every layout decision should make the reader feel:

- **Safe** — this is a real, careful process, not a marketing funnel.
- **Oriented** — I know where I am, what I have done, and what comes next.
- **Capable** — the language and the layout both suggest that I can do this.
- **Unhurried** — nothing animates to pressure me; nothing flashes to demand attention.

### Emotional outcomes by page type

| Page type | Emotional outcome | What the design must do | What the design must avoid |
|---|---|---|---|
| **Marketing / home** | Grounded confidence. "This is a serious tool that respects me." | Editorial spacing, one clear proposition, real diagram of what a trust is. | Hype, gradient hero, countdown urgency, stock photography. |
| **Educational / learn** | Patient clarity. "Someone is explaining this properly." | Long-form reading layout, generous line height, pull-quotes, inline diagrams. | Card grids that fragment the explanation, autoplay video, sticky CTAs. |
| **Document selection** | Oriented choice. "I can see what each document is for." | Structured comparison, one decision per row, a diagram where structure differs. | Mega-menus, tag clouds, "most popular" badges. |
| **Guided intake** | Steady progress. "One step at a time, I am not lost." | Single question focus, clear progress indicator, helper text beside the field. | Long scroll of all questions, conditional logic the user can see, modal interruptions. |
| **Review** | Careful authority. "This is my document. I should read it." | Document-like typography, wide reading column, change markers in bronze. | Dashboard chrome, side panels full of upsells, "generate" buttons that move. |
| **Account / dashboard** | Quiet utility. "My documents are here, organized." | List-first layout, document status as text labels, minimal surface decoration. | Widget grids, notification badges, empty-state illustrations with characters. |
| **Support / help** | Reassuring presence. "I can get help without performing." | Article-style answers, clear contact options as text, no chatbot bubble animation. | Support tiers, priority labels, "was this helpful?" thumb widgets that jiggle. |

---

## 2. Foundations

### 2.1 Color tokens

All colors are defined as CSS custom properties in `global.css` and referenced by semantic name, never by hex value, in components.

| Token | Value | Usage |
|---|---|---|
| `--color-forest` | `#1a3c34` | Primary brand. Header bar, headings, primary buttons, diagram lines. |
| `--color-forest-700` | `#142e28` | Footer, pressed states, deep headings. |
| `--color-forest-600` | `#235145` | Hover on forest surfaces, secondary heading tint. |
| `--color-bronze` | `#8b6914` | Accent. Registration-line dot, link underline, emphasis in diagrams, change markers. |
| `--color-bronze-600` | `#755810` | Hover on bronze accents. |
| `--color-cream` | `#f8f5ef` | Page background. Has paper-grain SVG texture overlay. |
| `--color-surface` | `#ffffff` | Cards, intake panels, document preview surface. |
| `--color-surface-raised` | `#fdfcf8` | Subtly raised surfaces (modal, popover). Off-white to sit above cream. |
| `--color-ink` | `#1f2421` | Body text. Near-black with green undertone. |
| `--color-ink-60` | `rgba(31,36,33,0.6)` | Helper text, secondary metadata. |
| `--color-ink-40` | `rgba(31,36,33,0.4)` | Placeholder text, disabled labels. |
| `--color-rule` | `#e3ddcf` | Hairline borders, dividers, card edges. |
| `--color-rule-strong` | `#c9c1ad` | Emphasized borders, field focus ring base. |
| `--color-warning` | `#8a5a00` | Warnings. Bronze-adjacent amber. Never red. |
| `--color-warning-surface` | `#fbf3e0` | Warning callout background. |
| `--color-error` | `#8a2a2a` | Validation errors. Muted, serious, not alarming. |
| `--color-error-surface` | `#f7ecec` | Error callout background. |
| `--color-success` | `#2d5a3d` | Success confirmation. Forest-adjacent. |
| `--color-success-surface` | `#eef4ef` | Success callout background. |

### 2.2 Type families

| Role | Family | Fallback | Notes |
|---|---|---|---|
| Headings | Crimson Pro | `Georgia, 'Times New Roman', serif` | 400 and 600 weights only. Never bold (700). |
| Body | Inter | `system-ui, -apple-system, sans-serif` | 400 body, 500 emphasis, 600 button labels. |
| Labels / kickers | JetBrains Mono | `ui-monospace, 'SF Mono', monospace` | 500 weight, uppercase, tracked. |

All three are self-hosted; load via `@font-face` in `global.css`, preload critical weights. Do not load weights the system does not use.

### 2.3 Radius, shadow, texture

| Token | Value | Usage |
|---|---|---|
| `--radius` | `4px` | Every rounded surface. Cards, buttons, inputs, callouts. No exceptions. |
| `--shadow-card` | `0 1px 2px rgba(26,60,52,0.06)` | Cards on cream. Barely perceptible. |
| `--shadow-raised` | `0 4px 16px rgba(26,60,52,0.08)` | Modals, floating panels. |
| `--texture-paper` | Inline SVG, 4px tile, 2% opacity | Applied to `body` on cream. Faint grain. Never on white surfaces. |

The 4px radius is a hard rule. It keeps surfaces feeling like printed cards rather than software buttons. If a component feels wrong at 4px, the component is wrong, not the radius.

### 2.4 Spacing scale

Use a 4px-based scale. All spacing is a multiple of 4.

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |

---

## 3. Layout, grid, and whitespace

### 3.1 Content widths

| Measure | Max width | When to use |
|---|---|---|
| **Wide** | 1100px | Marketing sections with diagrams, document selection comparisons, account dashboard lists. |
| **Content** | 720px | Body copy, educational articles, intake question text, review reading column. |
| **Narrow** | 520px | Disclaimers, helper text blocks, single-field focus intake, callouts inside reading column. |

Default to content width. Escalate to wide only when a diagram or comparison table genuinely needs the room. Drop to narrow when the content is a single thought that should feel intimate.

### 3.2 Grid

- 12-column grid on wide layouts, 6-column on tablet, single column on mobile.
- Gutter: 24px desktop, 16px tablet, 16px mobile.
- Outer margin: `clamp(16px, 5vw, 64px)`.
- Content is **left-aligned** within its measure. Center alignment is reserved for short, standalone statements (a single pull-quote, a section opener with no body text) and never used for paragraphs or lists.

### 3.3 Whitespace rules

1. **Section padding:** `--space-9` (96px) top and bottom between major page sections on desktop; `--space-7` (48px) on tablet; `--space-6` (32px) on mobile. Never collapse below 32px.
2. **Heading-to-body:** `--space-4` (16px) for section headings, `--space-5` (24px) for page titles.
3. **Body paragraph spacing:** `--space-4` (16px) between paragraphs. Do not tighten this for density.
4. **Card internal padding:** `--space-5` (24px) minimum. Never below 16px.
5. **Vertical rhythm is more important than fitting content above the fold.** If a section feels long, let it scroll.

### 3.4 Alignment

- Text is left-aligned by default. Right-align only for numeric table columns and the footer copyright line.
- Form labels are left-aligned above their fields. Never inline-right labels.
- Buttons align to the left edge of their containing content block. Right-align a button only when it concludes a right-aligned flow (e.g., a review action bar).

---

## 4. Responsive behavior

### 4.1 Desktop (≥ 1024px)

- Full 12-column grid available.
- Two-column layouts permitted for editorial sections (text column + diagram/aside column).
- Intake wizard shows question column (content width) with a persistent progress rail on the left at 240px.
- Review page shows document text at content width with a marginalia column for notes at 280px.

### 4.2 Tablet (768px–1023px)

- 6-column grid. Two-column editorial layouts collapse to single column with the diagram/aside below the text.
- Intake progress rail becomes a top bar: step count + current label + progress bar. Question column stays content width.
- Review marginalia moves below the document text.
- Navigation collapses to a menu button. Header stays full color.

### 4.3 Mobile (< 768px)

- Single column. All content at 100% width minus 16px margins.
- No fixed-position elements except the intake progress bar, which sticks to the top of the viewport at 48px height.
- Body type scales down by one step (see §5.2). Line height increases slightly to preserve readability on narrow screens.
- Touch targets: minimum 44×44px. Apply to buttons, checkbox hit areas, accordion headers, and tab labels.
- Forms are single-column. Never place two fields side by side on mobile.
- Diagrams render in a horizontally scrollable container only if they exceed viewport width; prefer redrawing the diagram in a vertical orientation for mobile.

### 4.4 Reading and interaction behavior across breakpoints

| Behavior | Desktop | Tablet | Mobile |
|---|---|---|---|
| Primary navigation | Inline links | Menu button → panel | Menu button → full-screen panel |
| Intake progress | Left rail, persistent | Top bar, persistent | Top bar, sticky 48px |
| Diagrams | Inline, full width of column | Inline, below text | Inline or vertical redraw |
| Modals | Centered, 520px max | Centered, 90% width | Bottom sheet, full width |
| Tooltips | Hover, 300ms delay | Disabled — convert to helper text below field | Disabled — convert to helper text |
| Focus rings | Always visible on keyboard nav | Always visible | Always visible |

---

## 5. Typography hierarchy

### 5.1 Type scale

All sizes assume a 16px root. Use `rem`.

| Level | Family | Size / line-height | Weight | Letter-spacing | Color | Usage |
|---|---|---|---|---|---|---|
| **Page title** | Crimson Pro | 2.5rem / 1.15 | 600 | -0.01em | `--color-forest` | One per page. H1. |
| **Section heading** | Crimson Pro | 1.75rem / 1.25 | 600 | -0.005em | `--color-forest` | H2. Major section dividers. |
| **Subsection heading** | Crimson Pro | 1.375rem / 1.3 | 600 | 0 | `--color-forest` | H3. Card titles, subsections. |
| **Minor heading** | Crimson Pro | 1.125rem / 1.35 | 600 | 0 | `--color-forest` | H4. Rare. List group titles. |
| **Body** | Inter | 1.0625rem / 1.65 | 400 | 0 | `--color-ink` | Default reading text. |
| **Body large** | Inter | 1.1875rem / 1.6 | 400 | 0 | `--color-ink` | Educational article lead paragraph. |
| **Body small** | Inter | 0.9375rem / 1.55 | 400 | 0 | `--color-ink` | Table cells, metadata, card secondary text. |
| **Label / kicker** | JetBrains Mono | 0.75rem / 1.4 | 500 | 0.08em, uppercase | `--color-forest` or `--color-ink-60` | Section kickers, field labels, status tags. |
| **Helper text** | Inter | 0.875rem / 1.5 | 400 | 0 | `--color-ink-60` | Field hints, inline guidance. |
| **Legal disclaimer** | Inter | 0.8125rem / 1.5 | 400 | 0 | `--color-ink-60` | Disclaimers, terms references. Italic. |
| **Validation error** | Inter | 0.875rem / 1.5 | 500 | 0 | `--color-error` | Below field, with icon. |
| **Button label** | Inter | 0.9375rem / 1 | 600 | 0 | White or `--color-forest` | Buttons and CTAs. |
| **Link** | Inter | inherits | 400, 500 on hover | 0 | `--color-forest` with bronze underline | Inline links. |

### 5.2 Mobile type adjustments

| Level | Desktop | Mobile |
|---|---|---|
| Page title | 2.5rem | 2rem |
| Section heading | 1.75rem | 1.5rem |
| Subsection heading | 1.375rem | 1.25rem |
| Body | 1.0625rem | 1rem |
| Body large | 1.1875rem | 1.0625rem |

All other levels remain unchanged. Do not scale labels, helper text, or disclaimers — they are already at the floor.

### 5.3 Typographic rules

- **Line length:** 60–75 characters for body copy. Use the 720px content measure to enforce this.
- **Widows:** Use `text-wrap: pretty` on headings and body paragraphs (supported in modern browsers; harmless where unsupported).
- **Numerals:** Use `font-variant-numeric: tabular-nums` in tables, step indicators, and financial fields. Oldstyle figures in Crimson Pro for large display numbers in marketing only.
- **Emphasis in body:** Use italic Crimson Pro for pull-quotes. Do not use bold Inter for emphasis inside body copy — restructure the sentence instead.
- **No text in all caps except JetBrains Mono labels.** Never uppercase Inter or Crimson Pro.

---

## 6. Color distribution

Color is semantic. A color appears because the content carries a specific meaning, not because it looks good in that spot.

### 6.1 Action hierarchy

| Element | Background | Text | Border | When to use |
|---|---|---|---|---|
| **Primary action** | `--color-forest` | `#ffffff` | none | One per view. "Continue," "Generate document," "Create account." |
| **Primary action hover** | `--color-forest-600` | `#ffffff` | none | Hover and focus-visible. |
| **Secondary action** | `--color-surface` | `--color-forest` | 1px `--color-rule-strong` | Tertiary paths, "Back," "Save and exit." |
| **Secondary action hover** | `--color-cream` | `--color-forest` | 1px `--color-bronze` | Hover. |
| **Tertiary / text action** | transparent | `--color-forest` | none | In-line actions, "Read more," "Edit." Bronze underline on hover. |
| **Danger action** | `--color-surface` | `--color-error` | 1px `--color-error` | "Delete document," "Revoke." Rare. Always requires confirmation. |

### 6.2 Links

- Inline links: `--color-forest` text, 1px bronze underline at 60% opacity, full opacity on hover.
- Never underline non-link text.
- Links in body copy do not change weight on hover; the underline brightens.
- Links in navigation and footers use `--color-forest` with no underline; underline appears on hover.

### 6.3 Content-type coloring

| Content type | Surface | Border / accent | Text | Icon |
|---|---|---|---|---|
| **Education callout** | `--color-surface` | 1px `--color-rule`, bronze left rule 3px | `--color-ink` | Document icon, forest |
| **Reassurance content** | `--color-cream` (no card) | Registration-line divider above | `--color-ink` | Shield or lock icon, forest |
| **Warning** | `--color-warning-surface` | 1px `--color-warning` at 40% opacity | `--color-ink`, heading in `--color-warning` | Warning triangle, `--color-warning` |
| **Error** | `--color-error-surface` | 1px `--color-error` at 40% opacity | `--color-ink`, message in `--color-error` | Alert icon, `--color-error` |
| **Success confirmation** | `--color-success-surface` | 1px `--color-success` at 40% opacity | `--color-ink`, heading in `--color-success` | Check icon, `--color-success` |

### 6.4 Distribution rules

1. **Forest green dominates.** It is the header, the headings, the primary actions, and the diagram ink. A page should read green at a glance.
2. **Bronze accents, never bronze fills.** Bronze appears as the registration-line dot, link underlines, diagram emphasis, and change markers. Never as a button background or a card fill.
3. **Cream is the ground.** White surfaces sit on cream; they do not replace it. If a page is more than 60% white, it has lost the paper feel and should be restructured.
4. **White is for content that must feel like a document.** Cards, intake panels, document preview. Not for page backgrounds.
5. **Warning amber and error red are muted.** They are serious, not alarming. Never use pure red (`#ff0000`) or pure amber (`#ffaa00`).
6. **No gradients anywhere.** Solid colors only. The only tonal transition is the paper texture over cream.

---

## 7. Borders, surfaces, dividers, focus

### 7.1 Borders

| Context | Width | Color | Style |
|---|---|---|---|
| Card edge | 1px | `--color-rule` | solid |
| Form field default | 1px | `--color-rule-strong` | solid |
| Form field focus | 2px | `--color-bronze` | solid |
| Form field error | 1px | `--color-error` | solid |
| Table row separator | 1px | `--color-rule` | solid |
| Header bottom | 2px | `--color-bronze` | solid |
| Diagram line | 1.5px | `--color-forest` | solid |
| Diagram emphasis line | 2px | `--color-bronze` | solid |

### 7.2 Surfaces

| Surface | Background | Shadow | Border | When |
|---|---|---|---|---|
| Page | `--color-cream` + paper texture | none | none | Always, on `body`. |
| Card | `--color-surface` | `--shadow-card` | 1px `--color-rule` | Content groupings, callouts, selection tiles. |
| Input field | `--color-surface` | none | 1px `--color-rule-strong` | Form fields. |
| Modal | `--color-surface-raised` | `--shadow-raised` | none | Confirmations, disclosures. |
| Document preview | `--color-surface` | `--shadow-card` | none | Review page, preview thumbnails. |

### 7.3 Dividers

**Registration line** is the signature divider. It is used between major sections, between article blocks, and as a section opener rule.

Structure: a 1px `--color-rule` horizontal line with a 6px bronze dot centered on the line at the left content edge. The dot sits on top of the line, not above it.

```
●————————————————————————————————
```

Implementation: a flex row with a 6px bronze circle (`border-radius: 50%`, no shadow) followed by a 1px-high `--color-rule` line that grows to fill. The dot is vertically centered on the line.

**Hairline rule** (plain 1px `--color-rule`) is used inside cards and between table rows where the bronze dot would be too ceremonial.

### 7.4 Focus states

- **Focus ring:** 2px `--color-bronze` outline with 2px offset. Applied via `:focus-visible` only.
- **Focus ring never uses forest green.** Bronze is the attention color; forest is the structure color.
- **Focus is always visible on keyboard navigation.** Never remove the focus ring without a replacement.
- **Focus order follows visual order.** Do not use `tabindex` to reorder unless the component genuinely requires it (e.g., a roving-tabindex grid).
- **Form field focus** transitions border to 2px bronze over 120ms. No glow, no shadow expansion.

---

## 8. Icon, illustration, and art direction

### 8.1 Icons

- **Style:** 1.5px stroke, line icons, no fills. Forest green (`--color-forest`) stroke. Round line caps and joins.
- **Size:** 20px in running text and labels, 24px in cards and feature blocks, 16px in dense metadata contexts only.
- **Set:** `search`, `download`, `check`, `arrow-right`, `arrow-left`, `document`, `shield`, `lock`, `plus`, `minus`, `chevron-down`, `chevron-right`, `info`, `warning`, `alert`, `x` (close).
- **Rules:**
  - Icons supplement text labels; they never replace them. Every icon that communicates an action has a visible text label beside or below it.
  - Icons are monochrome forest green. Do not two-tone or colorize per context.
  - Do not introduce icons outside the set without adding them to this specification.
  - Icons in buttons sit to the left of the label, 8px gap, vertically centered.
  - No emoji as icons. Ever.

### 8.2 Diagrams

Diagrams are the primary visual content of FreeTrustDocs. They explain trust structures, document relationships, and process flows.

- **Style:** editorial line diagrams. Forest green lines (1.5px) on cream or white. Bronze (2px) for emphasis lines, the "you are here" path, and highlighted relationships.
- **Nodes:** rounded rectangles (4px radius) with 1px `--color-rule` border and white fill, or plain text labels with no enclosing shape when the label is the node.
- **Connectors:** orthogonal (right-angle) lines preferred for structural diagrams; curved lines only for process flows where the path is the meaning.
- **Labels:** JetBrains Mono, 0.75rem, uppercase, forest green. Sit on or beside the line, never inside it.
- **Annotations:** Inter, 0.875rem, `--color-ink-60`, placed in the margin with a thin leader line.
- **Restraint:** a diagram shows one idea. If two ideas are needed, draw two diagrams. Do not combine a structure diagram with a process flow in the same figure.
- **No 3D, no isometric, no shadows on diagram nodes.** The diagram is a drawing, not a render.

### 8.3 Illustration

- **No cartoon illustrations.** No characters, no mascots, no flat-people figures.
- **No isometric or 3D illustration.**
- **The only illustrations are diagrams** (§8.2) and the paper texture (§2.3).
- Empty states use a single relevant icon at 32px in forest green with a one-sentence text explanation. No illustrated scenes.

### 8.4 Photography

- **No photography.** Not on marketing pages, not in education, not in testimonials, not in the team page.
- Trust is conveyed through typography, spacing, and diagrams — not through images of handshakes, families, or desks.

### 8.5 Document preview art direction

- Document previews render as white surfaces with `--shadow-card`, 4px radius, and an internal padding of `--space-5`.
- Preview text uses Crimson Pro at 0.875rem to simulate document typography. Section headings in the preview use 600 weight.
- A subtle 1px `--color-rule` border defines the page edge.
- Watermark or status indicators (draft, finalized, signed) sit as a JetBrains Mono label in the top-right corner of the preview surface, `--color-ink-60`.
- Preview thumbnails in the dashboard are 4:5 aspect ratio, showing the first portion of the document with a soft fade at the bottom edge.
- No mockup chrome (no browser frame, no "window" decoration). The document is the document.

---

## 9. Motion

Motion guides attention. It does not entertain.

### 9.1 Principles

1. **Motion is for orientation, not delight.** An animation that does not help the reader understand what changed is removed.
2. **Duration is short.** Nothing exceeds 250ms except page transitions (300ms).
3. **Easing is gentle.** Use `cubic-bezier(0.4, 0, 0.2, 1)` for standard transitions, `cubic-bezier(0.0, 0, 0.2, 1)` for entrances.
4. **No spring physics, no bounce, no overshoot.** Trust documents are serious; the interface should not feel bouncy.
5. **Motion respects `prefers-reduced-motion`.** When reduced motion is requested, all transitions collapse to 0ms and all entrances render in their final state. No fade, no slide.

### 9.2 Motion inventory

| Element | Property | Duration | Easing | Trigger |
|---|---|---|---|---|
| Link hover | underline opacity | 120ms | standard | hover |
| Button hover | background-color | 120ms | standard | hover |
| Form field focus | border-color, border-width | 120ms | standard | focus |
| Accordion expand | max-height, opacity | 200ms | entrance | click |
| Intake step transition | opacity, transform (8px slide) | 200ms | entrance | step advance |
| Modal open | opacity, transform (16px rise) | 200ms | entrance | open |
| Modal close | opacity, transform (8px drop) | 160ms | standard | close |
| Callout entrance | opacity | 150ms | entrance | scroll into view |
| Page transition (Astro view transitions) | opacity, transform (12px) | 300ms | entrance | navigation |
| Diagram draw-in (optional) | stroke-dashoffset | 600ms | standard | scroll into view |

### 9.3 Forbidden motion

- Parallax scrolling.
- Auto-playing carousels.
- Pulsing or breathing animations on badges or icons.
- Count-up number animations.
- Loading spinners that spin indefinitely (use a progress bar or a labeled "Preparing your document…" state instead).
- Any motion triggered by scroll position except a single fade-in for diagrams (§9.2).

---

## 10. Component decision framework

Use this framework to choose the right structural component for a piece of content.

### 10.1 Component inventory

| Component | Primary purpose | Emotional signal |
|---|---|---|
| **Editorial layout** | Long-form explanation, narrative argument | "Settle in and read." |
| **Structured list** | Sequential or ordered information, steps, requirements | "Here is what you need, in order." |
| **Information card** | A self-contained unit with a title, summary, and optional action | "This is one complete thing." |
| **Guided step** | A single question or decision in a multi-step process | "Answer this one thing; the rest waits." |
| **Callout** | Context that supplements the main flow — education, reassurance, warning | "Pause for this context." |
| **Disclosure (accordion)** | Optional detail that not every reader needs | "This is here if you want it." |

### 10.2 Decision tree

```
Is the content a continuous explanation longer than 3 paragraphs?
  → YES: Editorial layout (content width, headings, optional diagram)
  → NO: continue

Is the content a sequence of steps or a checklist?
  → YES: Structured list (numbered or with check icons)
  → NO: continue

Is the content a single self-contained item among peers?
  → YES: Information card (in a grid if there are 2–4 peers; a list if more)
  → NO: continue

Is the content one question in a multi-step process?
  → YES: Guided step (intake wizard)
  → NO: continue

Is the content supplementary context that some readers need and others skip?
  → YES: Disclosure (accordion) if it is optional detail
         Callout if it is context everyone should see
  → NO: reconsider — the content may belong inline as body copy
```

### 10.3 Good fit / not a fit

#### Editorial layout

| Good fit | Not a fit |
|---|---|
| "What is a revocable trust?" (800-word explanation with a structure diagram) | Three bullet points about trust benefits |
| "How FreeTrustDocs protects your privacy" (narrative with inline callouts) | A pricing comparison |

#### Structured list

| Good fit | Not a fit |
|---|---|
| "What you need before you start" (5 numbered items) | A 600-word explanation of trust funding |
| "Steps to finalize your document" (ordered checklist with status) | A set of 8 unrelated FAQ answers |

#### Information card

| Good fit | Not a fit |
|---|---|
| Document selection tiles (one card per document type, 3–4 cards) | A single "about us" paragraph |
| Feature summaries on the home page (3 cards: Free, Private, Valid) | A 12-item list of state availability (use a structured list or table) |

#### Guided step

| Good fit | Not a fit |
|---|---|
| "Name your trust" (single text field, one question) | A settings page with 10 fields |
| "Choose your successor trustee" (one selection from a list) | A review of the completed document |

#### Callout

| Good fit | Not a fit |
|---|---|
| "This field determines how your assets transfer. Read more →" beside a field | The main body of an educational article |
| "Your document is not legal until signed and notarized." (reassurance callout on review) | A warning that applies to the whole page (put it at the top, not in a callout) |

#### Disclosure

| Good fit | Not a fit |
|---|---|
| "What does 'successor trustee' mean?" (expandable definition) | The primary instructions for the current step |
| "State-specific requirements for California" (optional detail) | The disclaimer that must be seen before generating |

### 10.4 Grid guidance for cards

- 2 cards: side by side on desktop, stacked on tablet and mobile.
- 3 cards: 3 columns on desktop, stacked on tablet and mobile. (Three is the default card count for feature blocks.)
- 4 cards: 2×2 on desktop, stacked on tablet and mobile. Do not do 4-across; it gets too narrow.
- 5+ cards: do not use a card grid. Switch to a structured list or a table.

---

## 11. Page-level patterns

### 11.1 Header

- Forest green (`--color-forest`) background, full width, 64px tall on desktop, 56px on tablet and mobile.
- 2px bronze bottom border.
- Logo (Crimson Pro wordmark, white) left-aligned. Navigation links (Inter, white) right-aligned.
- On tablet and mobile: logo left, menu button right.
- Header is sticky. It does not animate on scroll; it simply stays.

### 11.2 Footer

- Dark green (`--color-forest-700`) background, full width.
- Content at wide measure. Three columns on desktop: navigation, legal links, a one-paragraph "about this tool" statement. Single column on mobile.
- Text is white at 80% opacity. Links are white at 100% with bronze underline on hover.
- The legal disclaimer sits at the bottom of the footer in Inter italic, 0.8125rem, white at 60% opacity.
- No newsletter signup. No social icons. This is a legal tool, not a brand.

### 11.3 Section openers

Every major page section begins with:

1. A JetBrains Mono kicker (uppercase, `--color-ink-60` or `--color-bronze`).
2. A Crimson Pro section heading.
3. A registration-line divider below the heading.
4. Optional: a one-sentence Inter lead in `--color-ink-60`.

This pattern is the visual rhythm of the site. Do not skip the registration line on section openers.

### 11.4 Intake wizard layout

- Left rail (240px desktop): progress indicator. Each step shows a JetBrains Mono step number, a short Inter label, and a status (complete = check icon, current = bronze dot, future = hollow circle). Completed steps are clickable to go back.
- Main column (content width): one question at a time. Question text is a Crimson Pro subsection heading. Helper text sits below in Inter `--color-ink-60`. The field or selection control sits below that.
- Action bar at the bottom of the main column: "Back" (secondary) on the left, "Continue" (primary) on the right.
- No progress percentage. The step rail is the progress.

### 11.5 Review page layout

- Content width reading column showing the generated document text in Crimson Pro.
- Marginalia column (280px desktop, below on tablet/mobile) for notes, change markers, and section jumps.
- A sticky action bar at the bottom of the viewport: "Back to edit" (secondary) left, "Download" (primary) right, with a reassurance callout ("You can return and edit at any time") above the bar.
- Change markers in the document text use bronze underlines and a small bronze dot in the margin.

---

## 12. Accessibility baseline

These are not optional.

1. **Color contrast:** all text meets WCAG AA against its surface. Body text (`--color-ink` on `--color-cream`) is 12:1. Helper text (`--color-ink-60` on cream) is 4.8:1. Error text (`--color-error` on `--color-error-surface`) is 5.2:1.
2. **Focus visibility:** every interactive element has a visible `:focus-visible` ring (2px bronze, 2px offset). No exceptions.
3. **Keyboard navigation:** every action reachable by mouse is reachable by keyboard in a logical order.
4. **Form errors:** announced via `aria-live="polite"`. The error message is associated with the field via `aria-describedby`. The field receives `aria-invalid="true"`.
5. **Diagrams:** every diagram has a text alternative — either a caption that explains the diagram in words, or a visually-hidden description. Diagrams are decorative only when the surrounding text fully conveys their meaning; in that case they are marked `aria-hidden="true"`.
6. **Motion:** `prefers-reduced-motion: reduce` disables all non-essential motion (§9.1).
7. **Touch targets:** minimum 44×44px on all interactive elements at all breakpoints.
8. **Semantic HTML:** use `<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`, `<figure>`, `<figcaption>`. Do not build structure from `<div>` alone.

---

## 13. Implementation notes

- **No CSS framework.** All styles are hand-written in `global.css` and component-scoped CSS files. The tokens in §2 are the single source of truth.
- **Astro SSG.** Pages are static. Interactive components (intake wizard, document selection, review annotations) are Preact islands hydrated on demand.
- **Preact islands** import only the tokens they need from `global.css` via CSS custom properties; they do not carry their own color definitions.
- **No utility classes.** If a pattern recurs, it becomes a component with a named class, not a string of utilities.
- **No CSS-in-JS.** Styles are static files.
- **Diagrams** are inline SVG components in Astro. They are not images; they are renderable, scalable, and themeable via `currentColor`.
- **Icons** are inline SVG, not an icon font. Each icon is a small Astro component or Preact component that takes a `size` prop.
- **Paper texture** is an inline SVG data URI on `body::before` at 2% opacity, `pointer-events: none`, `z-index: -1`. It does not scroll with content.

---

## 14. What this design is not

- It is not a **government form.** Generous spacing, serif headings, and the paper texture keep it human.
- It is not a **startup landing page.** No gradient hero, no feature carousel, no social proof strip, no pricing table.
- It is not a **law firm website.** No mahogany photography, no partner bios, no "schedule a consultation."
- It is not a **fintech dashboard.** No widget grid, no notification badges, no data visualizations.
- It is not **playful.** No mascots, no confetti, no illustrated empty states, no microcopy that winks at the reader.

It is a clear guide. Calm, legible, serious about its work, and patient with the person doing it.