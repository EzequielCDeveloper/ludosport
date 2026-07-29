## Exploration: fix-critical-findings

**Source**: Software Quality Audit 2026-07-27 (docs/software-quality-audit-2026-07-27.md)
**Scope**: 1 BLOCKER + 9 CRITICAL findings (Fase 1 only)
**Date**: 2026-07-28

---

### Current State

Every finding from the audit is **CONFIRMED present** in the current codebase. Below is per-file evidence from live source.

#### 1. `app/globals.css` — JD-B-01 (Hero invisible en Firefox)

**Evidence (lines 121-127)**:
```css
.hero__title-stroke {
  color: var(--color-red);
  -webkit-text-stroke: 4px var(--color-yellow);
  -webkit-text-fill-color: transparent;
  text-stroke: 4px var(--color-yellow);
  text-fill-color: transparent;
}
```

Firefox ignores `-webkit-text-stroke` and `text-stroke` (non-standard), but **does apply** `-webkit-text-fill-color: transparent`. Result: the hero title is fully transparent in Firefox. The `color: var(--color-red)` fallback never renders because `-webkit-text-fill-color` overrides it when supported.

**Also affected**: Mobile breakpoint at lines 128-132 reduces stroke width to `1.5px` — the Firefox fallback must also apply there.

**Consumer**: `app/components/Hero.tsx` lines 30, 33 — `<h1>` uses `.hero__title-stroke` class.

**Status**: 🔴 CONFIRMED

---

#### 2. `next.config.ts` — JD-A-01 (CSP `unsafe-inline`)

**Evidence (line 7)**:
```typescript
script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
```

`'unsafe-inline'` is **always present**, not conditionally gated on `isDev`. In production (`NODE_ENV=production` → `isDev = false`), the CSP is still:
```
script-src 'self' 'unsafe-inline';
```

This completely disables XSS protection. Next.js App Router needs inline scripts for React hydration — using nonces or hash-based CSP is the proper fix, but it requires middleware integration. A Minimum Viable Fix (MVF) is to document the tradeoff and add a reporting endpoint, then plan nonce migration for a future sprint.

**Status**: 🔴 CONFIRMED

---

#### 3. `next.config.ts` — JD-A-03 (Missing HSTS)

**Evidence (lines 25-43)**: The headers array includes `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `CSP`, and `Permissions-Policy`. There is **no `Strict-Transport-Security` header**.

**Note**: The deployment platform is Netlify (URL: `fluffy-lamington-27c3ea.netlify.app`). Netlify adds HSTS automatically for custom domains but **not for `*.netlify.app` subdomains**. The current production URL is a Netlify subdomain, so the HSTS header is genuinely missing.

**Status**: 🔴 CONFIRMED

---

#### 4. `app/components/StarWarsCrawl.tsx` — HE-07 (No skip button)

**Evidence (lines 90-172)**: The render returns:
- A spacer `<div ref={panelRef} aria-hidden="true">` that occupies scroll space
- A fixed panel `<div ref={sectionRef} className="fixed inset-0 z-40 ... pointer-events-none">` that floats on top

The entire fixed panel has `pointer-events-none`, making interaction impossible. No button, link, or any interactive element exists to skip or dismiss the crawl. Users must scroll through the entire spacer (~70% of content + viewport height) to reach content below.

**Status**: 🔴 CONFIRMED

---

#### 5. `app/components/StarWarsCrawl.tsx` — HE-14 (prefers-reduced-motion ignored in JS)

**Evidence (lines 17-88)**: The `useEffect` callback starts `requestAnimationFrame(tick)` **unconditionally**. Line 79 applies 3D transforms every frame:

```typescript
content.style.transform = `perspective(250px) rotateX(5deg) translateY(${Math.round(-progress * travel)}px)`;
```

The only `prefers-reduced-motion` check in the entire codebase is in `starfield.module.css` (line 13-17), which only affects the CSS starfield animation — not the JS-driven crawl transforms.

**Status**: 🔴 CONFIRMED

---

#### 6. `app/components/StarWarsCrawl.tsx` — A11Y-01 (Vestibular risk)

Same evidence as HE-14. The animation loop executes unconditionally regardless of `prefers-reduced-motion`. No pause/stop/hide mechanism exists. Violates WCAG 2.2 SC 2.2.2 (Pause, Stop, Hide) and SC 2.3.3 (Animation from Interactions).

**Status**: 🔴 CONFIRMED (same root cause as HE-14)

---

#### 7. `app/components/MapSection.tsx` — HE-21 (No error state)

**Evidence (lines 11-72)**: The component has only one UI state boolean:
```typescript
const [loaded, setLoaded] = useState(false);
```

The async IIFE (lines 17-63) imports Leaflet, initializes the map, and sets `loaded = true` on `whenReady`. There is **no `try/catch`**, no `error` state, no timeout. If the dynamic import fails, `loaded` remains `false` forever → infinite spinner.

**Status**: 🔴 CONFIRMED

---

#### 8. `app/components/MapSection.tsx` — JD-B-02 (Unhandled promise rejection)

**Evidence (lines 17-18)**:
```typescript
(async () => {
  const L = (await import("leaflet")).default;
  // … no try/catch
})();
```

The dynamic `import("leaflet")` can reject if: network fails, CDN is down, adblocker blocks the domain, or the module is corrupted. Without `try/catch`, this becomes an `unhandledrejection` — React error boundaries cannot catch errors from async `useEffect` callbacks. The spinner spins forever.

**Status**: 🔴 CONFIRMED (same root cause as HE-21)

---

#### 9. `app/components/MapSection.tsx` — A11Y-02 (No tabIndex)

**Evidence (lines 88-93)**:
```tsx
<div
  ref={containerRef}
  className="h-[380px] w-full bg-black"
  aria-label="Mapa: ubicación de Drake Academy en San Luis Río Colorado"
  role="application"
