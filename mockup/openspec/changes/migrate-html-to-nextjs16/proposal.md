# Proposal: Migrate Static HTML to Next.js 16 App Router

## Intent

Replace static `mockup/` (HTML+CSS+JS, no build) with Next.js 16 App Router. Server Components by default, minimal Client boundaries, SEO/geo optimized for Ludo Sport Drake Academy (Hermosillo, Sonora).

## Scope

### In Scope
- Rewrite `app/layout.tsx` (Anton + Pathway Gothic One via `next/font`, `lang="es"`, metadata)
- Rewrite `app/page.tsx` composing 8 sections
- 11 components: Navbar (Client), Hero (Server), Valores, Profesor (Server), Actividades (Client carousel), Rangos (Server), FAQs (Client accordion), CtaFinal (Server), Footer (Server), WhatsAppFloat (Client), Starfield (CSS Module), SkipLink (Server)
- 5 hooks: `useScrollNav`, `useStaggerAnimation`, `useHorizontalCarousel`, `useAccordion`, `useScrollVisibility`
- Tailwind CSS 4 for layout/styles; starfield → `starfield.module.css`
- `@theme` tokens in `globals.css` (brand colors, fonts, keyframes)
- `lib/constants.ts`, `lib/json-ld.ts` (LocalBusiness schema)
- `public/logo.jpeg`, `next/image` with `remotePatterns` for `placehold.co`
- Metadata API (OpenGraph, geo tags), `robots.ts`, `sitemap.ts`
- Security headers in `next.config.ts`

New capabilities: `landing-page`, `seo-geo`, `interactive-sections`.

### Out of Scope
Real photography, unit/E2E tests, i18n, additional pages, monorepo restructure.

## Approach

Hybrid (Approach B): Tailwind for layout/styles, starfield as CSS Module, `@keyframes` as `@theme --animate-*`. 5 React hooks for JS interactions. Client boundary pushed deep.

**PR sequence** (stacked-to-main): 1) Foundation → 2) Server Components → 3a/3b/3c) Client Components (chained) → 4) Images → 5) SEO & Polish.

## Affected Areas

`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next.config.ts`, `app/components/*` (new), `app/hooks/*` (new), `lib/*` (new), `app/robots.ts`, `app/sitemap.ts`.

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Starfield box-shadow (416 lines) not Tailwindable | Low | CSS Module, never touch |
| No test runner for regression | Medium | Manual visual per PR, tsc + lint |
| Carousel most complex interactive piece | Medium | Port ~70 lines JS to hook with useRef |
| placehold.co images need replacement | Medium | next/image remotePatterns, swap later |

## Rollback Plan

Each PR merges independently to main. Rollback = `git revert <sha>` per PR in reverse. `mockup/` preserved as reference.

## Dependencies

Next.js 16.2.10, Tailwind CSS 4 + @tailwindcss/postcss, bun (all installed).

## Success Criteria

- [ ] Fonts render without FOUT (Anton + Pathway Gothic One)
- [ ] All 8 sections visually match mockup (manual verification)
- [ ] Interactive features work: navbar toggle/solid scroll, stagger, carousel arrows/dots/keyboard, FAQ accordion, WhatsApp float visibility
- [ ] Metadata API: correct title, description, OpenGraph, geo tags
- [ ] JSON-LD LocalBusiness renders in page source
- [ ] `next/image` serves assets with proper sizing
- [ ] `bun run build` succeeds with zero lint/type errors
- [ ] No console errors or hydration mismatches
- [ ] Lighthouse scores maintain or improve vs mockup
