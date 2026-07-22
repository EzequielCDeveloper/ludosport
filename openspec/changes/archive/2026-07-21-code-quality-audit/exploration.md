# Code Quality Audit — Exploration

> **Change**: `code-quality-audit`
> **Date**: 2026-07-21
> **Scope**: Full project audit — every source file in `app/`, `lib/`, `mockup/`, `next.config.ts`
> **Mode**: openspec

---

## 1. DEAD CODE

### 1.1 `app/hooks/useAccordion.ts`
- **File**: `app/hooks/useAccordion.ts` (entire file, 18 lines)
- **Severity**: WARNING
- **Problem**: Exports `useAccordion()` hook but it's not imported anywhere in the project. The FAQs section uses native `<details>/<summary>` elements, which handle toggle state natively — no accordion hook needed.
- **Fix**: Delete the file.

### 1.2 `app/hooks/useScrollVisibility.ts`
- **File**: `app/hooks/useScrollVisibility.ts` (entire file, 36 lines)
- **Severity**: WARNING
- **Problem**: Exports `useScrollVisibility()` hook but it's not imported anywhere. Likely a remnant from earlier development where the WhatsApp float or navbar needed scroll-based hide/show behavior (now handled by CSS classes and the `useScrollNav` hook).
- **Fix**: Delete the file.

### 1.3 `lib/constants.ts` — `RANGO_COLORS`
- **File**: `lib/constants.ts`, lines 190-199
- **Severity**: WARNING
- **Problem**: `RANGO_COLORS` is exported but never imported by any component. Rangos.tsx and ValueCard.tsx each define their own local color maps (`BORDER_COLORS`/`TEXT_COLORS`). The `RANGO_COLORS` map maps to CSS variable strings, while the local maps use Tailwind arbitrary-value syntax.
- **Fix**: Either delete `RANGO_COLORS` from constants.ts and use a shared color map in a central location (e.g., `lib/colors.ts`), or consummate the export by importing it into Rangos.tsx and ValueCard.tsx and removing the duplicates.

### 1.4 `mockup/main.js` — `lastScroll` variable
- **File**: `mockup/main.js`, lines 12-16
- **Severity**: SUGGESTION (static mockup)
- **Problem**: `let lastScroll = 0;` is declared (line 12) and assigned on scroll (line 16: `lastScroll = sy;`) but never read. This is leftover from the static HTML/CSS mockup.
- **Fix**: Remove the unused variable. (Low priority since this is a static mockup, not production code.)

---

## 2. CODE ERRORS

### 2.1 NavbarClient.tsx — `closeMenu` used before declaration (temporal dead zone)
- **File**: `app/components/NavbarClient.tsx`, lines 29-37 vs 39-42
- **Severity**: CRITICAL (runtime correctness + lint error)
- **Problem**: `useEffect` blocks (lines 29-37) reference `closeMenu` (line 32) which is defined AFTER the effect (line 39: `const closeMenu = useCallback(...)`). In JavaScript, `const` is in the temporal dead zone until declaration. While the callback `handleEscape` isn't invoked until after mount (when `closeMenu` IS initialized), the reference is technically before declaration. ESLint's `no-use-before-define` rules flag this, and React Compiler may produce incorrect memoization around it.
  **Additionally**: `closeMenu` is a missing dependency in the effect (line 37: `[menuOpen]` should be `[menuOpen, closeMenu]`).
- **Fix**: Restructure the component so `closeMenu` is defined BEFORE the `useEffect` that references it. Also add `closeMenu` to the dependency array.

### 2.2 NavbarClient.tsx — ESLint exhaustive-deps warning
- **File**: `app/components/NavbarClient.tsx`, line 37
- **Severity**: WARNING
- **Problem**: `useEffect` has dependency array `[menuOpen]` but the closure captures `closeMenu`. The React hooks exhaustive-deps rule warns about this.
- **Fix**: Add `closeMenu` to the dependency array AND move the `useCallback` declaration above the `useEffect` to avoid the temporal dead zone issue.