/>
```

`role="application"` with `aria-label` but **no `tabIndex`**. The div is not focusable, so keyboard users cannot reach the map, zoom controls, or marker popup. Leaflet's internal controls render focusable `<a>` elements, but the container itself is invisible to keyboard navigation.

**Status**: 🔴 CONFIRMED

---

#### 10. `.github/workflows/ci.yml` — JD-B-03 (CI doesn't run tests)

**Evidence (lines 10-21)**: The steps are:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20, npm cache)
3. `npm ci`
4. `npx tsc --noEmit`
5. `npm run lint`
6. `npm run build`

**`npm run test` is absent**. Two test files exist (`FAQs.test.tsx`, `NavbarClient.test.tsx`) with full vitest configuration (`vitest.config.mts`, `vitest.setup.ts`). Vitest 4.1.10, jsdom, @testing-library/react are all in `devDependencies` and installed by `npm ci`.

**Status**: 🔴 CONFIRMED

---

### Affected Areas

| File | Findings | Impact |
|------|----------|--------|
| `app/globals.css` | JD-B-01 | Hero title rendering across all browsers |
| `app/components/Hero.tsx` | (consumer of JDB-01) | Title uses `.hero__title-stroke` class |
| `next.config.ts` | JD-A-01, JD-A-03 | All HTTP response headers |
| `app/components/StarWarsCrawl.tsx` | HE-07, HE-14, A11Y-01 | Scroll-driven animation, vestibular safety |
| `app/components/Starfield.tsx` | (supporting — already handles reduced motion in CSS) | Starfield composited behind crawl |
| `app/styles/starfield.module.css` | (reference only — already correct) | CSS-only prefers-reduced-motion check |
| `app/components/MapSection.tsx` | HE-21, JD-B-02, A11Y-02 | Map loading, keyboard access |
| `lib/constants.ts` | (supplier of ACADEMY data for error fallback) | Address/coordinates for static fallback |
| `.github/workflows/ci.yml` | JD-B-03 | CI pipeline — test execution |

---

### Dependencies Between Findings

**Cluster A — StarWarsCrawl (HE-07, HE-14, A11Y-01)**:
- HE-14 (reduced-motion check in JS) and A11Y-01 (vestibular risk) are the **same fix**: add `window.matchMedia('(prefers-reduced-motion: reduce)')` guard before starting the rAF loop, and render static content instead.
- HE-07 (skip button) is additive: it requires a button that sets state to skip the animation. It interacts with HE-14 because the skip button and the reduced-motion check both need to produce the same outcome — static visible content.
- **Recommendation**: Fix HE-14/A11Y-01 first (foundational), then add HE-07 skip button on top.
- Starfield component already respects reduced motion in CSS — no changes needed there.

**Cluster B — MapSection (HE-21, JD-B-02, A11Y-02)**:
- HE-21 (error state) and JD-B-02 (unhandled rejection) are the **same fix**: wrap the async IIFE in `try/catch`, add `error` state, render fallback UI.
- A11Y-02 (tabIndex) is independent — a one-line attribute addition.
- **Recommendation**: Fix error handling and tabIndex together in one change since they touch the same render block.

**Cluster C — next.config.ts (JD-A-01, JD-A-03)**:
- JD-A-01 (CSP unsafe-inline) and JD-A-03 (HSTS) are independent sections of the same file.
- HSTS is a simple header addition (1 line + object). CSP refactoring is more complex.
- **Recommendation**: Fix HSTS immediately (trivial). For CSP, implement the Minimum Viable Fix (document + add report-uri) in this change, and plan nonce migration for a future sprint.

**Standalone changes**:
- JD-B-01 (globals.css) — no dependencies on other fixes
- JD-B-03 (ci.yml) — no dependencies on other fixes

---

### Gotchas

1. **JD-B-01 (globals.css)**: The `@supports` approach must account for the mobile breakpoint (lines 128-132) that reduces stroke to `1.5px`. Firefox users on mobile also need visible text.

2. **JD-B-01 (globals.css)**: `-webkit-text-fill-color: transparent` is supported in Firefox but `-webkit-text-stroke` is not. The `@supports (-webkit-text-stroke: …)` guard correctly gates on the stroke property.

3. **StarWarsCrawl**: The `initiated` ref (line 12) controls first-frame measurement. For reduced-motion and skip flows, we must prevent the rAF loop from starting entirely — the measurement and spacer height still need to happen, but the animation should not run.

4. **StarWarsCrawl**: The inline `style` on the content div (line 116: `transform: "perspective(250px) rotateX(5deg) translateY(0px)"`) is the "double control" issue (JD-B-06, WARNING — not in scope for Fase 1 but worth noting). When adding static rendering, this `style` attribute must be consistent with the chosen approach.

5. **StarWarsCrawl**: The fixed panel has `pointer-events-none`. A skip button must override this on its own element with `pointer-events-auto`.

6. **MapSection**: The cleanup function (lines 65-70) sets `cancelled = true` and calls `mapRef.current.remove()`. The `try/catch` must respect `cancelled` — if the component unmounts while `import("leaflet")` is pending, the rejection should be silently ignored.

7. **MapSection**: The error fallback needs `ACADEMY.address` from constants (already imported). A Google Maps link is the recommended fallback: `https://maps.google.com/?q=32.461111,-114.795667`.

