---
last-reviewed: 2026-07-21
---

# Architecture: Ludo Sport Drake Academy

> Internal codebase reference for developers working on the project.

## App Router Hierarchy

```mermaid
graph TD
    L["layout.tsx (SC)"]
    L --> P["page.tsx (SC)"]
    L --> ERR["error.tsx (CC)"]
    L --> NF["not-found.tsx (SC)"]
    L --> SITEMAP["sitemap.ts"]
    L --> ROBOTS["robots.ts"]

    P --> SKIP["SkipLink (SC)"]
    P --> STAR["Starfield (SC)"]
    P --> NAV["Navbar (SC)"]
    P --> HERO["Hero (SC)"]
    P --> CRAWL["StarWarsCrawl (CC)"]
    P --> MV["MisionVision (SC)"]
    P --> VAL["Valores (CC)"]
    P --> PROF["Profesor (SC)"]
    P --> ACT["Actividades (CC)"]
    P --> RANG["Rangos (SC)"]
    P --> FAQS["FAQs (CC)"]
    P --> CTA["CtaFinal (SC)"]
    P --> MAP["MapSection (CC)"]
    P --> FOOT["Footer (SC)"]
    P --> WHATS["WhatsAppFloat (CC)"]

    NAV --> NC["NavbarClient (CC)"]
    VAL --> VC["ValueCard (SC)"]
```

The root `layout.tsx` wraps all pages, exports static metadata, loads Google Fonts, and injects JSON-LD structured data. The page `page.tsx` composes all 17 sections in order inside `<main id="main-content">` (skip-link target).

Error pages and SEO routes are siblings at the App Router level, rendered independently when triggered.

## Component Catalog

All 17 components are listed below. `SC` = Server Component (no `"use client"` directive), `CC` = Client Component (`"use client"` directive).

| # | Component | Type | Boundary Reason | Props | Description |
|---|-----------|------|-----------------|-------|-------------|
| 1 | `SkipLink` | SC | No hooks or interactivity | None | Accessibility skip-to-content link targeting `#main-content`. Uses `sr-only` / `focus:not-sr-only` pattern. |
| 2 | `Starfield` | SC | Pure CSS decoration (no JS runtime) | `style?: React.CSSProperties` | CSS-only animated starfield with three pseudo-element layers. `aria-hidden="true"`. Respects `prefers-reduced-motion`. |
| 3 | `Navbar` | SC | No hooks; delegates interactivity | None | Fixed top navigation with logo and branding. Renders `NavbarClient` for interactive menu. `aria-label="Navegación principal"`. |
| 4 | `NavbarClient` | CC | `useState`, `useEffect`, `useScrollNav` | None | Hamburger toggle, mobile slide-in overlay, active section highlighting, keyboard trap prevention, `inert` attribute, focus management. |
| 5 | `Hero` | SC | No hooks — CSS animations only | None | Full-screen hero with dual radial gradients, scanline overlay, Star-Jedi-styled title, CTA buttons, cascading fade animations. |
| 6 | `StarWarsCrawl` | CC | `useEffect` + `useRef` rAF animation loop | None | Scroll-driven Star Wars crawl: spacer div triggers fixed overlay with perspective transform, frame-rate independent damping (τ=0.08s). Decorative (`aria-hidden="true"`). |
| 7 | `MisionVision` | SC | No hooks or interactivity | None | Two-column layout with mission and vision statements, cyan left border accents. |
| 8 | `Valores` | CC | `useStaggerAnimation` | None | 3-column grid of value cards with intersection-based staggered entrance animation. Consumes `VALORES` constant. |
| 9 | `ValueCard` | SC | Pure render (no `"use client"`); consumed by `Valores` CC | `title: string`, `text: string`, `icon: ComponentType`, `color: string` | Card with backdrop blur, border-top accent color via utility class map. Icon rendered at 48×48. |
| 10 | `Profesor` | SC | No hooks | None | Two-column instructor profile: image with hover desaturate→color effect, blockquote, bio. |
| 11 | `Actividades` | CC | `useHorizontalCarousel` | None | Horizontal snap-scroll carousel for 10 activity cards. Left/right arrows, dot indicators, keyboard nav, hidden scrollbar. |
| 12 | `Rangos` | SC | No hooks | None | 5-rank progression grid with per-rank border-top accents and hover shadows. Consumes `RANGOS` constant. |
| 13 | `FAQs` | CC | `dangerouslySetInnerHTML` for answer content | None | 6-item accordion using native `<details>`/`<summary>` (zero JS for open/close). Chevron rotation via `group-open`. |
| 14 | `CtaFinal` | SC | No hooks | None | Final CTA with 3-column info grid (schedule, location, pricing), dual radial gradient background, WhatsApp link. |
| 15 | `MapSection` | CC | Dynamic Leaflet import (browser-only, no SSR) | None | OpenStreetMap with CARTO Dark Matter tiles, custom SVG marker, branded popup, scroll-wheel zoom disabled, cleanup on unmount. |
| 16 | `Footer` | SC | No hooks | None | 3-column footer: brand/logo, navigation links (from `NAV_LINKS`), contact + social media icons (Facebook, Instagram, TikTok). |
| 17 | `WhatsAppFloat` | CC | Uses `ACADEMY` constant, CSS animation | None | Fixed bottom-right WhatsApp button (green circle, SVG icon), hover scale effect, delayed fade-up entry, desktop tooltip. |

