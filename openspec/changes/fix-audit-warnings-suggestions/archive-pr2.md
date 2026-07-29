# Archive Report: PR 2 — Security + Data Integrity + FAQ

**Change**: fix-audit-warnings-suggestions  
**Phase**: 2 of 7 (PR 2)  
**Archive date**: 2026-07-28  
**Archive type**: Partial (change remains active — PRs 3-7 pending)  
**Verdict**: PASS

---

## Summary

PR 2 implemented 7 tasks covering security hardening (CSP + Permissions-Policy + JSON-LD escaping), data integrity (geo coordinates from constants, isMaestro by data field), and FAQ cleanup (dangerouslySetInnerHTML removal, accordion behavior, answerParts restructure). All 9 Phase 2 requirements (19 scenarios) are verified compliant. Build, tests, and lint pass cleanly.

## Requirements Satisfied

| Requirement | Title | Scenarios | Status |
|-------------|-------|-----------|--------|
| SPEC-FAWS-020 | CSP img-src Without blob/data | 3/3 | Implemented |
| SPEC-FAWS-021 | Document unsafe-eval Dev-Only | 2/2 | Implemented |
| SPEC-FAWS-022 | Comprehensive Permissions-Policy | 1/1 | Implemented |
| SPEC-FAWS-023 | JSON-LD Script Injection Prevention | 2/2 | Implemented |
| SPEC-FAWS-031 | Geo Coordinates From Constants | 2/2 | Implemented |
| SPEC-FAWS-032 | isMaestro By Data Field | 2/2 | Implemented |
| SPEC-FAWS-033 | FAQ Structured Data | 3/3 | Implemented |
| SPEC-FAWS-034 | FAQ Double br Removal | 2/2 | Implemented |
| SPEC-FAWS-035 | FAQ Accordion Single-Open | 2/2 | Implemented |

**Total**: 9 requirements, 19/19 scenarios compliant.

## Tasks Completed

| Task | File | Spec | Description |
|------|------|------|-------------|
| 2.1 | `next.config.ts` | SPEC-FAWS-020, 021, 022 | Removed `blob:`/`data:` from CSP `img-src`; documented `unsafe-eval` as dev-only HMR; extended Permissions-Policy to 9 directives |
| 2.2 | `lib/json-ld.ts` | SPEC-FAWS-023 | Added `.replace(/</g, '\\u003c')` on `JSON.stringify` output to prevent script injection |
| 2.3 | `lib/constants.ts` | SPEC-FAWS-031 | Added `coordinatesMeta` and `coordinatesICBM` derived from `ACADEMY.coordinates` |
| 2.4 | `app/layout.tsx` | SPEC-FAWS-031 | Imported `ACADEMY`; geo meta tags now use derived constants instead of hardcoded strings |
| 2.5 | `app/components/Rangos.tsx` | SPEC-FAWS-032 | Changed `index === 4` to `rango.nivel === "V"` for `isMaestro` detection |
| 2.6 | `lib/constants.ts` | SPEC-FAWS-033, 034 | Restructured FAQ interface from `answer: string` to `answerParts: AnswerPart[]`; fixed double `<br>` in FAQ #3 |
| 2.7 | `app/components/FAQs.tsx` | SPEC-FAWS-033, 034, 035, 044 | Removed `dangerouslySetInnerHTML`; render `answerParts` as JSX; added `name="faq-accordion"` on `<details>`; added sr-only help hint |

## Files Modified

| File | Lines Changed | Description |
|------|---------------|-------------|
| `next.config.ts` | ~15 | Removed `blob: data:` from CSP img-src; documented `unsafe-eval` dev-only; extended Permissions-Policy to 9 directives |
| `lib/json-ld.ts` | ~5 | Added `<` → `\u003c` escape; updated FAQPage schema to use `answerParts` |
| `lib/constants.ts` | ~40 | Added `coordinatesMeta`/`coordinatesICBM` derived constants; restructured FAQ data to `answerParts` |
| `app/layout.tsx` | ~5 | Import `ACADEMY`; geo meta tags now derived from constants |
| `app/components/Rangos.tsx` | 2 | `isMaestro` by `rango.nivel === "V"` instead of `index === 4` |
| `app/components/FAQs.tsx` | ~20 | Removed `dangerouslySetInnerHTML`; render `answerParts` as JSX; added accordion name + sr-only help |

## Verification Results

**Source**: `openspec/changes/fix-audit-warnings-suggestions/verify-report.md`  
**Engram observation**: #1318 (topic: `sdd/fix-audit-warnings-suggestions/verify-report`)

