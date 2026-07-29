# Design: Fix Critical Audit Findings

## Technical Approach

Five independent workstreams across four files + CI. Zero architecture changes — all fixes operate within existing component boundaries. Each finding group is independently deployable. The design follows the proposal's Phase 1–4 structure, with the single constraint that MapSection error handling and tabIndex share the same render path (do together).

## Architecture Decisions

| # | Finding | Option A | Option B | Chosen | Rationale |
|---|---------|----------|----------|--------|-----------|
| 1 | JD-B-01 | `@supports (-webkit-text-stroke)` progressive enhancement | `@supports not` graceful degradation | **Option A** | Base `color: var(--color-yellow)` works everywhere. Only browsers that support `-webkit-text-stroke` get the stroke effect inside `@supports`. Cleaner than `@supports not` which needs an extra `-webkit-text-fill-color: initial` reset. Nest `@media (max-width: 767px) { @supports (…) { stroke-width: 1.5px } }` for mobile. |
| 2 | HE-14 / A11Y-01 | JS `matchMedia('(prefers-reduced-motion: reduce)')` guard in `useEffect` | CSS `@media (prefers-reduced-motion)` | **JS guard** | The crawl's 3D transforms are JS-driven via `requestAnimationFrame`. CSS queries cannot stop a JS rAF loop. Must check in `useEffect` where `window.matchMedia` is available (not during SSR). When reduced: skip rAF loop, render static text at `opacity: 1` with no transforms. |
| 3 | HE-07 | `<button>` with `pointer-events-auto`, `scrollIntoView('#propuesta')` | `<a href="#propuesta">` anchor element | **Button** | An anchor is semantically wrong for a dismiss/skip action. Button with `pointer-events-auto` (panel is `pointer-events-none`) and explicit `scrollIntoView` keeps ARIA clean. Sets `skipped` state; static render path reused from HE-14. |
| 4 | HE-21 / JD-B-02 | `try/catch` around dynamic `import("leaflet")` with `error` state | React `<ErrorBoundary>` wrapper | **try/catch** | React error boundaries **cannot** catch async `useEffect` rejections (React docs). `try/catch` is the only option. Must respect `cancelled` flag — unmount during import should not `setError`. |
| 5 | A11Y-02 | `tabIndex={0}` on map container div | `tabIndex` on internal Leaflet controls | **Container** | Leaflet manages its own DOM for zoom/attribution controls (already focusable `<a>` elements). Adding tabIndex to the container keeps it simple without fighting Leaflet. One attribute. |
| 6 | JD-A-01 | Env-conditional CSP: dev keeps `unsafe-inline`; prod adds `report-uri` | Nonce-based CSP (requires Next.js middleware) | **Env split + report-uri** | Nonces require custom middleware, breaking change risk, ~4h effort. MVF: keep `unsafe-inline` (Next.js hydration needs it), add `report-uri /csp-violations` in production for monitoring. Defer nonces. |
| 7 | JD-A-03 | Single object in `headers` array: `{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }` | Netlify `_headers` file | **next.config.ts** | Centralizing all security headers in one location keeps audit surface small. Netlify subdomain may strip it, but it's still the canonical Next.js mechanism. No `preload` — irreversible on `*.netlify.app`. |
| 8 | JD-B-03 | Inline step `- run: npm run test` after build | Separate job/parallel matrix | **Inline step** | Two test files (vitest+jsdom). Separate job adds complexity with no throughput gain. `npm ci` already installs devDependencies; tests ready to run. |

## Data Flow

### StarWarsCrawl: Reduced Motion & Skip

```
useEffect mount
  │
  ├─ matchMedia('(prefers-reduced-motion: reduce)')
  │   └─ setReducedMotion(mq.matches)
  │
  ├─ Measure content → set spacer height (always)
  │
  └─ reducedMotion || skipped ?
       YES → render static content (opacity:1, no transforms, no rAF)
       NO  → start rAF tick() loop (existing animation)
                    │
                    └─ Skip button onClick → setSkipped(true) → scrollIntoView('#propuesta')
                                                   │
                                                   └─ effect re-runs → static render path
```

### MapSection: Error & Keyboard

```
useEffect mount
  │
  ├─ try { dynamic import("leaflet") }
  │   ├─ cancelled? → return (unmount guard)
  │   ├─ success → L.map(...) → whenReady → setLoaded(true)
  │   └─ catch → cancelled? → return : setError(true)
  │
  └─ render:
       error ? <ErrorFallback />   (address text + Google Maps link)
       !loaded && !error ? <Spinner />
       : <div tabIndex={0} />     (Leaflet map, keyboard-accessible)
```

### next.config.ts: CSP Split

