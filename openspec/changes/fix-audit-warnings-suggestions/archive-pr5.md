# Archive Report: PR 5 — Carousel A11Y + Guards

**Change**: fix-audit-warnings-suggestions  
**Phase**: 5 of 7 (PR 5)  
**Archive date**: 2026-07-28  
**Archive type**: Partial (change remains active — PRs 6-7 pending)  
**Verdict**: PASS WITH WARNINGS

---

## Summary

PR 5 implemented 2 tasks covering the Activities carousel accessibility hardening and defensive guards: `useHorizontalCarousel` hook gained an empty-array guard (Rules of Hooks compliant), redundant state update guard in `scrollTo`, and a debounced `ResizeObserver` for re-snapping on viewport resize. `Actividades.tsx` received `role="region"` + `aria-roledescription` + `aria-label` on the scroll container, `aria-current` on navigation dots, a visible counter with `aria-live="polite"`, and a screen-reader-only keyboard navigation hint. All 7 Phase 5 requirements (13 scenarios) are verified compliant. Cumulative across PR 1+2+3+4+5: 35 requirements, 76/76 scenarios compliant. Build, tests, and lint pass cleanly.

## Requirements Satisfied

| Requirement | Title | Scenarios | Status |
|-------------|-------|-----------|--------|
| SPEC-FAWS-001 | Carousel Dots aria-current | 2/2 | Implemented |
| SPEC-FAWS-014 | Carousel Region Role | 1/1 | Implemented |
| SPEC-FAWS-015 | Carousel Redundant State Guard | 2/2 | Implemented |
| SPEC-FAWS-016 | Carousel Counter Display | 2/2 | Implemented |
| SPEC-FAWS-017 | Carousel Keyboard Instructions | 2/2 | Implemented |
| SPEC-FAWS-018 | Carousel Empty Array Guard | 2/2 | Implemented |
| SPEC-FAWS-019 | Carousel ResizeObserver Re-snap | 2/2 | Implemented |

**Total**: 7 requirements, 13/13 scenarios compliant.

## Tasks Completed

| Task | File | Spec | Description |
|------|------|------|-------------|
| 5.1 | `app/hooks/useHorizontalCarousel.ts` | SPEC-FAWS-015, 018, 019 | Added `totalCards <= 0` early return with disabled controls placed AFTER all hooks (Rules of Hooks compliance). Each callback (`scrollTo`, `next`, `prev`) and effect guards with `if (totalCards <= 0) return`. Added `clamped === currentIdxRef.current` early return in `scrollTo` to skip redundant state updates. Added debounced 150ms `ResizeObserver` that re-snaps `scrollLeft` to nearest card boundary without state change, guarded with `if (!('ResizeObserver' in window)) return` |
| 5.2 | `app/components/Actividades.tsx` | SPEC-FAWS-001, 014, 016, 017 | Added `role="region"`, `aria-roledescription="carrusel"`, `aria-label="Carrusel de actividades — usa las flechas para navegar"` on scroll container. Added `aria-current={i === currentIndex ? "true" : "false"}` on dot buttons. Added visible counter `"{currentIndex + 1} / {ACTIVIDADES.length}"` with `aria-live="polite"` next to dots. Added `<span className="sr-only">Usa las flechas izquierda y derecha para navegar entre actividades</span>` inside carousel container |

## Files Modified/Created

| File | Action | Description |
|------|--------|-------------|
| `app/hooks/useHorizontalCarousel.ts` | Modified | Added `totalCards <= 0` disabled controls (after all hooks for Rules of Hooks); `scrollTo` redundant state guard via ref comparison; debounced 150ms `ResizeObserver` re-snap with feature detection guard and cleanup |
| `app/components/Actividades.tsx` | Modified | `role="region"` + `aria-roledescription="carrusel"` + `aria-label` on scroll container; `aria-current` on dots; visible counter `"N / {total}"` with `aria-live="polite"`; sr-only keyboard navigation hint |

## Verification Results

**Source**: `openspec/changes/fix-audit-warnings-suggestions/verify-report.md`  
**Engram observation**: #1318 (topic: `sdd/fix-audit-warnings-suggestions/verify-report`)

