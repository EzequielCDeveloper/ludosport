# Design: Code Quality Audit

## Technical Approach

Three force-chained PRs applying 13 fixes grouped by risk: Critical+Dead Code → Types+Data Dedup → Polish+Perf. Each PR independently reviewable (< 200 lines) and revertible. Build-time verification via `lint + tsc + build` — no runtime test infra.

All fixes are self-contained within their target files with no cross-PR data dependencies. Stack via rebase on parent merge (PR#2 → PR#1 base, PR#3 → PR#2 base).

## Architecture Decisions

### Decision: PR Boundaries

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Single PR (all 13 fixes) | 400+ line diff, harder review | Rejected — overloads reviewer |
| 3 PRs by risk | ~60-180 lines each, clean revert | **Chosen** — matches proposal, respects 400-line guard |
| PR per file | Too many reviews | Rejected — admin overhead |

### Decision: Navbar isSolid — Client boundary absorption

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Keep SC/CC split + DOM manipulation | Anti-pattern persists | Rejected |
| Forward ref from SC to CC | Couples rendering across boundary | Rejected |
| Move `<nav>` into NavbarClient (CC) | Small JS bundle increase, eliminates DOM hack | **Chosen** — Navbar (SC) becomes thin wrapper, NavbarClient owns full `<nav>` rendering with React className |

### Decision: Color map format

| Option | Tradeoff | Decision |
|--------|----------|----------|
| CSS variable strings (RANGO_COLORS format) | Breaks existing Tailwind arbitrary-value usage | Rejected |
| Tailwind arbitrary values (current local format) | Matches all current consumers | **Chosen** — `lib/colors.ts` exports `BORDER_COLORS` + `TEXT_COLORS` in Tailwind syntax |

### Decision: Icons barrel imports

icons/index.ts uses `./` relative imports for colocated re-exports. This is **correct** per spec rule for colocated files — no change needed.

## Data Flow

```
PR #1: NavbarClient.tsx ── reorder closeMenu + deps
       useAccordion.ts ─── delete
       useScrollVisibility.ts ─ delete
       lib/constants.ts ─── remove RANGO_COLORS

PR #2: Navbar.tsx ── thin wrapper only
       NavbarClient.tsx ── absorb <nav>, use className
       MapSection.tsx ── type fix + import ACADEMY.coords
       lib/colors.ts ── new shared color maps
       Rangos.tsx ── import colors
       ValueCard.tsx ── import colors

PR #3: Navbar.tsx ── priority on logo, @/ alias
       Valores.tsx ── @/ alias
       FAQs.tsx ── stable key (faq.question)
       Actividades.tsx ── stable key (actividad.num), sizes
       app/loading.tsx ── new skeleton
       package.json ── remove sharp from ignoreScripts
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/components/NavbarClient.tsx` | Modify | Hoist `closeMenu` above escape useEffect, add to deps. Absorb `<nav>` rendering, apply `navbar--solid` via className. Accept no props. |
| `app/hooks/useAccordion.ts` | Delete | Dead code — unused export |
| `app/hooks/useScrollVisibility.ts` | Delete | Dead code — unused export |
| `lib/constants.ts` | Modify | Remove `RANGO_COLORS` export (lines 190-199) |
| `lib/colors.ts` | Create | Export `BORDER_COLORS` + `TEXT_COLORS` as `Record<string, string>` in Tailwind arbitrary value syntax |
| `app/components/Rangos.tsx` | Modify | Remove local BORDER_COLORS/TEXT_COLORS, import from `@/lib/colors` |
| `app/components/ValueCard.tsx` | Modify | Remove local BORDER_COLORS, import from `@/lib/colors` |
| `app/components/MapSection.tsx` | Modify | `import type { Map as LeafletMap } from "leaflet"`, type `mapRef` as `useRef<LeafletMap\|null>`, remove LAT/LNG, import ACADEMY from constants, remove eslint-disable |
| `app/components/Navbar.tsx` | Modify | Strip to thin wrapper: render `<NavbarClient />` only. Add `priority` to logo Image. Use `@/` import alias. |
| `app/components/Valores.tsx` | Modify | Change `./ValueCard` import to `@/app/components/ValueCard` |
| `app/components/FAQs.tsx` | Modify | Change `key={index}` to `key={faq.question}` |
| `app/components/Actividades.tsx` | Modify | Change dot button `key={i}` to `key={actividad.num}`. Add `sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"` to activity Image. |
| `app/loading.tsx` | Create | Dark-themed skeleton: pulsing navbar + hero placeholder + grid skeleton. Matches brand colors (bg-black, accent yellow). |
| `package.json` | Modify | Remove `"sharp"` from `ignoreScripts` array |

## Interfaces / Contracts

### `lib/colors.ts` — Shared Color Maps

```typescript
export const BORDER_COLORS: Record<string, string> = {
  yellow: "[border-top-color:var(--color-yellow)]",
  blue:   "[border-top-color:var(--color-blue)]",
  green:  "[border-top-color:var(--color-green)]",
  cyan:   "[border-top-color:var(--color-cyan)]",
  red:    "[border-top-color:var(--color-red)]",
  purple: "[border-top-color:var(--color-purple)]",
  white:  "[border-top-color:white]",
};

export const TEXT_COLORS: Record<string, string> = {
  blue:   "text-[var(--color-blue)]",
  green:  "text-[var(--color-green)]",
  yellow: "text-[var(--color-yellow)]",
  purple: "text-[var(--color-purple)]",
  white:  "text-white",
};
```

### MapSection — Type Cleanup

```typescript
import type { Map as LeafletMap } from "leaflet";

const mapRef = useRef<LeafletMap | null>(null);

// Cleanup (no eslint-disable needed):
if (mapRef.current) {
  mapRef.current.remove();
}
```

## Testing Strategy

No testing infra exists (no test runner configured). Verification relies on static analysis:

| Check | Command | Validates |
|-------|---------|-----------|
| Lint | `bun run lint` | No ESLint errors (currently fails on TDZ + exhaustive-deps) |
| TypeScript | `npx tsc --noEmit` | Zero type errors, no `any` casts |
| Build | `bun run build` | Production build succeeds |
| Visual | Manual — mobile menu Escape, map render, color cards | Behavioral correctness |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary in any of the 13 fixes.

## Migration / Rollout

No migration required. PRs stacked sequentially:
1. Merge PR #1, rebase PR #2 → main
2. Merge PR #2, rebase PR #3 → main
3. Merge PR #3

Each PR verified independently before rebasing the next.

## Open Questions

None. All 13 fixes have clear, unambiguous technical approaches.
