# Design: Fix Audit Warnings & Suggestions

## Technical Approach

Remediate all 41 WARNING + SUGGESTION findings across 13 groups. Strategy: **surgical modifications per file** — no architectural rewrites. New utility components (ScrollProgress, BackToTop) are additive. The Section and CtaButton refactors from G13 are scoped to avoid visual regressions. All fixes use existing stack (Next.js 16, React 19, Tailwind CSS 4) with zero new dependencies.

## Architecture Decisions

### D1: FAQ Structured Data (JD-A-02, A11Y-14)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| A: Structured `answerParts[]` | Clean, no innerHTML, but changes `FAQ` interface + json-ld consumer | **Rejected** — json-ld FAQPage schema needs `text: string`, would require serialization back |
| B: DOMPurify | Defense-in-depth but adds 14KB dependency | **Rejected** — content is hardcoded, no CMS planned |
| C: Comment + strip `<br><br>` → `<br>` | 5 min, documents risk | **Accepted** — add code comment, fix double-break |

### D2: Focus Trap (HE-08)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| External lib (`focus-trap-react`) | Robust but +3KB, one use case | **Rejected** |
| Custom `useFocusTrap` hook | ~30 lines, zero deps | **Accepted** — query focusable elements, handle Tab/Shift+Tab wrap |

### D3: Starfield Optimization (JD-B-09, HE-20)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Reduce star count via media query | Static, no perf gain on scroll | **Rejected** |
| `radial-gradient` replacement | Cheapest but loses visual fidelity | **Rejected** |
| IntersectionObserver pause | SC→CC boundary change, ~50 lines JS | **Accepted** — pause CSS animation when off-screen |

### D4: WhatsApp Contrast (A11Y-03)

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Darken bg to `#1a8a3f` | Breaks brand | **Rejected** |
| Dark SVG stroke on icon paths | Preserves brand green, meets 3:1 | **Accepted** |

### D5: Rangos `isMaestro` (JD-B-13)

**Decision**: `rango.nivel === "V"` instead of `index === 4`. Data-driven, not index-driven.

### D6: HE-06 Color Tooltip

**Decision**: Add `title` attribute on each rango card explaining Star Wars theme alignment. No color reorder — brand decision.

### D7: G13 CtaButton

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Extract with 4 variants | Touches 4 files, risk of visual divergence | **Accepted with caveat** — keep exact classNames per variant, verify all contexts |
| Defer to separate change | Safer but leaves HE-11 open | Rejected — audit finding needs resolution |

### D8: G13 Section Component

**Decision**: **Defer to a separate change.** Touching 15 sections in this batch is high-risk for visual regressions. Document as follow-up.

## Component Design

### `useFocusTrap(containerRef, active)`

```ts
// Queries [href], button:not([disabled]), [tabindex]:not([tabindex="-1"])
// On Tab at last → focus first. On Shift+Tab at first → focus last.
// Returns void; installs/cleans up keydown listener.
```

### `ScrollProgress`

Client component. `useSyncExternalStore` for `scrollY / (scrollHeight - innerHeight)`. Renders `<div>` fixed top, `height: 2px`, `width: {pct}%`, `bg-yellow`. Respects `prefers-reduced-motion` (no transition).

### `BackToTop`

Client component. Shows after `scrollY > window.innerHeight`. Fixed bottom-right, above WhatsApp float. `aria-label="Volver arriba"`. Smooth scroll to top via `window.scrollTo({ top: 0, behavior: "smooth" })`.

### `CtaButton`

```tsx
interface CtaButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: "cyan" | "white" | "blue" | "whatsapp";
}
```

Each variant maps to the exact className currently used in its context. No style abstraction — passthrough.

## CSS Strategy

