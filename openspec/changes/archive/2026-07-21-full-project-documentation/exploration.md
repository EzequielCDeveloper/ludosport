# Exploration: Full Project Documentation

> **Change**: `full-project-documentation`
> **Date**: 2026-07-21
> **Explorer**: sdd-explore sub-agent
> **Mode**: openspec

---

## Current State

The Ludosport project is a single-page landing page for **Ludo Sport Drake Academy**, a Star Wars-themed contact sport academy in San Luis Río Colorado, Sonora, Mexico. The site is fully built and deployed on Netlify (fluffy-lamington-27c3ae.netlify.app). It was migrated from a static HTML/CSS/JS mockup to Next.js 16 with App Router.

The codebase is clean, well-organized, and follows Next.js 16 best practices: Server Components by default, Client Components as leaf nodes, minimal dependencies. However, **no formal project documentation exists** beyond the three existing audit reports in `docs/` and a migration guide. There is no README, no architecture overview, no component catalog, no deployment guide, or any developer-facing documentation.

---

## Full Architecture Map

### 1. Root Configuration

#### `package.json`
- **Runtime**: Next.js 16.2.10 / React 19.2.4 / React DOM 19.2.4
- **Dev Dependencies**: Tailwind CSS 4 (`@tailwindcss/postcss`), TypeScript 5, ESLint 9 with `eslint-config-next` 16.2.10
- **Other**: Leaflet 1.9.4 + `@types/leaflet` 1.9.21
- **Scripts**: `dev` (next dev), `build` (next build), `start` (next start), `lint` (eslint)
- **Package Manager**: bun (dev), npm (lockfile)

#### `next.config.ts`
- **CSP**: Strict Content-Security-Policy with `'self'` for scripts/styles/fonts, `unsafe-inline` for scripts (plus `unsafe-eval` in dev mode), img-src includes `placehold.co` and CARTO/OSM tile servers
- **Image Remote Patterns**: `placehold.co` (placeholder images)
- **Security Headers**: X-Content-Type-Options (nosniff), Referrer-Policy (strict-origin-when-cross-origin), X-Frame-Options (DENY), Permissions-Policy (camera/mic/geolocation all denied)
- **Performance**: `poweredByHeader: false`

#### `tsconfig.json`
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Strict**: true
- **Path aliases**: `@/*` → `./*`
- **JSX**: react-jsx (React 19)

#### `postcss.config.mjs`
- Single plugin: `@tailwindcss/postcss` (Tailwind CSS 4 PostCSS integration)

