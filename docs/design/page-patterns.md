# FreeTrustDocs — Page Patterns

**Direction:** The Clear Guide (approved August 19, 2026)
**Date:** August 19, 2026
**Status:** Canonical page recipes for all FreeTrustDocs pages

---

## How to Read This Document

Each page pattern defines: user goal, primary user question, required content hierarchy, primary action, secondary action, suitable components, trust/disclosure requirements, desktop and mobile behavior, loading/empty/error/success states, and anti-patterns to avoid.

These are recipes, not wireframes. The specific content varies per document type and state, but the structure is consistent.

---

## 1. Homepage

| Field | Value |
|---|---|
| **User goal** | Understand what FreeTrustDocs does and start creating a document |
| **Primary question** | "Can I create a trust document here, for free, without risk?" |

### Content hierarchy (in order, per homepage requirements)

1. **What FreeTrustDocs helps people do** — H1: "Create your trust document." + subheading: "Answer a few questions. Download a finished PDF."
2. **Who it is for** — implicit in the plain language. No "for individuals and families" tagline needed — the tone signals it.
3. **Why the service is useful and accessible** — "No account. No fees. Nothing leaves your browser." in the hero subheading.
4. **How the process works** — 4-step flow section: Answer → Review → Assemble → Download. Each step has a one-sentence description with a line icon.
5. **What users receive** — Document preview showcase (before/after transformation). Shows the actual document structure.
6. **Important limitations or context** — UPL notice in the trust section: "FreeTrustDocs is not a law firm and does not provide legal advice."
7. **Why users can trust the experience** — Trust section: "Nothing leaves your browser" + statute citations + "Last reviewed" dates.
8. **One calm, direct next step** — Primary CTA: "Start a Document →"

### Components

- Hero: H1 + subheading + primary button + text link
- Document type cards (3-column grid on desktop, stacked on mobile)
- Process flow: 4 steps with line icons and descriptions
- Document preview showcase (before/after)
- Trust/proof section: privacy statement + statute citations + review dates
- FAQ accordion
- Footer with UPL disclaimer

### Desktop behavior

Hero is full-width (1100px container) with generous 6rem top padding. Document cards in 3-column grid. Process flow in horizontal 4-column layout. Trust section as a narrative block (not a grid).

### Mobile behavior

Hero reduces padding to 3rem. H1 reduces to 2rem. Document cards stack to single column. Process flow stacks vertically with numbered steps. Trust section stays as narrative. FAQ accordion remains inline. Nav becomes hamburger.

### States

- **Loading:** N/A — static page, no async content
- **Empty:** N/A
- **Error:** N/A
- **Success:** N/A — homepage is not a task page

### Anti-patterns to avoid

