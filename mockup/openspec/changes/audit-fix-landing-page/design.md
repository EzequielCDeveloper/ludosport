# Design: Audit Fix — Landing Page

## Technical Approach

Three-wave strategy per proposal — each wave independently verifiable and revertible at the commit level.

| Wave | Focus | Findings | Files |
|------|-------|----------|-------|
| 1 — Safety | Home link, skip link, contact label | ID 3, 7, 20 | HTML + CSS |
| 2 — Accessibility | Contrast, targets, aria-current, live region, spans | ID 21, 24, 1, 4–13 | CSS + JS + HTML |
| 3 — Polish | Type scale normalization | ID 18 | CSS only |

## Architecture Decisions

### Decision: Type scale via CSS custom properties vs utility classes

| Option | Tradeoff |
|--------|----------|
| **CSS custom properties** (chosen) | 7 vars replace 20+ values inline. Zero HTML changes, no refactor risk. |
| Utility classes (`.text-sm`, `.text-lg`) | Would touch every element in HTML — invasive, not worth the diff. |

**Rationale**: The codebase already uses custom properties (`--font-display`, `--red`). Adding type-scale vars continues the established pattern. Every `font-size` declaration becomes `var(--fs-{step})`, evaluated to the same value at reference widths via `clamp()`.

### Decision: IntersectionObserver vs scroll listener for section tracking

| Option | Tradeoff |
|--------|----------|
| **IntersectionObserver** (chosen) | Existing IO pattern (stagger). Passive, no scroll-throttle needed. Graceful fallback. |
| `scroll` event listener | Requires RAF throttling, competes with existing `scroll` handler, wastes cycles. |

**Rationale**: The stagger IO at `main.js:34` proves the browser supports IO. Adding a second IO for section roots is ~15 lines, no scroll-hijack risk, and works after load without polling.

### Decision: Hitslop for target size — padding vs min-width/height

| Option | Tradeoff |
|--------|----------|
| **Inline padding** (chosen) | `.navbar__link` gets `padding-block: 0.75rem` — hits 44px, no layout shift. Dots: `width/height: 24px`. |
| `min-width`/`min-height` | Forces `display: inline-block` on links — risks text-wrapping and unintended width changes. |

**Rationale**: Padding keeps links inline, avoids breaking navbar flex alignment. The existing CTA link already uses padding successfully.

### Decision: No-visual-regression for type scale

Map each existing `font-size` to a `clamp()` via a CSS var that keeps the **same computed value** at the current breakpoints. Then consolidate into 7 steps in `:root`. The rendered page is pixel-identical; only the source changes.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `main.css` | Modify | Add type scale vars `--fs-display-xl` through `--fs-xs`. Lighten `--gray` → `#aaa`/`#bbb` and `--red` for AA. Add `.skip-link` styles. Add `.live-region` hidden styles. Add `.navbar__link--active`. Reduce `.actividad-card__num` opacity. Bump dot targets to 24px. Add `padding-block` to nav links. |
| `main.html` | Modify | Logo `href="#"` → `href="/"`. Insert skip link as `<body>` first child. Add hidden live region `<div aria-live="polite">`. Change "Inscribirme" → "Contacto". |
| `main.js` | Modify | Add `IntersectionObserver` mapping `#hero/#propuesta/#profesor/#actividades/#rangos/#faqs/#contacto` to nav links. Set `aria-current="page"` + toggle `.navbar__link--active`. |

## Testing Strategy (Manual Browser)

| Wave | What to Verify |
|------|----------------|
| 1 | Tab starts on skip link → Enter scrolls past nav. Logo click navigates to `/`. "Contacto" link scrolls to `#contacto`. |
| 2 | Contrast ratios via DevTools ≥ 4.5:1 normal / ≥ 3:1 large. Dot targets pass pointer hit tests at edges. Active section has red underline + `aria-current`. Live region present in DOM. Spans no longer look clickable. |
| 3 | Every section renders at identical font size vs baseline (screenshot diff). 20+ unique values gone from DevTools computed panel. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Pure static site with no build step.
