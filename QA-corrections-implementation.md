# FreeTrustDocs QA Corrections — Implementation Report

**Date:** 2026-08-19  
**Scope:** Confirmed QA corrections from read-only reports (`QA-runtime-seo.md`, `QA-builders.md`)  
**Repo:** `Kit/life/brands/TrustMinutes/projects/freetrustdocs/site`  
**Constraint:** No deploy, no commit, no brand marks/favicon without explicit approval

---

## Summary of Actions Taken

| # | Item | Action | Result |
|---|------|--------|--------|
| 1 | `public/robots.txt` | Verified — already present with correct content | ✅ No change needed |
| 2 | BreadcrumbList schema | Verified — no malformed `***@type` in current source | ✅ No change needed |
| 3 | Sitemap handling | Verified — `@astrojs/sitemap` integration active | ✅ No change needed |
| 4 | 404 page | Verified — `src/pages/404.astro` exists with proper content | ✅ No change needed |
| 5 | TypeScript type safety for pdfMake | Created type declaration, replaced `@ts-ignore` and `(window as any)` casts | 🔧 **Fixed — 3 files** |
| 6 | PDF generation error handling | Added try/catch around all `generatePDF()` call sites | 🔧 **Fixed — 3 files** |
| 7 | Build verification | `pnpm exec astro build` — 138 pages, 0 errors | ✅ Pass |
| 8 | TypeScript verification | `pnpm exec tsc --noEmit` — 0 errors, 0 warnings | ✅ Pass |

---

## 1. `public/robots.txt` — Already Correct

**File verified:** `public/robots.txt` exists at the repo root with correct content:
```
User-agent: *
Allow: /
Sitemap: https://freetrustdocs.com/sitemap-index.xml
```
This matches the recommendation from `QA-runtime-seo.md` §25 (item #1 in blockers). No action needed.

---

## 2. BreadcrumbList Schema — Already Correct

**Verified across:** all 60+ `.astro` page files in `certificate-of-trust/`, `declaration-of-trust/`, and `land-trust/` directories.

`QA-runtime-seo.md` §14 flagged a malformed BreadcrumbList with `"@context":"https://***@type":"BreadcrumbList"`. Inspection confirms the current source uses the correct pattern:

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[...]}
```

No malformed contexts found. No changes required.

---

## 3. Sitemap Handling — Already Correct

**Config** (`astro.config.mjs`):
```javascript
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://freetrustdocs.com',
  integrations: [preact(), sitemap()],
});
```

**Build output verified:**
- `dist/sitemap-index.xml` — 188 bytes, valid
- `dist/sitemap-0.xml` — 10,876 bytes, 138 URL entries

No changes needed.

---

## 4. Custom 404 Page — Already Correct

**File:** `src/pages/404.astro` — exists with:
- Proper `<Base>` layout with `title` and `description`
- Styled 404 heading, helpful error message
- Navigation links: Homepage, Create a Trust Document, Browse Guides
- Uses same design system as rest of site

**Build output verified:** `dist/404.html` — 7,542 bytes

This addresses the critical soft-404 finding from `QA-runtime-seo.md` §19. The source-level 404 is now in place; the deployment-level SPA fallback (returning `index.html` with HTTP 200 for unknown routes) is a server configuration concern outside source scope.

---

## 5. Builder/PDF Type Safety — 🔧 Fixed

### Problem (from `QA-builders.md` items #14, #15)
All three wizard components used `// @ts-ignore` and unsafe `(window as any)` casts to access pdfmake, a library loaded dynamically via `<script>` tags:

```typescript
// @ts-ignore - pdfmake is loaded via script tag
const pdfMake = (window as any).pdfMake;
```

This suppressed real type-checking and made the codebase harder to maintain.

### Solution

**Created `src/types/pdfmake.d.ts`** — Window interface augmentation providing proper types for dynamically loaded pdfmake:

```typescript
declare global {
  interface Window {
    pdfMake?: {
      vfs: Record<string, string>;
      fonts: Record<string, unknown>;
      createPdf: (docDefinition: Record<string, unknown>) => {
        download: (filename?: string) => void;
      };
    };
    ftdVFS?: Record<string, string>;
  }
}
```

