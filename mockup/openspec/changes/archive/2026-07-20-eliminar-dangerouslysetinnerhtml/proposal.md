# Proposal: Eliminar dangerouslySetInnerHTML

## Intent

Semgrep SAST detected a blocking XSS finding (`react-dangerouslysetinnerhtml`) in `ValueCard.tsx`. Although the SVG icon strings come from hardcoded constants (not user input), the pattern is a security smell that blocks CI and invites future misuse. This change eliminates `dangerouslySetInnerHTML` by converting inline SVG strings into proper React components.

## Scope

### In Scope
- Create 3 SVG icon components (`DisciplinaIcon`, `PerseveranciaIcon`, `AutocontrolIcon`) under `app/components/icons/`
- Change `Valor.icon` type from `string` to `React.ComponentType<React.SVGProps<SVGSVGElement>>`
- Update `ValueCard.tsx` to render the icon component directly
- Update `Valores.tsx` and `constants.ts` for the new type

### Out of Scope
- No CSS or layout changes to cards
- No behavioral changes to stagger animation or section rendering
- No changes to other components or sections

## Capabilities

### New Capabilities
None — pure refactor, no new spec-level behavior.

### Modified Capabilities
None — no behavioral changes at the spec level.

## Approach

1. Extract each SVG string from `VALORES` into individual React components under `app/components/icons/` with a barrel export.
2. Change `Valor.icon` type to `React.ComponentType<React.SVGProps<SVGSVGElement>>`.
3. Import icon components in `constants.ts` and replace string values.
4. In `ValueCard.tsx`, replace `dangerouslySetInnerHTML` with `<Icon className="w-12 h-12 mb-4 text-[var(--color-yellow)]" aria-hidden="true" />`.
5. Run `bun run lint` (includes `react/no-danger`) and `npx tsc --noEmit`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/components/icons/` | New | 3 icon components + barrel index |
| `lib/constants.ts` | Modified | `Valor.icon` type change, icon fields use component refs |
| `app/components/ValueCard.tsx` | Modified | Remove `dangerouslySetInnerHTML`, render `<Icon />` |
| `app/components/Valores.tsx` | Modified | No usage change — type-safe by propagation |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SVG rendering differs from raw HTML injection | Low | Icons are path-only; React renders `<svg>` identically |
| Type error propagates to unnoticed file | Low | Only 2 files consume `Valor.icon`; both updated. `tsc --noEmit` catches misses. |

## Rollback Plan

`git revert` of the PR. Change is additive (new icon files) + 3 modified files with surgical replacements.

## Dependencies

None.

## Success Criteria

- [ ] `dangerouslySetInnerHTML` not found in codebase (`rg "dangerouslySetInnerHTML"` returns 0)
- [ ] SVGs render identically on the landing page Valores section
- [ ] `bun run lint` passes (includes `react/no-danger` rule from eslint-config-next)
- [ ] `npx tsc --noEmit` passes with no type errors