8. **MapSection**: `tabIndex={0}` makes the Leaflet container focusable, but the map tiles and controls are Leaflet-managed DOM. Wait, the `role="application"` on the map container tells AT to pass keystrokes through — we need to verify that adding `tabIndex` doesn't conflict with Leaflet's internal keyboard handling (zoom controls use `+`/`-` keys).

9. **CSP (JD-A-01)**: Next.js 16 App Router injects inline `<script>` tags for React hydration and RSC payloads. Removing `unsafe-inline` without a nonce strategy **will break production**. The recommended MVF is: keep `unsafe-inline` but add `report-uri` to monitor violations before hardening.

10. **HSTS (JD-A-03)**: Including `preload` in the HSTS header submits to the browser preload list — this is irreversible. For a `*.netlify.app` subdomain, skip `preload`. Use `max-age=63072000; includeSubDomains` only.

11. **CI (JD-B-03)**: The CI doesn't use `bun`. Only `npm` commands. The `package.json` has `"test": "vitest run"`. The `npm ci` command installs devDependencies (including vitest, jsdom, @testing-library/*), so tests will work. Ensure `NODE_ENV=production` doesn't break any tests (it shouldn't — tests use jsdom, not the Next.js server).

---

### Effort Estimates

| # | ID | Description | File | Effort | Risk |
|---|----|-------------|------|--------|------|
| 1 | JD-B-01 | Hero Firefox: `@supports` fallback (~5 lines CSS) | `globals.css` | 30 min | Low |
| 2 | HE-14 / A11Y-01 | Reduced motion check in JS (~15 lines) | `StarWarsCrawl.tsx` | 1 h | Low |
| 3 | HE-07 | Skip button (~30 lines) | `StarWarsCrawl.tsx` | 2 h | Medium |
| 4 | HE-21 / JD-B-02 | Error handling in MapSection (~20 lines) | `MapSection.tsx` | 1 h | Low |
| 5 | A11Y-02 | tabIndex on map container (1 line) | `MapSection.tsx` | 15 min | Low |
| 6 | JD-B-03 | Add test to CI (1 line YAML) | `ci.yml` | 15 min | Low |
| 7 | JD-A-01 (MVF) | Document unsafe-inline + add report-uri | `next.config.ts` | 2 h | Medium |
| 8 | JD-A-03 | Add HSTS header (1 header object) | `next.config.ts` | 15 min | Low |
| **Total** | | | | **~7.5 h** | |

**Note**: For JD-A-01, a full nonce-based CSP refactoring is estimated at 4 h (audit estimate). The MVF here scopes down to documenting the tradeoff and adding `report-uri` for monitoring. Nonce migration is deferred to a future sprint.

---

### Recommended Approach

**Phase 1a — Quick wins (independent, low risk, deploy same day)**:
1. **JD-B-01** (globals.css): Wrap `.hero__title-stroke` in `@supports (-webkit-text-stroke: …)`. Fallback: `color: var(--color-yellow)`. Handle mobile breakpoint identically.
2. **JD-B-03** (ci.yml): Add `- run: npm run test` after build step.
3. **JD-A-03** (next.config.ts): Add `Strict-Transport-Security` header.
4. **A11Y-02** (MapSection.tsx): Add `tabIndex={0}` to map container div.

**Phase 1b — StarWarsCrawl (related changes, test together)**:
5. **HE-14 / A11Y-01** (reduced motion): Guard rAF loop with `matchMedia('(prefers-reduced-motion: reduce)')`. When reduced, render text at full opacity without transforms. This is the **foundation**.
6. **HE-07** (skip button): Add a "Saltar intro" button on the fixed panel with `pointer-events-auto`. On click, set `skipped` state that renders static content (reuse the static path from HE-14). Scroll to next section.

**Phase 1c — MapSection error handling (related changes, test together)**:
7. **HE-21 / JD-B-02** (error state): Add `const [error, setError] = useState(false)`. Wrap `import("leaflet")` and init in `try/catch`. Render static fallback with address text and Google Maps link when error.

**Phase 1d — CSP hardening (larger change, separate deploy)**:
8. **JD-A-01** (CSP): Split CSP by environment. Dev keeps `unsafe-inline`. Production adds `report-uri` for violation monitoring. Document why `unsafe-inline` is required (Next.js hydration). Plan nonce migration for future sprint.

**Order rationale**: Quick wins ship immediately with near-zero risk. StarWarsCrawl changes are visually impactful — test together. MapSection error handling requires the `error` state that A11Y-02's `tabIndex` lives next to in the JSX — do them in one PR. CSP gets its own PR because it has production stability risk.

---

### Risks

- **StarWarsCrawl**: Adding a skip button that scrolls to the next section requires knowing the next section's `id` (`#propuesta` from constants/NAV_LINKS). This couples the crawl to page structure. Use `data-section-next` attribute or hardcode `#propuesta` (the first nav link after hero).
- **StarWarsCrawl**: `window.matchMedia` is not available during SSR. The check must happen inside `useEffect` (client-side only), which it already does.
- **CSP report-uri**: Requires a report collection endpoint. If none exists, use `report-to` with a Reporting-Endpoints header, or skip reporting and just document.
- **Netlify HSTS**: Netlify may strip or override custom HSTS headers on their edge. Verify in deploy preview.
- **CI test execution**: The vitest jsdom environment may behave differently in CI (GitHub Actions Ubuntu) vs local. Verify tests pass in CI after adding the step.

---

### Ready for Proposal

Yes — all findings confirmed, code evidence verified, dependencies mapped, effort estimated, and approach recommended. Move to `sdd-propose`.
