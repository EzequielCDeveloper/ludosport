# Tasks: Fix Audit Warnings & Suggestions

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1700 (additions + deletions) across ~28 files |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 7 stacked PRs to main (PR 1 → PR 2 → … → PR 7) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

**Deferred to a separate change (D8)**: `<Section>` wrapper component — SPEC-FAWS-041, SPEC-FAWS-046. Touches 15 sections; high risk for visual regressions.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Quick a11y + loading/error + CSS tokens | PR 1 | `bun run test && bun run build` | `bun run dev` — visit `/`, check footer/map/hero/loading/error pages | `globals.css`, `Footer.tsx`, `MapSection.tsx`, `Hero.tsx`, `loading.tsx`, `error.tsx` |
| 2 | Security + data integrity + FAQ | PR 2 | `bun run test && bun run build` | Inspect response headers; render `/` and check geo meta + FAQ | `next.config.ts`, `lib/json-ld.ts`, `lib/constants.ts`, `FAQs.tsx`, `layout.tsx`, `Rangos.tsx` |
| 3 | WhatsApp URLs + image fallback + new UX components | PR 3 | `bun run test && bun run build` | Scroll page — progress bar + back-to-top appear; hover WhatsApp float | `WhatsAppFloat.tsx`, `CtaFinal.tsx`, `ScrollProgress.tsx`, `BackToTop.tsx`, `page.tsx`, `Profesor.tsx`, `Actividades.tsx` |
| 4 | Navbar focus trap | PR 4 | `bunx vitest run app/components/__tests__/NavbarClient.test.tsx` | Mobile viewport — open menu, Tab/Shift+Tab cycle, Escape closes | `useFocusTrap.ts`, `NavbarClient.tsx` |
| 5 | Carousel a11y + guards + ResizeObserver | PR 5 | `bunx vitest run app/components/__tests__/Actividades.test.tsx` | Resize browser — dots stay in sync with visible card | `useHorizontalCarousel.ts`, `Actividades.tsx` |
| 6 | StarWarsCrawl polish + starfield pause | PR 6 | `bun run build` + Performance tab | Scroll past starfield — animation pauses in Performance tab | `StarWarsCrawl.tsx`, `Starfield.tsx`, `starfield.module.css` |
| 7 | CtaButton refactor + G13 remaining | PR 7 | `bun run build` + visual check of 4 CTA contexts | Verify Hero/Navbar/CtaFinal/WhatsAppFloat unchanged visually | `CtaButton.tsx`, `Hero.tsx`, `NavbarClient.tsx`, `CtaFinal.tsx`, `WhatsAppFloat.tsx`, `Rangos.tsx`, `useScrollNav.ts` |

---

## Phase 1: Quick A11Y + Loading/Error + CSS (PR 1)