### 2.3 MapSection.tsx — `as any` type assertion
- **File**: `app/components/MapSection.tsx`, lines 12, 70
- **Severity**: WARNING
- **Problem**: `mapRef` is typed as `useRef<unknown>(null)`, then cast with `as any` (line 70) to call `map.remove()`. This bypasses TypeScript entirely. The `mapRef` could be typed as `L.Map | null`.
- **Fix**: Type `mapRef` as `useRef<L.Map | null>(null)` and import the Leaflet types properly. Import `L` type from `leaflet` without the dynamic import—or keep the dynamic import for bundle size but leverage the type package: `import type { Map as LeafletMap } from "leaflet"`.

### 2.4 MapSection.tsx — eslint-disable for `@typescript-eslint/no-explicit-any`
- **File**: `app/components/MapSection.tsx`, line 69
- **Severity**: WARNING
- **Problem**: `// eslint-disable-next-line @typescript-eslint/no-explicit-any` is used to silence the `as any` cast on line 70.
- **Fix**: Fix the type issue (2.3) and remove the eslint-disable comment.

### 2.5 useScrollVisibility.ts — eslint-disable for `react-hooks/set-state-in-effect`
- **File**: `app/hooks/useScrollVisibility.ts`, line 14
- **Severity**: WARNING (plus dead code — see 1.2)
- **Problem**: `// eslint-disable-next-line react-hooks/set-state-in-effect` silences a rule that warns about calling `setIsVisible(true)` inside `useEffect` (line 15). The comment argues this is valid synchronization, but the hook is dead code anyway.
- **Fix**: Remove the file (dead code).

---

## 3. IMPROVEMENT AREAS

### 3.1 Relative imports instead of `@/` alias
- **Files**:
  - `app/components/Navbar.tsx` line 3: `import NavbarClient from "./NavbarClient"`
  - `app/components/Valores.tsx` line 4: `import ValueCard from "./ValueCard"`
  - `app/components/icons/index.ts` lines 1-3: all relative (`"./DisciplinaIcon"`, etc.)
- **Severity**: SUGGESTION
- **Problem**: The project uses `@/` path alias (configured in `tsconfig.json` `paths`), and most imports across the codebase use it correctly (e.g., `@/lib/constants`, `@/app/hooks/useScrollNav`). These few relative imports are inconsistent and make refactoring harder (moving files breaks relative paths).
- **Fix**: Convert relative imports to `@/` alias. E.g., `import NavbarClient from "@/app/components/NavbarClient"`, `import ValueCard from "@/app/components/ValueCard"`.

### 3.2 Inline styles (15+ instances)
- **Severity**: SUGGESTION
- **Problem**: The codebase uses inline `style={}` objects extensively — at least 15 instances across components. Many of these use dynamic CSS custom properties or Tailwind arbitrary values that could be extracted:
  - **MapSection.tsx** — spinner style, container style (`height: 380` is Tailwind-inaccessible)
  - **Actividades.tsx** — card box-shadow
  - **ValueCard.tsx** — backdropFilter, WebkitBackdropFilter, boxShadow
  - **StarWarsCrawl.tsx** — opacity, transform, background gradients
  - **NavbarClient.tsx** — mobile menu `right` position
  - **Hero.tsx** — radial gradients, scanline overlay, bottom fade
  - **CtaFinal.tsx** — background gradients, button boxShadow/textShadow
  - **Rangos.tsx** — backdropFilter, boxShadow per card
- **Fix**: Extract static styles to CSS classes. Keep inline styles only for truly dynamic values (runtime-computed transforms, opacity, etc.).

### 3.3 Index as key in React lists
- **Files**:
  - `app/components/Actividades.tsx` line 94: `key={i}` for dot indicator buttons
  - `app/components/FAQs.tsx` line 18: `key={index}` for FAQ details elements
- **Severity**: WARNING (potential rendering issues if lists change)
- **Problem**: Using array index as `key` can cause rendering bugs if the list order changes, items are inserted/deleted, or reordering occurs. For static lists that never change (like FAQs and Actividades dots), this is safe in practice but still an anti-pattern.
- **Fix**: Use stable unique IDs. For FAQs, use `faq.question` or a hash. For dot indicators, use the actividad's `actividad.num`.

