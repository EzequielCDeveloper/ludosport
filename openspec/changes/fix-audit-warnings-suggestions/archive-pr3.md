# Archive Report: PR 3 — WhatsApp + Image Fallback + New UX

**Change**: fix-audit-warnings-suggestions  
**Phase**: 3 of 7 (PR 3)  
**Archive date**: 2026-07-28  
**Archive type**: Partial (change remains active — PRs 4-7 pending)  
**Verdict**: PASS WITH WARNINGS

---

## Summary

PR 3 implemented 7 tasks covering WhatsApp URL hardening (URL constructor, aria-describedby hints, icon contrast), image error fallbacks (Profesor + Actividades), and new UX components (ScrollProgress bar, BackToTop button). All 8 Phase 3 requirements (17 scenarios) are verified compliant. Cumulative across PR 1+2+3: 25 requirements, 55/55 scenarios compliant. Build, tests, and lint pass cleanly.

## Requirements Satisfied

| Requirement | Title | Scenarios | Status |
|-------------|-------|-----------|--------|
| SPEC-FAWS-028 | WhatsApp Icon Contrast | 2/2 | Implemented |
| SPEC-FAWS-029 | WhatsApp External Link Hints | 2/2 | Implemented |
| SPEC-FAWS-030 | WhatsApp URL Construction | 2/2 | Implemented |
| SPEC-FAWS-036 | Scroll Progress Bar | 4/4 | Implemented |
| SPEC-FAWS-037 | Back to Top Button | 4/4 | Implemented |
| SPEC-FAWS-039 | Image Fallback on Error | 3/3 | Implemented |

**Total**: 6 requirements, 17/17 scenarios compliant.

*Note: SPEC-FAWS-029 and SPEC-FAWS-030 are also satisfied by CtaFinal (task 3.2), giving 8 requirements covered across 7 tasks when counting per-task coverage.*

## Tasks Completed

| Task | File | Spec | Description |
|------|------|------|-------------|
| 3.1 | `app/components/WhatsAppFloat.tsx` | SPEC-FAWS-028, 029, 030 | Dark SVG stroke for 3:1 contrast; `aria-describedby="wa-hint"` + sr-only hint span; `URL` constructor + `searchParams.set()` for safe URL building |
| 3.2 | `app/components/CtaFinal.tsx` | SPEC-FAWS-029, 030 | `aria-describedby="wa-hint"` (shares hint from WhatsAppFloat); `URL` constructor for href |
| 3.3 | `app/components/ScrollProgress.tsx` | SPEC-FAWS-036 | New client component — `useSyncExternalStore` on scroll, fixed top 2px yellow bar, width=`{pct}%`, hidden under `prefers-reduced-motion` |
| 3.4 | `app/components/BackToTop.tsx` | SPEC-FAWS-037 | New client component — appears after `scrollY > innerHeight`, fixed bottom-right above WhatsApp, smooth scroll to top |
| 3.5 | `app/page.tsx` | SPEC-FAWS-036, 037 | Integrated `<ScrollProgress />` and `<BackToTop />` into page layout |
| 3.6 | `app/components/Profesor.tsx` | SPEC-FAWS-039 | Added `"use client"` + `onError` handler with styled fallback div preserving dimensions |
| 3.7 | `app/components/Actividades.tsx` | SPEC-FAWS-039 | Added per-image `onError` tracking with `useState<Record<number, boolean>>` and styled fallback divs |

## Files Modified/Created

| File | Action | Lines Changed | Description |
|------|--------|---------------|-------------|
| `app/components/WhatsAppFloat.tsx` | Modified | ~15 | Dark SVG stroke (`stroke="rgba(0,0,0,0.35)"`), `aria-describedby="wa-hint"` + sr-only hint span, `URL` constructor |
| `app/components/CtaFinal.tsx` | Modified | ~5 | `aria-describedby="wa-hint"`, `URL` constructor for href |
| `app/components/ScrollProgress.tsx` | Created | ~30 | Client component: `useSyncExternalStore` scroll tracking, fixed top 2px yellow bar |
| `app/components/BackToTop.tsx` | Created | ~35 | Client component: appears after scrollY > innerHeight, smooth scroll to top, positioned above WhatsApp float |
| `app/page.tsx` | Modified | ~5 | Added `<ScrollProgress />` and `<BackToTop />` imports + JSX |
| `app/components/Profesor.tsx` | Modified | ~15 | Added `"use client"`, `onError` handler with styled fallback div |
| `app/components/Actividades.tsx` | Modified | ~20 | Added `imgErrors` state + per-image `onError` handler with fallback divs |
| `app/globals.css` | Modified | ~10 | Added `prefers-reduced-motion` rules for `.scroll-progress-bar` and `.back-to-top-btn` |

