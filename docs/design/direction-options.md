# FreeTrustDocs — Visual Direction Options

**Date:** August 19, 2026
**Prepared by:** Kit (design lead)
**Status:** Approved by Jeff, August 19, 2026. Direction: The Clear Guide. All 8 design decisions locked.

---

## Existing Brand Foundation

Before proposing directions, here is what already exists and must be honored:

| Element | Current Value |
|---|---|
| **Logo** | Key + scroll mark, forest green (`#1a3c34`) — see `public/images/logo/logo.svg` |
| **Primary color** | Deep forest green `#1a3c34` |
| **Accent color** | Warm bronze `#8b6914` |
| **Background** | Cream `#f8f5ef` with subtle paper-grain texture |
| **Heading font** | Crimson Pro (serif) |
| **Body font** | Inter (sans-serif) |
| **Mono font** | JetBrains Mono |
| **Border radius** | 4px (conservative) |
| **Max width** | 1100px content, 720px narrow |
| **Texture** | Paper-grain SVG on body, registration-grid on header/footer |

All three directions below use this same foundation. They differ in emphasis, distribution, art direction, and emotional register — not in core palette or typography.

---

## Direction 1 — The Clear Guide

### Intended emotional impression

"You can do this." The Clear Guide feels like a knowledgeable friend walking you through something that seemed intimidating — patient, warm, never rushed. The user should feel smarter and more capable after each step, not dependent on the tool. It is the most human and least institutional of the three directions.

### How the current logo and colors are used

- **Forest green** is the primary voice — used for headings, links, buttons, and the header band. It carries the brand authority.
- **Bronze** is the guide accent — used sparingly for step indicators, progress marks, callout left-bars, and small registration dots that trail between sections like editorial pilcrows. Bronze feels like a teacher's red pencil, but warmer.
- **Cream** is the page — generous, warm, with the existing paper-grain texture providing tactile comfort.
- **White** surfaces appear inside cards and wizard steps — clean surfaces within the warm page.
- **Color distribution:** ~70% cream/white surface, ~20% forest green (text, header, buttons), ~10% bronze (accents, indicators, rules).

### Recommended typography hierarchy

| Role | Font | Size | Weight | Treatment |
|---|---|---|---|---|
| Display / H1 | Crimson Pro | 2.5rem (40px) | 600 | Tight leading (1.2), slight negative tracking |
| H2 | Crimson Pro | 2rem (32px) | 600 | Section headers |
| H3 | Crimson Pro | 1.5rem (24px) | 600 | Card titles, subsections |
| H4 | Crimson Pro | 1.25rem (20px) | 600 | Wizard step titles |
| Body | Inter | 17px | 400 | Line-height 1.7 for reading comfort |
| Body small | Inter | 0.85rem | 400 | Meta, captions, secondary info |
| Labels / kickers | JetBrains Mono | 0.72rem | 600 | Uppercase, letter-spacing 0.08em — used for step indicators, section labels, UPL notices |
| Tabular figures | Inter (tnum) | inherits | inherits | `font-feature-settings: "tnum"` on all numbers |

### Color-distribution rules

1. **Never use bronze for large fills.** Bronze is an accent — rules, dots, 1px borders, small text. Large bronze areas feel cheap.
2. **Green is for authority, not decoration.** Header band, primary buttons, heading text, link color. Not for backgrounds or large cards.
3. **Cream is always the base.** Never use pure white as the page background — it loses the warmth that differentiates FreeTrustDocs from generic SaaS.
4. **White surfaces are islands.** Cards, wizard steps, document previews — white surfaces sit on cream, separated by a 1px border or subtle shadow. They feel like paper placed on a desk.
5. **Error red (`#8b2020`) is reserved for validation errors only.** Never for warnings or informational content.

### Layout, grid, whitespace, borders, surface, radius, and shadow approach

- **Grid:** Single-column reading flow at narrow width (720px) for guides and legal pages. Two-column (content + sidebar) for document hub pages. Three-column card grid for document library.
- **Whitespace:** Generous. Section padding at 4rem vertical (2xl). Paragraph spacing at 1rem. The page should breathe — tightness reads as anxiety.
- **Borders:** 1px solid `--color-border` (`#d4cfc4`) on all cards and dividers. Hairline rules between sections, not heavy bars. The existing `.ftd-registration-line` pattern (thin rule + accent dot) is the signature divider.
- **Surface:** Flat. No glassmorphism, no frosted overlays. Cards are opaque white on cream.
- **Radius:** 4px everywhere — buttons, cards, inputs, callouts. Consistent, conservative, intentional.
- **Shadow:** Minimal. One shadow token: `0 1px 3px rgba(26, 60, 52, 0.08)` — a faint, brand-tinted shadow for elevated surfaces (wizard step cards, document preview). Never heavy drop shadows. Most surfaces use borders, not shadows.

### Art direction for imagery, illustrations, icons, diagrams, and document previews

