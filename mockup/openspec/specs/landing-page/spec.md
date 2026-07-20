# Landing Page Specification

## Purpose

The landing page MUST render the academy's complete visual identity — all 8 sections, animated starfield background, brand fonts, and structured layout — as a Server Component composing reusable children.

## Requirements

### Requirement: Section Composition

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Server Component (page) |

The landing page MUST compose Navbar, Starfield, Hero, Valores, Profesor, Actividades, Rangos, FAQs, CtaFinal, Footer, and WhatsAppFloat into a single `app/page.tsx`. Each section MUST be a separate component file under `app/components/`.

#### Scenario: Full composition renders

- GIVEN a request to `/`
- WHEN `app/page.tsx` renders
- THEN all 11 components appear in the DOM in the correct order

#### Scenario: Server Component isolation

- GIVEN the page component
- WHEN `"use client"` is absent from `page.tsx`
- THEN it is a React Server Component, data never hydrates on client

### Requirement: Starfield CSS Background

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Server (CSS only) |

The Starfield MUST render as a CSS-only animated background using the existing box-shadow star positions from `mockup/main.css`, ported into a CSS Module (`starfield.module.css`). The component MUST render a `<div>` with `aria-hidden="true"`.

#### Scenario: Stars render without JS

- GIVEN the page loads
- WHEN JavaScript is disabled
- THEN the starfield background animates via CSS `@keyframes` alone

### Requirement: Font Loading

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Server |

Fonts MUST use `next/font/google` for Anton (display, weight 400) and Pathway Gothic One (body, weight 400). The layout MUST apply them via CSS variable or class, with `display: "swap"` to prevent FOUT.

#### Scenario: Fonts load without FOUT

- GIVEN the page renders
- WHEN fonts are available
- THEN Anton applies to headings, Pathway Gothic One to body text, with `font-display: swap`

### Requirement: Image Handling

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Server/Client | Server |

Images MUST use `next/image` with explicit `width` and `height`. The logo (`/logo.jpeg`) MUST be served from `public/`. External images from `placehold.co` MUST use `remotePatterns` in `next.config.ts`.

#### Scenario: Local logo renders

- GIVEN `public/logo.jpeg` exists
- WHEN `next/image` renders it
- THEN it serves with optimized dimensions and no layout shift

### Requirement: Navbar Brand

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Server wrapper, Client child for interactivity |

The Navbar MUST display "DRAKE ACADEMY" text alongside the logo image. The wrapping component hierarchy MUST be: Navbar (Server shell) → NavbarClient (Client child) for interactive behaviors.

#### Scenario: Brand renders

- GIVEN the Navbar renders
- THEN "DRAKE ACADEMY" text and the logo image are visible
- AND the logo links to `/`

### Requirement: Content Language

| Attribute | Value |
|-----------|-------|
| Priority | P0 |

All user-facing content (headings, labels, body text, alt text, aria labels) MUST be in Spanish. All code identifiers, file names, comments, and component names MUST be in English.

#### Scenario: Spanish UI content

- GIVEN the page renders
- WHEN inspecting any section
- THEN all visible text is in Spanish
- AND component names like `Hero`, `Footer`, `Valores` are English

### Requirement: Skip-to-Content Link

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Server/Client | Server |

A skip link MUST be the first focusable element, targeting `#main-content`. It MUST be visually hidden until focused.

#### Scenario: Skip link focuses on first Tab

- GIVEN the page renders
- WHEN a user presses Tab
- THEN "Saltar al contenido principal" appears and focuses
- AND activating it moves focus to the main content landmark

### Requirement: Scroll Hint

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Server/Client | Server |

The Hero section MUST include a "Descubre más" scroll hint with an animated down-arrow SVG.

#### Scenario: Scroll hint visible

- GIVEN the Hero renders
- THEN the "Descubre más" hint with arrow is visible below the CTAs