## Server / Client Component Boundary

The project follows **Server Components by default** — only components that MUST use browser APIs or React client features declare `"use client"`.

### Boundary Rules

1. **State or effects** → Client Component. Any component using `useState`, `useEffect`, `useRef`, or event handlers requires `"use client"`.
2. **Custom hooks with browser APIs** → The consuming component must be a CC. The hook files also declare `"use client"` for clarity.
3. **Dynamic browser-only imports** → Client Component. `MapSection` dynamically imports Leaflet (no SSR support, no server-side Leaflet).
4. **`dangerouslySetInnerHTML`** → Requires CC. Even though technically possible in SC, dynamic HTML content needs client rendering.
5. **Child of a CC** → Does NOT need its own `"use client"` directive to render within the client tree (e.g., `ValueCard` is consumed by `Valores` CC but has no `"use client"` itself).

### Why This Matters

- Server Components reduce client JS bundle size by excluding interactivity code from the browser
- Server Components access server-side resources (fonts, metadata, static data) directly
- Keeping the boundary at natural interaction points (carousel, map, scroll animations) minimizes the client subtree
- Each CC boundary is documented in the catalog with its specific reason

## Hooks Catalog

| Hook | Parameters | Returns | Consumed By | Status |
|------|-----------|---------|-------------|--------|
| `useScrollNav` | None | `{ isSolid: boolean, activeSection: string }` | `NavbarClient` | Active |
| `useStaggerAnimation` | `threshold?: number` (default 0.15) | callback ref | `Valores` | Active |
| `useHorizontalCarousel` | `ref: RefObject`, `totalCards: number` | `{ currentIndex: number, scrollTo: (i: number) => void, next: () => void, prev: () => void, isFirst: boolean, isLast: boolean }` | `Actividades` | Active |
| `useAccordion` | None | `{ openId: number \| null, toggle: (id: number) => void }` | None | **Dead code** |
| `useScrollVisibility` | None | `{ isVisible: boolean }` | None | **Dead code** |

### Dead Code: `useAccordion`

**Location**: `app/hooks/useAccordion.ts`

**Why it is unused**: Was originally written to manage a single-open accordion state. Superceded by native `<details>` / `<summary>` HTML elements in `FAQs.tsx` (zero JavaScript, accessible by default).

**Migration**: Remove the file `app/hooks/useAccordion.ts` and its barrel export if re-exported from an index file.

### Dead Code: `useScrollVisibility`

**Location**: `app/hooks/useScrollVisibility.ts`

**Why it is unused**: Was meant to show/hide an element based on a scroll threshold. Replaced by CSS-only animations — the WhatsApp float uses `whatsapp-float--entry` (CSS `fadeUp` animation with 1s delay) and `bounceY` for periodic attention.

**Migration**: Remove the file `app/hooks/useScrollVisibility.ts` and its barrel export if re-exported from an index file.

## Data Flow

```mermaid
flowchart LR
    CT["lib/constants.ts"] --> CT_AC["ACADEMY"]
    CT --> CT_NL["NAV_LINKS"]
    CT --> CT_V["VALORES"]
    CT --> CT_A["ACTIVIDADES"]
    CT --> CT_F["FAQS"]
    CT --> CT_R["RANGOS"]

    CT_AC --> CTA["CtaFinal"]
    CT_AC --> FOOT["Footer"]
    CT_AC --> WHATS["WhatsAppFloat"]
    CT_AC --> JLD["lib/json-ld.ts"]

    CT_NL --> NC["NavbarClient"]
    CT_NL --> FOOT
    CT_NL --> ERR["error.tsx"]
    CT_NL --> NF["not-found.tsx"]

    CT_V --> VAL["Valores → ValueCard"]

    CT_A --> ACT["Actividades"]
    CT_A --> JLD

    CT_F --> FAQS["FAQs"]
    CT_F --> JLD

    CT_R --> RANG["Rangos"]

    JLD --> LAY["layout.tsx (script type=application/ld+json)"]
```