- **Photography:** None. The Clear Guide doesn't use stock photography — it would undermine the editorial, tool-focused character. If human warmth is needed, it comes from typography and language, not images of smiling families.
- **Illustrations:** Functional diagrams only — clean, editorial line diagrams that explain trust structures, document relationships, or process flows. Think architectural drawings or editorial infographics from a quality magazine: precise, labeled, restrained. Forest green lines on cream, bronze for emphasis marks. Never decorative illustrations, character art, or cartoon-style graphics. Diagrams earn their place by making something clearer than text alone could.
- **Icons:** Line icons for functional and navigational elements (search, download, check, arrow, document, shield, lock). 1.5px stroke, forest green, no fills. Consistent icon set — same stroke weight, same corner radius, same visual weight across all icons. Icons supplement text labels, never replace them. Used on document cards, in the wizard (step indicators, field types), and in trust/proof sections. Icon usage should feel like a well-designed form, not a decorated page.
- **Document previews:** Rendered as styled HTML previews on a white card with a 1px border and faint shadow — showing the actual document layout (title, article structure, signature block) in Crimson Pro at a reduced size. Like looking at a letter on a desk. No PDF raster thumbnails.

### Homepage hero and primary CTA treatment

The hero is text-first, not image-first:

```
[mono kicker: FREE TRUST DOCUMENTS — NO SIGNUP, NOTHING LEAVES YOUR BROWSER]

Create your trust document.
Answer a few questions. Download a finished PDF.
No account. No fees. No data leaves your browser.

[Primary button: Start a Document →]  [Text link: Browse Document Types]

[Below: three document-type cards — Certificate of Trust, Declaration of Trust, Land Trust]
```

- The hero uses the full container width (1100px) with generous top and bottom padding (6rem).
- The mono kicker sits above the H1 in forest green, uppercase, small — the editorial registration-mark voice.
- The H1 is Crimson Pro 2.5rem, two lines, tight leading. "Create your trust document." on line one, the rest as a subheading in Inter 1.125rem, muted color.
- Primary button: forest green background, cream text, 4px radius, 0.5rem 1.5rem padding. No gradient, no shadow.
- Secondary link: text link with underline, forest green, no button styling.

### Trust/proof section treatment

A dedicated section below the document cards, structured as:

1. **"Nothing leaves your browser"** — one sentence, H3-sized, with a 2-paragraph explanation in body text. Links to the full privacy page.
2. **"Based on real statutes"** — each document type lists its governing statute (e.g., "Certificate of Trust: Uniform Trust Code §1013" or state-specific equivalent). This is the expertise signal — citations, not claims.
3. **"Last reviewed: [date]"** — a small mono-text date stamp on each document card, signaling ongoing maintenance.

No testimonials (FreeTrustDocs has no users yet), no Trustpilot widgets, no "trusted by" logos. Trust comes from transparency and citations, not social proof.

### Document library and template-card treatment

Three-column grid on desktop, single column on mobile. Each card:

```
┌─────────────────────────────────────┐
│ CERTIFICATE OF TRUST                │  ← mono kicker, forest green
│                                     │
│ Prove your trust exists             │  ← H3, Crimson Pro
│ to banks and title companies.       │
│                                     │
│ 5 questions · ~3 minutes            │  ← body small, muted, with tnum
│ Based on UTC §1013                  │  ← body small, bronze
│                                     │
│ [Start →]                           │  ← text link, not button
└─────────────────────────────────────┘
```

- Card: white background, 1px border, 4px radius, 1.5rem padding.
- Hover: border color shifts to bronze, card lifts 1px (translateY), shadow appears.
- No icons inside cards. The text hierarchy carries the visual weight.

### Guided intake / document-generation flow treatment

The wizard is the heart of The Clear Guide:

- **Full-width white card on cream background**, max-width 720px (narrow), centered.
- **Step indicator:** "Step 2 of 5" in JetBrains Mono, uppercase, forest green — positioned top-left of the card. A thin progress bar (1px height, forest green fill on cream-dark track) sits below it.
- **One question per step.** H4 question text in Crimson Pro, input below in Inter. Helper text in body-small, muted color, positioned directly below the input — not in a sidebar.
- **Radio choices as cards.** "Revocable / Irrevocable" presented as two side-by-side tappable cards with a label and one-line description, not tiny radio buttons. Selected card gets a 2px forest green border; unselected gets 1px border-color.
- **Navigation:** "Back" as text link, "Continue" as primary button. Both at the bottom of the card, space-between layout.
- **Save reassurance:** "Your answers stay in your browser. You can close this tab and come back." — small text, muted, below the navigation.
- **Completion:** Full-width success state — H2 "Your document is ready", download button (primary, forest green), and a subtle cross-link to TrustMinutes ("Keep your trust records organized — try TrustMinutes, free").

### How to display legal disclaimers without making the experience feel alarming

