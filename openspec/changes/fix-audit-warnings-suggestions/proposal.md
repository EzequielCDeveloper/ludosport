# Proposal: Fix Audit Warnings & Suggestions

## Intent

Remediate all 41 remaining WARNING + SUGGESTION findings from the 2026-07-27 software quality audit. The critical cycle fixed 1 BLOCKER + 9 CRITICAL; this change addresses accessibility barriers (WCAG 2.2 AA), security hardening (CSP/Permissions-Policy), UX gaps (missing affordances), and reliability issues (data integrity, error handling). Target: zero WARNING/SUGGESTION findings post-deploy.

## Scope

### In Scope

| Group | Findings | Effort | Impact |
|-------|----------|--------|--------|
| **G1: A11Y Quick Wins** | A11Y-04, A11Y-05, JD-B-11, A11Y-07, A11Y-08, A11Y-11, A11Y-12 | ~30 min | 5 files: aria-current, aria-live, heading hierarchy, reduced-motion, sr-only |
| **G2: Navbar Focus Trap** | A11Y-06, HE-08, JD-B-08 | ~1.5 h | NavbarClient.tsx: dialog role, focus trap, inert fallback |
| **G3: StarWarsCrawl Polish** | JD-B-06, HE-01, JD-B-18, A11Y-13 | ~1 h | StarWarsCrawl.tsx: single transform source, progress indicator, resize recalc, br cleanup |
| **G4: Carousel A11Y + Fixes** | A11Y-10, HE-15, HE-16, HE-19, JD-B-05, JD-B-07 | ~1.5 h | Actividades.tsx + useHorizontalCarousel.ts: role, counter, keyboard hints, guards, ResizeObserver |
| **G5: Security Hardening** | JD-A-06, JD-A-08, JD-A-09, JD-A-04 | ~30 min | next.config.ts + json-ld.ts: CSP img-src, Permissions-Policy, JSON-LD escape |
| **G6: Loading & Error** | JD-A-05, JD-B-12, JD-B-17, HE-03 | ~30 min | loading.tsx + error.tsx: digest hiding, escape link, error logging, Suspense |
| **G7: WhatsApp & URLs** | A11Y-03, HE-09, JD-B-14 | ~30 min | WhatsAppFloat.tsx + CtaFinal.tsx: contrast, aria-describedby, URL constructor |
| **G8: Data Integrity** | JD-B-10, JD-B-13 | ~10 min | layout.tsx + Rangos.tsx: geo coords from constants, isMaestro by data |
| **G9: FAQs Cleanup** | JD-A-02, A11Y-14, HE-10 | ~15 min | FAQs.tsx + constants.ts: structured data (replace dangerouslySetInnerHTML), accordion name attr |
| **G10: Global UX** | HE-04, HE-18 | ~1 h | New ScrollProgress + BackToTop components |
| **G11: Starfield Optimization** | JD-B-09, HE-20 | ~1.5 h | Starfield.tsx: IntersectionObserver to pause off-screen animation |
| **G12: Image Error Handling** | JD-B-15 | ~30 min | Profesor.tsx + Actividades.tsx: onError fallback |
| **G13: Refactors** | HE-11, HE-13, HE-06, HE-12, HE-22, JD-B-04 | ~5 h | CtaButton + Section components, color tooltip, radius tokens, feature detection |

**Total: 41 findings, ~18 h estimated effort.**

### Out of Scope

- JD-B-16 (font FOUT) — separate concern, requires font-display strategy
- INFO findings not listed in groups — cosmetic/low-impact
- Future nonce-based CSP — requires Next.js middleware, deferred to security-v2 change
- CMS integration for FAQ content — structured data approach suffices for now

## Capabilities

### New Capabilities

- `scroll-progress`: Thin viewport-fixed bar showing page scroll progress (G10/HE-04, G3/HE-01)
- `back-to-top`: Floating button appearing after Hero, scrolls to top (G10/HE-18)
- `image-error-handling`: Fallback rendering when next/image fails to load (G12/JD-B-15)

### Modified Capabilities

- `web-standards`: Expanded accessibility (aria attributes, focus trap, heading hierarchy, reduced-motion), security hardening (CSP, Permissions-Policy, JSON-LD escaping), error page improvements
- `code-quality`: Replace `dangerouslySetInnerHTML` with structured JSX data in FAQ constants

## Approach