- [x] 1.1 `app/globals.css`: add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` (SPEC-FAWS-005).
- [x] 1.2 `app/globals.css`: delete unused `--radius-sm/md/lg/full` tokens from `@theme inline` block (SPEC-FAWS-043).
- [x] 1.3 `app/components/Footer.tsx`: change `<h4>` subheadings to `<h3>` ("Navegación", "Contacto") (SPEC-FAWS-003).
- [x] 1.4 `app/components/MapSection.tsx`: add visible `<h2>` heading ("UBICACIÓN") styled with other section headings (SPEC-FAWS-004).
- [x] 1.5 `app/components/Hero.tsx`: replace `title` attribute on scroll-hint `<div>` with `<span className="sr-only">` containing same text (SPEC-FAWS-006).
- [x] 1.6 `app/components/loading.tsx`: wrap spinner with `role="status" aria-live="polite" aria-busy="true"`, add `<span className="sr-only">Cargando página...</span>` (SPEC-FAWS-002, SPEC-FAWS-045).
- [x] 1.7 `app/components/error.tsx`: hide `error.digest` behind `process.env.NODE_ENV !== 'production'`, add "Volver al inicio" link to `/`, call `console.error(error)` in `useEffect` (SPEC-FAWS-024, SPEC-FAWS-025, SPEC-FAWS-026).

## Phase 2: Security + Data Integrity + FAQ (PR 2)

- [x] 2.1 `next.config.ts`: remove `blob:` and `data:` from CSP `img-src`; document `unsafe-eval` is dev-only HMR; extend Permissions-Policy with `accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()` (SPEC-FAWS-020, SPEC-FAWS-021, SPEC-FAWS-022).
- [x] 2.2 `lib/json-ld.ts`: replace `JSON.stringify` output `.replace(/</g, '\\u003c')` (SPEC-FAWS-023).
- [x] 2.3 `lib/constants.ts`: derive geo coords from `ACADEMY.coordinates` (new exported constant) instead of hardcoded (SPEC-FAWS-031).
- [x] 2.4 `app/layout.tsx`: consume `ACADEMY.coordinates` for `geo.position`, `ICBM`, `places:location` meta (SPEC-FAWS-031).
- [x] 2.5 `app/components/Rangos.tsx`: replace `index === 4` with `rango.nivel === "V"` for `isMaestro` (SPEC-FAWS-032).
- [x] 2.6 `lib/constants.ts`: restructure FAQ answers as `answerParts: Array<{type:'text'|'strong', content:string}>`; strip `<br><br>` → `<br>` (D1 approach C) (SPEC-FAWS-033, SPEC-FAWS-034).
- [x] 2.7 `app/components/FAQs.tsx`: render `answerParts` as JSX (map `text`→text, `strong`→`<strong>`), remove `dangerouslySetInnerHTML`; add `name="faq-accordion"` on `<details>` (SPEC-FAWS-033, SPEC-FAWS-034, SPEC-FAWS-035); add sr-only help hint (SPEC-FAWS-044).

## Phase 3: WhatsApp + Image Fallback + New UX (PR 3)

- [x] 3.1 `app/components/WhatsAppFloat.tsx`: add dark SVG stroke to icon paths for 3:1 contrast (D4); add `aria-describedby` pointing to sr-only "Se abre en WhatsApp"; use `URL` constructor + `searchParams.set()` (SPEC-FAWS-028, SPEC-FAWS-029, SPEC-FAWS-030).
- [x] 3.2 `app/components/CtaFinal.tsx`: same `aria-describedby` + `URL` constructor treatment as WhatsAppFloat (SPEC-FAWS-029, SPEC-FAWS-030).
- [x] 3.3 `app/components/ScrollProgress.tsx`: new client component — `useSyncExternalStore` on scroll, fixed top bar `height:2px`, `bg-yellow`, width=`{pct}%`, hidden under `prefers-reduced-motion` (SPEC-FAWS-036).
- [x] 3.4 `app/components/BackToTop.tsx`: new client component — visible after `scrollY > innerHeight`, fixed bottom-right above WhatsApp, `aria-label="Volver arriba"`, smooth scroll to top (SPEC-FAWS-037).
- [x] 3.5 `app/page.tsx`: integrate `<ScrollProgress />` and `<BackToTop />` (SPEC-FAWS-036, SPEC-FAWS-037).
- [x] 3.6 `app/components/Profesor.tsx`: add `onError` handler on `next/image` rendering a styled fallback div preserving dimensions (SPEC-FAWS-039).
- [x] 3.7 `app/components/Actividades.tsx`: same `onError` fallback on each activity image (SPEC-FAWS-039).

## Phase 4: Navbar Focus Trap (PR 4)

- [x] 4.1 `app/hooks/useFocusTrap.ts`: new hook — query focusable `[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])`, on Tab at last wrap to first, Shift+Tab at first wrap to last; install/cleanup `keydown` listener (SPEC-FAWS-008).
- [x] 4.2 `app/components/NavbarClient.tsx`: when `menuOpen`, add `role="dialog" aria-modal="true" aria-label="Menú de navegación"`; invoke `useFocusTrap(menuRef, menuOpen)`; feature-detect `inert` via `'inert' in HTMLElement.prototype` — when unsupported, apply `tabIndex={-1}` to menu container when closed (SPEC-FAWS-007, SPEC-FAWS-008, SPEC-FAWS-009).

## Phase 5: Carousel A11Y + Guards (PR 5)

- [x] 5.1 `app/hooks/useHorizontalCarousel.ts`: early return with disabled controls when `totalCards <= 0` (SPEC-FAWS-018); guard `scrollTo` with `clampedIndex === currentIndex` early return (SPEC-FAWS-015); add debounced (150ms) `ResizeObserver` that re-snaps `scrollLeft` to nearest card without state change (SPEC-FAWS-019); guard with `if (!('ResizeObserver' in window)) return`.
- [x] 5.2 `app/components/Actividades.tsx`: set `role="region" aria-roledescription="carrusel" aria-label="Carrusel de actividades — usa las flechas para navegar"` on scroll container (SPEC-FAWS-014); add `aria-current={i === currentIndex ? "true" : "false"}` on dots (SPEC-FAWS-001); render visible counter `"N / 10"` next to dots (SPEC-FAWS-016); add `<span className="sr-only">` keyboard hint (SPEC-FAWS-017).

## Phase 6: Crawl Polish + Starfield Pause (PR 6)

- [x] 6.1 `app/components/StarWarsCrawl.tsx`: remove inline `style.transform` from JSX, set initial transform via ref in `useEffect` before rAF loop (SPEC-FAWS-010); add "Scroll para continuar" hint that fades on first scroll (SPEC-FAWS-011); add debounced `resize` listener that resets `initiated.current = false` and re-measures (SPEC-FAWS-012); remove `<br>` tags mid-sentence from crawl paragraphs (SPEC-FAWS-013).
- [x] 6.2 `app/components/Starfield.tsx`: convert SC → CC; add `IntersectionObserver` in `useEffect` that toggles a `paused` state passed to CSS; cleanup `disconnect()` (SPEC-FAWS-038).
- [x] 6.3 `app/styles/starfield.module.css`: add `.stars--paused { animation-play-state: paused; }` (SPEC-FAWS-038).

## Phase 7: CtaButton Refactor + G13 Remaining (PR 7)

- [x] 7.1 `app/components/CtaButton.tsx`: new component — `interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> { variant: 'cyan' | 'white' | 'blue' | 'whatsapp' }`; each variant maps to exact className currently used per context; passthrough props (SPEC-FAWS-040).
- [x] 7.2 `app/components/Hero.tsx`, `app/components/NavbarClient.tsx`, `app/components/CtaFinal.tsx`, `app/components/WhatsAppFloat.tsx`: replace inline CTA `<a>` with `<CtaButton variant="...">` preserving existing visual (SPEC-FAWS-040).
- [x] 7.3 `app/components/Rangos.tsx`: add subtitle note explaining Star Wars / Drake Academy color theme (D6 tooltip) (SPEC-FAWS-042).
- [x] 7.4 `app/hooks/useScrollNav.ts`: guard effect with `if (!('IntersectionObserver' in window)) return;` returning safe defaults (SPEC-FAWS-047).

---

## Implementation Order

1. **PR 1 → 2 → 3** are independent — can be developed in parallel but stack cleanly to main.
2. **PR 4** (focus trap) depends on stable NavbarClient from PR 1/2/3.
3. **PR 5** (carousel) depends on Actividades.tsx image fallback from PR 3.
4. **PR 6** (crawl/starfield) independent — can run in parallel with PR 4/5.
5. **PR 7** (CtaButton) LAST — wraps CTAs in files already touched by PR 3/4. Must land after those to avoid merge conflicts.

## Verification Gate (applies to every PR)

- `bun run lint` passes with zero errors.
- `bun run build` succeeds.
- `bun run test` passes (existing + new tests).
- Visual regression check: Chrome + Firefox, all sections render identically.

## Out of Scope (tracked as follow-up)

- SPEC-FAWS-041: `<Section>` wrapper component (design D8 — deferred, too risky for this batch).
- SPEC-FAWS-046: `<section aria-labelledby>` (depends on Section wrapper or per-section manual pass).
- JD-B-16: font FOUT — separate concern.
- INFO findings not listed in groups.
- Nonce-based CSP — deferred to `security-v2`.