#### `eslint.config.mjs`
- Uses `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

---

### 2. Layout (`app/layout.tsx`)

**Type**: Server Component (default, no `"use client"` directive)

**Responsibilities**:
- Wraps the entire app in `<html lang="es">` with CSS class variables for fonts
- Loads **Google Fonts** via `next/font/google`:
  - **Anton** (weight 400, variable `--font-display`) — display/section headings
  - **Exo 2** (weights 400/500/600, variable `--font-body`) — body text
- Sets a custom font family "Star Jedi" via `@font-face` in `globals.css`
- Exports static `metadata` for SEO:
  - Title: "Ludo Sport Drake Academy — Esgrima con Sables de Madera"
  - Description: Academic with keywords for local SEO
  - OpenGraph: Full configuration with image (`/logo.jpeg`, 800×800)
  - Geo metadata: `geo.region: MX-SON`, `geo.placename`, `geo.position`, `ICBM`
  - Twitter card: summary
- Injects **JSON-LD structured data** (`application/ld+json`) via `generateLocalBusiness()`
- Body: `bg-black`, text `rgba(255,232,31,0.85)` (golden yellow), `antialiased`
- **Children**: `app/page.tsx` content (the single page)

**Dependencies**:
- `next/font/google` — Anton, Exo_2
- `@/lib/json-ld` — `generateLocalBusiness()`
- `./globals.css`

---

### 3. Page (`app/page.tsx`)

**Type**: Server Component

**Section Order** (top to bottom):

| # | Component | Type | Section ID | Description |
|---|-----------|------|------------|-------------|
| 0 | SkipLink | SC | — | Accessibility skip-to-content link |
| 1 | Starfield | SC | — | CSS-only animated starfield background |
| 2 | Navbar | SC | `#navbar` | Fixed top navigation bar |
| 3 | Hero | SC | `#hero` | Full-screen hero with CTAs |
| 4 | StarWarsCrawl | CC | — | Scroll-triggered Star Wars crawl sequence |
| 5 | MisionVision | SC | `#mision-vision` | Mission and vision statement |
| 6 | Valores | CC | `#propuesta` | 3 core values with staggered animation |
| 7 | Profesor | SC | `#profesor` | Instructor profile with image |
| 8 | Actividades | CC | `#actividades` | 10-activity horizontal carousel |
| 9 | Rangos | SC | `#rangos` | 5-rank progression system |
| 10 | FAQs | CC | `#faqs` | 6-item accordion FAQ |
| 11 | CtaFinal | SC | `#contacto` | Final CTA with info grid |
| 12 | MapSection | CC | — | Leaflet/OpenStreetMap dark map |
| 13 | Footer | SC | — | Navigation, contact, social links |
| 14 | WhatsAppFloat | CC | — | Fixed floating WhatsApp button |

**Key pattern**: The page wraps all content in `<main id="main-content" tabIndex={-1}>` — this is the skip-link target. SC = Server Component (no `"use client"`), CC = Client Component (`"use client"` directive).

---

### 4. Component Catalog (17 components)

#### 4.1 `SkipLink.tsx` — Server Component
- **No props**
- Renders: `<a href="#main-content">` with `sr-only` / `focus:not-sr-only` pattern
- Text: "Saltar al contenido principal"
- Visual style on focus: red background, white text, `font-display`, uppercase

#### 4.2 `Starfield.tsx` — Server Component
- **Props**: `style?: React.CSSProperties` (optional override)
- Renders: `<div className={styles.stars}>` with inner `<span className={styles.stars__large}>`
- Uses CSS module `starfield.module.css`
- `aria-hidden="true"` — purely decorative
- Three pseudo-element layers: small stars (120 points, 1px), medium stars (50 points, 2px), large stars (15 stars, 3-4px with yellow tint)
- **Animation**: 60s linear infinite scroll-down, respects `prefers-reduced-motion`

#### 4.3 `Navbar.tsx` — Server Component
- Renders: Fixed `<nav id="navbar">` at top, `z-50`
- Contains Next.js `<Image>` for logo (`/logo.jpeg`, 48×48, `alt=""` decorative)
- Logo text "DRAKE ACADEMY" with `font-star-jedi` class
- Delegates to `<NavbarClient>` for interactive menu logic
- `aria-label="Navegación principal"`

#### 4.4 `NavbarClient.tsx` — Client Component (`"use client"`)
- **No props**
- Consumes hooks: `useScrollNav()` for `isSolid`, `activeSection`
- Consumes constants: `NAV_LINKS` from `@/lib/constants`
- **States**: `menuOpen` (boolean), refs for button/menu/firstLink
- **Desktop**: renders inline `<ul>` with nav links, highlights active section via `navbar__link--active` class and `aria-current="page"`
- **Mobile**: hamburger toggle (3 bars, animated to X on open), slide-in overlay panel (75% width, `right:-100%` → `right:0`), backdrop overlay
- **Accessibility features**:
  - `aria-expanded` on hamburger
  - `aria-hidden` on menu when closed
  - `inert` attribute when closed (solves keyboard trap)
  - Escape key closes menu
  - Focus management: moves to first link on open, returns to hamburger on close
  - CTA link marked with `title="Contáctanos"` and distinct blue styling
