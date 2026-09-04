# Frontend style rules — FreeTrustDocs

**2026-09-04, after three production bugs from one root cause:**

## ⚠️ Tailwind is NOT installed in this project

This is a plain **Astro + vanilla CSS** site. All styling lives in:
- `src/styles/global.css` (shared classes, design tokens via CSS variables)
- `<style>` blocks inside `.astro` components (Astro scopes them automatically)

**Tailwind utility classes (`flex items-center gap-1.5 max-w-4xl mx-auto`, etc.) are INERT here** — they compile to nothing because there is no Tailwind integration. They don't error at build time, so the bug ships silently.

**Incident history (2026-09-04, one commit caused all three):**
1. AdSense container rendered edge-to-edge, "Advertisement" label stuck left with dead space (`my-8 max-w-4xl mx-auto` = nothing)
2. Footer "Preferred Source on Google" SVG rendered as a **1020×1020px star** (`w-3.5 h-3.5` = nothing)
3. (Layout) Hero gallery hard-coded `grid-template-columns: 1fr 1fr` for 3 cards → 2+1 with an empty slot

**Rule: before using a utility class, grep `package.json` for `tailwind`. Not there → write real CSS.**
- Centering: `margin: 0 auto` + explicit `max-width`
- Flex rows: `display: flex; align-items: center; justify-content: center`
- Small icons: explicit `width/height` in `em`/`rem` on the SVG class
- Component styles: prefer the component's own `<style>` block (scoped) over global.css additions

**Hero gallery:** `grid-template-columns: repeat(auto-fit, minmax(210px, 1fr))` inside the full-width `.container` — it fills one row with however many wizard cards exist (3 now; goes 4-across automatically when a 4th template ships).