- **Inline UPL notices** use the existing `.upl-notice` pattern: cream-dark background, bronze left-border, small text. They read as helpful notes, not warning boxes.
- **Pre-download checkbox:** "I understand this is a legal document template, not legal advice. I should consult an attorney in my state before signing." — presented as a standard checkbox in the wizard, not a modal gate. The language is plain, not adversarial.
- **Footer disclaimer** on every page: the existing one-sentence bold statement + two-sentence explanation. Never expanded, never alarmist.
- **Key principle:** Disclaimers use bronze accents, never red. Red is for validation errors only. Disclaimers are information, not danger.

### Mobile considerations

- Single-column everywhere. No sidebars, no multi-column grids.
- Wizard steps fill the viewport — question, input, navigation. No distractions.
- Step indicator shows "Step 2 of 5" (text) — progress bar is too thin to read on mobile.
- Yes/No and radio choices as full-width tappable cards, minimum 48px height.
- Body text stays at 17px — do not reduce font size on mobile. Reduce padding instead.
- Hamburger menu for navigation (already implemented in Base.astro).

### Risks and anti-patterns

- **Risk: Too plain.** Without photography, the site relies on icons, diagrams, and typographic hierarchy for visual interest. Mitigation: functional line icons on cards and in the wizard, editorial diagrams for trust structure explanations, bronze accents, and generous typography provide enough warmth. Test with non-legal users to confirm it feels welcoming, not sterile.
- **Risk: Looks like a text-only blog.** Mitigation: the document cards with icons, wizard card, editorial diagrams, and registration-mark dividers provide visual structure. The grid breaks up the reading flow.
- **Anti-pattern to avoid:** Do not add cartoon or decorative illustrations to compensate for text-forward design. That would move toward Trust & Will's cartoon style, which conflicts with the editorial tone. Diagrams and icons must be functional and editorial — precise, labeled, restrained.
- **Anti-pattern to avoid:** Do not use green for everything. Over-saturating with the primary color makes the site feel heavy and institutional. Cream is the dominant surface.

### Why this direction does or does not fit FreeTrustDocs

**Fits strongly.** The Clear Guide aligns with FreeTrustDocs' core value proposition: making legal documents approachable for people who feel uncertain. The editorial, text-forward character differentiates it from eForms (cluttered ad-site) and Trust & Will (cartoon-illustrated paid product). The emphasis on explanation and guided progress matches the wizard-based product model. The absence of photography and illustration keeps the site fast-loading (important for ad RPM) and cheap to maintain.

**Tension:** The Clear Guide is the least visually distinctive of the three directions. It relies on execution quality — typography, spacing, and micro-interactions — rather than a bold visual concept. If the execution is merely adequate, it could feel generic. It needs to be crafted, not assembled.

---

## Direction 2 — The Modern Steward

### Intended emotional impression

"This is handled." The Modern Steward feels like a well-run office — precise, orderly, and professional. The user should feel that their document is being generated by a system that takes itself seriously, with the same care a trust officer would apply. It is institutional without being intimidating, structured without being bureaucratic.

### How the current logo and colors are used

- **Forest green** dominates more aggressively here — used for the header, section dividers, table headers, and document-preview frames. Green is the institutional color.
- **Bronze** is the precision accent — used for data labels, statute citations, registration marks, and the thin rules that structure the page. Bronze feels like the ink on a legal document.
- **Cream** is the reading surface, but with less prominence than in Direction 1. More white surfaces appear — the document library feels like a catalog of structured records.
- **Color distribution:** ~60% cream/white surface, ~30% forest green (text, header, structural elements, table headers), ~10% bronze (data accents, citations, rules).

### Recommended typography hierarchy

| Role | Font | Size | Weight | Treatment |
|---|---|---|---|---|
| Display / H1 | Crimson Pro | 2.25rem (36px) | 700 | Tighter, more compact than Direction 1. Institutional weight. |
| H2 | Crimson Pro | 1.75rem (28px) | 700 | Structured section headers with mono section numbers |
| H3 | Crimson Pro | 1.375rem (22px) | 600 | Card titles, subsections |
| H4 | Inter | 1rem (16px) | 600 | Wizard step titles — sans-serif for a more systematic feel |
| Body | Inter | 16px | 400 | Slightly smaller body text — denser, more document-like |
| Body small | Inter | 0.8rem | 400 | Meta, captions |
| Labels / data | JetBrains Mono | 0.72rem | 600 | Uppercase — used heavily for data labels, statute references, section numbers |
| Tabular figures | Inter (tnum) | inherits | inherits | All numbers tabular — critical for the institutional precision feel |

### Color-distribution rules

1. **Green for structure.** Section headers can have green underline rules. Table headers are green with cream text. The header band is green. Green organizes the page.
2. **Bronze for data.** Statute citations, document IDs, field labels in the wizard — bronze signals "this is a specific, verifiable fact."
3. **White surfaces are more prominent.** Document cards have white backgrounds with crisp borders — they look like records in a filing system.
4. **Cream is the background, not a feature.** The paper-grain texture is present but less emphasized. The overall feel is cleaner, less tactile.
5. **Mono text is used more heavily.** Section numbers, data labels, and metadata all use JetBrains Mono — reinforcing the systematic, document-first character.