```
NODE_ENV value
  │
  ├─ development → isDev=true  → CSP includes 'unsafe-eval', no report-uri
  └─ production  → isDev=false → CSP excludes 'unsafe-eval', adds report-uri /csp-violations
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/globals.css` | Modify | Replace `.hero__title-stroke` with `@supports` progressive enhancement (~10 lines) |
| `app/components/StarWarsCrawl.tsx` | Modify | Add `reducedMotion` state, `skipped` state, matchMedia listener, skip button, static render path (~65 lines) |
| `app/components/MapSection.tsx` | Modify | Add `error` state, `try/catch`, error fallback UI, `tabIndex={0}` (~30 lines) |
| `next.config.ts` | Modify | Split CSP by environment, add HSTS header (~12 lines) |
| `.github/workflows/ci.yml` | Modify | Add `- run: npm run test` after build step (1 line) |

## CSS Strategy — JD-B-01

```css
/* Base: solid yellow for browsers without text-stroke (Firefox) */
.hero__title-stroke {
  color: var(--color-yellow);
}

/* Progressive enhancement: stroke effect */
@supports (-webkit-text-stroke: 4px var(--color-yellow)) {
  .hero__title-stroke {
    color: var(--color-red);
    -webkit-text-stroke: 4px var(--color-yellow);
    -webkit-text-fill-color: transparent;
  }
}

/* Mobile: thinner stroke, same progressive pattern */
@media (max-width: 767px) {
  @supports (-webkit-text-stroke: 1.5px var(--color-yellow)) {
    .hero__title-stroke {
      -webkit-text-stroke-width: 1.5px;
    }
  }
  .hero__title,
  .hero__title-stroke {
    letter-spacing: 0.02em; /* unchanged */
  }
}
```

Remove `text-stroke` / `text-fill-color` properties — non-standard, never shipped in any browser.

## StarWarsCrawl Skip Button — JSX Structure

```tsx
{!skipped && !reducedMotion && (
  <button
    type="button"
    onClick={() => { setSkipped(true); document.querySelector('#propuesta')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
    className="absolute top-20 right-4 z-50 pointer-events-auto px-4 py-2 bg-white/10 text-yellow border border-yellow/30 rounded hover:bg-white/20 transition-colors"
    aria-label="Saltar introducción animada"
  >
    Saltar intro
  </button>
)}
```

Placed inside the fixed panel (where `sectionRef` is attached) so it floats with the crawl.

## MapSection Error Fallback

```tsx
const [error, setError] = useState(false);

// In useEffect:
try {
  const L = (await import("leaflet")).default;
  if (cancelled || !containerRef.current) return;
  // ... existing init
} catch {
  if (!cancelled) setError(true);
}

// Error fallback in JSX:
{error && (
  <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
    <p className="text-white text-lg font-display">No se pudo cargar el mapa</p>
    <p className="text-gray-aa text-sm">{ACADEMY.address}</p>
    <a
      href={`https://maps.google.com/?q=${ACADEMY.coordinates.lat},${ACADEMY.coordinates.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-cyan underline text-sm hover:text-white transition-colors"
      aria-label={`Ver ${ACADEMY.shortName} en Google Maps`}
    >
      Ver en Google Maps
    </a>
  </div>
)}
```

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| CI | Vitest execution | `npm run test` step in CI workflow — existing 2 test files pass as-is |
| Visual | Hero Firefox | Manual BrowserStack / local Firefox — verify title visible, mobile breakpoint |
| Visual | Crawl skip & reduced motion | Manual: toggle `prefers-reduced-motion: reduce` in DevTools, verify static render; click skip, verify dismissal |
| Visual | Map error fallback | Manual: block `leaflet` in DevTools network tab, verify fallback UI appears |
| Visual | Map keyboard nav | Manual: Tab to map container, verify focus ring, verify Leaflet zoom controls reachable |
| Visual | Security headers | `curl -I` against deploy preview, verify `Content-Security-Policy` (report-uri in prod) + `Strict-Transport-Security` |
| Unit | (future) | No new tests authored — `config.yaml` has `tdd: false`. Existing test execution is the CI MVP. |

## Edge Cases

| Case | Handling |
|------|----------|
| `window.matchMedia` during SSR | Check only in `useEffect` (client-only). No server-side guard needed. |
| Unmount during `import("leaflet")` | `cancelled` flag checked after import, before `setError`/`setLoaded`. Promise rejection silently discarded. |
| `prefers-reduced-motion` changes at runtime | `addEventListener('change', …)` on `MediaQueryList`. Re-render triggers effect re-run via state change. |
| Skip button clicks before first frame | Button rendered unconditionally (not inside tick callback). State change triggers effect re-run → static path. |
| CSP `report-uri` endpoint doesn't exist | Violations logged to browser console (default behavior). Non-breaking. Endpoint can be added later. |
| HSTS stripped by Netlify | Verified in deploy preview. If stripped, document limitation and note that `*.netlify.app` subdomain has platform-level HSTS for custom domains only. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migrations. Per-file rollback: revert to previous commit state. No data, no schema, no feature flags. Each file change is atomic and independently deployable.

## Open Questions

- [ ] Does the platform have a `/csp-violations` reporting endpoint? If not, `report-uri` will be a dead-end (harmless, no 500). We can add a reporting service later.
- [ ] Confirmation: Netlify preview will show whether HSTS header survives their edge. If stripped, document and accept.