- **Effect**: Syncs `navbar--solid` CSS class to parent `<nav id="navbar">` based on scroll position > 60px

#### 4.5 `Hero.tsx` — Server Component
- **No props**
- Full-screen (`min-h-screen`) section with:
  - Background: dual radial gradients (red 15% @ 30% 40%, blue 15% @ 70% 60%)
  - Scanline overlay: repeating-linear-gradient vertical lines at 120px spacing
- Content:
  - Badge: "Primera clase gratis" in red with `fadeDown` animation
  - Title: "LUDOSPORT" + "DRAKE ACADEMY" in Star Jedi font with yellow stroke + red fill (`-webkit-text-stroke: 4px #ffe81f`, transparent fill)
  - Subtitle: Esgrima deportiva blurb
  - Age range: "Para niños y jóvenes desde los 7 años"
  - Two CTA buttons: cyan outlined ("Quiero mi primera clase" → `#contacto`), white outlined ("Ver actividades" → `#actividades`)
  - Scroll hint: "Descubre más" with SVG chevron + `bounceY` animation
- Bottom fade gradient: black for seamless transition to StarWarsCrawl
- **Hero animations** (via CSS classes): badge, title, subtitle, age, CTAs, scroll hint — cascading `fadeDown`/`fadeUp` with staggered delays (0.2s → 0.8s)

#### 4.6 `StarWarsCrawl.tsx` — Client Component (`"use client"`)
- **No props**
- Dependencies: `useEffect`, `useRef`, `Starfield` component
- **Complex scroll-driven animation system**:
  - Uses a "spacer" `div` that occupies page space — its scroll position drives the animation
  - When spacer enters viewport: a fixed overlay appears (z-40, pointer-events-none)
  - Content `div` scrolls upward with `perspective(250px) rotateX(5deg)` transform — classic Star Wars crawl effect
  - **Smooth opacity**: Entry/exit lerp via exponential time constant (τ=0.08s) for frame-rate independent damping
  - Uses `requestAnimationFrame` loop (not IntersectionObserver) for continuous update
- Visual: Full-black backdrop with `Starfield` overlay, top fade gradient (45% height), yellow text justified, multiple paragraphs
- Text content: backstory about the academy's founding philosophy
- `aria-hidden="true"` on spacer; the section itself is decorative

#### 4.7 `MisionVision.tsx` — Server Component
- **No props**
- Two-column grid layout (label column + content column)
- Mission: cyan left border accent, text: "Brindar un ambiente seguro..."
- Vision: same styling, text: "Ser la academia donde cada alumno descubre..."
- Separated by thin horizontal divider (`h-px bg-white/[0.06]`)
- Typography: `font-display` for headings, `font-body` for content

#### 4.8 `Valores.tsx` — Client Component (`"use client"`)
- **No props**
- Consumes: `VALORES` constant (3 items), `useStaggerAnimation` hook, `ValueCard` component
- Renders a responsive 3-column grid (`grid sm:grid-cols-2 lg:grid-cols-3`)
- Each value wrapped in `<div className="stagger">` for intersection-based staggered entrance animation
- Headings: "NUESTROS VALORES" + subtitle "Forjamos carácter a través del arte del sable"

#### 4.9 `ValueCard.tsx` — Client Component (actually no `"use client"` — pure rendering, could be SC)
- **Props**: `title: string`, `text: string`, `icon: ComponentType<SVGProps<SVGSVGElement>>`, `color: string`
- Renders `<article>` with backdrop blur, border-top accent color via utility class map
- Icon rendered at 48×48 with `aria-hidden="true"`, colored yellow
- `color` prop maps to CSS variable for border-top via `BORDER_COLORS` record
- **Note**: Currently not marked `"use client"` but imported by Valores (CC). It would work as SC since it doesn't use hooks.