### Layout, grid, whitespace, borders, surface, radius, and shadow approach

- **Grid:** More structured. Document hub pages use a defined 12-column grid. Document library uses a 3-column card grid with consistent gaps. Guides use a 720px narrow column but with more visible structural elements (section numbers, rule dividers).
- **Whitespace:** Controlled, not generous. Padding is deliberate and consistent — 3rem section padding (tighter than Direction 1). The page feels organized, not airy.
- **Borders:** 1px borders on all surfaces. Section dividers are 1px solid green at 30% opacity. The registration-line pattern is used more frequently — between every section, not just occasionally.
- **Surface:** Flat, crisp. White cards on cream. Document previews have a subtle inner border — like a document in a frame.
- **Radius:** 4px everywhere, same as Direction 1. The consistency is more noticeable here because the layout is more structured.
- **Shadow:** One shadow token, same as Direction 1: `0 1px 3px rgba(26, 60, 52, 0.08)`. Used on document cards and wizard steps. Slightly more present than in Direction 1 because the structured layout benefits from subtle depth.

### Art direction for imagery, illustrations, icons, and document previews

- **Photography:** None. Same as Direction 1 — no stock photography.
- **Illustrations:** None. The visual character comes from structure, not decoration.
- **Icons:** Functional line icons only, same as Direction 1. But used more sparingly — the Modern Steward relies on text labels and structure, not iconography.
- **Document previews:** Rendered as structured HTML within a bordered frame — showing the document's article hierarchy as an outline (Article I, Article II, etc.) in Crimson Pro, with mono section numbers. Feels like a table of contents in a legal catalog. More systematic than Direction 1's "letter on a desk" approach.

### Homepage hero and primary CTA treatment

The hero is structured and compact:

```
[mono section number: 01 — FREE TRUST DOCUMENTS]

Generate your trust document.
A precise, statute-referenced document in minutes.
No account. No fees. Nothing leaves your browser.

[Primary button: Begin Document Generation →]  [Text link: View Document Library]

[Below: three document-type cards in a structured 3-column grid, each with mono section numbers]
```

- The hero is more compact than Direction 1 — less whitespace, more structured.
- Mono section numbers ("01 —") prefix each section, giving the page a document-like feel.
- The H1 is Crimson Pro 2.25rem, weight 700 — heavier and more compact.
- The subheading is Inter 1rem, not 1.125rem — denser, more factual.
- Primary button: same forest green styling, but with a mono-text label prefix ("BEGIN →") rather than sentence-case.

### Trust/proof section treatment

Structured as a labeled grid, not a narrative section:

```
╔══════════════════════════════════════════════════════════╗
║ 02 — PRIVACY & SECURITY                                   ║
╠══════════════════════════════════════════════════════════╣
║ CLIENT-SIDE GENERATION  │ No data transmitted to server  ║
║ NO ACCOUNT REQUIRED     │ No signup, no email, no tracking ║
║ STATUTE-REFERENCED      │ Each template cites governing law ║
║ LAST REVIEWED           │ [date] — ongoing legal review    ║
╚══════════════════════════════════════════════════════════╝
```

- Uses a definition-list or table layout with mono labels and body-text descriptions.
- Feels like a spec sheet — precise, verifiable, no marketing language.
- The structure itself is the trust signal: organized information reads as organized thinking.

### Document library and template-card treatment

Three-column grid, more structured than Direction 1:

```
┌──────────────────────────────────────┐
│ 01                                   │  ← mono section number
│ CERTIFICATE OF TRUST                 │  ← mono kicker, forest green
│                                      │
│ Prove your trust exists.             │  ← H3, Crimson Pro
│                                      │
│ ──────────────────────────────────── │  ← thin rule
│ QUESTIONS: 5    TIME: ~3 MIN         │  ← mono data labels
│ STATUTE: UTC §1013                   │  ← mono, bronze
│ REVIEWED: 2026-08-18                 │  ← mono, muted
│                                      │
│ [Begin →]                            │  ← text link
└──────────────────────────────────────┘
```

- Card: white background, 1px border, 4px radius, 1.25rem padding (tighter than Direction 1).
- The data strip at the bottom is the key differentiator — it presents the document as a structured record, not a friendly card.
- Hover: border shifts to forest green (not bronze — this direction is more institutional), card lifts 1px.

### Guided intake / document-generation flow treatment

The wizard is more systematic:

