# Tasks: Code Quality Audit

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~390 total (PR 1: ~60, PR 2: ~180, PR 3: ~150) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Critical+Dead Code) → PR 2 (Types+Data) → PR 3 (Polish+Perf) |
| Delivery strategy | force-chained |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Critical fix + dead code removal | PR 1 | `bun run lint` | `bun run dev` + manual Escape | Revert PR merge commit |
| 2 | Types + data dedup + color consolidation | PR 2 | `npx tsc --noEmit` | `bun run dev` + verify map+colors | Revert PR merge commit |
| 3 | Polish + perf + loading state | PR 3 | `bun run build` | `bun run dev` + Lighthouse check | Revert PR merge commit |

## Phase 1: Critical + Dead Code (PR #1)

- [x] 1.1 NavbarClient: hoist `closeMenu` above the Escape `useEffect`, add `closeMenu` to deps
- [x] 1.2 Delete `app/hooks/useAccordion.ts` (unused, 18 lines)
- [x] 1.3 Delete `app/hooks/useScrollVisibility.ts` (unused, 36 lines)
- [x] 1.4 Remove `RANGO_COLORS` export from `lib/constants.ts` (lines 190-199)

## Phase 2: Types + Data Dedup (PR #2)

- [x] 2.1 Create `lib/colors.ts` with shared `BORDER_COLORS` + `TEXT_COLORS` in Tailwind arbitrary-value syntax
- [x] 2.2 Rangos.tsx: remove local color maps, import from `@/lib/colors`
- [x] 2.3 ValueCard.tsx: remove local `BORDER_COLORS`, import from `@/lib/colors`
- [x] 2.4 MapSection: import `type { Map as LeafletMap } from "leaflet"`, type `mapRef` as `useRef<LeafletMap\|null>`, import `ACADEMY` coords from constants, remove LAT/LNG + eslint-disable
- [x] 2.5 Navbar: move `<nav>` into NavbarClient, pass `isSolid` via React className instead of DOM `classList`

## Phase 3: Polish + Performance (PR #3)

- [x] 3.1 Fix import aliases: Navbar.tsx `./NavbarClient` → `@/app/components/NavbarClient`, Valores.tsx `./ValueCard` → `@/app/components/ValueCard`
- [x] 3.2 Fix array keys: FAQs `key={index}` → `key={faq.question}`, Actividades dots `key={i}` → `key={actividad.num}`
- [x] 3.3 Add `priority` to Navbar logo Image, add `sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"` to Actividades Images
- [x] 3.4 Create `app/loading.tsx` with dark-themed skeleton (pulsing navbar + hero placeholder + grid)
- [x] 3.5 `package.json`: remove `"sharp"` from `ignoreScripts` array

## Phase 4: Verification

- [x] 4.1 Run `bun run lint` — verify zero ESLint errors (TDZ + exhaustive-deps must be fixed)
- [x] 4.2 Run `npx tsc --noEmit` — verify zero type errors, no `any` casts
- [x] 4.3 Run `bun run build` — verify production build succeeds
- [ ] 4.4 Manual checks: mobile menu Escape key, map renders at correct coordinates, all Rango/Valor cards show correct colors