### 3.4 `dangerouslySetInnerHTML` usage
- **Files**:
  - `app/components/FAQs.tsx` line 37: `dangerouslySetInnerHTML={{ __html: faq.answer }}`
  - `app/layout.tsx` line 63: `dangerouslySetInnerHTML={{ __html: jsonLd }}`
- **Severity**: WARNING (XSS vector)
- **Problem**: FAQ answers contain inline HTML (`<strong>`, `<br>`) so `dangerouslySetInnerHTML` is required unless the content is restructured. The JSON-LD injection is standard practice but still bypasses React's XSS protection. If FAQ content ever comes from a CMS or user input, this is a real vulnerability.
- **Fix**: For FAQs: split answer text into structured fields (e.g., `answerParts: string[]`) and render without innerHTML. For JSON-LD: consider using a `<script>` tag with `type="application/ld+json"` and `JSON.stringify` in a template literal (acceptable practice, this is the standard approach).

### 3.5 `eslint-disable` comments
- **Files**:
  - `app/hooks/useScrollVisibility.ts` line 14: `// eslint-disable-next-line react-hooks/set-state-in-effect`
  - `app/components/MapSection.tsx` line 69: `// eslint-disable-next-line @typescript-eslint/no-explicit-any`
- **Severity**: WARNING
- **Problem**: Suppressing lint rules instead of fixing the underlying issue.
- **Fix**: Remove the suppression comments by fixing the underlying causes (see 1.2 and 2.3-2.4).

---

## 4. OPTIMIZATION OPPORTUNITIES

### 4.1 Missing `priority` and `loading` attributes on Next.js Image
- **Files**: All components using `next/image`
  - `app/components/Navbar.tsx` — logo image (above the fold, no `priority`)
  - `app/components/Actividades.tsx` — activity card images (below the fold, no `loading="lazy"`)
  - `app/components/Profesor.tsx` — teacher image (below the fold, has `sizes` but no `priority`)
  - `app/components/Footer.tsx` — logo image (below the fold, no `loading="lazy"`)
- **Severity**: WARNING (performance / Core Web Vitals)
- **Problem**: Next.js `<Image>` defaults to lazy loading. Above-the-fold images (Navbar logo) should have `priority` to avoid layout shift and get preloaded. Below-the-fold images (activities, footer) should explicitly have `loading="lazy"` (which is the default but explicit is better).
- **Fix**: Add `priority` to the Navbar logo. Optionally add explicit `loading="lazy"` to cards and footer.

### 4.2 Missing `sizes` attribute on images
- **Files**:
  - `app/components/Navbar.tsx` — logo (48x48, small — low impact)
  - `app/components/Actividades.tsx` — activity images (width 600, height 400, no `sizes`)
  - `app/components/Footer.tsx` — logo (36x36, small — low impact)
- **Severity**: SUGGESTION (performance)
- **Problem**: Without `sizes`, Next.js assumes `100vw` which causes larger images to be served than needed on smaller screens. Only `Profesor.tsx` specifies `sizes="(max-width: 768px) 100vw, 500px"`.
- **Fix**: Add appropriate `sizes` attributes. For activities: `sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"`.

### 4.3 Redundant event listeners in `useScrollNav`
- **File**: `app/hooks/useScrollNav.ts`
- **Severity**: SUGGESTION
- **Problem**: The hook sets up a `scroll` event listener to toggle `isSolid`, AND an `IntersectionObserver` to track `activeSection`. The scroll listener could be replaced with a `IntersectionObserver` watching a threshold element, but the current approach is a common pattern. Minor overhead.
- **Fix**: Consider using a single `IntersectionObserver` with `rootMargin: "-60px 0px 0px 0px"` to detect when the navbar should become solid, removing the scroll listener entirely.

### 4.4 Starfield CSS duplication
- **File**: `app/styles/starfield.module.css` (434 lines)
- **Severity**: SUGGESTION
- **Problem**: The CSS star positions are duplicated for the seamless scroll loop: `::before` has two blocks of 120 positions each, `::after` has two blocks of 50 each, `.stars__large` has two blocks of 15 each. This is 868 lines worth of coordinates for the starry background. While functional, it's a significant CSS payload.
- **Fix**: This is largely intentional for the visual effect. Consider generating the star positions at build time instead of hardcoding, or reduce the number of stars.

