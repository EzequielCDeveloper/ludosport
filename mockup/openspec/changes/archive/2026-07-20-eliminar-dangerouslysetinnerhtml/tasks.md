# Tasks: Eliminar dangerouslySetInnerHTML

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~80-100 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | force-chained (user chose chained PRs from preflight) |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: stacked-to-main
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | SVG components + type change + wiring + verify | Single PR | `bun run lint && npx tsc --noEmit` | `bun run dev` + visual check of Valores section | `git revert` entire PR — additive + surgical, no collateral |

## Phase 1: Icon Components

- [x] 1.1 Create `app/components/icons/DisciplinaIcon.tsx` — triangle SVG as React component with `SVGProps<SVGSVGElement>`
- [x] 1.2 Create `app/components/icons/PerseveranciaIcon.tsx` — circle + clock hand SVG as React component
- [x] 1.3 Create `app/components/icons/AutocontrolIcon.tsx` — house-like shape SVG as React component
- [x] 1.4 Create `app/components/icons/index.ts` — barrel export of all three icon components

## Phase 2: Type Update & Wiring

- [x] 2.1 Change `Valor.icon` type in `lib/constants.ts` from `string` to `React.ComponentType<React.SVGProps<SVGSVGElement>>`
- [x] 2.2 Import icon components in `lib/constants.ts` and assign to `VALORES` array fields (replacing SVG strings)
- [x] 2.3 Update `app/components/ValueCard.tsx` — replace `dangerouslySetInnerHTML={{ __html: icon }}` with `<Icon className="w-12 h-12 mb-4 text-[var(--color-yellow)]" aria-hidden="true" />`

## Phase 3: Verification

- [x] 3.1 Run `bun run lint` — `react/no-danger` passes (pre-existing errors in `NavbarClient.tsx` and `mockup/main.js` are unrelated)
- [x] 3.2 Run `npx tsc --noEmit` — passes with zero type errors
- [x] 3.3 Confirm `dangerouslySetInnerHTML` eliminated from `app/components/` (2 pre-existing usages remain: `layout.tsx` for JSON-LD, `FAQs.tsx` for HTML content — both out of scope)
- [ ] 3.4 Visual check: `bun run dev` and confirm Valores section renders SVGs identically (manual — recommended but not blocking)

## Phase 4: Cleanup

- [x] 4.1 Remove the `icon` SVG string literals from `VALORES` in `constants.ts` (done during 2.2 — SVG strings replaced with component references)