- **Full-width white card, max-width 720px, centered.** Same dimensions as Direction 1.
- **Step indicator:** "02 / 05" in JetBrains Mono — a fraction format, more precise than "Step 2 of 5." The progress bar is 2px height (slightly more visible), forest green fill.
- **Question text in Inter 1rem, weight 600** — sans-serif, not serif. The Modern Steward uses sans-serif for the wizard to feel more systematic.
- **Helper text in body-small, muted** — positioned below the input, same as Direction 1.
- **Radio choices as cards** — same pattern, but the selected state uses a 2px forest green border with a small green check mark (line icon, not decorative). Unselected: 1px border.
- **Section labels in the wizard:** Each step has a mono label (e.g., "TRUSTEE INFORMATION") above the question — giving the wizard a form-like, structured feel.
- **Navigation:** "← Back" and "Continue →" with mono arrow indicators. Same button styling.
- **Completion:** Success state with a document summary — "Document: Certificate of Trust | State: California | Generated: [date]" in mono text above the download button. Feels like a receipt.

### How to display legal disclaimers without making the experience feel alarming

- **UPL notices use the existing `.upl-notice` pattern** but with a more structured layout — mono label "LEGAL NOTICE" followed by body text. Still bronze accent, never red.
- **Pre-download checkbox:** Same language as Direction 1, but presented in a bordered box with a mono header ("ACKNOWLEDGMENT") — feels like signing a form, not dismissing a warning.
- **Footer disclaimer:** Same as Direction 1 — the institutional tone naturally accommodates legal language.
- **Key principle:** Disclaimers are structured like the rest of the page — labeled, bordered, consistent. They don't stand out as warnings; they read as standard legal metadata.

### Mobile considerations

- Single-column, same as Direction 1.
- Wizard steps fill the viewport.
- Mono labels ("02 / 05") work well on mobile — they're compact and precise.
- Data strips on document cards stack vertically on mobile — each data point on its own line.
- Section numbers ("01 —") can be hidden on mobile if they add clutter — test with users.

### Risks and anti-patterns

- **Risk: Too cold.** The institutional precision could feel distant or unwelcoming for users who are already nervous about legal documents. Mitigation: the cream background, serif headings, and plain-language helper text provide warmth. But the balance is delicate.
- **Risk: Feels like a government form.** The structured, mono-heavy layout could read as bureaucratic. Mitigation: use Crimson Pro for all headings and card titles — the serif typeface prevents the site from feeling like a .gov site.
- **Anti-pattern to avoid:** Do not add table after table. The structured feel should come from consistent layout, not from making everything a table.
- **Anti-pattern to avoid:** Do not increase the body text density to the point where reading becomes uncomfortable. 16px is the minimum — anything smaller sacrifices readability for density.

### Why this direction does or does not fit FreeTrustDocs

**Fits well, with a caveat.** The Modern Steward aligns with FreeTrustDocs' credibility needs — statute citations, structured document library, and professional precision all reinforce "this is a serious legal tool." It differentiates strongly from eForms (which is cluttered and unprofessional) and from Trust & Will (which is warm but paid). The institutional tone positions FreeTrustDocs as a credible, reliable resource.

**Caveat:** The Modern Steward is less welcoming than The Clear Guide. For users who are anxious about legal documents — a significant portion of FreeTrustDocs' target audience — the structured, mono-heavy aesthetic could feel intimidating. The risk is that the site looks professional but doesn't reduce the user's anxiety, which is the primary UX goal.

---

## Direction 3 — The Warm Estate Library

### Intended emotional impression

"This has been here for you." The Warm Estate Library feels like a private archive or a family office library — quiet, enduring, and human. The user should feel they've entered a space where important documents are treated with care, where generational continuity is the subtext, and where the tool is a steward of something that matters. It is the most atmospheric and least systematic of the three directions.

### How the current logo and colors are used

- **Forest green** is the library's wood — used for the header, footer, section dividers, and document-preview frames. Green feels like the paneling of a study, not the paint of an institution.
- **Bronze** is the library's brass — used for accent rules, registration dots, small ornamental marks (not decorative flourishes — just the existing registration-line pattern used more deliberately), and the key+scroll logo's accent. Bronze feels like a plaque or a nameplate.
- **Cream** is the library's paper — the dominant surface, with the paper-grain texture emphasized. The tactile quality is the point. This direction leans most heavily into the existing paper texture.
- **White** surfaces are rare — used only inside document previews. Most surfaces are cream or cream-dark, creating a continuous warm field.
- **Color distribution:** ~75% cream/cream-dark surface, ~18% forest green (text, header, footer, structural elements), ~7% bronze (accents, rules, marks).

### Recommended typography hierarchy

| Role | Font | Size | Weight | Treatment |
|---|---|---|---|---|
| Display / H1 | Crimson Pro | 2.75rem (44px) | 600 | The largest of all three directions. Generous, literary. Leading 1.15. |
| H2 | Crimson Pro | 2rem (32px) | 600 | Section headers with bronze rule beneath |
| H3 | Crimson Pro | 1.5rem (24px) | 600 | Card titles |
| H4 | Crimson Pro | 1.25rem (20px) | 500 | Wizard step titles — serif throughout, even in the wizard |
| Body | Inter | 17px | 400 | Line-height 1.75 — the most generous line height of all three |
| Body small | Inter | 0.85rem | 400 | Meta, captions |
| Labels / kickers | Crimson Pro | 0.8rem | 600 | Italic, not uppercase — a literary kicker, not a systematic label |
| Tabular figures | Inter (tnum) | inherits | inherits | All numbers tabular |

