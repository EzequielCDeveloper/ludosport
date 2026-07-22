# Proposal: Code Quality Audit Fixes

## Intent

Fix 31 code quality issues — runtime bugs, dead code, type unsafety, data duplication, and performance gaps. Pays down tech debt before it causes production incidents or blocks future work.

## Scope

### In Scope (11 actionable fixes)
- **Critical**: NavbarClient `closeMenu` TDZ + missing deps
- **Dead code**: Delete `useAccordion.ts`, `useScrollVisibility.ts`, `RANGO_COLORS`
- **Types**: Replace `as any` in MapSection with proper `L.Map`
- **Imports**: Convert `./` relative imports to `@/` aliases (3 files)
- **Keys**: Replace index keys with stable IDs in FAQs + Actividades
- **Data dup**: Import coordinates from constants in MapSection; consolidate BORDER_COLORS/TEXT_COLORS into `lib/colors.ts`
- **DOM anti-pattern**: Pass `isSolid` as prop to NavbarClient
- **Image perf**: Add `priority` to logo, `sizes` to activity images
- **Loading state**: Create `app/loading.tsx`
- **Sharp config**: Remove sharp from `ignoreScripts`

### Out of Scope
Test infra (CI/CD/runners), content/images, mockup/ dir, CMS/env vars, CSS extraction, StarWarsCrawl dual starfield, ESLint config audit.

## Capabilities

### New Capabilities
None — pure refactor/fix, no new user-facing capability.

### Modified Capabilities
None — no existing spec requirements change.

## Approach

Three force-chained PRs stacked to `main` (each < 200 lines):

1. **PR #1: Critical + Dead Code** — NavbarClient fix, delete unused hooks/constants
2. **PR #2: Types + Data Dedup** — MapSection type, coordinate/color consolidation, DOM pass-through
3. **PR #3: Polish + Perf** — Image optimization, loading.tsx, array keys, import aliases, sharp

Each independently reviewable, testable (`lint + tsc`), and revertible.

## Affected Areas

| Area | Impact |
|------|--------|
| `app/components/NavbarClient.tsx` | Modified — hoisting, prop DOM, deps |
| `app/hooks/useAccordion.ts` | Removed |
| `app/hooks/useScrollVisibility.ts` | Removed |
| `lib/constants.ts` | Modified — remove RANGO_COLORS |
| `lib/colors.ts` | New — shared color map |
| `app/components/MapSection.tsx` | Modified — Leaflet type, import coords |
| `app/components/Navbar.tsx` | Modified — pass isSolid prop |
| `app/components/Valores.tsx` | Modified — import alias |
| `app/components/ValueCard.tsx` | Modified — shared colors, alias |
| `app/components/Rangos.tsx` | Modified — shared colors |
| `app/components/FAQs.tsx` | Modified — stable keys |
| `app/components/Actividades.tsx` | Modified — stable keys, sizes |
| `app/components/icons/index.ts` | Modified — aliases |
| `app/loading.tsx` | New |
| `package.json` | Modified — sharp ignoreScripts |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| NavbarClient refactor breaks mobile menu | Low | Test Escape + scroll in dev |
| Color consolidation alters visuals | Low | Verify every Rango/ValueCard |
| Chain merge conflicts | Med | Stack sequentially, rebase on parent merge |

## Rollback Plan

Revert per-PR: `git revert <merge-commit>`, verify with `lint + tsc`. No cross-PR rollback dependency.

## Dependencies

None — all fixes are self-contained.

## Success Criteria

- [ ] `bun run lint` passes (currently fails on TDZ + exhaustive-deps)
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `bun run build` succeeds in production mode
- [ ] Mobile menu opens/closes via Escape key
- [ ] Map renders at correct coordinates
- [ ] All Rango/Valor cards show correct colors
- [ ] Lighthouse shows no layout shift from logo