| Change | File | Detail |
|--------|------|--------|
| Reduced-motion scroll | `globals.css` | Add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` |
| Remove dead radius tokens | `globals.css` | Delete `--radius-*` lines 21-24 (unused by all components) |
| Starfield pause | `starfield.module.css` | Add `.stars--paused { animation-play-state: paused; }` |

## Configuration Approach

| Setting | Change |
|---------|--------|
| CSP img-src | Remove `blob: data:` (Leaflet uses HTTPS, next/image doesn't need them) |
| CSP script-src comment | Document `unsafe-eval` is dev-only for HMR |
| Permissions-Policy | Extend: `accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()` |
| JSON-LD escape | `.replace(/</g, '\\u003c')` on `JSON.stringify` output |
| Geo metadata | Derive from `ACADEMY.coordinates` instead of hardcoded strings |

## Edge Cases

- **Focus trap**: Escape key closes menu (existing). Click-outside via backdrop (existing). Tab wrap needs both directions. `inert` fallback: `'inert' in HTMLElement.prototype` check → `tabIndex={-1}` on closed menu.
- **IntersectionObserver lifecycle**: Starfield observer in `useEffect` cleanup must `disconnect()`. ScrollProgress observer uses `scroll` event (simpler, no observer needed).
- **ResizeObserver in carousel**: Debounce 150ms. Only re-snap `scrollLeft` — no state change, no re-render. Guard with `if (!('ResizeObserver' in window)) return`.
- **useScrollNav feature detection**: Add `if (!('IntersectionObserver' in window)) return;` at top of effect, matching `useStaggerAnimation.ts` pattern.

## File Changes

| File | Action | Groups |
|------|--------|--------|
| `app/hooks/useFocusTrap.ts` | Create | G2 |
| `app/components/ScrollProgress.tsx` | Create | G10 |
| `app/components/BackToTop.tsx` | Create | G10 |
| `app/components/CtaButton.tsx` | Create | G13 |
| `app/components/NavbarClient.tsx` | Modify | G2: dialog role, aria-modal, focus trap, inert fallback |
| `app/components/StarWarsCrawl.tsx` | Modify | G3: remove inline transform, add resize listener, remove `<br>`, add scroll hint |
| `app/components/Actividades.tsx` | Modify | G4: role/aria, counter, keyboard hint, image onError |
| `app/hooks/useHorizontalCarousel.ts` | Modify | G4: early return guards, ResizeObserver re-snap, redundant state fix |
| `app/components/FAQs.tsx` | Modify | G9: `name="faq-accordion"`, comment on innerHTML |
| `app/components/loading.tsx` | Modify | G5: role/aria-live/aria-busy, sr-only text |
| `app/components/error.tsx` | Modify | G5: hide digest in prod, add home link, console.error |
| `app/components/Hero.tsx` | Modify | G7: title → sr-only span |
| `app/components/Footer.tsx` | Modify | G1: h4 → h3 |
| `app/components/MapSection.tsx` | Modify | G1: add heading |
| `app/components/WhatsAppFloat.tsx` | Modify | G6: SVG stroke contrast, aria-describedby, URL constructor |
| `app/components/CtaFinal.tsx` | Modify | G6: aria-describedby, use CtaButton |
| `app/components/Rangos.tsx` | Modify | G8: `isMaestro` by nivel, color tooltip |
| `app/components/Profesor.tsx` | Modify | G12: image onError handler |
| `app/components/Starfield.tsx` | Modify | G11: SC → CC, IntersectionObserver pause |
| `app/page.tsx` | Modify | G10: integrate ScrollProgress + BackToTop |
| `app/hooks/useScrollNav.ts` | Modify | G13: feature detection guard |
| `app/layout.tsx` | Modify | G8: geo from constants |
| `next.config.ts` | Modify | G4: CSP, Permissions-Policy, comments |
| `lib/json-ld.ts` | Modify | G4: escape `<` |
| `lib/constants.ts` | Modify | G9: fix `<br><br>` |
| `app/globals.css` | Modify | G1/G12: reduced-motion scroll, remove radius tokens |
| `app/styles/starfield.module.css` | Modify | G11: add `.stars--paused` class |

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Unit | `useFocusTrap` wrap logic, `useHorizontalCarousel` guards | Mock DOM, test Tab/Shift+Tab cycling, test early returns with 0 cards |
| Unit | `json-ld.ts` escape | Test `<script>` injection string is escaped |
| Build | CSP doesn't break images | `npm run build` + visual check in CI |
| Manual | Focus trap, carousel a11y, contrast | Browser testing with screen reader + axe devtools |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. All changes are additive or modifier — no database, API, or config migration. Netlify auto-deploys on merge. Revert via git revert if issues found.

## Open Questions

- [ ] G13/HE-13 Section component deferred — needs separate change tracking
- [ ] G7/A11Y-03: Verify WhatsApp SVG stroke approach passes visual review with brand team
