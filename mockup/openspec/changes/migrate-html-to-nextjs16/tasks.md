# Tasks: Migrate Static HTML to Next.js 16 App Router

## Review Workload Forecast

| PR | Scope | Est. Lines |
|----|-------|-----------|
| 1 | Config, CSS foundation, lib, logo, constants | ~200 |
| 2 | layout, page, 9 Server components | ~350 |
| 3a | Navbar + NavbarClient + useScrollNav hook | ~180 |
| 3b | Valores + useStaggerAnimation hook | ~120 |
| 3c | Actividades, FAQs, WhatsAppFloat + 3 hooks | ~250 |
| 4 | next/image in all components | ~150 |
| 5 | robots, sitemap, metadata, headers, JSON-LD | ~150 |

```
Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High
```

## Suggested Work Units

| Unit | Likely PR | Test Command | Rollback |
|------|-----------|-------------|----------|
| Foundation | 1 | `bun run lint` + `npx tsc --noEmit` | `git revert <pr1>` |
| Server Layout | 2 | same | `git revert <pr2>` |
| Navbar Interactive | 3a | same | `git revert <pr3a>` |
| Valores Stagger | 3b | same | `git revert <pr3b>` |
| Interactive Sections | 3c | same | `git revert <pr3c>` |
| Image Optimization | 4 | same | `git revert <pr4>` |
| SEO & Polish | 5 | same | `git revert <pr5>` |

Runtime harness: N/A — static landing page, manual visual check.

## Phases

### Phase 1: Foundation — 5 tasks (PR 1)

- [x] 1. `next.config.ts` — `headers()` + `images.remotePatterns`
- [x] 2. `app/globals.css` — `@theme inline` tokens, keyframes, reset
- [x] 3. `app/styles/starfield.module.css` — port box-shadow star positions
- [x] 4. `lib/constants.ts` — data arrays (nav, cards, actividades, FAQs, ranks)
- [x] 5. `lib/json-ld.ts` + copy `public/logo.jpeg`

### Phase 2: Server Components — 9 tasks (PR 2)

- [x] 1. `app/layout.tsx` — next/font (Anton, Pathway Gothic One), metadata, JSON-LD
- [x] 2. `app/page.tsx` — compose 11 sections
- [x] 3. `SkipLink`, `Starfield` — skip-to-content link, CSS background
- [x] 4. `Navbar` (server shell) — logo, brand, nav links
- [x] 5. `Hero` — CTAs, scroll hint with SVG arrow
- [x] 6. `ValueCard` — reusable card with stagger CSS
- [x] 7. `Profesor` — instructor bio
- [x] 8. `Rangos` — rank progression
- [x] 9. `CtaFinal` + `Footer`

### Phase 3a: Navbar — 2 tasks (PR 3a)

1. `app/hooks/useScrollNav.ts` — scroll >60px + IO section tracking
2. `app/components/NavbarClient.tsx` — toggle, solid bg, active link

### Phase 3b: Valores — 2 tasks (PR 3b)

1. `app/hooks/useStaggerAnimation.ts` — IO observer, 15% threshold, unobserve
2. `app/components/Valores.tsx` — client wrapper, 3× ValueCard, stagger ref

### Phase 3c: Interactive Sections — 6 tasks (PR 3c)

1. `app/hooks/useHorizontalCarousel.ts` — scroll-snap, arrows, dots, keyboard
2. `app/components/Actividades.tsx` — carousel
3. `app/hooks/useAccordion.ts` — single-open, aria-expanded
4. `app/components/FAQs.tsx` — accordion
5. `app/hooks/useScrollVisibility.ts` — 2s idle at top, 100px threshold
6. `app/components/WhatsAppFloat.tsx` — float button

### Phase 4: Images — 2 tasks (PR 4)

- [x] 1. `next/image` in Server components (Hero, Profesor, Footer, Navbar)
- [x] 2. `next/image` in Client components (Valores cards, Actividades)

### Phase 5: SEO & Polish — 5 tasks (PR 5)

- [x] 1. `app/robots.ts` — export `Robots`, `allow: "/"`
- [x] 2. `app/sitemap.ts` — export `Sitemap`, single URL entry
- [x] 3. Verify layout metadata — OpenGraph, `geo.region` (MX-SON), `geo.placename`
- [x] 4. Verify JSON-LD injection — LocalBusiness in `<script type="application/ld+json">`
- [x] 5. Verify security headers — `X-Content-Type-Options`, `Referrer-Policy`
