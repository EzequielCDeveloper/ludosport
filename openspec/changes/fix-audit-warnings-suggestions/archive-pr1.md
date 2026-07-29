# Archive Report: PR 1 — Quick A11Y + Loading/Error + CSS Tokens

**Change**: fix-audit-warnings-suggestions  
**Phase**: 1 of 7 (PR 1)  
**Archive date**: 2026-07-28  
**Archive type**: Partial (change remains active — PRs 2-7 pending)  
**Verdict**: PASS

---

## Summary

PR 1 implemented 7 tasks covering quick accessibility wins, loading/error page hardening, and CSS token cleanup. All 10 Phase 1 requirements (19 scenarios) are verified compliant. Build, tests, and lint pass cleanly.

## Requirements Satisfied

| Requirement | Title | Scenarios | Status |
|-------------|-------|-----------|--------|
| SPEC-FAWS-002 | Loading Page Live Region | 2/2 | Implemented |
| SPEC-FAWS-003 | Footer Heading Hierarchy | 1/1 | Implemented |
| SPEC-FAWS-004 | MapSection Heading | 2/2 | Implemented |
| SPEC-FAWS-005 | Reduced Motion Smooth Scroll | 2/2 | Implemented |
| SPEC-FAWS-006 | Hero Scroll Hint Screen Reader | 2/2 | Implemented |
| SPEC-FAWS-024 | Hide Error Digest in Production | 2/2 | Implemented |
| SPEC-FAWS-025 | Error Page Escape Route | 2/2 | Implemented |
| SPEC-FAWS-026 | Error Boundary Logging | 2/2 | Implemented |
| SPEC-FAWS-043 | Remove Unused Radius Tokens | 2/2 | Implemented |
| SPEC-FAWS-045 | Loading Screen Reader Announcement | 2/2 | Implemented |

**Total**: 10 requirements, 19/19 scenarios compliant.

## Tasks Completed

| Task | File | Spec | Description |
|------|------|------|-------------|
| 1.1 | `app/globals.css` | SPEC-FAWS-005 | Added `@media (prefers-reduced-motion: reduce)` override for `scroll-behavior` |
| 1.2 | `app/globals.css` | SPEC-FAWS-043 | Removed unused `--radius-sm/md/lg/full` tokens from `:root` |
| 1.3 | `app/components/Footer.tsx` | SPEC-FAWS-003 | Changed `<h4>` to `<h3>` for "Navegacion" and "Contacto" subheadings |
| 1.4 | `app/components/MapSection.tsx` | SPEC-FAWS-004 | Added visible `<h2>UBICACION</h2>` heading with section heading styles |
| 1.5 | `app/components/Hero.tsx` | SPEC-FAWS-006 | Replaced `title` attribute with `<span className="sr-only">` |
| 1.6 | `app/loading.tsx` | SPEC-FAWS-002, 045 | Wrapped spinner with ARIA live region + sr-only announcement text |
| 1.7 | `app/error.tsx` | SPEC-FAWS-024, 025, 026 | Dev-only digest, "Volver al inicio" link, `console.error` logging |

## Files Modified

| File | Lines Changed | Description |
|------|---------------|-------------|
| `app/globals.css` | ~10 | Added reduced-motion media query; removed `--radius-*` tokens |
| `app/components/Footer.tsx` | 2 | `<h4>` to `<h3>` (2 instances) |
| `app/components/MapSection.tsx` | +1 | Added `<h2>` heading above map container |
| `app/components/Hero.tsx` | ~2 | `title` attr replaced with sr-only span |
| `app/loading.tsx` | ~10 | ARIA wrapper + sr-only text |
| `app/error.tsx` | ~15 | Digest gate + home link + console.error |

## Verification Results

**Source**: `openspec/changes/fix-audit-warnings-suggestions/verify-report.md`  
**Engram observation**: #1318 (topic: `sdd/fix-audit-warnings-suggestions/verify-report`)

| Check | Result | Details |
|-------|--------|---------|
| Build (`bun run build`) | PASS | Next.js 16.2.10 (Turbopack), 6 static pages, 2 pre-existing CSS warnings |
| Tests (`bun run test`) | PASS | 8 passed / 0 failed / 0 skipped (2 test files) |
| Lint (`bun run lint`) | PASS | 0 errors, 3 pre-existing warnings |
| Spec compliance | 19/19 | All scenarios COMPLIANT |
| CRITICAL findings | 0 | None |
| Blockers | 0 | None |

## Design Coherence

| Decision | Followed? | Notes |
|----------|-----------|-------|
| D8 (Section wrapper deferred) | Yes | SPEC-FAWS-041 and SPEC-FAWS-046 correctly excluded from PR 1 |
| CSS reduced-motion strategy | Yes | Implemented exactly per design |
| CSS radius token removal | Yes | Removed from `:root` (actual location) instead of `@theme inline` (stated location) |

## Warnings and Notes

1. **Token location deviation**: tasks.md stated `--radius-*` tokens were in `@theme inline` block, but they were actually in `:root` (lines 20-24). Implementation correctly removed them from the actual location. No functional impact.
2. **File path deviation**: tasks.md references `app/components/loading.tsx` and `app/components/error.tsx`, but actual paths are `app/loading.tsx` and `app/error.tsx` (Next.js App Router convention). Implementation used correct paths.
3. **Pre-existing issues**: 3 lint warnings and 2 CSS build warnings are pre-existing and not introduced by this change.

## Spec Sync Status

**Not synced to main specs.** This is a partial archive — PR 1 of 7. The delta spec covers 47 requirements across all 7 phases. Main spec sync (`web-standards`, `code-quality`) will occur when the full change completes and the change folder moves to `openspec/changes/archive/`.

Phase 1 requirements (10 of 47) are implemented and verified. The remaining 37 requirements are pending in PRs 2-7.

## Engram Traceability

| Artifact | Observation ID | Topic Key |
|----------|---------------|-----------|
| Apply progress | #1317 | `sdd/fix-audit-warnings-suggestions/apply-progress` |
| Verify report | #1318 | `sdd/fix-audit-warnings-suggestions/verify-report` |
| This archive | (new) | `sdd/fix-audit-warnings-suggestions/archive-pr1` |

## Change Status After This Archive

- **PR 1**: Archived (this report)
- **PR 2-7**: Pending (see `tasks.md` phases 2-7)
- **Change folder**: Remains at `openspec/changes/fix-audit-warnings-suggestions/` (not moved to archive)
- **Next action**: Implement PR 2 (Security + Data Integrity + FAQ)
