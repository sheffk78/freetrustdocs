# FreeTrustDocs — Pre-Implementation Design-System Validation

**Date:** August 19, 2026
**Reviewer:** Kit (design lead)
**Scope:** All files in `docs/design/`
**Direction under review:** The Clear Guide
**Decision:** This is a validation document only. No code or design files were modified.

---

## 1. Direction Integrity

These are the rules that make this system distinctly The Clear Guide — not generic legal SaaS, not a law-firm site, not a template marketplace.

| # | Rule | Source document | Heading |
|---|---|---|---|
| 1 | **Restraint is the trust signal.** Visual noise reads as salesmanship; calm reads as competence. No gradients, no glassmorphism, no decorative elements. The absence of noise IS the brand. | direction-options.md | "The three primary visual principles" — Principle 1 |
| 2 | **Typography is the interface.** No photography, no cartoon illustration. Visual experience is entirely typographic — hierarchy, spacing, leading, and weight carry everything. | direction-options.md | "The three primary visual principles" — Principle 2 |
| 3 | **The document is the hero.** Every page serves document creation or understanding. Marketing, navigation, cross-links, and ads defer to the document. | direction-options.md | "The three primary visual principles" — Principle 3 |
| 4 | **One primary action per screen.** Forest green is reserved for the single most important action. Secondary actions are text links or outline buttons — visibly subordinate. | visual-language.md | §6.1 Action hierarchy; do-not-do.md #13 |
| 5 | **Disclaimers use bronze, never red.** Legal limitations are information, not danger. They sit at body size, in context, near the decision they affect — never hidden in fine print. | content-and-trust.md | §6.1 Placement rules; do-not-do.md #20 |
| 6 | **Color carries meaning, not decoration.** Forest green = authority/action. Bronze = guidance/accent. Cream = comfort/surface. Red = validation errors only. No color appears without a semantic reason. | visual-language.md | §6.4 Distribution rules; do-not-do.md #6 |
| 7 | **Progressive disclosure: outcome before legal detail.** Every concept starts with a plain-language outcome, then introduces the legal term. A user who reads only Layer 1 must be able to finish. | content-and-trust.md | §4 Outcome-first rule; §5 Progressive disclosure |
| 8 | **No unverified claims.** Only 4 claims are permitted: client-side generation, no signup, based on real statutes (with citations), template-based (not attorney-created). No "attorney-approved," no "legally valid," no "bank-grade security." | content-and-trust.md | §1 Core commitments, verified-claims table |
| 9 | **4px radius is a hard rule.** It keeps surfaces feeling like printed cards rather than software buttons. No pill shapes, no fully rounded controls. If a component feels wrong at 4px, the component is wrong. | visual-language.md | §2.3 Radius, shadow, texture |
| 10 | **No pressure, ever.** No countdowns, no urgency, no exit-intent popups, no scarcity. The document is free and will be here tomorrow. Reassurance, not urgency, is the conversion lever. | content-and-trust.md | §9.2 Pressure patterns prohibited; do-not-do.md #14 |

---

## 2. Contradictions and Gaps

18 contradictions found across the 9 design documents. The primary cause: `visual-language.md` (written by a subagent) introduced a parallel token naming scheme that conflicts with `tokens.md` (written by another subagent) and the existing `global.css`. Both subagents were given the same source material but independently invented different naming conventions.

### Blockers (5) — must resolve before any implementation

