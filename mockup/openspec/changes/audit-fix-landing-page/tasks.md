# Tasks: Audit Fix — Landing Page

## Review Workload Forecast

Full diff: ~400–500 lines across `main.html`, `main.css`, `main.js`. With `force-chained`, each wave is a stacked PR targeting `main`:

| Work Unit | Focus | Est. Lines | Rollback |
|-----------|-------|------------|----------|
| 1 — Safety | Home link, skip link, contact label | ~50–80 | Revert commit 1 |
| 2 — Accessibility | Contrast, targets, aria-current, live region, spans | ~200–300 | Revert commit 2 |
| 3 — Polish | Type scale normalization | ~100–150 | Revert commit 3 |

---

## Phase 1 — Safety (Wave 1)

**T1.1 Logo href** — `main.html:18` `<a href="#">` → `<a href="/">`. **[x]**

**T1.2 Skip link** — Insert `<a href="#main-content" class="skip-link">Saltar al contenido</a>` as `<body>` first child. Add `.skip-link` in CSS: visually hidden by default, visible on `:focus` with high-contrast background, positioned above navbar (`z-index: 1001`). **[x]**

**T1.3 Contact label** — `main.html:33` `Inscribirme` → `Contacto`. **[x]**

**Verify**: Tab lands on skip link → Enter scrolls past nav. Logo navigates to `/`. "Contacto" scrolls to `#contacto`.

---

## Phase 2 — Accessibility (Wave 2)

**T2.1 Color contrast** — Lighten `--gray: #888` → `#aaa` (4.5:1 on black) at `main.css:55`. Review `--red: #dc3545` — passes 3:1 on black (8:1), left unchanged. Raise `.actividad-card__num` `rgba(220,53,69,0.15)` → `rgba(220,53,69,0.85)` for 3:1 on `--black3`. Fix `.footer__copy` `#444` → `#777` at `main.css:1002`. **[x]**

**T2.2 Target sizes** — `.navbar__link` at `main.css:285` add `padding-block: 0.75rem` (44px touch height). Bump `.actividades__dot` `12px` → `24px` at `main.css:736–737`. **[x]**

**T2.3 Section tracking** — Add `IntersectionObserver` in `main.js` observing `#hero, #propuesta, #profesor, #actividades, #rangos, #faqs, #contacto`. Uses `rootMargin: '-50% 0px -50% 0px'` for natural single-section activation. Sets `aria-current="page"` on matching navbar link + toggles `.navbar__link--active`. Add `.navbar__link--active` rule in CSS (white text + red bottom glow). **[x]**

**T2.4 Live region** — Insert `<div aria-live="polite" role="status" class="visually-hidden">` in `main.html` before `</body>`. Add `.visually-hidden` CSS utility (clip: `rect(0,0,0,0)` + absolute positioning). **[x]**

**T2.5 Span weight** — Reduce `.actividad-card__num` font-size from `2.5rem` → `1rem` at `main.css:684` so the number reads as decorative, not interactive. **[x]**

**Verify**: DevTools contrast ≥ 4.5:1 normal / ≥ 3:1 large. Dot edges pass pointer hit tests. Active section has `aria-current="page"` + distinct style. Live region present in DOM. Numeric spans don't look clickable.

---

## Phase 3 — Polish (Wave 3)

**T3.1 Type scale vars** — Add 7 `--fs-*` custom properties in `:root` (`main.css:48–64`): `--fs-display-xl`, `--fs-display-lg`, `--fs-display`, `--fs-lg`, `--fs-base`, `--fs-sm`, `--fs-xs`. Each maps to the same `clamp()` or rem value currently in use, preserving computed output. **[x]**

**T3.2 Replace font-size** — Substitute all 20+ `font-size` declarations in `main.css` with the corresponding `var(--fs-*)`. Zero visual change by design. **[x]**

**Verify**: Screenshot diff shows identical rendering against baseline. DevTools computed panel shows only 7 unique `font-size` values.

---

## Runtime Harness

Open `main.html` directly in any modern browser. No build step, no server, no test runner — pure manual verification per wave.

## Rollback Strategy

Each wave lives in its own commit atop `main`. `git revert <commit>` removes that wave cleanly. Waves are independent — no cascading failures across phases.