---

## 5. WEIRD / INCONSISTENT LOGIC

### 5.1 Duplicate coordinate definitions
- **Files**:
  - `app/components/MapSection.tsx` lines 7-8: `const LAT = 32.461111; const LNG = -114.795667;`
  - `lib/constants.ts` line 8: `ACADEMY.coordinates: { lat: 32.461111, lng: -114.795667 }`
- **Severity**: WARNING (maintenance risk)
- **Problem**: Same coordinates defined in two places with no shared source of truth. If the academy moves, both locations must be updated. MapSection.tsx should import from `@/lib/constants`.
- **Fix**: Import `ACADEMY` from `@/lib/constants` in MapSection.tsx and use `ACADEMY.coordinates.lat` / `ACADEMY.coordinates.lng`.

### 5.2 Triple color maps with divergent schemas
- **Files**:
  - `lib/constants.ts` line 193: `RANGO_COLORS` — maps color name to `{ border: string, text: string }` with CSS variable values (UNUSED)
  - `app/components/Rangos.tsx` lines 3-17: local `BORDER_COLORS: Record<string, string>` and `TEXT_COLORS: Record<string, string>` — maps to Tailwind arbitrary value syntax like `"[border-top-color:var(--color-blue)]"`
  - `app/components/ValueCard.tsx` line 11: local `BORDER_COLORS: Record<string, string>` — same pattern as Rangos.tsx, maps to Tailwind arbitrary values
- **Severity**: WARNING (maintenance risk)
- **Problem**: Three separate implementations of the same concept (color mapping by name), plus one dead export. The unused `RANGO_COLORS` maps to raw CSS variable strings, while the used local maps use Tailwind arbitrary value syntax. Adding a new rango/valor color requires updating two or three files.
- **Fix**: Consolidate into a single shared color map in `lib/` (e.g., `lib/colors.ts` or a `COLORS` export in constants). Decide on a single format (Tailwind arbitrary value strings) and use it everywhere.

### 5.3 NavbarClient applies classes via direct DOM manipulation
- **File**: `app/components/NavbarClient.tsx`, lines 14-19
- **Severity**: WARNING (React anti-pattern)
- **Problem**: The component calls `document.getElementById("navbar")` and directly manipulates `classList` to toggle `navbar--solid`. This bypasses React's rendering cycle and couples NavbarClient to its parent's DOM structure. A more idiomatic approach would pass `isSolid` as a prop from the parent or use a portal-based approach.
- **Fix**: Pass `isSolid` as a prop from Navbar.tsx to NavbarClient.tsx, and use React's `className` binding instead of DOM manipulation.

### 5.4 Dual Starfield instances during crawl
- **Files**: `app/page.tsx` (renders `<Starfield />`), `app/components/StarWarsCrawl.tsx` (renders `<Starfield />` inside fixed overlay)
- **Severity**: SUGGESTION
- **Problem**: The main page has a background Starfield. When the StarWarsCrawl section is visible, a SECOND Starfield renders in a fixed overlay on top of the main one. While visually intentional (the crawl needs stars to scroll over), this results in two starfield instances animating simultaneously (double the work for the GPU/compositor).
- **Fix**: Consider hiding the background `#starfield` when the crawl overlay is active, or using CSS `z-index` layering with a single starfield.

### 5.5 `useScrollVisibility.ts` — confusing scroll behavior
- **File**: `app/hooks/useScrollVisibility.ts` (dead code, but logic is worth noting)
- **Severity**: SUGGESTION
- **Problem**: The hook sets `isVisible = true` on ANY scroll (line 20), then sets `isVisible = false` after 2 seconds of no scrolling IF the scroll position is < 100. This means the element becomes visible on ANY scroll movement, even scrolling upward past the threshold. The initial sync (line 15) uses a hard threshold of 100px.
- **Fix**: (Not needed — dead code.) But if revived, the logic should be: on scroll, keep visible while `scrollY >= 100`, with a debounced transition-out.

