# Exploration: Migration Path — mockup (HTML/CSS/JS) → Next.js 16

## Current State

- **Static site**: 3 files (710 lines HTML, 1677 lines CSS, 209 lines JS)
- **No build step**: browser opens `main.html` directly
- **No router**: hash-based navigation (`#propuesta`, `#actividades`)
- **No image optimization**: `placehold.co`, raw `logo.jpeg`
- **Google Fonts CDN**: Anton + Pathway Gothic One via `<link>`
- **Testing**: none

## Target Stack

- Next.js 16.2.10 / React 19 / TypeScript 5 strict / Tailwind CSS 4 / bun
- App Router, Server Components by default
- SEO + Geo optimized (Hermosillo, Sonora, MX)
- Stacked-to-main PR delivery

## Component Tree

```
RootLayout (Server) — lang="es", fonts, globals
└── Home page (Server) — metadata, JSON-LD
    ├── SkipLink (Server)
    ├── Starfield (Server) — CSS-only bg (module)
    ├── Navbar (Client) — scroll, toggle, tracking
    ├── Hero (Server) — CSS animated entrance
    ├── ValoresWrapper (Client) — IO stagger orchestrator
    │   └── ValorCard[] (Server)
    ├── Profesor (Server) — img, bio, quote
    ├── Actividades (Client) — carousel
    ├── Rangos (Server) — nth-child ranks
    ├── FAQs (Client) — accordion
    ├── CtaFinal (Server) — info + WhatsApp CTA
    ├── Footer (Server)
    └── WhatsAppFloat (Client) — scroll visibility
```

## Recommendation

**Approach B: Hybrid migration** — Tailwind for component layout/styles, preserve starfield as CSS Module, register keyframes as `@theme` tokens. Pragmatic: invest where it matters, preserve what works.

## PR Sequence

1. **Foundation** — config, fonts, layout, theme, constants (~200 lines)
2. **Server Components** — Hero, Profesor, Rangos, CtaFinal, Footer (~350 lines)
3. **Client Components** — split into 3a/3b/3c (~450 total, chained)
4. **Images & Assets** — real images, next/image (~150 lines)
5. **SEO & Polish** — metadata, JSON-LD, robots, sitemap, headers (~150 lines)

## Key Risks

- Starfield CSS box-shadow set (416 lines) must stay as module
- No test runner — regression protection via tsc + lint only
- Carousel is the most complex interactive piece