#### 4.10 `Profesor.tsx` — Server Component
- **No props**
- Two-column grid: image left, content right
- Image: `<Image>` with `fill`, `object-cover`, responsive `sizes`, placeholder URL `/placeholders/kid-learning-with-teacher.jpg`
- Image hover effect: desaturate → full color + scale 1.03 (via `profesor__img` CSS)
- Content: "EL MAESTRO" heading, "Maestro Vazquez" subheading, cyan blockquote ("El verdadero dominio comienza con el dominio de uno mismo"), bio paragraph

#### 4.11 `Actividades.tsx` — Client Component (`"use client"`)
- **No props**
- Consumes: `ACTIVIDADES` (10 items), `useHorizontalCarousel` hook
- **Horizontal snap-scroll carousel**:
  - Scroll container with `overflow-x-auto`, `snap-x snap-mandatory`, hidden scrollbar
  - Each card: `flex-[0_0_85vw]` (mobile) → `45vw` (md) → `30vw` (lg) → `25vw` (2xl)
  - Cards have yellow bottom border, backdrop blur, hover lift effect
  - Image inside each card: `<Image>` with `hover:scale-105`
- **Controls**: Left/right arrow buttons, dot indicators for each card
  - Arrows disabled at boundaries with `disabled:opacity-50`
  - Keyboard navigation via `onKeyDown` (ArrowLeft/ArrowRight)

#### 4.12 `Rangos.tsx` — Server Component
- **No props**
- Consumes: `RANGOS` constant (5 items)
- Color maps: `BORDER_COLORS` and `TEXT_COLORS` for blue/green/yellow/purple/white
- 5-column grid (`lg:grid-cols-5`), responsive to 2 columns on sm
- Each rank card: border-top accent + number + title + description
- Last rank "Maestro" gets special styling (brighter border, enhanced shadow)
- Per-rank hover shadows via CSS classes `rango-card--{color}`

#### 4.13 `FAQs.tsx` — Client Component (`"use client"`)
- **No props**
- Consumes: `FAQS` constant (6 items)
- Uses native `<details>` / `<summary>` HTML elements for accordion behavior (no JS needed)
- Summary: question text with rotating chevron SVG on `group-open`
- Answer: rendered via `dangerouslySetInnerHTML` (allows inline HTML in answers like pricing tables)
- `divide-y` for separator lines between items

#### 4.14 `CtaFinal.tsx` — Server Component
- No props
- Consumes: `ACADEMY` constant (whatsappUrl, schedule, pricing, address)
- Background: dual radial gradients (blue 12% left, red 12% right)
- 3-column info grid:
  - Horarios (blue border top)
  - Ubicación (yellow border top)
  - Costo (red border top)
- Main CTA link → WhatsApp with cyan outlined style, hover glow effect
- Animations: `animate-fade-up` on title, subtitle, info grid, and CTA button

#### 4.15 `MapSection.tsx` — Client Component (`"use client"`)
- **No props**
- Uses Leaflet (dynamically imported via `import("leaflet")`) for OpenStreetMap
- **Dynamic import**: Ensures leaflet only loads on client, no SSR issues
- **CARTO Dark Matter tiles**: Free, no API key, dark-themed
- **Custom marker**: SVG divIcon with red circle + yellow border (lightsaber-themed)
- **Popup**: "Drake Academy" branded info popup
- Coordinates: 32.461111, -114.795667 (Drake Academy, San Luis Río Colorado)
- Map config: `scrollWheelZoom: false`, zoom 15
- **Loading state**: CSS spinner overlay with `role="status"` and `aria-live="polite"`, hidden when map loads
- Cleanup: `map.remove()` on unmount to prevent memory leaks

#### 4.16 `Footer.tsx` — Server Component
- Consumes: `ACADEMY`, `NAV_LINKS`
- 3-column grid layout:
  - Brand: logo + "DRAKE ACADEMY" + quote
  - Navigation: list of `NAV_LINKS` with hover transitions
  - Contact: WhatsApp, address, schedule + social media icons (Facebook, Instagram, TikTok) with SVG icons, `aria-label` for new window