| Check | Result | Details |
|-------|--------|---------|
| Build (`bun run build`) | PASS | Next.js 16.2.10 (Turbopack), 6 static pages, 2 pre-existing CSS warnings |
| Tests (`bun run test`) | PASS | 8 passed / 0 failed / 0 skipped (2 test files) |
| Lint (`bun run lint`) | PASS | 0 errors, 3 pre-existing warnings |
| Spec compliance (PR 2) | 19/19 | All Phase 2 scenarios COMPLIANT |
| Spec compliance (cumulative PR 1+2) | 38/38 | All Phase 1+2 scenarios COMPLIANT |
| CRITICAL findings | 0 | None |
| Blockers | 0 | None |

## Design Coherence

| Decision | Followed? | Notes |
|----------|-----------|-------|
| D1 (FAQ strategy) | Modified | Design chose Option C (comment + strip `<br><br>`). Tasks.md and SPEC-FAWS-033 require no `dangerouslySetInnerHTML`. Implementation follows spec with full `answerParts` restructure (Option A). Better outcome than design. |
| D5 (`isMaestro` by nivel) | Yes | `rango.nivel === "V"` exactly per design decision |
| D8 (Section wrapper deferred) | Yes | SPEC-FAWS-041 and SPEC-FAWS-046 correctly excluded |
| CSP img-src: remove blob/data | Yes | Implemented exactly per design configuration table |
| CSP script-src comment | Yes | Comment documents `unsafe-eval` as dev-only HMR |
| Permissions-Policy: extend 6 directives | Yes | All 9 directives present, `fullscreen=(self)`, others denied |
| JSON-LD escape | Yes | `.replace(/</g, '\\u003c')` as specified in design |
| Geo metadata: derive from constants | Yes | Layout uses `ACADEMY.coordinatesMeta`/`coordinatesICBM` |

## Warnings and Notes

1. **SPEC-FAWS-031 — Derived constants are string duplicates, not computed.** `ACADEMY.coordinatesMeta` ("32.461111;-114.795667") and `ACADEMY.coordinatesICBM` ("32.461111, -114.795667") are manually hardcoded strings that duplicate the numeric values in `ACADEMY.coordinates`. If `ACADEMY.coordinates.lat` or `lng` changes, the meta strings must be updated manually — violating the spirit of "single source of truth". Recommend computing them: `` `${coordinates.lat};${coordinates.lng}` ``. Not a spec failure (values currently match), but a maintainability risk.
2. **D1 FAQ approach deviation**: Design D1 chose Option C (strip `<br><br>` → `<br>`). Tasks.md overrides with full `answerParts` restructure (Option A, originally rejected by design). Implementation follows tasks.md and SPEC-FAWS-033. This produces a better outcome — no `dangerouslySetInnerHTML` at all.
3. **JSON-LD FAQPage `text` field** joins `answerParts` content, losing `<strong>` formatting. Acceptable since schema.org `text` is plain text, but noted for future consideration.
4. **Pre-existing issues**: 3 lint warnings and 2 CSS build warnings are pre-existing and not introduced by this change.

## Spec Sync Status

**Not synced to main specs.** This is a partial archive — PR 2 of 7. The delta spec covers 47 requirements across all 7 phases. Main spec sync (`web-standards`, `code-quality`) will occur when the full change completes and the change folder moves to `openspec/changes/archive/`.

Phase 1+2 requirements (19 of 47) are implemented and verified. The remaining 28 requirements are pending in PRs 3-7.

## Engram Traceability

| Artifact | Observation ID | Topic Key |
|----------|---------------|-----------|
| Apply progress | #1317 | `sdd/fix-audit-warnings-suggestions/apply-progress` |
| Verify report | #1318 | `sdd/fix-audit-warnings-suggestions/verify-report` |
| PR 1 archive | (file only) | `sdd/fix-audit-warnings-suggestions/archive-pr1` |
| This archive | (new) | `sdd/fix-audit-warnings-suggestions/archive-pr2` |

## Change Status After This Archive

- **PR 1**: Archived (see `archive-pr1.md`)
- **PR 2**: Archived (this report)
- **PR 3-7**: Pending (see `tasks.md` phases 3-7)
- **Change folder**: Remains at `openspec/changes/fix-audit-warnings-suggestions/` (not moved to archive)
- **Next action**: Implement PR 3 (WhatsApp + Image Fallback + New UX Components)
