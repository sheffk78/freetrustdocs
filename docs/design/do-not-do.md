# Do Not Do — FreeTrustDocs Design Guardrails

**Design direction:** The Clear Guide — editorial, calm, reassuring.
**Audience:** People preparing trust documents who need clarity, not theater.

This document lists patterns that are **prohibited** on FreeTrustDocs, explains **why each fails** the design direction, and names the **preferred alternative**. It is a guardrail: when in doubt, choose the alternative, not the prohibited pattern.

---

## 1. Visual Symbolism

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 1 | Generic legal stock symbolism — gavels, courthouses, columns, scales of justice, handshakes, stamped seals, "Lady Justice" statues. | Cliché shorthand that signals "lawyer website," not "clear guide." It borrows authority instead of earning it and clashes with the editorial, line-icon direction. | Approved **line icons** (1.5px stroke, forest green `#1a3c34`) for functional concepts (document, signer, witness, effective date). For trust structures, use **editorial diagrams** — labeled boxes and arrows, not symbols. |
| 2 | Cartoon illustrations or character art — mascots, smiling families, anthropomorphic documents, "friendly robot" helpers. | Undermines the calm, serious, editorial tone. Reads as condescending to people making real legal decisions. | **No character art.** Use editorial diagrams, typographic hierarchy, and whitespace to guide attention. If warmth is needed, use voice in the copy, not drawn characters. |
| 3 | Photography of any kind — stock office photos, "diverse family" shoots, handshake close-ups, laptop-on-desk scenes. | The approved system has **no photography**. Photos introduce uncontrolled color, mood, and specificity that fight the cream/forest/bronze palette and editorial calm. | **No photography.** Use the type system, line icons, and editorial diagrams. If a human element is essential, use a short quoted sentence set in Crimson Pro, not a photo. |

---

## 2. Aesthetic Direction

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 4 | Generic AI / startup-landing-page aesthetics — gradient backgrounds, gradient text, glassmorphism (frosted blur cards), neon accents, glows, drop-shadow halos, "aurora" blobs. | Trendy, noisy, and visually unstable. Signals "marketing site," not "trustworthy guide." Gradients and glows destroy the flat, editorial, high-contrast reading surface. | **Flat surfaces** on `#f8f5ef` cream. Solid colors from the approved palette only. Depth comes from typographic hierarchy and hairline rules (`1px solid` at 10–15% forest green), not blur or shadow. |
| 5 | Decorative elements that compete with reading or the primary action — animated background shapes, parallax, auto-rotating carousels, decorative confetti, oversized hero illustrations, scroll-triggered flourishes. | Every decorative element steals attention from the document a person is trying to understand or complete. The Clear Guide is about removing competition, not adding it. | **One primary action per screen.** Surround it with calm whitespace, a clear heading, and supporting body text. Motion is reserved for state feedback (a button press, a step completing) — never decoration. |
| 6 | Using brand color as decoration — forest green as a section background "just because," bronze underlines on random words, forest-green tints on non-interactive elements. | Brand colors must carry **meaning** (interactive, structural, or emphasized). Decorative use dilutes the signal: when everything is green, nothing reads as "this is the action." | Forest green `#1a3c34` is reserved for **primary actions, active states, and structural marks** (diagram lines, hairline rules). Bronze `#8b6914` is reserved for **accents and emphasis** (a key term, a section number). Cream `#f8f5ef` is the default surface. If a color doesn't map to one of those roles, don't use it. |

---

## 3. Design Tokens (Color, Type, Space, Radius, Shadow)

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 7 | Unapproved hard-coded values — hex colors outside the palette, ad-hoc `font-family` strings, magic-number spacing (`margin: 13px`), custom border-radius, bespoke box-shadows. | Drift. Each hard-coded value makes the system less consistent and the next decision harder. "Just this once" compounds into an incoherent site. | Use **design tokens** only. Colors: forest green `#1a3c34`, bronze `#8b6914`, cream `#f8f5ef`, plus the documented neutral ramp. Type: Crimson Pro (serif, headings/editorial), Inter (sans, UI/body), JetBrains Mono (code/labels). Spacing: the approved 4/8/12/16/24/32/48/64 scale. Radius: the documented token (sharp-to-subtle, no pill). Shadow: none, or the single approved hairline — never bespoke glows. If a token is missing, **propose a token**; do not hard-code around the gap. |
| 8 | Pill-shaped controls — fully rounded buttons (`border-radius: 999px`), pill tags, capsule inputs. | Pills read as playful/consumer-app, not editorial/legal. They also don't match the sharp, document-like geometry of the rest of the system. | Use the **approved radius token** — a subtle corner, not a pill. Buttons and inputs share the same radius as cards and inputs so the surface language is consistent. |
| 9 | Excessive shadows or "floating" depth — stacked shadows, colored shadows, large blur radii, elements that appear to hover above the page. | Implies a consumer dashboard, not a calm document. Shadows add visual noise and contradict the flat editorial surface. | **No shadows by default.** Separate sections with hairline rules and whitespace. If elevation is truly needed (a focused dialog), use a single subtle shadow from the token set — never a custom one. |

---