- Social links have hover color transition (gray → cyan)
- Bottom copyright: "© 2026 Ludo Sport Drake Academy. Todos los derechos reservados."

#### 4.17 `WhatsAppFloat.tsx` — Client Component (`"use client"`)
- **No props**
- Consumes: `ACADEMY` whatsappUrl
- Fixed bottom-right (`fixed bottom-6 right-6 z-50`)
- WhatsApp green (`#25D366`) rounded circle with SVG icon
- Hover: scale 1.10, brighter shadow
- Entry animation: `fadeUp` at 1s delay (via CSS class)
- Desktop tooltip: "Chatea por WhatsApp" (hidden on mobile via `sr-only md:not-sr-only`)
- Pre-filled message: "Quiero informes sobre Drake Academy"
- `aria-label` and `rel="noopener noreferrer"`

---

### 5. Hooks Catalog (5 hooks)

#### 5.1 `useScrollNav.ts`
- **Purpose**: Controls navbar solid/transparent state and active section tracking
- **Returns**: `{ isSolid: boolean, activeSection: string }`
- **Implementation**:
  - `isSolid`: `window.scrollY > 60` → toggles `navbar--solid` CSS class (via NavbarClient effect)
  - `activeSection`: Uses `IntersectionObserver` with `rootMargin: "-50% 0px -50% 0px"` (triggers at 50% viewport) on sections: hero, propuesta, profesor, actividades, rangos, faqs, contacto
  - Cleanup: removes both scroll listener and observer disconnect
- **Used by**: `NavbarClient.tsx`

#### 5.2 `useStaggerAnimation.ts`
- **Purpose**: Intersection-based staggered entrance animation for child elements with `.stagger` class
- **Parameter**: `threshold = 0.15` (default)
- **Returns**: callback ref to attach to parent container
- **Implementation**:
  - Uses callback ref pattern (`useState` + `useCallback`) to avoid re-observer on re-render
  - Creates `IntersectionObserver` on mount, observes all children with `.stagger` class
  - On intersection: adds `.stagger--visible` class (triggers CSS transition with per-child delay via `nth-child`)
  - Fallback: if IntersectionObserver unavailable, immediately shows all
- **Used by**: `Valores.tsx`

#### 5.3 `useHorizontalCarousel.ts`
- **Purpose**: Scroll-snap carousel logic for a horizontally scrollable container
- **Parameters**: `ref` (scroll container), `totalCards`
- **Returns**: `{ currentIndex, scrollTo, next, prev, isFirst, isLast }`
- **Implementation**:
  - Tracks `currentIndex` via state and ref (for callback safety)
  - `snapWidth()`: Calculates distance between first and second card (dynamic, adjusts on resize)
  - `scrollTo(index)`: Smooth scroll to clamped index position
  - `next()`/`prev()`: Boundary-safe scrolling
  - Scroll listener: RAF-throttled, syncs `currentIndex` from `el.scrollLeft / step`
  - Cleanup: removes scroll listener
- **Used by**: `Actividades.tsx`

#### 5.4 `useAccordion.ts`
- **Purpose**: Simple accordion state manager (single open item)
- **Returns**: `{ openId: number | null, toggle: (id: number) => void }`
- **Implementation**: Minimal — `useState` + `useCallback` toggle
- **Used by**: NOT currently used (FAQs use native `<details>` instead). This is **dead code** — a legacy artifact from the migration.

#### 5.5 `useScrollVisibility.ts`
- **Purpose**: Shows/hides an element based on scroll position
- **Returns**: `{ isVisible: boolean }`
- **Implementation**:
  - Immediately sets `isVisible = true` if `scrollY >= 100` on mount
  - Scroll listener: sets visible, then 2s debounce to hide if `scrollY < 100`