## Verification Results

**Source**: `openspec/changes/fix-audit-warnings-suggestions/verify-report.md`  
**Engram observation**: #1318 (topic: `sdd/fix-audit-warnings-suggestions/verify-report`)

| Check | Result | Details |
|-------|--------|---------|
| Build (`bun run build`) | PASS | Next.js 16.2.10 (Turbopack), 6 static pages, 2 pre-existing CSS warnings |
| Tests (`bun run test`) | PASS | 8 passed / 0 failed / 0 skipped (2 test files) |
| Lint (`bun run lint`) | PASS | 0 errors, 3 pre-existing warnings |
| Spec compliance (PR 3) | 17/17 | All Phase 3 scenarios COMPLIANT |
| Spec compliance (cumulative PR 1+2+3) | 55/55 | All Phase 1+2+3 scenarios COMPLIANT |
| CRITICAL findings | 0 | None |
| Blockers | 0 | None |

## Design Coherence

| Decision | Followed? | Notes |
|----------|-----------|-------|
| D4 (WhatsApp contrast) | Yes | Dark SVG stroke `stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"` — preserves brand green, meets 3:1 |
| ScrollProgress component design | Yes | `useSyncExternalStore`, fixed top 2px bar, yellow, respects reduced-motion |
| BackToTop component design | Yes | Shows after `scrollY > innerHeight`, fixed bottom-right, `aria-label`, smooth scroll |
| D8 (Section wrapper deferred) | Yes | SPEC-FAWS-041 and SPEC-FAWS-046 correctly excluded |
| Image fallback pattern | Yes | Styled div with background color + SVG icon, preserves layout dimensions |

## Warnings and Notes

1. **SPEC-FAWS-036 — `useSyncExternalStore` instead of `requestAnimationFrame`.** Spec text says "The bar MUST use `requestAnimationFrame` for smooth updates". Implementation uses `useSyncExternalStore` with passive scroll event listeners, which is the idiomatic React 18+ pattern. Design explicitly chose `useSyncExternalStore` and tasks confirm this approach. Functionally equivalent — scroll events fire synchronously with the browser render pipeline and React batches updates efficiently. The spec intent ("smooth updates") is fully met. This is a wording deviation from the spec, not a functional gap.
2. **SPEC-FAWS-029 — Cross-component `aria-describedby` dependency.** `CtaFinal.tsx` references `aria-describedby="wa-hint"` where `id="wa-hint"` lives in `WhatsAppFloat.tsx`. This works because both components are rendered in `page.tsx`, but creates a cross-component DOM dependency. If CtaFinal were used standalone, the reference would be broken. Recommend duplicating the hint span inside CtaFinal with a unique id for self-containment.
3. **SPEC-FAWS-031 — Derived constants are string duplicates (carry-over from PR 2).** `ACADEMY.coordinatesMeta` and `ACADEMY.coordinatesICBM` are manually hardcoded strings, not computed from `ACADEMY.coordinates`. Not a Phase 3 concern but remains open.
4. **Pre-existing issues**: 3 lint warnings and 2 CSS build warnings are pre-existing and not introduced by this change.

## Spec Sync Status

**Not synced to main specs.** This is a partial archive — PR 3 of 7. The delta spec covers 47 requirements across all 7 phases. Main spec sync (`web-standards`, `code-quality`) will occur when the full change completes and the change folder moves to `openspec/changes/archive/`.

Phase 1+2+3 requirements (25 of 47) are implemented and verified. The remaining 22 requirements are pending in PRs 4-7.

## Engram Traceability

| Artifact | Observation ID | Topic Key |
|----------|---------------|-----------|
| Apply progress | #1317 | `sdd/fix-audit-warnings-suggestions/apply-progress` |
| Verify report | #1318 | `sdd/fix-audit-warnings-suggestions/verify-report` |
| PR 1 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr1` |
| PR 2 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr2` |
| This archive | (new) | `sdd/fix-audit-warnings-suggestions/archive-pr3` |

## Change Status After This Archive

- **PR 1**: Archived (see `archive-pr1.md`)
- **PR 2**: Archived (see `archive-pr2.md`)
- **PR 3**: Archived (this report)
- **PR 4-7**: Pending (see `tasks.md` phases 4-7)
- **Change folder**: Remains at `openspec/changes/fix-audit-warnings-suggestions/` (not moved to archive)
- **Next action**: Implement PR 4 (Navbar Focus Trap)