### Color-distribution rules

1. **Cream is the world.** The page is overwhelmingly cream — warm, tactile, continuous. White surfaces are rare islands, not the default.
2. **Green is structural, not decorative.** Header, footer, heading text, primary buttons. The green frame holds the cream content.
3. **Bronze is ornamental precision.** Thin rules, small dots, italic kickers, citation text. Bronze adds the "brass nameplate" quality — sparingly, deliberately.
4. **Cream-dark surfaces create depth.** Used for callout backgrounds, section bands, and the wizard's surrounding area — creating a layered, warm field rather than a flat white page.
5. **The paper-grain texture is a feature, not a substrate.** It should be visible enough to register consciously on first load — a tactile signal that this is a different kind of site.

### Layout, grid, whitespace, borders, surface, radius, and shadow approach

- **Grid:** Asymmetric and editorial. Document hub pages use a 7/5 split — main content on the left, a sidebar with "Related Documents" or "What You Should Know" on the right. The grid feels composed, not gridded.
- **Whitespace:** The most generous of all three directions. Section padding at 5rem vertical. Paragraph spacing at 1.25rem. The page should feel like turning the pages of a well-designed book — unhurried, spacious.
- **Borders:** 1px borders in the warm border color (`#d4cfc4`). Section dividers use the bronze registration-line pattern. The overall feel is of thin, warm rules — not sharp grid lines.
- **Surface:** Layered cream. The body is cream with paper grain. Sections alternate between cream and cream-dark. Cards are cream-dark with 1px borders — not white. This creates a continuous warm field with subtle layering.
- **Radius:** 4px, same as all directions. But the radius matters less here because most surfaces are cream-on-cream — borders, not boundaries, define edges.
- **Shadow:** The most minimal of all three. `0 1px 2px rgba(26, 60, 52, 0.06)` — barely visible. Most depth is created by cream/cream-dark layering, not shadows. The library doesn't need shadows — it has surfaces.

### Art direction for imagery, illustrations, icons, and document previews

- **Photography:** Considered, but only if it can be done right. If used: a single, muted, editorial photograph on the homepage — not stock photos of families or handshakes, but something like a close-up of paper, a desk surface, or a shelf of bound volumes. Desaturated, warm-toned, treated like a magazine plate. If this cannot be sourced at high quality, omit it — the direction works without photography.
- **Illustrations:** None. Same as all directions.
- **Icons:** Minimal line icons, same as Direction 1. Forest green, 1.5px stroke.
- **Document previews:** Rendered as HTML on a cream-dark card with a 1px bronze border — like a document laid on a leather desk surface. The preview shows the document's title in Crimson Pro, article structure, and signature block. The bronze border is the "frame" — it makes the preview feel like an artifact, not a UI element.

### Homepage hero and primary CTA treatment

The hero is the most spacious and literary:

```
[italic kicker: Free trust documents — no signup, nothing leaves your browser]

Create your trust document.
Answer a few questions. Receive a finished document,
ready to sign and file.

[Primary button: Start Your Document →]  [Text link: Browse the Library]

[Below: a horizontal row of three document types, separated by bronze registration lines — not cards]
```

- The hero uses the full container width with 6rem top padding and 5rem bottom padding.
- The italic kicker is Crimson Pro italic, 0.8rem, bronze — it reads like a chapter epigraph, not a section label.
- The H1 is Crimson Pro 2.75rem — the largest of all directions. Three lines, leading 1.15. The line break after "Receive a finished document," is deliberate — it creates a pause, a breath.
- The subheading is part of the H1 block, not a separate element — the whole hero reads as one composed statement.
- Primary button: forest green, cream text, 4px radius — same as all directions. But slightly larger padding (0.6rem 1.75rem) to match the generous spacing.
- Below the hero: document types presented as a horizontal list with bronze registration-line dividers between them — not as cards. This feels like a table of contents, not a product grid.

### Trust/proof section treatment

Structured as a narrative section, not a grid or list:

```
[italic kicker: Privacy & Process]

Nothing leaves your browser.

Your document is generated entirely on your device.
No information is sent to a server, stored in a database,
or associated with an account — because there is no account.

Each document template is based on the governing statute
for your state, with citations you can verify.

[Small text: Last reviewed August 18, 2026]
```

- This section reads as a short essay, not a spec sheet.
- The bronze italic kicker sets the tone — literary, not systematic.
- The text is composed in short paragraphs — each idea gets its own space.
- The statute citation is woven into the prose, not displayed as a data label.
- The "last reviewed" date is small, muted, and human — not a mono timestamp.

### Document library and template-card treatment

