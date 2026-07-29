# Tasks: Fix Critical Audit Findings

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~110 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: single-pr
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Fix 10 critical findings across 5 files | Single PR | `npm run lint && npm run test` | `npm run dev` — verify hero in Firefox, crawl skip/reduced-motion in DevTools, map error fallback (block Leaflet in Network), keyboard Tab to map, `curl -I` for headers | Per-file revert: undo CSS, remove motion guard/skip button/error state, drop report-uri/HSTS, remove CI test step |

## Phase 1: CSS Fallback (JD-B-01)

- [x] 1.1 Replace `.hero__title-stroke` class in `app/globals.css` (lines 121-127) with solid-yellow base + `@supports (-webkit-text-stroke: 4px var(--color-yellow))` progressive enhancement block. Remove `text-stroke` and `text-fill-color` non-standard properties.
- [x] 1.2 Update mobile breakpoint `@media (max-width: 767px)` (lines 128-132) to nest `@supports (-webkit-text-stroke: 1.5px var(--color-yellow))` inside, matching desktop pattern. Keep `.hero__title` letter-spacing unchanged.

## Phase 2: StarWarsCrawl Skip + Reduced Motion (HE-07, HE-14, A11Y-01)

- [x] 2.1 Add `useSyncExternalStore` for `reducedMotion` and `useState` for `skipped` in `app/components/StarWarsCrawl.tsx`. Import `useSyncExternalStore` alongside existing `useEffect`/`useRef`.
- [x] 2.2 Use `useSyncExternalStore` for `prefers-reduced-motion` subscription (React-idiomatic media query pattern). In `useEffect`: measure spacer height, skip rAF loop when `reducedMotion || skipped`, render content at `opacity: 1` with no transforms.
- [x] 2.3 Add "Saltar intro" `<button>` inside the fixed panel (before `<div className="relative z-20 w-full...">`), with `pointer-events-auto`, `aria-label="Saltar introducción animada"`. On click: `setSkipped(true)`, then `document.querySelector('#propuesta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })`. Button hidden when `skipped` or `reducedMotion` is true.
- [x] 2.4 Wire render logic: when `reducedMotion || skipped` — render content inline-style with `opacity: 1`, `transform: none`, and skip rAF tick. Wrap existing animated path behind `!reducedMotion && !skipped` guard.

## Phase 3: MapSection Error Handling + Keyboard Access (HE-21, JD-B-02, A11Y-02)

- [x] 3.1 Add `const [error, setError] = useState(false)` in `app/components/MapSection.tsx`.
- [x] 3.2 Wrap `const L = (await import("leaflet")).default` and init block in `try/catch`. On catch: check `!cancelled` before `setError(true)`.
- [x] 3.3 Add error fallback JSX: when `error` is true, render `<div>` with academy address text and `<a href="https://maps.google.com/?q=32.461111,-114.795667">` link. Import `ACADEMY` constant already present.
- [x] 3.4 Update spinner conditional from `!loaded` to `!loaded && !error` to avoid concurrent spinner+error rendering.
- [x] 3.5 Add `tabIndex={0}` to the map container `<div ref={containerRef}>` for keyboard accessibility.

## Phase 4: Security Headers + CI (JD-A-01, JD-A-03, JD-B-03)

- [x] 4.1 In `next.config.ts`, split CSP: in production (`!isDev`), add `report-uri /csp-violations` to the CSP value string after existing directives. Keep dev behavior unchanged (no report-uri).
- [x] 4.2 Add `{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }` to the headers array. Do NOT include `preload` (irreversible for `*.netlify.app`).
- [x] 4.3 In `.github/workflows/ci.yml`, add `- run: npm run test` as a new step after `npm run build` (line 21).