- Multiple primary CTAs competing for attention
- Carousel of testimonials (no testimonials yet — don't fabricate)
- Video background or animated hero
- "Trusted by" logo strip (no partners to show yet)
- Full-bleed dark CTA band that breaks the cream rhythm (the existing `.proof-cta` should be softened)

---

## 2. Document Library

| Field | Value |
|---|---|
| **User goal** | Browse available document types and choose one to create |
| **Primary question** | "Which document do I need?" |

### Content hierarchy

1. H1: "Trust Documents" + subheading: "Choose a document type to get started."
2. Document type cards or rows (all available types)
3. "Not sure which document you need?" callout with plain-language explanations
4. "Best States for Trusts" link if relevant
5. Footer with UPL disclaimer

### Components

- Document type cards (grid) or document library rows (list)
- Educational callout (Info variant) explaining the difference between document types
- Links to individual document landing pages

### Desktop behavior

Cards in 3-column grid (1100px container). Rows in single-column list with registration-line dividers. Educational callout above the grid.

### Mobile behavior

Cards or rows stack to single column. Callout remains inline. No horizontal scroll.

### Anti-patterns to avoid

- Category filter sidebar (only 3 document types — a filter is unnecessary complexity)
- Search bar (not enough content to justify it yet)
- Pagination (all documents fit on one screen)

---

## 3. Individual Document Landing Page

| Field | Value |
|---|---|
| **User goal** | Understand a specific document type and start the wizard |
| **Primary question** | "Is this the right document for me, and can I trust it?" |

### Content hierarchy

1. Breadcrumb: Home > [Document Type]
2. H1: Document name (e.g., "Certificate of Trust")
3. Subheading: Plain-language description (1-2 sentences)
4. Primary CTA: "Start [Document Name] →"
5. "What this document does" section — plain language explanation with editorial diagram if helpful
6. "What you'll need" section — list of information required (trust name, settlor, trustee, etc.)
7. "How it works" — 4-step mini flow (Answer → Review → Download → Sign)
8. Document preview card — showing the structure of the generated PDF
9. Statute citation + "Last reviewed" date
10. FAQ accordion (document-specific questions)
11. UPL notice
12. Footer

### Components

- Document type card (for the current document — shows metadata, statute, review date)
- Document preview card
- Callout (Tip variant) for "What you'll need"
- Process flow (compact, 4 steps)
- FAQ accordion
- UPL notice
- Primary CTA button

### Desktop behavior

Two-column layout: main content (left, 7/12) + sticky sidebar with document preview and CTA (right, 5/12). On scroll, the CTA remains visible.

### Mobile behavior

Single column. CTA appears after the subheading and again at the bottom. Document preview collapses to `<details>`. Sidebar content moves below main content.

### Trust requirements

- Statute citation visible on the page (not hidden in a tooltip)
- "Last reviewed" date stamp
- UPL notice before the footer
- Link to full disclaimer page

### Anti-patterns to avoid

- Long-form SEO content that buries the CTA (the user came to create a document, not read an article)
- Pricing table (it's free)
- Comparison with paid competitors
- "Limited time" or urgency framing

---

## 4. Document Comparison / Selection Page

| Field | Value |
|---|---|
| **User goal** | Compare document types to choose the right one |
| **Primary question** | "What's the difference between these documents?" |

### Content hierarchy

1. H1: "Which Trust Document Do You Need?"
2. Short introduction (2-3 sentences)
3. Comparison table: document types as columns, attributes as rows (what it does, who it's for, questions, time, statute, states recognized)
4. "Still not sure?" callout with link to FAQ or guide
5. Primary CTAs for each document type
6. UPL notice
7. Footer

### Components

- Data table (responsive, horizontal scroll on mobile)
- Callout (Info variant) for guidance
- Primary buttons (one per document type — but visually equal, no "recommended" badge)

### Desktop behavior

Table with 3-4 columns. First column is attributes, remaining columns are document types. Header row in forest green.

### Mobile behavior

Table transforms to stacked card layout — each document type becomes a card with key-value pairs. No horizontal scroll.

### Anti-patterns to avoid

- "Recommended for you" logic (FreeTrustDocs never recommends — user chooses from a menu)
- Green checkmarks vs red X marks (use "Yes" / "No" / "N/A" text instead)
- Highlighting one column as "most popular"

---

## 5. Guided Document-Intake Flow (Wizard)

| Field | Value |
|---|---|
| **User goal** | Answer questions and generate a completed trust document |
| **Primary question** | "What do I need to enter, and will this produce a valid document?" |

### Content hierarchy (per step)

1. Progress stepper (dual indicator: "Step 2 of 5" + segmented bar)
2. Step title (H4, Crimson Pro) — the question being asked
3. Helper text (if needed) — why this information is needed, in plain language
4. Form controls (input, select, radio cards, or checkbox group)
5. Validation errors (if any) — inline, below the field
6. Navigation: "Back" (quiet link) + "Continue to [next step]" (primary button)
7. Save status indicator: "Saved in this browser" with pulsing dot

### Components

- Progress stepper
- Text inputs, selects, radio card groups, checkbox groups
- Helper text (`.wizard-field-note`)
- Validation error text (`.wizard-error`)
- Save status bar (`.wizard-statusbar`)
- Document preview (sidebar on desktop, `<details>` on mobile)
- Navigation buttons

### Guided-flow requirements

- **Explain why each question is asked:** Helper text below each field. "The settlor is the person who creates the trust and contributes the initial property." Not just "Settlor name:"
- **Plain language first, deeper explanation available:** Field label in plain English. Helper text provides context. Statute references in the document landing page, not in the wizard.
- **Honest progress:** "Step 2 of 5" with segmented bar. No fake progress (the bar fills as steps complete, not as fields fill).
- **Preserve answers:** localStorage with visible save status. User can close the tab and return.
- **Easy review and correction:** Review step before download. "Edit" links jump back to specific steps.
- **Distinguish guidance from legal advice:** Helper text is informational ("This is the name that will appear on your document"). Never advisory ("You should name a successor trustee to ensure continuity").
- **One decision per step:** Each step asks one question or a tightly related group. Never present all questions at once.

### Desktop behavior

Wizard card (max 720px) centered. Document preview sticky sidebar on the right (for Certificate of Trust wizard with preview). Navigation at the bottom of the card.

### Mobile behavior

Wizard card fills viewport. No sidebar — document preview collapses to `<details>` below the step. Sticky navigation bar at the bottom of the screen (safe-area aware). Radio cards are full-width, min 48px height.

### States

| State | Behavior |
|---|---|
| Loading (PDF generation) | Button shows "Generating…" + pulsing dot, disabled |
| Empty (no input yet) | Fields show placeholder examples, preview shows blank lines |
| Error (validation) | Inline error below field, `--color-error` border, `role="alert"` |
| Error (PDF generation) | "Something went wrong creating your PDF" + retry button + collapsed debug details |
| Saved progress | Pulsing dot + "Saving…" → "Saved in this browser" |
| Success | Download success state (see component specs) |

### Anti-patterns to avoid

- Multi-column form layout (one field per row, always)
- "Required" asterisks without explanation (use helper text instead)
- Progress bar that fills based on field completion, not step completion
- Preventing backward navigation (always allow "Back")
- Auto-advancing when a field is filled (let the user click "Continue")
- Legal jargon in field labels ("Fiduciary designation" → "Trustee name and address")

---

## 6. Review-and-Confirm Page

| Field | Value |
|---|---|
| **User goal** | Verify all answers are correct before generating the document |
| **Primary question** | "Did I enter everything correctly?" |

### Content hierarchy

1. Progress stepper (final step)
2. H2: "Review Your Document"
3. Helper text: "Check your answers below. You can edit any section before generating your document."
4. Review groups (one per wizard section): header + key-value rows + "Edit" link
5. UPL acknowledgment checkbox: "I understand this is a legal document template, not legal advice. I should consult an attorney in my state before signing."
6. Primary CTA: "Generate PDF"
7. "Back" quiet link

### Components

- Review panel (`.wizard-review` family)
- Checkbox (acknowledgment variant)
- Primary button
- Quiet link

### Desktop behavior

Review groups stacked vertically, full width of the wizard card. Checkbox above the generate button.

### Mobile behavior

Same layout, single column. Checkbox with large tap target. Generate button full-width.

### Anti-patterns to avoid

- Showing raw form input without grouping (always group by section)
- "Edit" links that reset the entire form (edit should jump to the specific step)
- Generating the PDF before the acknowledgment checkbox is checked
- Hiding the UPL text behind a tooltip or modal

---

## 7. Document Completion, Download, and Next-Steps

| Field | Value |
|---|---|
| **User goal** | Download the finished document and understand next steps |
| **Primary question** | "Is my document ready, and what do I do with it now?" |

### Content hierarchy

1. Checkmark icon (forest green, 24px)
2. H2: "Your document is ready"
3. Document summary: "Certificate of Trust | California | Generated [date]" (mono, muted)
4. Primary CTA: "Download PDF"
5. "What to do next" section:
   - "Print and sign your document in front of a notary"
   - "Store the signed copy in a safe place"
   - "Keep your trust records organized — try TrustMinutes (free)" [subtle cross-link card]
6. "Create another document" quiet link
7. UPL notice (reminder)

### Components

- Checkmark line icon
- Download button (primary)
- TrustMinutes cross-link card (subtle)
- UPL notice
- Quiet link

### Desktop behavior

Centered, max-width 720px (narrow). Cross-link card below the download button, visually subordinate.

### Mobile behavior

Same layout, single column. Download button full-width. Cross-link card full-width.

### Anti-patterns to avoid

- Confetti or celebratory animation
- Multiple cross-link cards competing for attention
- "Rate your experience" prompt
- Email capture modal (not decided yet — and if added, must not block the download)
- Hiding the download button behind a secondary action

---

## 8. Account / Dashboard

**Note:** FreeTrustDocs has no accounts. This page is aspirational and may be built if email capture is implemented. Define now to ensure consistency if it ships.

| Field | Value |
|---|---|
| **User goal** | View and manage saved documents (future feature) |
| **Primary question** | "What documents have I created?" |

### Content hierarchy

1. H1: "Your Documents" (or "Saved Documents")
2. Empty state (if no documents): "You haven't created any documents yet. [Start a document →]"
3. Document list (if documents exist): rows with document type, date created, state, "Download again" link, "Start over" link
4. Privacy reminder: "Your documents are stored only in this browser. Clearing your browser data will remove them."

### Anti-patterns to avoid

- Requiring an account to view saved documents (client-side storage means no account needed)
- "Upgrade to Pro" upsell (there is no Pro)
- Dashboard widgets unrelated to document creation

---

## 9. Saved Documents Page

Same as Account/Dashboard above. If email capture is implemented, this page shows documents associated with the user's browser (localStorage) or email (if they opt in). The privacy implication of email-based storage must be clearly stated.

---

## 10. Educational Article / FAQ Page

| Field | Value |
|---|---|
| **User goal** | Learn about trust documents, estate planning, or a specific legal concept |
| **Primary question** | "How does this work, and what do I need to know?" |

### Content hierarchy

1. Breadcrumb: Home > [Topic] > [Article]
2. H1: Article title
3. "Last reviewed" date stamp
4. Article body (narrow column, 720px) with:
   - H2 section headings
   - Body copy with generous line-height (1.75)
   - Callouts for key concepts
   - Editorial diagrams where helpful
   - Links to relevant document creation pages
5. "Related documents" section at the bottom
6. UPL notice
7. Footer

### Components

- Callouts (Info, Tip, Warning variants)
- Editorial diagrams (line diagrams for trust structures)
- Document type cards (compact, in "Related documents" section)
- UPL notice
- FAQ accordion (if the article includes Q&A)

### Desktop behavior

Single column, 720px narrow width. Generous whitespace. Reading-optimized.

### Mobile behavior

Same single column. Padding reduces but font-size stays at 17px.

### Anti-patterns to avoid

- SEO-first content walls (walls of text with no hierarchy)
- Auto-rotating "related articles" carousel
- Inline ads that break the reading flow (ads should be placed between sections, not mid-paragraph)
- Jargon-first introductions (always start with the plain-language outcome)

---

## 11. Support / Contact Page

| Field | Value |
|---|---|
| **User goal** | Find help or contact information |
| **Primary question** | "How do I get help with my document?" |

### Content hierarchy

1. H1: "Help"
2. "Common questions" — FAQ accordion with the top 5-10 questions
3. "Contact us" — email address or contact form (if implemented)
4. "Before you contact us" callout: "FreeTrustDocs is not a law firm and cannot answer legal questions about your specific situation. For legal advice, consult a licensed attorney in your state."
5. UPL notice
6. Footer

### Anti-patterns to avoid

- Live chat widget (not staffed, would erode trust)
- "We typically respond in 24 hours" promise (unless actually staffed)
- Legal advice in support responses
- Hiding the "not a law firm" disclaimer

---

## 12. Privacy, Terms, Legal Disclaimer, and Policy Pages

| Field | Value |
|---|---|
| **User goal** | Understand the legal terms and privacy policy |
| **Primary question** | "What are my rights and what does FreeTrustDocs do with my information?" |

### Content hierarchy

1. H1: Page title (e.g., "Privacy Policy", "Terms of Use", "Disclaimer")
2. "Last updated" date
3. Body content (narrow column, 720px) with clear H2 section headings
4. Plain-language summary at the top (3-4 sentences)
5. Full legal text below
6. Links to other legal pages
7. Footer

### Components

- Callout (Info variant) for plain-language summary at the top
- H2 section headings
- Body copy with good hierarchy
- Links between legal pages

### Desktop behavior

Single column, 720px narrow. Generous whitespace. Reading-optimized.

### Mobile behavior

Same single column.

### Privacy page specific requirements

- State clearly: "Nothing leaves your browser. Your answers are not sent to a server. No account is required."
- Explain localStorage usage: "Your wizard answers are saved in your browser's local storage so you can return to an incomplete document. Clearing your browser data will remove them."
- Explain analytics: "We use [analytics tool] to understand site usage. No personal information from your document answers is ever tracked."
- If email capture exists: explain what happens to the email address

### Disclaimer page specific requirements

- Full UPL text: what FreeTrustDocs provides (document templates based on real statutes) and what it does NOT provide (legal advice, attorney review, jurisdictional validation)
- User responsibilities: review the document, consult an attorney, sign and notarize
- No attorney-client relationship
- Template-based, not attorney-created

### Anti-patterns to avoid

- Legalese walls with no plain-language summary
- Buried limitations in small print
- "By using this site you agree to..." without a visible link to the terms
- Privacy policy that claims more data protection than the technology actually provides