## 4. Layout and Cards

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 10 | Excessive cards, nested cards, and floating panels — wrapping every section in a card, putting cards inside cards, floating panels over panels. | Card-soup destroys editorial flow. Nested cards especially imply "settings inside settings" and make the page feel like a config dashboard, not a guide. | Default to **flat editorial sections** separated by hairline rules and whitespace. Use a card **only** to group a cohesive unit (a single trust structure, a single step) and **never nest a card inside a card**. If you feel the need to nest, you need a new section, not a sub-card. |
| 11 | Card-inside-card layouts specifically — a card containing another bordered, padded card. | The single clearest anti-pattern in the system. It signals "I couldn't structure this, so I boxed it twice." It also doubles borders and padding, wasting space and confusing hierarchy. | Flatten. Move the inner content to the same level as the outer, separated by a hairline rule or a heading shift. One border per conceptual unit, always. |
| 12 | Mobile layouts that simply stack desktop content without reprioritizing it — collapsing a 3-column desktop grid into one tall scroll where the primary action is 6 screens down. | Stacking preserves structure but destroys priority. On mobile the person should reach the primary action and the essential explanation first, not wade through desktop-sized preamble. | **Reprioritize for mobile.** Decide the single most important action and the single most important explanatory sentence; put them first. Collapse secondary detail behind a labeled disclosure ("See what this means"). Re-flow diagrams to a vertical, legible form — don't just shrink them. |

---

## 5. Calls to Action and Conversion

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 13 | Multiple competing primary CTAs — two or more equally prominent buttons ("Start now" / "Download" / "Talk to an expert" all at the same weight) on the same screen. | Splits attention and decision. The Clear Guide is about one clear next step, not a menu of equally-loud options. | **One primary CTA per screen**, in forest green. Secondary actions are text links or ghost buttons — visibly subordinate. Tertiary actions live in body copy or a footer, not as a third button. |
| 14 | Pressure-based conversion patterns — countdown timers ("Offer ends in 02:14:33"), urgency copy ("Only today!", "Don't miss out"), exit-intent popups, fake-stock scarcity ("Only 3 left!"). | Antithetical to a calm, reassuring legal tool. Trust documents are a considered decision; pressure tactics erode the trust the product depends on. | **No pressure, ever.** Let people leave and return. State what the tool does and what it costs (free, plainly) and let them decide. Reassurance, not urgency, is the conversion lever. |
| 15 | "Free" messaging that implies a bait-and-switch — "Free!" in giant type with a hidden paid tier, "Free to start" that reveals costs mid-flow, asterisked "free" that resolves to a paid plan. | Destroys credibility on first contact. A trust-document tool that hedges on "free" reads as a trap, which is fatal in a legal context. | Say **"Free" plainly and once**, where it's true, with no asterisk. If anything is not free (e.g., optional notary add-on), state it in the same breath, at the same size — never buried in fine print. |

---

## 6. Trust, Legal, and Accessibility

| # | Prohibited | Why it fails | Preferred alternative |
|---|---|---|---|
| 16 | Unsupported trust, privacy, accuracy, or legal claims — "100% legally binding," "Guaranteed valid in all 50 states," "Bank-grade security," "Attorney-approved" without an attorney, "We never share your data" if not literally true. | A free trust-document generator making unqualified legal/security claims is a liability and a trust-killer once scrutinized. Vague superlatives read as marketing, not guidance. | Make only claims you can **substantiate and have reviewed**. Use precise, scoped language: "Creates a document that meets the requirements in [state list] as of [date]." Link to a plain-language limitations page. When unsure, say less and link to detail. |
| 17 | Legal jargon without explanation — "residuary beneficiary," "pour-over," "funded trust," "trustee succession" dropped into copy with no definition. | The audience is not lawyers. Unglossed jargon violates the "clear guide" premise and makes people feel the tool isn't for them. | **Define on first use.** Every legal term gets a one-sentence plain-language definition on first appearance, set in Inter and visually subordinate (e.g., a short parenthetical or a one-line gloss below). Maintain a glossary page and link terms to it. |
| 18 | Dense jargon-first interfaces — forms that lead with the statutory field name ("Grantor's Residuary Disposition") instead of the question the person is answering. | The form itself becomes the barrier. People can't answer what they can't parse, and a jargon-first field label guarantees wrong entries and abandonment. | **Question-first.** Lead with the plain-language question ("Who should receive the rest of your property?"), with the legal term as a smaller secondary label or tooltip. The form reads like a guide asking questions, not a statute demanding fields. |
| 19 | Low-contrast text, tiny disclosures, or hidden terms — gray-on-cream disclaimers at 10px, legal limitations behind a hover-only tooltip, terms linked only from the footer in 8px type. | Hiding limitations is the opposite of a clear guide. Low contrast and tiny type also fail accessibility and signal "we hope you don't read this." | **Same contrast, same type scale as body text** for anything a person needs to make a decision. Disclosures and limitations sit in the flow at `16px` minimum, meeting WCAG AA contrast on cream. If it matters enough to disclose, it matters enough to be readable. |
| 20 | Tiny or hidden legal limitations specifically — limitations shrunk to fit, relegated to a hover tooltip, or only reachable via a footer link in micro-type. | The most damaging form of #19 in a legal product. If a limitation is hidden and a user relies on the document, the hidden caveat becomes a real-world harm and a credibility collapse. | State **limitations in context, at body size**, right where the relevant claim or action appears. A dedicated "What this does not do" section at body type is preferred over scattered micro-print. No legal limitation lives only behind a tooltip or in the footer. |

---

## How to use this document

- **When proposing a design:** scan this list before you start. If your idea matches a prohibited pattern, adopt the alternative instead.
- **When reviewing a design:** any prohibited pattern present is a blocking issue. Note the row number and require the alternative.
- **When a pattern isn't listed:** default to the design direction — *editorial, calm, reassuring* — and the token set. If a new prohibition is needed, add it here with the same three-part structure (prohibited / why / alternative).