### 5.6 10 activities share only 3 placeholder images
- **File**: `app/components/Actividades.tsx` — all 10 activity cards use images from `ACTIVIDADES` data
- **File**: `lib/constants.ts` lines 78-149 — activities reference only 3 unique images
- **Severity**: SUGGESTION
- **Problem**: `/placeholders/kids-training.jpg`, `/placeholders/kid-learning-with-teacher.jpg`, `/placeholders/kid-tired.jpg` are reused across all 10 activities in a pattern. Activities 1, 5, 9 share image 1; activities 2, 4, 7, 10 share image 2; activities 3, 6, 8 share image 3. This is visually repetitive.
- **Fix**: Replace with unique royalty-free images or custom photography specific to each discipline.

---

## 6. PROJECT GAPS

### 6.1 No test infrastructure
- **Severity**: WARNING
- **Problem**: `package.json` has no test runner (Jest, Vitest, Playwright, etc.), no test scripts, and no test files. The project relies solely on ESLint and TypeScript for code quality validation.
- **Fix**: Add at least a unit test runner (Vitest) with React Testing Library for component tests, and a lint/type-check step in CI.

### 6.2 Missing `sharp` for image optimization
- **File**: `package.json` lines 29-34: `ignoreScripts: ["sharp", "unrs-resolver"]` + `trustedDependencies: ["sharp", "unrs-resolver"]`
- **Severity**: WARNING
- **Problem**: `sharp` is listed as both `ignoreScripts` and `trustedDependencies`, meaning its installation scripts are skipped. Without `sharp`, Next.js falls back to a slower, non-native image optimization pipeline, which will degrade build performance and may affect image quality in production.
- **Fix**: Remove `sharp` from `ignoreScripts` (keep in `trustedDependencies`), then run `npm install` to rebuild native bindings.

### 6.3 No CI/CD pipeline
- **Severity**: SUGGESTION
- **Problem**: The project has no GitHub Actions, GitLab CI, or any CI/CD configuration. No automated linting, type-checking, building, or deployment pipeline.
- **Fix**: Add a GitHub Actions workflow that runs `bun run lint`, `npx tsc --noEmit`, and `bun run build` on PRs, plus deploys to Netlify on merge to main.

### 6.4 No `loading.tsx`
- **Severity**: SUGGESTION
- **Problem**: Next.js App Router supports `app/loading.tsx` for auto-generated Suspense boundaries. The project doesn't have one, so users may see a flash of unstyled content during page transitions.
- **Fix**: Add `app/loading.tsx` with a spinner or skeleton matching the brand theme.

### 6.5 Duplicate layout between `error.tsx` and `not-found.tsx`
- **Files**: `app/error.tsx`, `app/not-found.tsx`
- **Severity**: SUGGESTION
- **Problem**: Both files import the same modules (`Navbar`, `Footer`, `Starfield`, `NAV_LINKS`) and render near-identical layout patterns (Starfield + Navbar + main content + Footer). The only difference is the content (error message vs 404 message) and the presence of a `reset` button in `error.tsx`.
- **Fix**: Consider extracting the shared layout shell into a component, or conditionally rendering based on error type.

### 6.6 Missing `metadata` on error/not-found pages
- **Severity**: SUGGESTION
- **Problem**: `error.tsx` and `not-found.tsx` don't export `metadata` objects. While Next.js automatically handles some metadata for these pages, explicit titles/descriptions improve SEO for error states.
- **Fix**: Add appropriate `export const metadata: Metadata` to both pages, or use `generateMetadata`.

### 6.7 ESLint config uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **File**: `eslint.config.mjs`
- **Severity**: SUGGESTION
- **Problem**: The import path `eslint-config-next/core-web-vitals` is unusual — the standard `eslint-config-next` typically provides configs via `eslint-config-next` directly. The `/core-web-vitals` and `/typescript` subpath imports may resolve differently depending on the version. If they break, the entire lint setup fails silently.
- **Fix**: Verify the import paths resolve correctly for `eslint-config-next@16.2.10`. Consider using the traditional `.eslintrc.json` or the flat config pattern documented for the version.

---

## 7. ADDITIONAL CONTEXT

