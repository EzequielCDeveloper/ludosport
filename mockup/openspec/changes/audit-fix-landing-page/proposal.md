# Proposal: Audit Fix — Landing Page

## Intent

Fix all 10 SIGNAL findings from `heuristic_audit.csv` — WCAG AA contrast, missing home link, undersized targets, no current-page indicator, no live region, false-interactive spans, no skip-to-content, fragmented type scale, and unclear contact link. Screen reader and keyboard users are most affected; all visitors get clearer nav and consistent hierarchy.

## Scope

### In Scope
1. **Color contrast** (High) — lighten `--gray` / `--red` tokens; fix `#444` and `rgba(..,0.15)` exceptions
2. **Home link** (High) — logo `<a href="#">` → `<a href="/">`
3. **Target size** (Medium) — padding on `.navbar__link`; dots 12px → 24px
4. **Current-page indicator** (Medium) — IO-driven `aria-current="page"` + `.navbar__link--active`
5. **Live region** (Medium) — hidden `aria-live="polite"` + `.visually-hidden`
6. **Clickable spans** (Medium) — reduce `.actividad-card__num` visual weight
7. **Skip-to-content** (Low) — "Saltar al contenido" as first focusable element
8. **Type scale** (Low) — 20+ font-sizes → 7 CSS vars, zero visual change
9. **Help/Contact link** (Low) — "Inscribirme" → "Contacto"

### Out of Scope
- **Site search** — content too shallow to justify. Deferred.

## Capabilities

`openspec/specs/` is empty. Pure fix/refactor.

### New Capabilities
None.

### Modified Capabilities
None.

## Approach

CSS token changes + utility classes + one IntersectionObserver. HTML: 3 new elements (skip link, live region, logo href), 1 text change. Type scale refactored via CSS vars — no visible differences.

Order: Safety (2, 7, 9) → Accessibility (1, 3, 4, 5, 6) → Polish (8).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `main.css` | Modified | Colors, type scale, targets, skip/live-region, active-nav |
| `main.html` | Modified | Logo href, skip link, live region, nav label |
| `main.js` | Modified | IntersectionObserver for section tracking |

## Risks & Rollback

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Type-scale misses an override | Low | Diff review + screenshot per phase |
| IO missing in old browser | Low | Feature-detect; nav works gracefully |

Each issue group = separate commit. Revert problematic commit and skip if regression. No build/DB — instant rollback.

## Dependencies

None.

## Success Criteria

- [ ] All 10 SIGNAL rows resolved or deferred (search)
- [ ] WCAG AA contrast ≥ 4.5:1 normal / ≥ 3:1 large (verified)
- [ ] Skip link visible on focus; logo links to `/`; "Contacto" scrolls
- [ ] Active nav has `aria-current="page"` + distinct style
- [ ] Dots ≥ 24×24px; nav links meet target height
- [ ] 7 type-scale vars replace 20+ values; rendered output unchanged