Presented as a horizontal list with dividers, not a card grid:

```
──────────────────────────────────────────────────────────
  Certificate of Trust
  Prove your trust exists to banks and title companies.
  5 questions · ~3 minutes · UTC §1013
                                              [Start →]
──────────────────────────────────────────────────────────
  Declaration of Trust
  Create a private contract trust agreement.
  8 questions · ~5 minutes · State-specific
                                              [Start →]
──────────────────────────────────────────────────────────
  Land Trust
  Hold real property privately for beneficiary protection.
  7 questions · ~4 minutes · IL, FL, and recognizing states
                                              [Start →]
──────────────────────────────────────────────────────────
```

- Each document is a row separated by bronze registration lines.
- The document name is H3 in Crimson Pro. The description is body text. The metadata is body-small, muted, with tabular figures.
- "Start →" is a right-aligned text link, not a button.
- On hover, the row background shifts to cream-dark — a subtle highlight, like running a finger down a table of contents.
- Mobile: same layout, single column, with the "Start →" link moving below the description.

### Guided intake / document-generation flow treatment

The wizard is the most human:

- **Cream-dark card on cream background**, max-width 720px, centered. The card is a warm surface, not a white one — it feels like a form on a desk, not a screen in an app.
- **Step indicator:** "Step 2 of 5" in Crimson Pro italic, bronze — literary, not systematic. No progress bar — the italic step text is the only progress signal. (A progress bar can be added if testing shows users need it, but the default is text-only for atmosphere.)
- **Question text in Crimson Pro 1.25rem, weight 500** — serif, warm. The wizard questions feel like a conversation, not a form.
- **Helper text in Inter body-small** — positioned below the input, same as all directions.
- **Radio choices as cards** — cream background (not white), 1px border. Selected: 2px bronze border. The choices feel like options laid out on a desk.
- **Navigation:** "← Back" and "Continue →" with text arrows. Same button styling but slightly more padding.
- **Save reassurance:** "Your answers stay on your device. Close this tab whenever you need to — nothing is lost." — the language is warmer and more conversational than Direction 1 or 2.
- **Completion:** Success state with a literary touch — H2 "Your document is ready" followed by a one-line composed sentence: "Your Certificate of Trust is ready to download, review, and sign." The download button is primary, forest green. The TrustMinutes cross-link appears as a quiet, italic suggestion below — not a prominent card.

### How to display legal disclaimers without making the experience feel alarming

- **UPL notices use the existing `.upl-notice` pattern** with the bronze left-border and cream-dark background — they read as notes in a margin, not warning boxes.
- **Pre-download checkbox:** Same language as all directions, but presented in a warm, bordered box with an italic Crimson Pro label ("Please acknowledge:") — feels like a polite request, not a legal gate.
- **Footer disclaimer:** Same as all directions. The warm, literary tone of the page naturally accommodates legal language — it reads like a colophon, not a warning.
- **Key principle:** Disclaimers are integrated into the reading flow, not separated from it. They belong in the text, not above it or below it in a warning-colored box.

### Mobile considerations

- Single-column, same as all directions.
- The generous spacing needs to be reduced on mobile — 3rem section padding instead of 5rem. The literary feel should come from typography, not from empty space that becomes awkward on small screens.
- The horizontal document list stacks vertically on mobile — each document becomes a block with the "Start →" link below.
- The italic step indicator ("Step 2 of 5") works well on mobile — it's compact and readable.
- The H1 reduces to 2rem on mobile — 2.75rem is too large for a 375px viewport.

### Risks and anti-patterns

- **Risk: Too literary for a tool.** The Warm Estate Library's atmospheric, book-like character could undermine the utility-first impression. Users might wonder if this is a reading site or a document generator. Mitigation: the wizard flow and download button are unmistakably functional — the literary treatment is the wrapper, not the product.
- **Risk: Feels old-fashioned.** The library/archive aesthetic could read as dated rather than timeless. Mitigation: the Inter body font, the functional wizard, and the clean registration-line dividers keep the site feeling modern. The warmth comes from composition, not from vintage decoration.
- **Risk: Performance from texture.** The paper-grain texture, if emphasized too heavily, could affect load time. Mitigation: the SVG texture is already small (~2KB). Keep it as a subtle background, not a full-page overlay.
- **Anti-pattern to avoid:** Do not add vintage decorations — wax seals, quill icons, parchment backgrounds, classical column ornaments. The "library" feeling comes from composition and restraint, not from props.
- **Anti-pattern to avoid:** Do not let the literary tone override clarity. Every sentence, no matter how well-composed, must be immediately understandable by someone who has never read a trust document before.

### Why this direction does or does not fit FreeTrustDocs

**Fits, but with the most risk.** The Warm Estate Library is the most visually distinctive direction — it would immediately differentiate FreeTrustDocs from every competitor (eForms, LegalTemplates, Trust & Will, RocketLawyer). The editorial, archival character signals "we treat your documents with care" in a way that neither the Clear Guide's utility nor the Modern Steward's precision can match. For a brand called "FreeTrustDocs" positioned in a portfolio alongside TrustMinutes and TrustOffice, the library aesthetic reinforces the portfolio's trust-first identity.