### 7.1 Stack Overview
- **Next.js**: 16.2.10 (App Router, Server Components by default)
- **React**: 19.2.4 (includes React Compiler in experimental mode)
- **TypeScript**: 5.x (strict mode enabled)
- **Tailwind CSS**: v4 (CSS-first configuration via `@import "tailwindcss"`)
- **Leaflet**: 1.9.4 (with `@types/leaflet` for types)
- **Linting**: ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next`
- **Runtime**: bun (dev) + npm (lock)
- **Deployment**: Netlify (`fluffy-lamington-27c3ea.netlify.app`)

### 7.2 Security Observations
- CSP is configured in `next.config.ts` with `script-src 'unsafe-inline'` (required for Next.js) and `upgrade-insecure-requests`.
- The `Permissions-Policy` disables camera, microphone, and geolocation.
- `X-Frame-Options: DENY` prevents clickjacking.
- No external scripts (Google Analytics, Facebook Pixel, etc.) are loaded.
- The `dangerouslySetInnerHTML` in FAQs (for rendered HTML answers) and layout (JSON-LD) are the two main self-XSS vectors. Both use trusted, hardcoded content.

### 7.3 Prior Work / Known Issues
- The `NavbarClient.tsx` hoisting issue is a pre-existing eslint error that was noted but not fixed.
- The `mapRef as any` cast in MapSection.tsx is a known workaround for the dynamic import pattern.
- `useScrollVisibility.ts` and `useAccordion.ts` were noted as likely dead code in prior sessions.
- The `RANGO_COLORS` unused export was identified previously.

### 7.4 Architecture Quirks
- **Component tree**: `Navbar.tsx` (Server) → `NavbarClient.tsx` (Client) — the server wrapper adds the nav structure, the client component adds interactivity. However, NavbarClient applies CSS classes to the parent `<nav>` via `document.getElementById("navbar")`, which couples them tightly.
- **Dynamic import pattern in MapSection**: `leaflet` is dynamically imported inside a `useEffect` to avoid server-side rendering issues (Leaflet requires `window`). This is correct but requires the `as any` cast because `mapRef` is typed as `unknown`.
- **StarWarsCrawl custom scroll system**: Uses `requestAnimationFrame` loop with manual scroll calculations (entry/exit opacity, text perspective transform). The lerp/damping formula for opacity smoothing is frame-rate independent (uses exponential time constant `tau`).

---

## Category Summary

| Category | Count | Critical | Warning | Suggestion |
|----------|-------|----------|---------|------------|
| Dead Code | 4 | 0 | 3 | 1 |
| Code Errors | 5 | 1 | 4 | 0 |
| Improvements | 5 | 0 | 2 | 3 |
| Optimizations | 4 | 0 | 1 | 3 |
| Inconsistencies | 6 | 0 | 3 | 3 |
| Project Gaps | 7 | 0 | 2 | 5 |
| **Total** | **31** | **1** | **15** | **15** |

---

## Risk Assessment

### Critical Issues (1)
1. **NavbarClient closeMenu TDZ + missing deps** — potential runtime crash on Escape key in mobile menu, and an ESLint error that blocks clean builds.

### High-Risk Issues (0)
- No critical-type warnings found beyond the CRITICAL item above.

### Medium-Risk Issues
- **Duplicate coordinates** — low risk of drift but silent failure mode (map shows wrong location).
- **Triple color maps** — adding a new rango color requires touching 3 files, low risk but real maintenance overhead.
- **Missing sharp** — degrades image perf in production, may cause build warnings.
- **No tests** — no safety net for refactors.

### Low-Risk / Cosmetic
- Most SUGGESTION items are style choices or nice-to-haves.

---

## Ready for Proposal
**Yes** — All source files have been analyzed. The exploration covers 31 findings across 7 categories with 1 critical, 15 warnings, and 15 suggestions. The scope for the proposal phase should prioritize:
1. CRITICAL fixes (NavbarClient)
2. WARNING fixes (tests, sharp, dead code removal, color map consolidation, coordinate dedup)
3. SUGGESTION items (lower priority)

A proposal should distinguish between "must fix before launch" and "nice to have."