- **Used by**: NOT currently used in any component. **Dead code** — legacy from migration.

---

### 6. Constants (`lib/constants.ts`)

Central data store — all content data is defined here:

| Export | Type | Items | Used By |
|--------|------|-------|---------|
| `ACADEMY` | Object | name, whatsapp, address, coords, social URLs, schedule, pricing | CtaFinal, Footer, WhatsAppFloat, json-ld |
| `NAV_LINKS` | `NavLink[]` | 6 navigation items (Valores, Maestro, Actividades, Rangos, FAQ, Contacto CTA) | NavbarClient, Footer, error.tsx, not-found.tsx |
| `VALORES` | `Valor[]` | 3 values (Disciplina, Perseverancia, Autocontrol) with icon components | Valores, ValueCard |
| `ACTIVIDADES` | `Actividad[]` | 10 activities with num, title, text, image path, imageAlt | Actividades, json-ld |
| `FAQS` | `FAQ[]` | 6 Q&A pairs | FAQs, json-ld |
| `RANGOS` | `Rango[]` | 5 rank levels (I-V) with color mapping | Rangos |
| `RANGO_COLORS` | `Record<string, ...>` | Color name → CSS variable mapping | Referenced but no direct consumer (Rangos has its own local maps) |

**Important**: Icon components (DisciplinaIcon, PerseveranciaIcon, AutocontrolIcon) are imported directly into constants.ts via value icons — this creates a coupling between data and UI.

---

### 7. JSON-LD (`lib/json-ld.ts`)

Generates a comprehensive structured data `@graph` for SEO:

- **LocalBusiness**: Full business info (name, address, geo, telephone, priceRange, URL, image, opening hours, area served, social profiles, categories)
- **Service[]**: Each of the 10 activities as a `Service` entity linked to the business
- **FAQPage**: All 6 FAQs as `Question`/`Answer` pairs
- **WebPage**: Page metadata with `about` and `mainEntity` links

Generated string is injected via `<script type="application/ld+json">` in `layout.tsx`.

---

### 8. Styling Strategy

**Three-layer approach**:

#### 8.1 Tailwind CSS 4 (Primary)
- `globals.css` uses `@import "tailwindcss"` (Tailwind v4 syntax)
- All components use Tailwind utility classes for layout, spacing, typography, colors, responsive design
- Tailwind v4 `@theme inline` directive defines custom colors and font families as CSS variables
- No `tailwind.config.js` (v4 uses CSS-based config)

#### 8.2 CSS Module
- `app/styles/starfield.module.css`: Pure CSS starfield with 180+ box-shadow positions, `prefers-reduced-motion` support

#### 8.3 Global CSS (`app/globals.css`)
- **Custom fonts**: `@font-face` for "Star Jedi" (from `/fonts/Starjedi.woff`)
- **CSS Variables** (via `:root`): `--stagger-delay`, `--transition-*`, `--radius-*`
- **@theme inline** (Tailwind v4): Colors (red, yellow, cyan, blue, green, purple, black variants, gray variants), font families (display, body, star-jedi), animations (fade-up, fade-down, bounce-y, star-scroll)
- **Custom animations**: `fadeUp`, `fadeDown`, `bounceY` (@keyframes)
- **Component-specific CSS**: Hero (title size, stroke), navbar (solid/active/toggle states), stagger animation classes, focus-visible, WhatsApp float, profesor image hover, carousel scrollbar hide, per-rank hover shadows, CTA button glow, Leaflet dark theme overrides
- **Small screen overrides**: `<389px` media query for hero CTAs

**Theme colors**:
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

---

### 9. Icons (`app/components/icons/`)

3 custom SVG icon components, each exported individually and via barrel `index.ts`:

| File | SVG Description | Used In |
|------|----------------|---------|
| `DisciplinaIcon.tsx` | Triangle/chevron icon symbolizing discipline | VALORES[0] |
| `PerseveranciaIcon.tsx` | Circle with clock hand symbolizing persistence | VALORES[1] |
| `AutocontrolIcon.tsx` | Shield/house shape symbolizing self-control | VALORES[2] |

All icons use `#ffe81f` (yellow) stroke/fill and accept standard `React.SVGProps<SVGSVGElement>`.

---

### 10. Public Assets

#### `public/fonts/`
- **`Starjedi.woff`** — Self-hosted Star Wars font (licensed as freeware for personal use, the original Star Jedi font)

#### `public/placeholders/`
- **`kid-learning-with-teacher.jpg`** — Used in Profesor and 4 Actividades cards
- **`kid-tired.jpg`** — Used in 3 Actividades cards
- **`kids-training.jpg`** — Used in 3 Actividades cards

**Note**: Placeholder images are reused across multiple activities (duplication). Future improvement: replace with unique images per activity.

#### `public/`
- `favicon.ico` — Browser favicon
- `logo.jpeg` — Academy logo (800×800, used in layout OG image, Navbar, Footer)
- Default Next.js SVGs: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`

---

### 11. Error & Fallback Pages

#### `app/error.tsx` — Client Component (`"use client"`)
- Props: `error: Error & { digest? }`, `reset: () => void`
- Full layout with Starfield, Navbar, Footer
- Red "¡" icon, yellow "Algo salió mal" heading, gray explanation text
- Error ID display (if digest available)
- "Intentar de nuevo" button (calls `reset()`)
- Section navigation links (from `NAV_LINKS`)

#### `app/not-found.tsx` — Server Component (no `"use client"`)
- Full layout with Starfield, Navbar, Footer
- Red "404" display, yellow "Página no encontrada" heading
- "Volver al inicio" link (cyan outlined style)
- Section navigation links (from `NAV_LINKS`)

---

### 12. SEO Configuration

#### `app/sitemap.ts`
- Single entry: `https://ludosport.com`, monthly change frequency, priority 1

#### `app/robots.ts`
- Allow all (`userAgent: "*", allow: "/"`)
- Points to `https://ludosport.com/sitemap.xml`

#### Metadata (in `layout.tsx`)
- Full OpenGraph with image
- Geo tags for local SEO
- Twitter card

#### JSON-LD (injected in layout)
- LocalBusiness, Services (x10), FAQPage, WebPage

---

### 13. Existing Documentation (`docs/`)

| File | Content |
|------|---------|
| `auditoria-consolidada-ui-ux.md` | 32 UI/UX findings (accessibility, usability, visual consistency), 28-hour remediation estimate |
| `nextjs16_landing_page_migration.md` | Migration guide from static HTML → Next.js 16, architectural recommendations |
| `wcag-accessibility-audit.md` | WCAG 2.2 AA audit, 16 findings, 3 blockers (main landmark, keyboard trap, focus-visible) |

---

### 14. Mockup Legacy (`mockup/`)

The original static HTML/CSS/JS site, preserved at root level:
- `main.html`, `main.css`, `main.js` — The original site
- `estrellas.webp`, `estrellas2.jpg` — Original starfield images (now CSS-only)
- `instrucciones_fondo_estrellas.md` — Instructions for starfield background
- `logo.jpeg` — Same logo
- `heuristic_audit.csv` — Heuristic evaluation data from an audit
- `propuesta-colores.md` — Color palette proposal
- `sdd/` — Previous SDD artifacts
- `openspec/` — Previous OpenSpec config

---

### 15. Data Flow Architecture

```
constants.ts ─────────────────────────────────────────────┐
  ├── ACADEMY ───→ CtaFinal, Footer, WhatsAppFloat, json-ld │
  ├── NAV_LINKS ──→ NavbarClient, Footer, error/not-found    │
  ├── VALORES ────→ Valores → ValueCard                       │
  │                 (via icon imports from components/icons/)  │
  ├── ACTIVIDADES → Actividades, json-ld                      │
  ├── FAQS ───────→ FAQs, json-ld                             │
  └── RANGOS ─────→ Rangos                                    │
                                                              │
json-ld.ts ──────→ layout.tsx (LD+JSON script tag) ──────────┘
```