**Key architectural insight**: `lib/constants.ts` is the single source of truth for all editable content. There is no CMS, no markdown-based content — all data (activities, FAQs, ranks, values, navigation, academy info) lives in this one TypeScript file. The JSON-LD generator (`lib/json-ld.ts`) reads from the same constants, so structured data stays synchronized with visible content automatically.

## Styling Strategy

Three-layer approach with clear boundaries:

### 1. Tailwind CSS 4 (Primary)

- **Entry**: `@import "tailwindcss"` in `app/globals.css`
- **Config**: Pure CSS-based via `@theme inline` directive — no `tailwind.config.js` (Tailwind v4 convention)
- **Usage**: All components use Tailwind utility classes for layout, spacing, typography, colors, and responsive breakpoints
- **Custom theme**: Colors, font families, and animations are registered as CSS variables via `@theme inline`
- **Plugin**: `@tailwindcss/postcss` (single PostCSS plugin in `postcss.config.mjs`)

### 2. CSS Module (`app/styles/starfield.module.css`)

- Only `starfield.module.css` uses this approach
- Pure CSS starfield with 180+ box-shadow positions across three pseudo-element layers (small, medium, large stars)
- 60s linear infinite scroll animation, respects `prefers-reduced-motion`
- Benefits: zero runtime cost, no client JavaScript for decorative background

### 3. Global CSS (`app/globals.css`)

- **Custom fonts**: `@font-face` for "Star Jedi" (self-hosted at `/fonts/Starjedi.woff`)
- **CSS variables**: `--stagger-delay`, `--transition-*` (fast/base/slow), `--radius-*` (sm/md/lg/full)
- **Custom animations**: `fadeUp`, `fadeDown`, `bounceY`, `starScroll` with `@keyframes`
- **Component-specific styles**: Hero title stroke (`clamp` sizing, text stroke), navbar solid/active/toggle states, stagger animation classes (`.stagger`/`.stagger--visible`), focus-visible outlines, profesor image hover grayscale→color, carousel scrollbar hide, per-rank hover shadows, CTA button cyan glow, Leaflet dark theme overrides, WhatsApp float entry animation
- **Small-screen overrides**: `<389px` media query for hero CTAs (column layout + full width)

### Theme Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-red` | `#dc3545` | Accents, hero title fill, error pages |
| `--color-yellow` | `#ffe81f` | Primary brand color, headings, active states |
| `--color-cyan` | `#4bd5ee` | CTAs, accents, links |
| `--color-blue` | `#0a58ca` | Navbar CTA, rank I |
| `--color-green` | `#2ff923` | Rank II |
| `--color-purple` | `#9b59b6` | Rank IV |
| `--color-black-2` | `#111` | Mobile menu background |
| `--color-black-3` | `#1a1a1a` | Dividers, card borders |
| `--color-gray-aa` | `#aaa` | Secondary text |
| `--color-gray-light` | `#ccc` | Light gray accents |

## SEO

### Static Metadata

Exported from `app/layout.tsx` via the Next.js `metadata` export object:

- **Title**: `"Ludo Sport Drake Academy — Esgrima con Sables de Madera"`
- **Description**: SEO-optimized with local keywords (academy name, location, sport type, audience)
- **OpenGraph**: Full configuration — title, description, locale (`es_MX`), type (`website`), URL (`https://ludosport.com`), site name, image (`/logo.jpeg`, 800×800)
- **Geo tags** (via `other` metadata): `geo.region: MX-SON`, `geo.placename: San Luis Río Colorado`, `geo.position: 32.452;-114.7635`, `ICBM: 32.452, -114.7635`, `places:location: 32.452,-114.7635`
- **Twitter card**: `summary`

### JSON-LD Structured Data

Generated by `lib/json-ld.ts` and injected via `<script type="application/ld+json">` in the root layout:

| Entity | Type | Content Source |
|--------|------|---------------|
| **LocalBusiness** | `schema.org/LocalBusiness` | `ACADEMY` constant (name, address, geo, telephone, opening hours, social profiles) |
| **Services** (×10) | `schema.org/Service` | `ACTIVIDADES` constant — each activity as a service linked to the business |
| **FAQPage** | `schema.org/FAQPage` | `FAQS` constant — Q&A pairs mapped to `Question`/`Answer` |
| **WebPage** | `schema.org/WebPage` | Page metadata, linked to business and FAQ |

### Sitemap & Robots

- **`app/sitemap.ts`**: Single entry — `https://ludosport.com`, `changeFrequency: "monthly"`, `priority: 1`
- **`app/robots.ts`**: Allow all (`userAgent: "*", allow: "/"`), sitemap URL: `https://ludosport.com/sitemap.xml`