| Check | Result | Details |
|-------|--------|---------|
| Build (`bun run build`) | PASS | Next.js 16.2.10 (Turbopack), 6 static pages, 2 pre-existing CSS warnings |
| Tests (`bun run test`) | PASS | 8 passed / 0 failed / 0 skipped (2 test files) |
| Lint (`bun run lint`) | PASS | 0 errors, 3 pre-existing warnings |
| Spec compliance (PR 5) | 13/13 | All Phase 5 scenarios COMPLIANT |
| Spec compliance (cumulative PR 1+2+3+4+5) | 76/76 | All Phase 1+2+3+4+5 scenarios COMPLIANT |
| CRITICAL findings | 0 | None |
| Blockers | 0 | None |

## Design Coherence

| Decision | Followed? | Notes |
|----------|-----------|-------|
| Rules of Hooks compliance | Yes | Empty-array guard placed AFTER all hook declarations; individual callbacks and effects have internal guards to avoid unnecessary work |
| ResizeObserver debounce | Yes | 150ms debounce with direct DOM manipulation (no state change), 1px threshold to prevent visible jump |
| Feature detection | Yes | `if (!('ResizeObserver' in window)) return` guard on observer setup |
| aria-current on dots | Yes | `aria-current={i === currentIndex ? "true" : "false"}` — updates on scroll and programmatic navigation |
| Counter with aria-live | Yes | Visible counter `"N / total"` with `aria-live="polite"` for screen reader announcements |
| D8 (Section wrapper deferred) | Yes | SPEC-FAWS-041 and SPEC-FAWS-046 correctly excluded |

## Issues Found During Implementation

1. **Rules of Hooks**: Initial implementation placed `totalCards <= 0` early return BEFORE hooks, causing `react-hooks/rules-of-hooks` lint errors. Fixed by moving all hooks to the top and placing the disabled-state return AFTER all hooks. The callbacks and effects each have internal `totalCards <= 0` guards to avoid unnecessary work.

## Warnings and Notes

1. **SPEC-FAWS-031 — Derived constants are string duplicates (carry-over from PR 2).** `ACADEMY.coordinatesMeta` and `ACADEMY.coordinatesICBM` are manually hardcoded strings, not computed from `ACADEMY.coordinates`. Not a Phase 5 concern but remains open.
2. **SPEC-FAWS-036 — `useSyncExternalStore` instead of `requestAnimationFrame` (carry-over from PR 3).** Spec wording says "MUST use requestAnimationFrame" but implementation uses `useSyncExternalStore`. Functionally equivalent. Wording deviation, not a functional gap.
3. **SPEC-FAWS-029 — Cross-component `aria-describedby` dependency (carry-over from PR 3).** `CtaFinal.tsx` references `aria-describedby="wa-hint"` where `id="wa-hint"` lives in `WhatsAppFloat.tsx`. Works because both are in `page.tsx`, but creates a cross-component DOM dependency.
4. **Pre-existing issues**: 3 lint warnings and 2 CSS build warnings are pre-existing and not introduced by this change.

## Spec Sync Status

**Not synced to main specs.** This is a partial archive — PR 5 of 7. The delta spec covers 47 requirements across all 7 phases. Main spec sync (`web-standards`, `code-quality`) will occur when the full change completes and the change folder moves to `openspec/changes/archive/`.

Phase 1+2+3+4+5 requirements (35 of 47) are implemented and verified. The remaining 12 requirements are pending in PRs 6-7.

## Engram Traceability

| Artifact | Observation ID | Topic Key |
|----------|---------------|-----------|
| Apply progress | #1317 | `sdd/fix-audit-warnings-suggestions/apply-progress` |
| Verify report | #1318 | `sdd/fix-audit-warnings-suggestions/verify-report` |
| PR 1 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr1` |
| PR 2 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr2` |
| PR 3 archive | #1321 | `sdd/fix-audit-warnings-suggestions/archive-pr3` |
| PR 4 archive | #1322 | `sdd/fix-audit-warnings-suggestions/archive-pr4` |
| This archive | (new) | `sdd/fix-audit-warnings-suggestions/archive-pr5` |

## Change Status After This Archive

- **PR 1**: Archived (see `archive-pr1.md`)
- **PR 2**: Archived (see `archive-pr2.md`)
- **PR 3**: Archived (see `archive-pr3.md`)
- **PR 4**: Archived (see `archive-pr4.md`)
- **PR 5**: Archived (this report)
- **PR 6-7**: Pending (see `tasks.md` phases 6-7)
- **Change folder**: Remains at `openspec/changes/fix-audit-warnings-suggestions/` (not moved to archive)
- **Next action**: Implement PR 6 (Crawl Polish + Starfield Pause)
