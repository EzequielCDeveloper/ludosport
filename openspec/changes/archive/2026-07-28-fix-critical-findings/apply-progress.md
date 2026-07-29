# Apply Progress: Fix Critical Audit Findings

**Status**: All 14 tasks complete
**Mode**: Standard (strict_tdd disabled)
**Delivery**: Single PR (low risk, ~110 estimated lines)

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test command and exact result | `npm run lint && npm run test` — lint: 0 errors, 3 pre-existing warnings; tests: 2 files passed, 8 tests passed |
| Runtime harness | `npm run dev` — see manual verification in sdd-verify phase |
| Rollback boundary | Per-file revert: undo `globals.css`, remove `useSyncExternalStore`/skip button/`renderContent` from StarWarsCrawl, remove `error` state/fallback/tabIndex from MapSection, drop `report-uri`/HSTS from next.config.ts, remove `npm run test` from ci.yml |

## Phase 1: CSS Fallback (JD-B-01)

### Completed Tasks
- [x] 1.1 Replaced `.hero__title-stroke` with solid-yellow base + `@supports (-webkit-text-stroke)` progressive enhancement
- [x] 1.2 Updated mobile breakpoint to nest `@supports` inside, matching desktop pattern

| File | Action | What Was Done |
|------|--------|---------------|
| `app/globals.css` | Modified | Replaced `text-stroke`/`text-fill-color` non-standard props with `@supports (-webkit-text-stroke)` progressive enhancement. Base `color: var(--color-yellow)` works in Firefox; WebKit browsers get stroke effect inside `@supports`. Mobile breakpoint nests `@supports` with thinner stroke. |

## Phase 2: StarWarsCrawl Skip + Reduced Motion (HE-07, HE-14, A11Y-01)

### Completed Tasks
- [x] 2.1 Added `useSyncExternalStore` for `reducedMotion`, `useState` for `skipped`
- [x] 2.2 Used `useSyncExternalStore` for `prefers-reduced-motion` subscription (React-idiomatic pattern, avoids setState-in-effect lint error). `useEffect` measures spacer, skips rAF when reduced motion or skipped
- [x] 2.3 Added "Saltar intro" button with `pointer-events-auto`, `aria-label`, scrollIntoView('#propuesta')
- [x] 2.4 Wired render: static content when `reducedMotion || skipped`, animated crawl behind `!reducedMotion && !skipped` guard

| File | Action | What Was Done |
|------|--------|---------------|
| `app/components/StarWarsCrawl.tsx` | Modified | Added `useSyncExternalStore` (React-idiomatic for media queries — avoids setState-in-effect lint error), `skipped` state, matchMedia lifecycle via hook, "Saltar intro" button with scrollIntoView, `renderContent()` helper, static render path at `opacity: 1, transform: none`, conditional rAF tick. |

## Phase 3: MapSection Error Handling + Keyboard Access (HE-21, JD-B-02, A11Y-02)

### Completed Tasks
- [x] 3.1 Added `const [error, setError] = useState(false)`
- [x] 3.2 Wrapped `import("leaflet")` in try/catch, checking `!cancelled` before setError
- [x] 3.3 Added error fallback: address text + Google Maps link
- [x] 3.4 Updated spinner to `!loaded && !error`
- [x] 3.5 Added `tabIndex={0}` to map container

| File | Action | What Was Done |
|------|--------|---------------|
| `app/components/MapSection.tsx` | Modified | Added `error` state. Wrapped Leaflet dynamic import in try/catch with unmount-safe `!cancelled` guard. Error fallback UI: "No se pudo cargar el mapa" message, `ACADEMY.address`, Google Maps link. Spinner conditional: `!loaded && !error`. `tabIndex={0}` on map container. |

## Phase 4: Security Headers + CI (JD-A-01, JD-A-03, JD-B-03)

### Completed Tasks
- [x] 4.1 Split CSP: prod gets `report-uri /csp-violations;`, dev unchanged
- [x] 4.2 Added HSTS header: `max-age=63072000; includeSubDomains` (no `preload`)
- [x] 4.3 Added `npm run test` to CI workflow after build step

| File | Action | What Was Done |
|------|--------|---------------|
| `next.config.ts` | Modified | CSP template: `${isDev ? "" : " report-uri /csp-violations;"}` appended after `upgrade-insecure-requests;`. Added HSTS header object after X-Frame-Options. |
| `.github/workflows/ci.yml` | Modified | Added `- run: npm run test` as new step after `npm run build`. |

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | Passed (0 errors) |
| `npm run lint` | 0 errors, 3 pre-existing warnings (none from this change) |
| `npm run test` | 2 files passed, 8 tests passed |
| `npm run build` | N/A (not run — CI step) |

## Deviations from Design

1. **Task 2.1/2.2**: Used `useSyncExternalStore` instead of `useState` + `matchMedia` in `useEffect` for reduced motion detection. This is the React-idiomatic pattern for subscribing to external stores (like media queries). The original approach (`setState` synchronously in `useEffect`) triggers `react-hooks/set-state-in-effect` lint error. `useSyncExternalStore` handles the subscription lifecycle natively and avoids cascading renders. The functional behavior is identical: `reducedMotion` is `true` when `prefers-reduced-motion: reduce` is active, and updates at runtime via the `change` event.

## Issues Found

- **Lint**: `react-hooks/set-state-in-effect` flagged synchronous `setReducedMotion(mq.matches)` in useEffect. Resolved by refactoring to `useSyncExternalStore` — the React-recommended pattern for external store subscriptions. This is noted as a design deviation (see above).
- No other issues. All 14 tasks implemented as specified.