| # | Contradiction | Docs in conflict | Resolution |
|---|---|---|---|
| B1 | **Token naming scheme.** visual-language.md renames all colors (`--color-forest`, `--color-ink`, `--color-rule`, `--color-bronze`). tokens.md, component-specs.md, and existing global.css all use `--color-primary`, `--color-text`, `--color-border`, `--color-accent`. These are completely different naming schemes for the same colors. | visual-language.md vs. tokens.md, component-specs.md, global.css | **tokens.md wins.** It preserves existing token names, which are already in production across 61 pages. visual-language.md's renamed tokens should be updated to use the existing names. The semantic roles (forest=primary, bronze=accent, ink=text, rule=border) can be documented as aliases or descriptions, but the CSS variable names must match what's in global.css. |
| B2 | **Spacing scale.** visual-language.md defines a 9-step scale (`--space-1` through `--space-9`, adding 12px and 32px steps). tokens.md and existing global.css use a 7-step scale (`--space-xs` through `--space-3xl`) without 12px or 32px. | visual-language.md vs. tokens.md, global.css | **tokens.md wins.** The existing 7-step scale is in production. Adding 12px and 32px is reasonable but should be additive (new tokens `--space-sm-md` and `--space-md-lg`) rather than a full renumber. visual-language.md should be updated to use the existing scale names. |
| B3 | **Focus ring.** visual-language.md says 2px bronze. tokens.md says 3px `#2d5a4e` (primary-light). component-specs.md says 2px `--color-primary`. Three different colors and two widths. | visual-language.md, tokens.md, component-specs.md | **Recommendation: 2px `--color-primary` with 2px offset.** Bronze focus rings conflict with bronze decorative elements (registration-line dots, accent rules), making it hard to distinguish focus from decoration. Primary-light (#2d5a4e) is too close to primary to read as a distinct ring. Primary (#1a3c34) at 2px is visible, distinct from decoration, and matches the existing global.css pattern. tokens.md's 3px width is excessive for the editorial tone. |
| B4 | **Wizard progress pattern.** visual-language.md §11.4 describes a left rail with step numbers and status icons, explicitly says "No progress percentage. The step rail is the progress." component-specs.md and page-patterns.md describe a dual indicator (text "Step 2 of 5" + segmented bar) matching Jeff's approved decision #5. | visual-language.md vs. component-specs.md, page-patterns.md, direction-options.md | **Approved decision wins.** Jeff approved the dual indicator (text + segmented bar). visual-language.md §11.4 must be updated to match. The left-rail concept can be retained as the desktop layout for the progress stepper, but the segmented bar and "Step X of N" text must be present. |
| B5 | **Data persistence.** content-and-trust.md §7.5 says "answers live in the browser tab and are cleared when the tab is closed or the page is refreshed." component-specs.md says "localStorage persistence lets users close and return." The existing wizard already uses localStorage. These are contradictory claims about the same feature. | content-and-trust.md vs. component-specs.md, existing wizard code | **localStorage wins (existing behavior).** The wizard already persists to localStorage and shows "Saved in this browser" status. content-and-trust.md §7.5 must be corrected to describe localStorage behavior accurately: "Your answers are saved in your browser's local storage so you can return to an incomplete document. Clearing your browser data will remove them." |

### Must resolve before canonical build (10)

| # | Contradiction | Docs in conflict | Resolution |
|---|---|---|---|
| M1 | **Font size token names.** visual-language.md and tokens.md agree on new `--fs-*` names but component-specs.md uses old `--fs-display`/`--fs-h2` names. tokens.md provides alias mapping. | component-specs.md vs. tokens.md | Update component-specs.md to use new token names, noting the alias mapping during migration. |
| M2 | **Shadow tokens.** Three systems: visual-language (2 tokens, rgba 26,60,52), tokens.md (4 tokens, rgba 15,38,32), component-specs/impl (3 tokens, rgba 26,60,52, different values). | All four docs | **tokens.md wins** (most comprehensive, 4 tiers). Update the rgba base to 26,60,52 (matching primary color, not primary-dark) across all shadow tokens. Update visual-language and component-specs to use tokens.md names. |
| M3 | **Body text color.** visual-language: `--color-ink` (#1f2421). tokens.md: `--color-text` (#1a1a1a). Different values and names. | visual-language.md vs. tokens.md | **tokens.md wins.** Keep `--color-text: #1a1a1a` (existing, in production). visual-language's #1f2421 is a nice green-undertone alternative but changing it across 61 pages is unnecessary risk. |
| M4 | **Border color.** visual-language: `--color-rule` (#e3ddcf) + `--color-rule-strong` (#c9c1ad). tokens.md: `--color-border` (#d4cfc4). | visual-language.md vs. tokens.md | **tokens.md wins.** Keep `--color-border: #d4cfc4`. If a "strong border" variant is needed, add `--color-border-strong: #c9c1ad` as a new token. |
| M5 | **Warning color.** visual-language: #8a5a00. tokens.md: #8a6d1a. | visual-language.md vs. tokens.md | **tokens.md wins.** #8a6d1a is closer to the bronze family and more consistent with the palette. |
| M6 | **Utility class policy.** visual-language §13: "No utility classes." implementation-foundations Stage 2: creates 5 utility classes (.lede, .cta-row, etc.). | visual-language.md vs. implementation-foundations.md | **implementation-foundations wins** (pragmatic). The 492 inline styles in state pages need replacement classes. Prohibiting utility classes entirely is impractical for a site with 61 pages. Allow a small, defined set of utility classes for patterns that recur across many pages but don't warrant a full component. Document the allowed set. |
| M7 | **Content widths.** visual-language adds 520px "narrow." tokens.md adds 1280px "wide." Neither mentions the other. | visual-language.md vs. tokens.md | **Both are useful.** Add both: `--max-width-narrow: 520px` (renamed from current 720px, which becomes "reading"), `--max-width-reading: 720px`, `--max-width: 1100px`, `--max-width-wide: 1280px`. Or keep 3 widths: 520/720/1100 and add 1280 only if needed. The 520px width is useful for disclaimers and callouts. |
| M8 | **Breakpoints.** visual-language: 768/1024. tokens.md: 480/720/1024/1280. implementation-foundations: 480/768/1024. | All three docs | **tokens.md wins** (most complete, mobile-first). Use 480/720/1024/1280. The 720 boundary aligns with the reading width. Update visual-language and implementation-foundations to match. |
| M9 | **Heading weight.** visual-language: "Never bold (700)" for Crimson Pro, H1 uses 600. tokens.md: `--fw-bold: 700` for h1/h2. | visual-language.md vs. tokens.md | **tokens.md wins.** Crimson Pro at 700 for large display headings (H1, H2) is visually appropriate — the serif at 700 reads as authoritative, not heavy. visual-language's restriction to 600 max is overly conservative. Allow 700 for H1/H2 only; 600 for H3/H4. |
| M10 | **Pill radius.** do-not-do.md #8 prohibits pill-shaped controls. tokens.md §13 defines `--border-radius-pill: 999px`. | do-not-do.md vs. tokens.md | **do-not-do.md wins.** The approved direction is editorial and square-ish. Pills are prohibited. Remove `--border-radius-pill` from tokens.md. Status indicators use `--border-radius-sm` (2px) tags, not pills. |

### Can resolve during implementation (3)

| # | Contradiction | Resolution |
|---|---|---|
| C1 | **Error color.** visual-language: #8a2a2a. tokens.md: #8b2020. | Keep #8b2020 (existing). Difference is imperceptible. |
| C2 | **Success color.** visual-language: #2d5a3d. tokens.md: #2a5f3e. | Pick one during implementation. Either works. |
| C3 | **Ad placement policy.** content-and-trust prohibits ads on completion screen. No other doc addresses this. | Add a note to page-patterns §7 (completion page) stating "No ads on this screen per content-and-trust §10.4." |

---

## 3. Canonical Page Challenge

| Candidate | Trust test covered | Components validated | Risk | Reuse potential | Recommendation |
|---|---|---|---|---|---|
| **Homepage** | Privacy claim, statute citations, UPL footer, "free" framing, no-pressure CTA | Hero, document cards, process flow, document preview, callouts, trust section, FAQ accordion, footer — 8+ components | Medium — reworks an existing authored page; must preserve what works while fixing drift (4 card variants, dark proof CTA, duplicate sections) | Highest — every component built here is reused on every other page. Document cards → library. Process flow → landing pages. FAQ → all content pages. Footer → all pages. | **Recommended** |
| **Document landing page** | Statute citation display, "last reviewed" date, document preview, UPL notice placement, two-column layout | Document type card, document preview, callouts, FAQ accordion, primary CTA, breadcrumbs, statute citation, review date | Low — new page, no existing drift to fix. But narrower component coverage. | Medium — layout pattern reused for other document types, but fewer shared primitives tested. | Second build |
| **First step of guided intake** | Helper text quality, save-progress status, field validation, UPL boundary in helper text, privacy reminder | Progress stepper, text input, helper text, validation error, save status bar, navigation buttons, document preview sidebar | High — the wizard is the core product and the most complex interactive component. Building it first risks building on unresolved token conflicts. Also, it's already functional — rework is lower priority than fixing the homepage. | High but narrow — wizard components are reused across document types, but don't test marketing/education components. | Third build |

### Recommendation: Homepage

The homepage is the right canonical build because:

1. **It exercises the most components** — 8+ distinct component types in one page. If the homepage works, most of the design system is tested.
2. **It's the highest-traffic entry point** — every user sees it. Improvements here have the most impact.
3. **The audit identified specific drift** — 4 overlapping card variants, dark proof CTA band, duplicate "Available Trust Documents" section, dead CSS. These are concrete fixes, not speculative redesign.
4. **It's already the most authored page** — the hero→gallery→showcase flow is a visual anchor. The rework preserves what works and fixes what drifts, which is lower risk than building from scratch.
5. **It tests the token system end-to-end** — if tokens are wrong, the homepage will reveal it immediately across headings, body, cards, buttons, and the footer.

---

## 4. Design-System Readiness

| Area | Rating | Evidence | Required action |
|---|---|---|---|
| **Tokens** | Ready with minor fixes | tokens.md is comprehensive (90 tokens, full migration plan). 5 blockers and 10 must-resolve contradictions with visual-language.md need adjudication. | Resolve B1-B5 and M1-M10 per §2 resolutions. Update visual-language.md to use tokens.md naming. |
| **Fonts** | Ready | Three families defined (Crimson Pro, Inter, JetBrains Mono). Self-hosting decision approved. PDF font embedding approved. Weight, line-height, letter-spacing tokens defined in tokens.md. | Implement self-hosted woff2 with preload. Bundle Crimson Pro + Inter in pdfmake VFS. Resolve M9 (heading weight 700 vs 600). |
| **Component specs** | Ready with minor fixes | 15 component categories fully specified with anatomy, states, accessibility. Consolidation plan for 4 card variants → 1 and 3 preview components → 1. Uses old font-size token names (M1). | Update font-size token references to new scale. Resolve shadow token conflict (M2). |
| **Page patterns** | Ready | 12 page recipes with content hierarchy, components, responsive behavior, states, anti-patterns. Homepage has 8-point hierarchy. Wizard has all 6 guided-flow requirements. | Add ad-placement note to completion page (C3). No other actions needed. |
| **Mobile rules** | Ready with minor fixes | visual-language.md has detailed desktop/tablet/mobile behavior table. Breakpoint conflict (M8) between docs. Mobile nav hamburger approved. | Resolve breakpoint conflict per tokens.md (480/720/1024/1280). |
| **Interaction states** | Ready with minor fixes | Audit identified missing :active, :disabled, loading, and reduced-motion states. component-specs defines all states. Focus ring conflict (B3) needs resolution. | Resolve B3 (focus ring color/width). Add missing states during Stage 2 implementation. |
| **Accessibility** | Ready | visual-language §12 defines WCAG AA contrast targets, keyboard navigation, focus visibility, form error semantics, diagram text alternatives, reduced motion, touch targets, semantic HTML. content-and-trust defines plain-language reading level. | No actions needed. Accessibility spec is thorough. |
| **Content/trust standards** | Ready with minor fixes | content-and-trust.md is excellent — verified-claims table, progressive disclosure framework, good/poor examples, CTA standards, voice/tone for all states. Data persistence contradiction (B5) needs fix. | Resolve B5 (localStorage description must match existing behavior). |
| **Disclaimer patterns** | Ready | UPL notice placement defined in 4 layers (footer, dedicated page, checkbox gate, PDF embed). content-and-trust defines placement rules and how to state limitations. component-specs defines the UPL notice component. | No actions needed. |
| **Engineering adoption** | Blocked | 5 blockers (B1-B5) prevent implementation from starting. The token naming conflict (B1) means engineers don't know which variable names to use. Until visual-language.md is updated to match tokens.md, any code written will use the wrong names. | Resolve all 5 blockers first. Then update visual-language.md. Then begin Stage 1 (token consolidation). |

---

## 5. Required Owner Decisions

Only decisions that genuinely need owner approval. All other contradictions have clear resolutions based on existing code, approved decisions, or pragmatic preference.

| # | Decision | Recommendation | Default if no decision |
|---|---|---|---|
| 1 | **Which token naming scheme wins?** visual-language.md renamed all tokens (--color-forest, --color-ink, --color-rule). tokens.md kept existing names (--color-primary, --color-text, --color-border). | **tokens.md wins** — existing names are in production across 61 pages. Renaming everything is unnecessary risk. | tokens.md naming is used. visual-language.md is updated to match. |
| 2 | **Focus ring color** — bronze (visual-language), primary-light (tokens.md), or primary (component-specs)? | **Primary (#1a3c34) at 2px with 2px offset.** Distinct from bronze decoration, visible on cream, matches existing code. | Primary at 2px is used. |
| 3 | **Utility classes allowed or prohibited?** visual-language says no. implementation-foundations says yes (5 classes for 492 inline styles). | **Allow a defined set** — .lede, .cta-row, .content-prewrap, .utc-badge, .text-muted. Prohibiting them entirely is impractical. | The 5 utility classes are allowed. |

All other contradictions (spacing scale, shadow tokens, breakpoints, heading weight, content widths, pill radius, data persistence, color value tweaks) have clear resolutions per §2 and don't require owner judgment.

---

## 6. First Build Brief — Homepage

### User and primary decision
The user is an ordinary person who needs a trust document. They arrive uncertain whether they can do this themselves, whether the result will be valid, and whether a free tool can be trusted. The primary decision: **"Should I start creating my document here?"**

### Information hierarchy (8-point, per approved homepage requirements)

1. **What FreeTrustDocs does** — H1: "Create your trust document." + subheading: "Answer a few questions. Download a finished PDF."
2. **Who it's for** — implicit in plain language; no "for families" tagline
3. **Why it's useful and accessible** — "No account. No fees. Nothing leaves your browser." in hero subheading
4. **How the process works** — 4-step flow: Answer → Review → Assemble → Download, each with line icon + one-sentence description
5. **What users receive** — document preview showcase showing actual document structure (before/after transformation)
6. **Important limitations** — UPL notice in trust section: "FreeTrustDocs is not a law firm and does not provide legal advice."
7. **Why trust the experience** — trust section: "Nothing leaves your browser" + statute citations + "Last reviewed" dates
8. **One calm next step** — Primary CTA: "Start a Document →"

### Required components (in build order)

1. **Token system** (Stage 1) — consolidate to tokens.md naming, fix all 5 blockers
2. **Shared primitives** (Stage 2) — unified `.doc-type-card`, `.doc-preview`, normalized callouts, buttons with all states, utility classes
3. **Homepage-specific:**
   - Hero block (H1 + subheading + primary button + text link)
   - Document type cards (3-column grid, unified `.doc-type-card` with line icons, statute citations, review dates)
   - Process flow (4 steps, horizontal, line icons + descriptions)
   - Document preview showcase (before/after, unified `.doc-preview`)
   - Trust section (narrative: privacy statement + statute citations + review dates, on cream-dark with bronze rules — NOT dark green band)
   - FAQ accordion (native `<details>`, inline, no card boxing)
   - Footer (existing, with UPL disclaimer — already correct)

### Trust/disclosure placement

- **Hero subheading:** "No account. No fees. Nothing leaves your browser."
- **Trust section:** 3-part narrative — privacy, statutes, review dates — using registration-line dividers
- **Footer:** existing UPL disclaimer (bold statement + two-sentence explanation)
- **No testimonials, no trust badges, no "trusted by" logos** (none are verified)

### Mobile behavior

- Hero: H1 reduces to 2rem, padding reduces to 3rem
- Document cards: single column, full-width
- Process flow: stacks vertically, numbered steps
- Trust section: stays as narrative, single column
- FAQ: remains inline accordion
- Navigation: hamburger menu (<768px, already coded)
- Body text: stays at 17px — reduce padding, not readability

### Required states

- **Default:** all components render as specified
- **Hover:** card border shifts, button lightens, link underline brightens
- **Focus:** 2px primary ring on all interactive elements
- **Keyboard:** tab order follows visual order; all actions reachable
- **Reduced motion:** all transitions collapse to 0ms

### Definition of done

- [ ] All 5 blockers (B1-B5) resolved; visual-language.md updated to match tokens.md naming
- [ ] Token consolidation complete in global.css (new tokens added, redundant ones removed, aliases mapped)
- [ ] 4 card variants consolidated to 1 `.doc-type-card` system
- [ ] 3 preview components consolidated to 1 `.doc-preview` system
- [ ] Duplicate callout definition removed
- [ ] Dead CSS removed (`.doc-selector`, `.process-spine` families)
- [ ] "Available Trust Documents" duplicate section removed
- [ ] Dark `.proof-cta` band replaced with cream-dark section + bronze rules
- [ ] Trust panels grid removed or redesigned with brand language
- [ ] Line icons added to document cards and process flow steps
- [ ] Statute citations and "Last reviewed" dates on document cards
- [ ] All states present: hover, focus, active, reduced-motion
- [ ] Zero inline `style=` attributes on the homepage
- [ ] No hardcoded color, font-size, spacing, radius, or shadow values
- [ ] Astro build passes clean
- [ ] Page loads in under 2 seconds on 3G
- [ ] Visual QA checklist (40 items from implementation-foundations.md) passes