# Archive Report: Fix Critical Audit Findings

**Change**: fix-critical-findings
**Date archived**: 2026-07-28
**SDD cycle**: Complete — propose → spec → design → tasks → apply → verify → archive
**Verdict**: PASS WITH WARNINGS

## Summary

Fixed 1 BLOCKER + 9 CRITICAL findings from the 2026-07-27 Software Quality Audit across 5 files + CI. Firefox users now see a visible hero title via CSS `@supports` progressive enhancement. StarWarsCrawl respects `prefers-reduced-motion: reduce` with a `useSyncExternalStore` guard and provides a keyboard-accessible skip button. MapSection catches Leaflet import failures with address+Google Maps fallback and is keyboard-focusable via `tabIndex={0}`. Security headers split CSP by environment (prod gets `report-uri`) and add HSTS. CI pipeline now executes `npm run test`.

## Verification Results

| Metric | Value |
|--------|-------|
| TypeScript (`npx tsc --noEmit`) | ✅ Clean (exit 0) |
| Lint (`npm run lint`) | 0 errors, 3 pre-existing warnings |
| Tests (`npm run test`) | 8 passed, 0 failed (2 test files) |
| Requirements met | 9/9 (SPEC-FCF-001 through SPEC-FCF-009) |
| Scenarios verified | 18/18 correct |
| Tasks complete | 14/14 |
| CRITICAL issues | 0 |

### Warnings (from verify-report)

1. **SPEC-FCF-003 Scenario 3 wording** — Original spec GIVEN stated "skip button present" during reduced motion, but the design and implementation hide the button since content is already static. **Resolved**: main spec corrected during archive sync — scenario now describes static content rendering without a skip button.
2. **No automated test coverage for changed components** — All 18 scenarios verified manually (by design — `config.yaml` has `tdd: false`). The existing 2 test suites (FAQs, NavbarClient) confirm no regressions.

### Suggestions (from verify-report)

1. Add `vitest` tests for StarWarsCrawl reduced-motion logic and MapSection error/unmount paths.
2. Add `aria-label` to the StarWarsCrawl fixed panel for screen reader context.

## Files Changed

| File | Action | What Changed |
|------|--------|-------------|
| `app/globals.css` | Modified | Replaced non-standard `text-stroke`/`text-fill-color` with `@supports (-webkit-text-stroke)` progressive enhancement. Base solid yellow for Firefox; WebKit gets stroke inside `@supports`. Mobile breakpoint nests `@supports` with 1.5px stroke. |
| `app/components/StarWarsCrawl.tsx` | Modified | Added `useSyncExternalStore` for `prefers-reduced-motion` subscription (React-idiomatic, avoids `setState-in-effect` lint error). Added `skipped` state. Skip button with `pointer-events-auto`, `aria-label`. Static render path at opacity 1 + no transforms. rAF loop gated behind `!reducedMotion && !skipped`. |
| `app/components/MapSection.tsx` | Modified | Added `error` state. Wrapped `import("leaflet")` in `try/catch` with unmount-safe `!cancelled` guard. Error fallback: address text + Google Maps link. Spinner conditional: `!loaded && !error`. `tabIndex={0}` on container for keyboard accessibility. |
| `next.config.ts` | Modified | Split CSP by environment: `${isDev ? " 'unsafe-eval'" : ""}` for script-src, `${isDev ? "" : " report-uri /csp-violations;"}` for upgrade-insecure-requests. Added HSTS header: `max-age=63072000; includeSubDomains` (no `preload`). |
| `.github/workflows/ci.yml` | Modified | Added `- run: npm run test` step after `npm run build`. |

- **Files created**: 0
- **Files deleted**: 0
- **Estimated lines changed**: ~110

## Design Deviations

1. **Task 2.1/2.2**: Used `useSyncExternalStore` instead of `useState` + `matchMedia` in `useEffect` for reduced motion detection. The original approach triggered `react-hooks/set-state-in-effect` lint error. `useSyncExternalStore` is the React-idiomatic pattern for external store subscriptions. Functional behavior is identical: `reducedMotion` is `true` when `prefers-reduced-motion: reduce` is active, updates at runtime via the `change` event listener.

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `web-standards` | Created | 9 requirements added: SPEC-FCF-001 through SPEC-FCF-009. Six capability groups: cross-browser-hero, crawl-accessibility (2 reqs), map-error-handling (2 reqs), map-keyboard-access, security-headers (2 reqs), ci-test-execution. |

No existing main specs were modified — all requirements are net-new to the codebase.

### Spec Correction During Archive

SPEC-FCF-003 Scenario 3 was corrected during sync from delta to main spec:
- **Before (delta)**: GIVEN "`prefers-reduced-motion: reduce` is active, skip button present"
- **After (main spec)**: GIVEN "`prefers-reduced-motion: reduce` is active, content renders static at full opacity", THEN "Content is already readable — no skip button needed"

This matches the design decision (D3), task 2.3, and implementation — the skip button is intentionally hidden during reduced motion since content is already static and readable.

## Artifact Traceability

All SDD artifacts preserved in the archive:

| Artifact | Filesystem | Engram |
|----------|-----------|--------|
| Exploration | `archive/2026-07-28-fix-critical-findings/exploration.md` | observation #1302 |
| Proposal | `archive/2026-07-28-fix-critical-findings/proposal.md` | observation #1303 |
| Spec (delta) | `archive/2026-07-28-fix-critical-findings/spec.md` | observation #1304 |
| Design | `archive/2026-07-28-fix-critical-findings/design.md` | observation #1305 |
| Tasks | `archive/2026-07-28-fix-critical-findings/tasks.md` | observation #1306 |
| Apply Progress | `archive/2026-07-28-fix-critical-findings/apply-progress.md` | observation #1307 |
| Verify Report | `archive/2026-07-28-fix-critical-findings/verify-report.md` | observation #1308 |
| Archive Report | `archive/2026-07-28-fix-critical-findings/archive-report.md` | saved below |

All 14 tasks in `tasks.md` are marked `[x]` complete. No stale checkboxes remain.

## Source of Truth Updated

- **New**: `openspec/specs/web-standards/spec.md` — 9 behavioral requirements for cross-browser rendering, WCAG 2.2 accessibility, security headers, and CI integrity.

## SDD Cycle Complete

The `fix-critical-findings` change has been fully planned, implemented, verified, and archived. All findings from the 2026-07-27 audit's Blocking and Critical tiers have been addressed. Ready for the next change.
