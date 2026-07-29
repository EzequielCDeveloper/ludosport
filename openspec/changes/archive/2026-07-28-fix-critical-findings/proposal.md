# Proposal: Fix Critical Audit Findings

## Intent

Fix 1 BLOCKER + 9 CRITICAL findings from the 2026-07-27 software quality audit. Firefox users see an invisible hero title (~4% desktop market share). CSP `unsafe-inline` disables XSS protection. StarWarsCrawl lacks skip button and reduced-motion guard — violates WCAG 2.2.2/2.3.3, risking vestibular harm. MapSection has no error handling, unhandled promise rejection, and is keyboard-inaccessible. CI omits test execution.

## Scope

### In Scope

- **Phase 1 (Cross-browser)**: Hero Firefox fallback via `@supports` — JD-B-01
- **Phase 2 (Crawl A11Y)**: Skip button + `prefers-reduced-motion` JS guard — HE-07, HE-14, A11Y-01
- **Phase 3 (Map Reliability)**: Error handling, try/catch, tabIndex — HE-21, JD-B-02, A11Y-02
- **Phase 4 (Security + CI)**: CSP report-uri MVF, HSTS header, CI test step — JD-A-01, JD-A-03, JD-B-03

### Out of Scope

- All WARNING, SUGGESTION, and INFO findings (30+ items)
- Starfield animation optimization
- Nonce-based CSP refactoring (planned future sprint)
- New test authoring beyond existing test execution

## Capabilities

### New Capabilities

- **cross-browser-hero**: CSS `@supports` fallback making hero title visible in Firefox. Fallback: `color: var(--color-yellow)`. Works at mobile breakpoint (1.5px stroke).
- **crawl-accessibility**: Skip/dismiss button with `pointer-events-auto` + `prefers-reduced-motion` JS guard rendering static content. Satisfies WCAG 2.2.2 and 2.3.3.
- **map-error-handling**: try/catch around dynamic `import("leaflet")` with `error` state and static address fallback (Google Maps link). Respects unmount cancellation.
- **map-keyboard-access**: `tabIndex={0}` on map container enabling keyboard navigation per WCAG 2.1.1.
- **security-headers**: Split CSP by environment — dev keeps `unsafe-inline`, prod adds `report-uri`. HSTS header with `max-age=63072000; includeSubDomains`.
- **ci-test-execution**: `npm run test` step in CI workflow after build.

### Modified Capabilities

None — these are net-new concerns.

## Approach

**Phase 1**: Wrap `.hero__title-stroke` in `@supports (-webkit-text-stroke: 4px var(--color-yellow))`. Unsupported browsers get `color: var(--color-yellow)`.

**Phase 2**: Guard rAF loop with `matchMedia('(prefers-reduced-motion: reduce)')`. When reduced, render text at full opacity without transforms. Add "Saltar intro" button, scrolls to `#propuesta`.

**Phase 3**: Add `error` state. Wrap import + init in `try/catch`. Error fallback: address text + `https://maps.google.com/?q=32.461111,-114.795667`. Add `tabIndex={0}` on container.

**Phase 4**: Env-conditional CSP with `report-uri` in production. Add `Strict-Transport-Security` header. Add `- run: npm run test` after build in CI workflow.

## Affected Areas

| File | Findings | Change |
|------|----------|--------|
| `app/globals.css` | JD-B-01 | @supports fallback (~8 lines) |
| `app/components/StarWarsCrawl.tsx` | HE-07, HE-14, A11Y-01 | Motion guard + skip button (~60 lines) |
| `app/components/MapSection.tsx` | HE-21, JD-B-02, A11Y-02 | Error handling + tabIndex (~35 lines) |
| `next.config.ts` | JD-A-01, JD-A-03 | CSP split + HSTS (~15 lines) |
| `.github/workflows/ci.yml` | JD-B-03 | Test step (1 line) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CSP `unsafe-inline` required by Next.js hydration — removing breaks prod | High | Keep `unsafe-inline`; add report-uri only; defer nonces |
| Netlify strips/overrides HSTS on `*.netlify.app` subdomains | Medium | Verify in deploy preview |
| Skip button couples crawl to `#propuesta` section ID | Low | Hardcode first nav link target |
| `window.matchMedia` unavailable during SSR | Low | Check inside `useEffect` (already client-side) |
| Vitest tests behave differently in CI (jsdom env) | Low | Verify after adding step |

## Rollback Plan

Per-file rollback: revert CSS class, remove JS guard/skip button/error state, drop CSP report-uri and HSTS, remove CI test step. No schema or data migrations.

## Dependencies

None — each phase is independently deployable.

## Success Criteria

- [ ] Hero title visible in Firefox desktop + mobile
- [ ] StarWarsCrawl does not animate when `prefers-reduced-motion: reduce` is active
- [ ] Skip button visible and functional — scrolls to next section
- [ ] MapSection shows error fallback when Leaflet fails to load
- [ ] Map container receives keyboard focus via Tab
- [ ] CSP response includes `report-uri` in production
- [ ] HSTS header present in all responses
- [ ] CI workflow executes `npm run test` and existing 2 test files pass
