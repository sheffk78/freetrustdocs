# Content and Trust Standards

> **The Clear Guide.** This document defines how FreeTrustDocs writes, explains, warns, reassures, and asks for action. Every sentence on the site is a trust decision. Users are ordinary people — often unfamiliar with legal terminology, frequently anxious about making an expensive mistake, and rightly skeptical of anything that sounds too good to be true. Our job is to be the site that earns the trust they are uncertain whether to give.

---

## Table of contents

1. [Core commitments](#1-core-commitments)
2. [Communicating "free"](#2-communicating-free)
3. [Plain language before legal terminology](#3-plain-language-before-legal-terminology)
4. [The outcome-first rule](#4-the-outcome-first-rule)
5. [Progressive disclosure](#5-progressive-disclosure)
6. [Limitations, eligibility, jurisdiction, and legal-advice boundaries](#6-limitations-eligibility-jurisdiction-and-legal-advice-boundaries)
7. [Privacy, security, document handling, and data retention](#7-privacy-security-document-handling-and-data-retention)
8. [Testimonials, professional review, trust markers, and statistics](#8-testimonials-professional-review-trust-markers-and-statistics)
9. [Calls to action on high-stakes decisions](#9-calls-to-action-on-high-stakes-decisions)
10. [Voice and tone for difficult moments](#10-voice-and-tone-for-difficult-moments)
11. [Examples index](#11-examples-index)

---

## 1. Core commitments

These are the only claims we are permitted to make without further verification. Every other assertion about the service must trace back to one of these, or it must not appear.

| Verified claim | How we may state it | What we must not extend it to |
|---|---|---|
| Documents are generated entirely in the browser — nothing is transmitted to a server. | "Nothing leaves your browser." "Your answers stay on your device." | We must not claim the browser itself is secure, that no tracker exists (ads are present), or that output is encrypted at rest. |
| No account or signup is required. | "No account. No email. Start whenever you're ready." | We must not claim data is "deleted from our servers" — there are no servers in the generation path, and ad networks operate under their own policies. |
| Templates are derived from real statutes, with citations. | "Based on [statute name], [citation]." | We must not claim the documents are "legally valid," "court-approved," "attorney-reviewed," or effective in a particular jurisdiction unless separately verified. |
| Documents are template-based, not attorney-created. | "These are templates, not documents prepared by a lawyer." | We must not imply tailoring, conflict checks, or attorney judgement. |

**Rule 1.1 — No unverified claims.** If a sentence asserts effectiveness, coverage, privacy depth, security posture, or professional review, and it is not in the table above, do not write it. See [§8](#8-testimonials-professional-review-trust-markers-and-statistics) for the handling of social proof.

**Rule 1.2 — The ad-supported model is stated openly.** We say "free, supported by advertising" rather than "free" alone, in the first mention on any page where cost is discussed. Honesty about the business model is itself a trust signal.

**Rule 1.3 — We are not a law firm and do not provide legal advice.** This statement appears in the footer of every page and is restated in context wherever a user is making a legally significant choice. It is never buried.

---

## 2. Communicating "free"

The word "free" is a trust problem. On a site dealing with trusts, wills, and estate documents, a no-cost promise can read as either a gift or a trap. Our voice must land on the first reading.

### 2.1 What "free" means here

- No payment at any step. No "premium" tier revealed later. No gated output. The completed PDF is free.
- No account, no email, no contact information required.
- The service is supported by advertising. Ads are clearly labeled and never simulate document UI.

### 2.2 Framing rules

| Use | Avoid | Why the avoidance |
|---|---|---|
| "Free, supported by advertising." | "100% free!" | Exclamation and absolutism read as sales pressure, not generosity. |
| "No payment, no account, no email." | "No catch!" | "No catch" implies the speaker expects you to suspect one. |
| "We made this free because estate planning shouldn't require a credit card." | "Free forever!" | "Forever" is a promise we cannot guarantee and dilutes credibility. |
| "Costs you nothing today, and nothing later." | "Free — no hidden fees!" | "No hidden fees" implies fees are a thing to hide, which seeds doubt. |
| Describe the ad model once, plainly. | "We may show relevant offers." | Euphemism reads as evasion. Call ads ads. |

### 2.3 Placement

- The first mention of cost on any page uses the full phrase "free, supported by advertising."
- Subsequent mentions may use "free" alone.
- The ad-supported nature is disclosed before the user begins answering questions, not at the end.

---

## 3. Plain language before legal terminology

Users arrive with a goal — "set up a trust for my kids," "leave my house to my sister" — not with a vocabulary. We must meet them at the goal and only then introduce the terms they will see on the document.

### 3.1 The two-step explanation

1. **Say what it does, in their words.** Describe the outcome and the user consequence first. (See [§4](#4-the-outcome-first-rule).)
2. **Then name it.** Introduce the legal term, paired with the plain-language description, so the term becomes a label for something already understood.

> **Pattern:** "[Plain outcome]. In legal documents, this is called [term]."

### 3.2 Term handling

- Define a legal term the first time it appears on a page, inline. Do not link to a glossary as a substitute for an inline definition; link as a supplement.
- If a term has a common misunderstanding (e.g., "trustee" ≠ "beneficiary"), name the misunderstanding and correct it.
- Never use a legal term as the heading for a user-facing section if a plain-language heading is available. "Who gets your things" before "Distribution of assets."
- Statutory citations are provided for transparency, not as a substitute for explanation. Format: `Based on [statute name], [citation].` Place citations subordinate to the plain-language explanation, not above it.

### 3.3 Vocabulary tier

We write at approximately a US 8th-grade reading level for instructional copy. Legal terms are introduced as labeled exceptions, not as the baseline register.

---

## 4. The outcome-first rule

> **Rule 4.1 — Outcome before detail.** In any explanation, the first sentence states what will happen and what it means for the user. Legal mechanics, statutory basis, and edge cases come after, and only if they serve the user's decision.

This rule governs every tooltip, field label, section description, and help passage on the site.

### Why

Users are not studying law; they are deciding what to put in a document. If they have to parse the legal mechanism before they understand the consequence, they will either guess or leave. Both outcomes are failures of trust.

### Application

- A field asking for a successor trustee leads with: "If your first choice can't serve, this person steps in. Choose someone you trust to follow your instructions." The legal definition of a successor trustee follows, available on demand.
- A jurisdiction selector leads with: "Pick the state whose rules you want to apply to your trust. This is usually where you live." The concept of governing law follows, available on demand.
- A warning about funding a trust leads with: "This document creates the trust. It does not move your property into it. You'll need to transfer your assets separately." The distinction between creation and funding follows.

---

## 5. Progressive disclosure

We do not dump the entire legal context on a user at once, and we do not hide it behind a wall of jargon. Progressive disclosure is the structure that lets us do both.

### 5.1 The three layers

| Layer | Purpose | Default visibility | Trigger to reveal |
|---|---|---|---|
| **1. Short answer** | What this is, what it does, what you decide here. One or two sentences in plain language. | Always visible. | — |
| **2. More detail** | The legal term, the mechanism, the common variations. A short paragraph. | Visible on request. | "More about this" toggle, inline. |
| **3. Full reference** | Statutory citation, edge cases, interactions with other fields, when to consult a lawyer. | Visible on request. | "See the details" link, inline or to a reference page. |

### 5.2 Rules

- Layer 1 is mandatory for every concept the user encounters. No concept is introduced at Layer 2 or 3.
- Layer 2 must be available for any field whose effect is not obvious from Layer 1 alone.
- Layer 3 must be available wherever a statutory citation exists or where the user's specific situation may diverge from the template's assumptions.
- The labels for revealing deeper layers are plain: "More about this," "See the details," "When this might not apply." Not "Learn more" (vague) and not a bare chevron (unlabeled).
- Nothing in Layer 2 or 3 is required to complete the document. A user who reads only Layer 1 everywhere must be able to finish.

### 5.3 What progressive disclosure is not

It is not a way to hide disclaimers. Limitations, eligibility, and the no-legal-advice boundary are stated at Layer 1 in the contexts where they matter. See [§6](#6-limitations-eligibility-jurisdiction-and-legal-advice-boundaries).

---

## 6. Limitations, eligibility, jurisdiction, and legal-advice boundaries

These are not fine print. They are part of the product. A user who completes a document without understanding its limits has been misled, even if the document is technically correct.

### 6.1 Placement rules

- **Global:** The statement "FreeTrustDocs is not a law firm and does not provide legal advice" appears in the footer of every page.
- **Contextual:** A specific limitation is stated at the point where the user's decision interacts with it — not consolidated in a single "Limitations" page that no one reads.
- **Pre-completion:** Before the user generates the final PDF, a plain-language summary of what the document does and does not do is presented on the review screen. This is the last thing they see before the download.
- **On the document:** The generated PDF includes a cover page or footer stating that the document is template-based, not attorney-created, and that the user should consider review by a qualified attorney in their jurisdiction.

### 6.2 How to state a limitation

A clear limitation names four things: what the document does, what it does not do, who might need more, and where to look.

> **Pattern:** "This document [does X]. It does not [address Y]. If your situation involves [Z], consider talking to a lawyer in [your state]."

### 6.3 Jurisdiction

- The jurisdiction selector is explicit and user-chosen. We do not infer jurisdiction from IP address.
- We state which statutes the template draws from, with citations, at the point of selection.
- We do not claim coverage of all 50 states or any specific count of jurisdictions. We state which statutes are reflected and let the user judge fit.
- If a template is built on a uniform act (e.g., the Uniform Trust Code), we say so and note that states may adopt it with modifications.

### 6.4 Eligibility

- Where a document has common eligibility considerations (e.g., capacity requirements, residency assumptions in the template), we state them in plain language at the relevant step.
- We do not gate access with an eligibility quiz that implies legal judgement on our part. We inform; the user decides.

### 6.5 The no-legal-advice boundary in practice

- Help text explains what a field means, not what the user should choose.
- If a user's input suggests a situation the template may not cover (e.g., blended family, non-US assets), we surface an informational note pointing to the limitation and suggesting attorney review. We do not diagnose, recommend, or refuse.
- Support channels (see [§10.5](#support)) help with using the site, not with legal decisions. Staff do not interpret the user's circumstances.

---

## 7. Privacy, security, document handling, and data retention

Privacy is the strongest verified claim we have, and it is the one users care about most on this topic. It must be stated clearly, located where it is useful, and never overstated.

### 7.1 What we can say

- "Your answers are processed in your browser. They are not sent to our servers."
- "Nothing leaves your browser" — accurate for the document generation path.
- "No account, no email, no signup."

### 7.2 What we must not say

- We must not claim the site is "100% secure," "hack-proof," "encrypted," or "bank-level security." We have not verified these and they are not ours to claim.
- We must not claim "we never collect your data" without scoping, because advertising operates on this page and ad networks have their own data practices.
- We must not claim documents are "deleted from our servers" — there are no servers in the generation path, so the framing is misleading.

### 7.3 The ad-network qualification

Because the site is ad-supported, a fully accurate privacy statement must distinguish the document-generation path from the advertising path. The privacy disclosure states plainly:

- Document generation is client-side; answers are not transmitted.
- Ads are served by third-party networks with their own privacy policies, linked from the disclosure.
- Users can use ad blockers; doing so does not affect document generation.

This is not fine print. It belongs in the main privacy disclosure, linked from the footer and from the pre-wizard introduction.

### 7.4 Placement

| Information | Where it lives |
|---|---|
| "Nothing leaves your browser" (one-line) | Pre-wizard introduction screen; review screen before download. |
| Full privacy disclosure (client-side generation, ad-network qualification, no account) | Dedicated `/privacy` page, linked from footer and pre-wizard intro. |
| Document handling note (the PDF is yours; we have no copy) | On the completion screen, next to the download. |
| Data retention statement (we do not retain your answers; refresh clears the page) | In the full privacy disclosure and in a dismissible note on the wizard's first step. |

### 7.5 Browser-state honesty

We state that answers live in the browser tab and are cleared when the tab is closed or the page is refreshed. We do not imply persistence we don't provide. If a "save progress" feature is ever added (it is not in the current verified scope), its storage behavior must be disclosed at the point of use.

---

## 8. Testimonials, professional review, trust markers, and statistics

Social proof is the easiest place to lose credibility. Most trust-document sites either overclaim ("attorney-approved") or manufacture testimonials. We do neither.

### 8.1 Testimonials

- We do not display user testimonials unless they are real, current, and verifiable, with the user's informed consent.
- If we ever display testimonials, they are not edited to change meaning. Minor edits for length are disclosed ("edited for length").
- We do not fabricate testimonials, ever. No exceptions, no "placeholder" testimonials in mocks that ship to production.

### 8.2 Professional review claims

- We do not claim "attorney-reviewed," "lawyer-approved," "drafted by attorneys," or any variation, because the documents are template-based and not attorney-created. This is a verified fact, not a marketing choice.
- If, in the future, a qualified attorney reviews the templates, the claim will name the reviewer, their jurisdiction, and the scope of the review (e.g., "reviewed for alignment with [statute] as of [date]"). Generic "reviewed by lawyers" claims are prohibited.
- A citation to a statute is not a professional review claim. "Based on [statute], [citation]" is a factual reference, not an endorsement.

### 8.3 Trust markers

- Badges, seals, and certifications are displayed only if they correspond to a real, verifiable credential (e.g., a specific accessibility certification, a specific open-source license). Invented "Trusted by" seals are prohibited.
- We do not display logos of publications, law firms, or organizations unless we have written permission and the relationship is accurately described.
- The strongest trust markers we have are the ones we can verify: "Nothing leaves your browser," "No signup required," "Based on real statutes (with citations)." Lead with these, not with borrowed authority.

### 8.4 Statistics

- Any statistic ("X documents generated," "used in Y states") must be real, current, and labeled with its date and method. Round numbers are suspicious; honest counts are not.
- We do not display vanity metrics that imply legal effectiveness (e.g., "99% legally valid") — we cannot verify validity and will not claim it.
- If we display a usage count, it reflects generation events, not legal outcomes. We have no way to verify outcomes and will not imply we do.

### 8.5 The default

In the absence of verified social proof, the trust strategy is transparency, not theater. A clear, honest site with no testimonials is more trustworthy than a slick site with fabricated ones.

---

## 9. Calls to action on high-stakes decisions

A trust document is a high-stakes artifact. The CTAs around it must not apply the pressure patterns of low-stakes consumer checkout.

### 9.1 What a high-stakes CTA must do

1. **Name the action specifically.** Not "Continue," but "Generate my trust document (PDF)."
2. **State what happens next.** "You'll get a PDF to download. Nothing is sent to us."
3. **Leave room to stop.** A visible, equally weighted path to go back, review, or leave without completing.
4. **Never manufacture urgency.** No countdown timers, no "complete now or lose your progress," no scarcity language. The document is free and will be here tomorrow.

### 9.2 Pressure patterns that are prohibited

- Countdown timers on a trust document. (Absurd and manipulative.)
- "Only X left!" scarcity. (We are a free website; nothing is limited.)
- Pre-checked boxes that add actions the user did not choose.
- Modal interruptions that block review to push completion.
- Dark-pattern confirm-shaming on exit ("Are you sure you want to leave your family unprotected?"). This is never acceptable.

### 9.3 The completion CTA

Before the final generate step, the CTA reads as a summary, not a sales close:

> "You've answered everything. Review your document below, then generate the PDF when you're ready. You can come back and change your answers any time before you generate."

The generate button itself: **"Generate my document (PDF)."** Not "Get my free trust now!"

### 9.4 The "talk to a lawyer" CTA

Where appropriate (see [§6.5](#6-5-the-no-legal-advice-boundary-in-practice)), we present a neutral, non-affiliated informational CTA: "If your situation is complex, consider review by a qualified attorney in your state." This is informational, not a referral, and not monetized unless explicitly disclosed.

---

## 10. Voice and tone for difficult moments

The Clear Guide is calm, reassuring, and editorial. It does not panic, it does not over-promise, and it does not perform confidence it doesn't have. The voice across all states:

- **Calm.** Short sentences. No exclamation marks in errors or warnings. No urgency theater.
- **Reassuring.** We assume the user is capable and is doing something reasonable. We do not scold.
- **Editorial.** We explain, we don't slogan. We prefer a concrete sentence to a polished phrase.
- **Honest about limits.** We say "we don't know" when we don't, and "consider a lawyer" when we should.

### 10.1 Errors

- Say what happened, in plain language. "We couldn't open that field. Try again."
- Say what to do next. "Your answers are still here — nothing is lost."
- Never blame the user. Not "You entered an invalid value" but "That date doesn't look right."
- Never expose a stack trace, a raw error code without context, or a system message unedited.
- If the error is ours and persistent, say so plainly: "Something on our side isn't working. Your answers are safe in your browser. You can try again or come back later."

### 10.2 Uncertainty

- Where the template cannot accommodate a user's input, we say so: "This template doesn't cover [situation]. Here's what it does cover, and where you might want more help."
- We do not guess. We do not produce a document with silent gaps. If a field is unresolved, the output marks it clearly for the user to address.
- We distinguish "we don't handle this" from "this is a legal question we can't answer." The first is a product limit; the second is the no-legal-advice boundary.

### 10.3 Warnings

- Warnings are specific and actionable. Not "Warning!" but "This document won't take effect until you sign it in front of a notary. We'll remind you on the final page."
- Warnings appear at the point of decision, not aggregated in a banner the user learns to dismiss.
- Severity is communicated by content and placement, not by color alone. A critical warning (e.g., "this trust is not funded by generating this document") is stated in text, in the relevant step, and again on the review screen.
- We never cry wolf. A warning that fires on every field is a warning that is ignored on the important one.

### 10.4 Completion states

- Completion is acknowledged, not celebrated. "Your document is ready." Not "🎉 Done!"
- We tell the user what they have and what they still need to do. "You have a PDF. Next: sign it in front of a notary, and transfer your assets into the trust. See the checklist."
- We restate the core limitation once, gently: "This is a template, not a document from a lawyer. If your situation is complex, consider attorney review."
- We remind them of the privacy fact: "This PDF is on your device. We don't have a copy."
- We do not upsell, because there is nothing to upsell. We do not show ads on the completion screen — this is a deliberate trust decision. The user has just made a significant decision; the screen should respect that.

### 10.5 Support

- Support covers using the site: navigation, field meaning, browser issues, PDF download problems.
- Support does not cover legal questions. Staff are trained to decline legal questions with a respectful redirect: "I can help with how the site works, but I'm not able to advise on your legal situation. For that, a qualified attorney in your state is the right resource."
- Support copy is warm but does not promise more than we can deliver. "We'll do our best to help with the site. For legal questions, we'll point you to where you can find a lawyer."
- Support channels state their hours and scope honestly. No "24/7" claim unless it is true and verified.

---

## 11. Examples index

Each example below gives a good version, a poor version, and an explanation of why the poor version fails the standards in this document.

- [11.1 A helpful explanation](#111-a-helpful-explanation)
- [11.2 A clear limitation / disclaimer](#112-a-clear-limitation--disclaimer)
- [11.3 A reassuring privacy statement](#113-a-reassuring-privacy-statement)
- [11.4 A supportive validation error](#114-a-supportive-validation-error)
- [11.5 A trustworthy CTA](#115-a-trustworthy-cta)

---

### 11.1 A helpful explanation

**Context:** The field asking the user to name a successor trustee.

**Good.**

> **Successor trustee**
>
> If your first choice ever can't act as trustee — for example, they're no longer able or no longer willing — this person steps in and carries out the instructions in your trust. Choose someone you trust to follow your wishes carefully.
>
> *More about this:* In legal terms, this role is called a "successor trustee." The person you name here has the same authority as your original trustee once they take over. You can name more than one, in order, as backups for each other.
>
> *See the details:* Based on the Uniform Trust Code § 602 and § 703. Some states adopt these provisions with modifications; see your state's adoption notes on the jurisdiction page.

**Poor.**

> **Successor Trustee**
>
> Designate a successor trustee pursuant to UTC § 602. The successor trustee shall assume all fiduciary duties of the primary trustee upon the occurrence of a triggering event as defined under applicable law. Failure to designate a successor may result in court-appointed administration.

**Why the poor version fails.**

- **Violates §3 and §4.** It leads with the legal term and the statutory citation, not with the outcome. A user who does not already know what a successor trustee is cannot use this field.
- **Violates §10.** The final sentence is a threat ("may result in court-appointed administration") with no context, no action, and no reassurance. It panics rather than informs.
- **Violates §5.** It collapses all three disclosure layers into one dense paragraph. There is no short answer; there is no on-ramp.
- **Violates the voice.** "Pursuant to," "shall assume," "triggering event" are not the register of a calm, editorial guide. They are the register of a document the user has not asked to read yet.

---

### 11.2 A clear limitation / disclaimer

**Context:** The review screen, before the user generates the final PDF.

**Good.**

> **Before you generate**
>
> This document creates a trust based on the statutes shown on the jurisdiction page. It does not:
>
> - Move your property into the trust. You'll need to transfer assets like your home and bank accounts separately — the checklist after download explains how.
> - Cover every situation. If you have a blended family, own a business, have assets in multiple states or countries, or expect disputes, this template may not fit.
> - Replace advice from a lawyer who knows your situation.
>
> FreeTrustDocs is not a law firm and does not provide legal advice. If anything here is unclear or your situation is complex, consider talking to a qualified attorney in your state.

**Poor.**

> **Disclaimer:** FreeTrustDocs provides general template documents for informational purposes only and makes no warranties, express or implied, regarding the legal sufficiency, fitness for a particular purpose, or enforceability of any document. Use at your own risk. Consult legal counsel for your specific needs. By proceeding, you acknowledge that you have read and agree to the terms of service.

**Why the poor version fails.**

- **Violates §6.1 and §6.2.** It is a consolidated, context-free block of legalese — exactly the "evasive fine print" the standard prohibits. It states no specific limitation; it states only abstract disclaimers.
- **Violates §4.** It does not tell the user what the document does or does not do in concrete terms. "No warranties regarding legal sufficiency" is unintelligible to the target user.
- **Violates §9.1.** The "By proceeding, you acknowledge…" clause turns a limitation disclosure into a pressure gate — the user must accept to continue, and the acceptance is meaningless because they were not informed in usable language.
- **Violates the voice.** "Express or implied," "fitness for a particular purpose," "use at your own risk" are legal register, not editorial register. They signal "we are protecting ourselves," not "we are helping you."

---

### 11.3 A reassuring privacy statement

**Context:** The pre-wizard introduction screen.

**Good.**

> **Your answers stay on your device.**
>
> Everything you type here is processed in your browser. Your answers are not sent to our servers, and we don't have an account system, so there's nothing to log into and nothing for us to store.
>
> The ads on this site are served by third-party advertising networks. They have their own privacy policies, which we link to below. Using an ad blocker won't affect your document.
>
> When you're done, the PDF downloads to your device. We don't keep a copy — there isn't one on our side to keep.
>
> When you close or refresh this tab, your answers are cleared. There's no save feature, so finish in one sitting or start over when you return.
>
> Read the full privacy disclosure →

**Poor.**

> **100% Secure & Private!**
>
> FreeTrustDocs uses state-of-the-art encryption to protect your data. We never collect, store, or share your personal information. Your privacy is our top priority. Rest assured that your sensitive legal documents are completely safe with us. We are GDPR compliant and HIPAA compliant.

**Why the poor version fails.**

- **Violates §7.2.** It claims "state-of-the-art encryption," "100% secure," "completely safe," and compliance with GDPR and HIPAA — none of which are verified claims and several of which are inapplicable (HIPAA governs health information; we do not handle it). These are false claims, not merely unsupported ones.
- **Violates §7.3.** It says "we never collect, store, or share your personal information" without scoping. This is false in the presence of third-party ad networks, and the omission of the ad-network qualification is exactly the evasion the standard prohibits.
- **Violates the voice.** Exclamation marks, "rest assured," "top priority" are marketing register, not calm editorial. They perform confidence the product has not earned and cannot verify.
- **Violates §1.1.** Every sentence after the first is an unverified claim. The statement is actively harmful — it sets an expectation we cannot meet and undermines the one true claim ("nothing leaves your browser") by surrounding it with false ones.

---

### 11.4 A supportive validation error

**Context:** The user has entered a date in the future as a trust execution date.

**Good.**

> That date is in the future.
>
> A trust is usually signed on the day you complete it, not a date you plan for later. If you meant today, you can change it here. If you're planning ahead and intend to sign on that date, that's fine — just confirm and we'll use it.
>
> [Use today's date] [Keep this date]

**Poor.**

> ⚠️ ERROR: Invalid date. The date must be in the past or today. Please enter a valid date and try again.

**Why the poor version fails.**

- **Violates §10.1.** It blames the user ("Please enter a valid date") and exposes a raw system framing ("ERROR: Invalid date") with no plain-language explanation of what went wrong or why it matters.
- **Violates §4.** It does not explain the consequence. The user learns that the date is "invalid" but not that trusts are normally signed on completion — the one piece of information that would let them decide whether the future date is a mistake.
- **Violates §9.2 and the voice.** The warning emoji and the imperative "must" apply pressure where none is warranted. A future date may be intentional; the error treats it as a defect.
- **Fails on action.** It offers one path (re-enter) and no path to confirm an intentional choice. The good version offers both, because both are legitimate.

---

### 11.5 A trustworthy CTA

**Context:** The final generate step.

**Good.**

> **You've answered everything.**
>
> Review your answers below. When you're ready, generate your document as a PDF. You can change any answer before you generate, and you can come back and start over any time.
>
> Nothing on this page is sent to us. The PDF will download to your device when it's ready.
>
> [Generate my document (PDF)]
>
> [Go back and review] [Save a copy of my answers to my device] [Leave without generating]

**Poor.**

> 🎉 You're almost done! Don't lose your progress — generate your free trust document now before you leave!
>
> [GET MY FREE TRUST NOW →]
>
> *By clicking, you agree to our Terms of Service and Privacy Policy.*

**Why the poor version fails.**

- **Violates §9.1.** The button label ("GET MY FREE TRUST NOW →") does not name the action (generating a PDF), does not state what happens next, and applies urgency ("before you leave") where none exists.
- **Violates §9.2.** "Don't lose your progress — generate now before you leave" is manufactured urgency, a prohibited pressure pattern. The document is free and persistent; there is no time pressure.
- **Violates §10.4.** Completion is celebrated with an emoji and an exclamation, where the standard calls for calm acknowledgment. The user has made a serious decision; the tone treats it like a coupon redemption.
- **Violates §9.1 and §6.** The hidden "By clicking, you agree…" line is a consent gate disguised as a footnote, attached to a pressure CTA — the combination of urgency and buried consent is a textbook dark pattern.
- **Fails on the exit path.** There is no equally weighted way to go back, review, or leave. The only visible action is the generate button. The good version offers review, local save, and leave as first-class options.

---

*This document is the content and trust standard for FreeTrustDocs. It is not a legal document and does not constitute legal advice. Where it references statutes, those references are for transparency about template origins, not assertions of legal effectiveness.*