**Risk:** The Warm Estate Library is the hardest to execute well. It requires the most typographic craft, the most careful composition, and the most disciplined restraint. If the execution is slightly off — too much warmth, too much atmosphere, too literary — it tips into pastiche. And it is the least "tool-like" of the three, which could confuse users who expect a form-generator and find a library.

---

## Recommendation

### Recommended direction: The Clear Guide (Direction 1)

### Why it best serves people making consequential legal decisions

The Clear Guide is recommended because it directly addresses the primary emotional state of FreeTrustDocs' users: **uncertainty**. People arriving at a free trust document generator are not lawyers. They are individuals who need a trust document and are unsure whether they can do this themselves, whether the result will be valid, and whether they can trust a free tool. The Clear Guide reduces that uncertainty at every touchpoint:

1. **Explanation over institution.** The Clear Guide prioritizes helping users understand what they're creating, not impressing them with institutional credibility. For people who feel uncertain, understanding is more reassuring than authority. The Modern Steward impresses; The Clear Guide empowers.

2. **Guided progress over structured precision.** The wizard — the core product — is designed as a patient guide, not a systematic form. "Step 2 of 5" with a progress bar and just-in-time help text serves completion better than mono fraction labels and section headers. People who are anxious complete forms that feel like conversations, not forms that feel like forms.

3. **Editorial calm over atmospheric warmth.** The Clear Guide's restraint — generous whitespace, limited color, no decoration — reads as competence without pretension. The Warm Estate Library's atmosphere is beautiful but risks feeling like a place to read, not a place to act. For a tool whose success metric is document completion, the Clear Guide's utility-forward character is the safer bet.

4. **Scalability.** As FreeTrustDocs adds document types (Phase 2: Revocable Living Trust, Irrevocable Trust, Will, POA), the Clear Guide's system scales cleanly — each new document type gets a card, a wizard, and statute citations. The Warm Estate Library's literary composition is harder to scale across 6+ document types without becoming repetitive or losing its atmospheric quality.

5. **Differentiation.** The Clear Guide's editorial, text-forward, no-photography character differentiates FreeTrustDocs from every competitor: eForms (cluttered ad-site), LegalTemplates (generic WordPress), Trust & Will (cartoon illustrations + paid), RocketLawyer (corporate legal service). It looks like none of them, which is exactly the point.

### The three primary visual principles that should govern all future FreeTrustDocs pages

1. **Restraint is the trust signal.** Every visual decision should be evaluated against the question: does this add clarity, or does it add noise? Forest green for authority, bronze for guidance, cream for comfort — and nothing else. No gradients, no glassmorphism, no decorative elements, no stock photography. The absence of visual noise IS the brand. When in doubt, remove.

2. **Typography is the interface.** FreeTrustDocs has no photography, no illustrations, and no decorative imagery. The visual experience is entirely typographic. Crimson Pro for authority and warmth (headings, card titles, wizard questions), Inter for clarity and function (body, buttons, labels), JetBrains Mono for precision and structure (step indicators, kickers, UPL notices). Every page must demonstrate typographic craft — hierarchy, spacing, leading, tracking, and weight differences that guide the eye without decoration.

3. **The document is the hero.** Every page exists to help the user create, understand, or find a trust document. The document — its preview, its structure, its statute basis, its completion flow — is always the most important element on the page. Marketing copy, navigation, cross-links, and ads (when added) must defer to the document. If a page element doesn't serve document creation or understanding, it should be demoted or removed.

### Design decisions — approved by Jeff, August 19, 2026

1. **Direction: The Clear Guide.** ✅ Approved.

2. **Icons and diagrams included.** ✅ Amended — Jeff wants icons and diagrams for visual appeal. No photography or cartoon illustrations, but functional line icons (search, download, check, arrow, document, shield, lock) and editorial diagrams (trust structures, document relationships, process flows) are included. Icons supplement text labels; diagrams earn their place by making something clearer than text alone.

3. **Document previews as styled HTML.** ✅ Approved. Render actual document structure in Crimson Pro on a white card — not PDF thumbnails.

4. **Statute citations on document cards.** ✅ Approved. Governing statute (e.g., "UTC §1013") shown on each document card as a trust signal.

5. **Wizard progress: dual indicator.** ✅ Approved. Text "Step 2 of 5" + visual progress bar. (Clear Guide default.)

6. **TrustMinutes cross-link: subtle card.** ✅ Approved. At download success — present but not pushy.

7. **Paper-grain texture: subtle substrate.** ✅ Approved. (Clear Guide default — present but not emphasized as a conscious feature.)

8. **"Last reviewed" date stamps: implemented.** ✅ Approved. Show on document cards and in trust section. Requires a maintenance process to review and update dates.