**Updated all three wizard files:**
- Removed `// @ts-ignore` comments
- Replaced `(window as any).pdfMake` → `window.pdfMake` (type-checked, possibly undefined)
- Replaced `(window as any).ftdVFS` → `window.ftdVFS`
- Replaced `(window as any).pdfMake.vfs` → `window.pdfMake!.vfs` (non-null assertion inside onload where it's guaranteed)
- Replaced `(window as any).pdfMake.fonts` → `window.pdfMake!.fonts`

### Files modified:
- `src/types/pdfmake.d.ts` — **new file**
- `src/components/CertOfTrustWizard.tsx`
- `src/components/DeclarationOfTrustWizard.tsx`
- `src/components/LandTrustWizard.tsx`

---

## 6. PDF Generation Error Handling — 🔧 Fixed

### Problem (from `QA-builders.md` item #5)
"If pdfmake or font loading fails mid-generation, the user gets no feedback; possible uncaught exception."

All `generatePDF()` call sites (9 total: 3 per wizard × 3 locations each) were unprotected:
1. Inside `ftdVfs.onload` callback
2. Inside `ftdVfs.onerror` callback  
3. Inside `else` branch (pdfMake already loaded)

### Solution
Added `try/catch` around every `generatePDF(data)` invocation across all three wizard components:

```typescript
try {
  generatePDF(data);
  setGenerated(true);
} catch (e) {
  alert('Failed to generate PDF. Please try again.');
}
```

Also added null guard inside `generatePDF()` itself, guarding against the case where it's called before pdfMake is fully initialized:

```typescript
const pdfMake = window.pdfMake;
if (!pdfMake) {
  alert('PDF generator is not loaded. Please check your internet connection and try again.');
  return;
}
```

### Additional hardening
- Added `script.onerror` callbacks for both the pdfmake and vfs_fonts CDN script loads (these were missing in DeclarationOfTrustWizard and LandTrustWizard)

---

## Pre-Existing Modifications (Not Made During This Session)

The following modifications were already present in the working tree before this implementation session. They are **not** attributed to the changes made here:

### `src/layouts/Base.astro`
```diff
   <!-- Favicon -->
   <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
+  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
```
A favicon.ico fallback `<link>` was added. This is a reasonable addition for broader browser compatibility but was not part of this implementation.

### `tsconfig.json`
```diff
     }
+    "ignoreDeprecations": "6.0"
   }
```
The TypeScript 6.0 deprecation warning for `baseUrl: "."` was suppressed. This was likely added during workspace setup.

---

## Build & Verification Results

### Astro Build
```
pnpm exec astro build
✓ 138 page(s) built in 973ms
✓ sitemap-index.xml created at dist
✓ 0 errors
```

### TypeScript Check
```
pnpm exec tsc --noEmit
✓ Clean — 0 errors, 0 warnings
```
*(Previous `TS5101: Option 'baseUrl' is deprecated` warning already suppressed by `"ignoreDeprecations": "6.0"` in tsconfig.json)*

### Build Outputs Verified
| Output | Status | Size |
|--------|--------|------|
| `dist/404.html` | ✅ | 7,542 bytes |
| `dist/sitemap-index.xml` | ✅ | 188 bytes |
| `dist/sitemap-0.xml` | ✅ | 10,876 bytes |
| `dist/robots.txt` | ✅ | 75 bytes |

---

## Items NOT Modified (As Directed)

| Item | Reason |
|------|--------|
| Brand marks / favicon generation | Explicit approval required per task instructions |
| `og:image` / social preview images | Requires brand asset creation; needs explicit approval |
| Privacy policy analytics contradiction | Policy decision required (GA4/Clarity mentioned but not deployed) |
| Cloudflare Worker for server-side 404 | Deployment/server configuration, outside source scope |
| Land Trust state coverage expansion | Content gap requiring legal research, not a technical fix |
| ESLint/Prettier/test infrastructure | Tooling recommendation from QA report, not a confirmed bug fix |
| Deployment config (`wrangler.toml`) | DevOps concern, not source-level QA |

---

## Remaining Recommendations (from QA reports, not implemented)

1. **OG image** — All pages lack `og:image`. Create a branded social preview image.
2. **Twitter Card meta tags** — Add `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
3. **Cross-domain canonical** — `pages.dev` deployment serves pages with canonical pointing to `freetrustdocs.com`. Either block `pages.dev` from indexing or fix canonicals dynamically.
4. **Privacy policy analytics** — Policy mentions GA4/Clarity but zero analytics scripts are deployed. Decide and update either deployment or policy.
5. **Preconnect hints** — Add `rel="preconnect"` for cdnjs (PDF/font CDN) to improve performance.

---

*Implementation completed without commit or deploy. All verification passed.*