- **JD-A-02**: Structured data approach (Approach A) — replace HTML strings with JSX-compatible data in constants.ts
- **HE-06**: Keep Star Wars theme colors, add tooltip explaining progression
- **A11Y-03**: Dark SVG stroke on WhatsApp icon for contrast, preserve brand green
- **G2 focus trap**: Custom `useFocusTrap` hook (~30 lines), no external dependency
- **G11 starfield**: IntersectionObserver to pause animation when off-screen (requires SC → CC boundary change)
- **G13 Section component**: `<Section id title subtitle>` wrapper for heading consistency
- **G13 CtaButton**: `<CtaButton variant>` with 4 variants preserving existing per-context styles

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/components/NavbarClient.tsx` | Modified | Dialog role, focus trap, inert fallback |
| `app/components/StarWarsCrawl.tsx` | Modified | Transform fix, progress indicator, resize, br cleanup |
| `app/components/Actividades.tsx` | Modified | A11Y roles, counter, keyboard hints, image error |
| `app/hooks/useHorizontalCarousel.ts` | Modified | Guards, ResizeObserver, early return |
| `app/components/FAQs.tsx` | Modified | Structured data rendering, accordion name |
| `app/components/loading.tsx` | Modified | aria-live, aria-busy, sr-only |
| `app/components/error.tsx` | Modified | Digest hiding, escape link, error logging |
| `app/components/Hero.tsx` | Modified | title → sr-only |
| `app/components/Footer.tsx` | Modified | h4 → h3 |
| `app/components/MapSection.tsx` | Modified | Add heading |
| `app/components/WhatsAppFloat.tsx` | Modified | Contrast, aria-describedby, URL constructor |
| `app/components/CtaFinal.tsx` | Modified | aria-describedby, URL constructor |
| `app/components/Rangos.tsx` | Modified | isMaestro by data, color tooltip |
| `app/components/Profesor.tsx` | Modified | Image onError handler |
| `app/components/Starfield.tsx` | Modified | SC → CC, IntersectionObserver pause |
| `app/layout.tsx` | Modified | Geo coords from constants, JSON-LD escape |
| `app/page.tsx` | Modified | ScrollProgress + BackToTop integration |
| `app/hooks/useScrollNav.ts` | Modified | IntersectionObserver feature detection |
| `next.config.ts` | Modified | CSP img-src, Permissions-Policy, comments |
| `lib/json-ld.ts` | Modified | Escape `<` in JSON output |
| `lib/constants.ts` | Modified | FAQ structured data, ACADEMY geo |
| `app/globals.css` | Modified | prefers-reduced-motion scroll, radius tokens |
| `app/starfield.module.css` | Modified | Star count optimization |
| `app/components/CtaButton.tsx` | New | Shared CTA with variants |
| `app/components/Section.tsx` | New | Reusable section wrapper |
| `app/components/ScrollProgress.tsx` | New | Scroll progress bar |
| `app/components/BackToTop.tsx` | New | Back-to-top button |
| `app/hooks/useFocusTrap.ts` | New | Focus trap hook for navbar |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Focus trap breaks mobile menu escape routes | Low | Test all 4 escape mechanisms (Escape, backdrop, close btn, link click) |
| Section component touches every section — visual regressions | Med | Pixel-compare before/after; implement last as isolated PR |
| Removing `blob:`/`data:` from CSP breaks Leaflet or next/image | Low | Test map tiles + image optimization after change |
| Starfield SC → CC increases JS bundle | Low | Measure before/after; Starfield is CSS-only animation, minimal JS |
| ResizeObserver re-snap causes visual jump | Low | Debounce 150ms; only re-snap scrollLeft, no state change |
| CtaButton variants diverge from original per-context styling | Med | Keep exact className per variant, verify all 4 contexts |

## Rollback Plan

Revert the merge commit. All changes are additive or modifier — no database, no API, no config migration. Netlify auto-deploys previous commit on rollback. No user data affected.

## Dependencies

- None external. All fixes use existing stack (Next.js 16, React 19, Tailwind CSS 4).
- Browser APIs used: IntersectionObserver (97%+ support), `details[name]` (Chrome 120+, Firefox 130+, Safari 17.4+ — progressive enhancement), ResizeObserver (95%+ support).

## Success Criteria

- [ ] All 41 audit findings resolved — re-audit shows zero WARNING/SUGGESTION
- [ ] WCAG 2.2 AA compliance: no aria violations, focus trap works, heading hierarchy valid
- [ ] CSP hardened: no `blob:`/`data:` in img-src, Permissions-Policy comprehensive
- [ ] No `dangerouslySetInnerHTML` in FAQs
- [ ] Starfield pauses when off-screen (verified via Performance tab)
- [ ] `bun run lint` passes with zero errors
- [ ] `bun run build` succeeds
- [ ] Visual regression: all sections render identically in Chrome + Firefox