### 16. Client vs Server Component Boundary

```
layout.tsx  (SC — metadata, fonts, JSON-LD injection)
  └── page.tsx (SC — section composition)
        ├── SkipLink (SC)
        ├── Starfield (SC)
        ├── Navbar (SC)
        │     └── NavbarClient (CC) ← useScrollNav, useState
        ├── Hero (SC)
        ├── StarWarsCrawl (CC) ← useEffect/useRef animation loop
        ├── MisionVision (SC)
        ├── Valores (CC) ← useStaggerAnimation
        │     └── ValueCard (SC-compatible)
        ├── Profesor (SC)
        ├── Actividades (CC) ← useHorizontalCarousel
        ├── Rangos (SC)
        ├── FAQs (CC)
        ├── CtaFinal (SC)
        ├── MapSection (CC) ← dynamic Leaflet import
        ├── Footer (SC)
        └── WhatsAppFloat (CC)

Error pages:
  error.tsx (CC) ← useState reset
  not-found.tsx (SC)

SEO:
  sitemap.ts (SC — generates sitemap.xml)
  robots.ts (SC — generates robots.txt)
```

---

## Affected Areas

All files in the project — this documentation covers every source file:

- `app/layout.tsx` — Root layout, metadata, fonts, JSON-LD
- `app/page.tsx` — Page composition
- `app/components/*.tsx` — All 17 components
- `app/hooks/*.ts` — All 5 hooks
- `lib/constants.ts` — Data constants
- `lib/json-ld.ts` — JSON-LD generator
- `app/globals.css` — Global styles, theme, animations
- `app/styles/starfield.module.css` — CSS module
- `app/components/icons/*.tsx` — SVG icon components
- `app/error.tsx` — Error page
- `app/not-found.tsx` — 404 page
- `app/sitemap.ts` — Sitemap generation
- `app/robots.ts` — Robots.txt generation
- `public/` — Static assets (fonts, images, placeholders)
- `docs/*.md` — Existing audit/migration docs
- `mockup/` — Legacy static site
- `next.config.ts` — Next.js configuration
- `tsconfig.json`, `package.json`, `postcss.config.mjs`, `eslint.config.mjs` — Tool configs
- `openspec/config.yaml` — Project SDD config

---

## Dead Code Found

- **`useAccordion.ts`**: Not used anywhere. FAQs use native `<details>` instead.
- **`useScrollVisibility.ts`**: Not used anywhere. WhatsApp float uses CSS animation instead.

---

## Risks

1. **CDN-dependent fonts**: Google Fonts require CDN access — if blocked, site relies on fallback fonts
2. **Placeholder images reused**: 10 activities share only 3 unique images — affects visual quality
3. **No unit tests**: Project has lint + type-check only — no Jest, Playwright, or Vitest
4. **Static content embedded in code**: All content (activities, FAQs, ranks) lives in TypeScript constants — no CMS or markdown source
5. **Leaflet CSS from CDN**: Imported via `import "leaflet/dist/leaflet.css"` — dependency on unpkg/CDN availability
6. **No environment variables**: No `.env` detected — sensitive config (WhatsApp number, social URLs) exposed in constants
7. **Hardcoded coordinates**: Map coordinates, geo metadata, and address duplicated in multiple locations (constants, json-ld, MapSection)
8. **No loading/error states**: No Suspense boundaries or loading.tsx for potential dynamic content

---

## Ready for Proposal

Yes. The full architectural analysis is complete and documented.

**Next phase**: `sdd-propose` — define the scope of the full project documentation deliverable, including what documents to create, their structure, audience, and format.
