# Tasks: Full Project Documentation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~480 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (README.md + ARCHITECTURE.md) → PR 2 (docs/* + verification) |
| Delivery strategy | force-chained |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | README.md + ARCHITECTURE.md | PR 1 | `bun run build && bun run lint` | Review both docs against source | `git revert` README.md & ARCHITECTURE.md |
| 2 | docs/development.md + docs/content.md + verify | PR 2 | `bun run build && bun run lint` | Review all 4 docs + spot-check | `git revert` docs/ |

## Phase 1: README.md — Project Overview

- [x] 1.1 Add YAML frontmatter (`last-reviewed: 2026-07-21`) and project title with tagline
- [x] 1.2 Write Tech Stack table: Next.js 16, React 19, TS 5, Tailwind v4, Leaflet 1.9, bun
- [x] 1.3 Add Prerequisites (Node.js, bun) and Quickstart: clone → install → dev → build → lint
- [x] 1.4 Add Available Scripts table with descriptions for dev, build, start, lint
- [x] 1.5 Add Deployment section: Netlify URL, build command, auto-deploy from default branch
- [x] 1.6 Add Project Structure tree (Mermaid `graph TD`) with annotated directories and config files
- [x] 1.7 Strip all `create-next-app` boilerplate — confirm no CNA markdown remains

## Phase 2: ARCHITECTURE.md — Architecture Reference

- [x] 2.1 Add App Router hierarchy diagram (Mermaid `graph TD`): layout.tsx → page.tsx → sections + error/SEO
- [x] 2.2 Add Component Catalog table: all 17 components with type (SC/CC), boundary reason, props, description
- [x] 2.3 Add Server/Client Component Boundary rationale section
- [x] 2.4 Add Hooks Catalog: 5 hooks with params, return values, consumer components, dead-code flags
- [x] 2.5 Add Data Flow diagram (Mermaid `flowchart LR`): each constant export → its consumers + JSON-LD
- [x] 2.6 Add Styling Strategy: Tailwind v4 (primary), CSS Modules (starfield), global CSS (fonts/animations/theme)
- [x] 2.7 Add SEO section: static metadata, JSON-LD via `lib/json-ld.ts`, sitemap, robots, geo tags
- [x] 2.8 Flag `useAccordion` and `useScrollVisibility` as dead code with explanation and migration note

## Phase 3: docs/development.md — Developer Guide

- [x] 3.1 Write Prerequisites (Node.js, bun) and step-by-step Setup: clone, install, dev, build, lint
- [x] 3.2 Document Project Conventions: SC-by-default, kebab-case CSS, PascalCase components, Tailwind v4, TS strict
- [x] 3.3 Write "Adding a Section" guide: create component → register in page.tsx → add constants → update NAV_LINKS
- [x] 3.4 Add Build & Deployment section: `bun run build`, Netlify auto-deploy, output directory
- [x] 3.5 Add Code Style & Linting section: ESLint config (`eslint-config-next/core-web-vitals`), `bun run lint`
- [x] 3.6 Add Troubleshooting: port conflicts, install failures, TS strict errors, Tailwind class not found

## Phase 4: docs/content.md — Content Editor Guide

- [x] 4.1 Write Content Architecture overview: all editable content lives in `lib/constants.ts`
- [x] 4.2 Add Activities update instructions: locate `ACTIVIDADES` array, modify entry, image/alt fields
- [x] 4.3 Add FAQs update instructions: modify `FAQS` array, add/remove Q&A, `dangerouslySetInnerHTML` note
- [x] 4.4 Add Ranks update instructions: modify `RANGOS` array, color-mapping constraints
- [x] 4.5 Add Values update instructions: modify `VALORES` array, icons require developer guidance
- [x] 4.6 Add What NOT to Change section: no `.tsx`/`.css` files outside `lib/constants.ts`
- [x] 4.7 Document JSON-LD auto-generation: editors don't need to update structured data separately
- [x] 4.8 Add Map Coordinate updates: modify `ACADEMY.coords` + verify against `MapSection.tsx`
- [x] 4.9 Add Image Replacement section: `public/placeholders/`, image dimensions, `image`/`imageAlt` fields

## Phase 5: Verification

- [x] 5.1 Run `bun run build` — verify zero build errors
- [x] 5.2 Run `bun run lint` — verify no new warnings (only pre-existing issues in NavbarClient.tsx and mockup/main.js)
- [x] 5.3 Verify every relative cross-doc link resolves
- [x] 5.4 Spot-check all component and hook names in docs against actual source files
- [x] 5.5 Confirm README has zero CNA boilerplate content
