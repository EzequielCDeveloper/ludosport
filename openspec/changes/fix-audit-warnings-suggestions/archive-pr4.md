# Archive Report: PR 4 — Navbar Focus Trap

**Change**: fix-audit-warnings-suggestions  
**Phase**: 4 of 7 (PR 4)  
**Archive date**: 2026-07-28  
**Archive type**: Partial (change remains active — PRs 5-7 pending)  
**Verdict**: PASS WITH WARNINGS

---

## Summary

PR 4 implemented 2 tasks covering the navbar mobile menu focus trap: a reusable `useFocusTrap` hook and NavbarClient integration with dialog semantics (`role="dialog"`, `aria-modal`, `aria-label`), focus cycling (Tab/Shift+Tab wrap), and `inert` feature detection with `tabIndex={-1}` fallback. All 3 Phase 4 requirements (8 scenarios) are verified compliant. Cumulative across PR 1+2+3+4: 28 requirements, 63/63 scenarios compliant. Build, tests, and lint pass cleanly.

## Requirements Satisfied

| Requirement | Title | Scenarios | Status |
|-------------|-------|-----------|--------|
| SPEC-FAWS-007 | Mobile Menu Dialog Semantics | 2/2 | Implemented |
| SPEC-FAWS-008 | Mobile Menu Focus Trap | 3/3 | Implemented |
| SPEC-FAWS-009 | Inert Fallback | 3/3 | Implemented |

**Total**: 3 requirements, 8/8 scenarios compliant.

## Tasks Completed

| Task | File | Spec | Description |
|------|------|------|-------------|
| 4.1 | `app/hooks/useFocusTrap.ts` | SPEC-FAWS-008 | New hook — queries focusable elements (`[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`), filters disabled and invisible (`offsetParent === null`), Tab at last wraps to first, Shift+Tab at first wraps to last. `useEffect` installs/cleans up `keydown` listener, only active when `active` param is true |
| 4.2 | `app/components/NavbarClient.tsx` | SPEC-FAWS-007, 008, 009 | Imported `useFocusTrap` hook. Called `useFocusTrap(menuRef, menuOpen)`. Mobile menu overlay uses conditional spread: when open → `role="dialog"`, `aria-modal="true"`, `aria-label="Menú de navegación"`; when closed → `aria-hidden={true}` plus either `inert={true}` (if supported) or `tabIndex={-1}` (fallback). Feature detection via `'inert' in HTMLElement.prototype` |

## Files Modified/Created

| File | Action | Lines Changed | Description |
|------|--------|---------------|-------------|
| `app/hooks/useFocusTrap.ts` | Created | ~55 | Custom hook: traps Tab/Shift+Tab focus within a container element; queries focusable elements, wraps at boundaries; installs/cleans up keydown listener based on `active` flag |
| `app/components/NavbarClient.tsx` | Modified | ~15 | Imported `useFocusTrap`; added `useFocusTrap(menuRef, menuOpen)` call; replaced static `aria-hidden`/`inert` with conditional spread: dialog semantics when open; inert or tabIndex fallback when closed |

## Verification Results

**Source**: `openspec/changes/fix-audit-warnings-suggestions/verify-report.md`  
**Engram observation**: #1318 (topic: `sdd/fix-audit-warnings-suggestions/verify-report`)

| Check | Result | Details |
|-------|--------|---------|
| Build (`bun run build`) | PASS | Next.js 16.2.10 (Turbopack), 6 static pages, 2 pre-existing CSS warnings |
| Tests (`bun run test`) | PASS | 8 passed / 0 failed / 0 skipped (2 test files) |
| Lint (`bun run lint`) | PASS | 0 errors, 3 pre-existing warnings |
| Spec compliance (PR 4) | 8/8 | All Phase 4 scenarios COMPLIANT |
| Spec compliance (cumulative PR 1+2+3+4) | 63/63 | All Phase 1+2+3+4 scenarios COMPLIANT |
| CRITICAL findings | 0 | None |
| Blockers | 0 | None |

## Design Coherence

| Decision | Followed? | Notes |
|----------|-----------|-------|
| D2 (Focus trap) | Yes | Custom `useFocusTrap` hook — ~55 lines, zero dependencies. Queries focusable elements, handles Tab/Shift+Tab wrap at boundaries. Matches design component signature `useFocusTrap(containerRef, active)` exactly |
| Escape key handling | Yes | Existing `NavbarClient.tsx` Escape handler calls `closeMenu()` which returns focus to hamburger via `buttonRef.current?.focus()` — satisfies SPEC-FAWS-008 Scenario 3 |
| Inert feature detection | Yes | `'inert' in HTMLElement.prototype` check with `tabIndex={-1}` fallback for older browsers |
| D8 (Section wrapper deferred) | Yes | SPEC-FAWS-041 and SPEC-FAWS-046 correctly excluded |

## Warnings and Notes

1. **SPEC-FAWS-031 — Derived constants are string duplicates (carry-over from PR 2).** `ACADEMY.coordinatesMeta` and `ACADEMY.coordinatesICBM` are manually hardcoded strings, not computed from `ACADEMY.coordinates`. Not a Phase 4 concern but remains open.
2. **SPEC-FAWS-036 — `useSyncExternalStore` instead of `requestAnimationFrame` (carry-over from PR 3).** Spec wording says "MUST use requestAnimationFrame" but implementation uses `useSyncExternalStore`. Functionally equivalent. Wording deviation, not a functional gap.
3. **SPEC-FAWS-029 — Cross-component `aria-describedby` dependency (carry-over from PR 3).** `CtaFinal.tsx` references `aria-describedby="wa-hint"` where `id="wa-hint"` lives in `WhatsAppFloat.tsx`. Works because both are in `page.tsx`, but creates a cross-component DOM dependency.
4. **Pre-existing issues**: 3 lint warnings and 2 CSS build warnings are pre-existing and not introduced by this change.

## Spec Sync Status

**Not synced to main specs.** This is a partial archive — PR 4 of 7. The delta spec covers 47 requirements across all 7 phases. Main spec sync (`web-standards`, `code-quality`) will occur when the full change completes and the change folder moves to `openspec/changes/archive/`.

Phase 1+2+3+4 requirements (28 of 47) are implemented and verified. The remaining 19 requirements are pending in PRs 5-7.

## Engram Traceability

| Artifact | Observation ID | Topic Key |
|----------|---------------|-----------|
| Apply progress | #1317 | `sdd/fix-audit-warnings-suggestions/apply-progress` |
| Verify report | #1318 | `sdd/fix-audit-warnings-suggestions/verify-report` |
| PR 1 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr1` |
| PR 2 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr2` |
| PR 3 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr3` |
| This archive | (new) | `sdd/fix-audit-warnings-suggestions/archive-pr4` |

## Change Status After This Archive

- **PR 1**: Archived (see `archive-pr1.md`)
- **PR 2**: Archived (see `archive-pr2.md`)
- **PR 3**: Archived (see `archive-pr3.md`)
- **PR 4**: Archived (this report)
- **PR 5-7**: Pending (see `tasks.md` phases 5-7)
- **Change folder**: Remains at `openspec/changes/fix-audit-warnings-suggestions/` (not moved to archive)
- **Next action**: Implement PR 5 (Carousel A11Y + Guards)
