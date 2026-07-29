<!-- BEGIN:nextjs-agent-rules -->
# ⚠️ This is NOT the Next.js you know

Next.js **16.2.10** has breaking changes — APIs, conventions, and file structure differ from your training data. Before writing **any** code:

1. Read `node_modules/next/dist/docs/index.md` for the version overview
2. Read the relevant guide in `node_modules/next/dist/docs/01-app/` for App Router patterns
3. Check `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` for removed APIs
4. Heed all deprecation notices — APIs that worked in v14/v15 may be gone

**Hard rules:**
- No synchronous request APIs (`cookies()`, `headers()`, `params`) — these are async in v16
- No `middleware.ts` — the convention is now `proxy.ts`
- No `next/legacy/image` — use `next/image` only
- No `priority` prop on `<Image>` — replaced by `preload` in v16
- No `useAmp`, `serverRuntimeConfig`, `publicRuntimeConfig` — removed
- No `experimental_ppr` — removed
<!-- END:nextjs-agent-rules -->

---

# Ludo Sport Drake Academy — Agent Rules

## Project Identity

Landing page institucional para una academia de esgrima deportiva con sables de madera en San Luis Río Colorado, Sonora. Next.js 16 App Router, Server Components por defecto, Tailwind CSS 4. Contenido estático en TypeScript — sin CMS, sin API, sin base de datos.

**URL**: `https://ludosport.com` | **Deploy**: Netlify | **CI**: GitHub Actions

---

## Ecosystem Tools (read before working)

This project uses the Gentle AI ecosystem. These tools are **already configured** — use them, don't reconfigure them.

| Tool | Purpose | When to use |
|------|---------|-------------|
| **CodeGraph** | Symbol-level codebase intelligence | Before EVERY code change — understand blast radius first |
| **gga** | Pre-commit AI code review | Runs automatically on `git commit` via hook. Reviews against THIS file. |
| **gentle-ai review** | Deep review (4R: Risk, Readability, Reliability, Resilience) | Non-trivial diffs before push/PR |
| **gentle-ai review (Judgment Day)** | Adversarial dual-judge review | High-risk changes only (auth, data, platform, security) |
| **SDD** (propose→spec→design→tasks→apply→verify→archive) | Spec-driven development | Changes with genuine ambiguity — NOT for bugfixes or understood tweaks |
| **Engram** | Persistent cross-session memory | Automatic — saves decisions, bugs, discoveries without being asked |

**Tool routing principle**: The orchestrator auto-selects inline → delegated → SDD based on complexity. Don't force SDD for a one-line fix. Don't skip review for a 200-line refactor.

**When gga runs**: It sends the staged diff + THIS FILE to the AI provider. The review quality depends on the rules written here. Keep this file authoritative and current.

---

## Architecture — Golden Rules

### 1. Server Components by Default

**ALWAYS start with a Server Component.** Add `"use client"` ONLY when the component needs:
- `useState`, `useEffect`, `useRef`, event handlers (`onClick`, `onKeyDown`)
- Custom hooks that consume browser APIs
- Dynamic browser-only imports (e.g., Leaflet)
- `dangerouslySetInnerHTML`

**11 SCs vs 9 CCs** — this ratio is intentional. If you're about to add `"use client"`, justify it.

### 2. Client Boundary — Children Stay Server

A child of a Client Component does NOT need its own `"use client"`. Example:
```tsx
// Valores.tsx — "use client" (uses IntersectionObserver)
// ValueCard.tsx — NO "use client" (just renders props)
// ✅ Correct: Valores composes ValueCard as its child
```

### 3. Flat Composition Pattern

All 17 section components live in `app/components/`. No feature folders, no nested component directories. The page composes them linearly:
```tsx
// app/page.tsx
<SkipLink /> → <ScrollProgress /> → <Starfield /> → <Navbar /> → <Hero /> → ...
```

Each section has an `id` attribute for anchor navigation (`#hero`, `#profesor`, etc.).

**Do NOT create subdirectories under `app/components/` unless you have explicit approval.** The flat structure is a deliberate architectural choice.

### 4. Single Source of Truth

ALL editable content lives in `lib/constants.ts`. Components import data from there — never hardcode content strings in components.

```
lib/constants.ts → ACADEMY, NAV_LINKS, VALORES, ACTIVIDADES, FAQS, RANGOS
lib/json-ld.ts   → generateLocalBusiness() — consumes constants
```

If you need to add a new section, add its data to `lib/constants.ts`, export the interface, and import it in the component.

### 5. No New Dependencies Without Justification

The dependency surface is deliberately minimal: React 19, Next.js 16, Tailwind 4, Leaflet, Vitest, Playwright. Before adding ANY npm package:
- Can this be done with built-in browser APIs? (`<details>` replaced `useAccordion`)
- Can this be done with existing libraries?
- Justify the tradeoff (bundle size, maintenance, version conflicts)

---

## Code Conventions

### File Naming

| Artifact | Convention | Example |
|----------|-----------|---------|
| Components | **PascalCase** | `StarWarsCrawl.tsx`, `CtaButton.tsx` |
| Hooks | **camelCase** with `use` prefix | `useScrollNav.ts`, `useHorizontalCarousel.ts` |
| Library/utils | **camelCase** | `constants.ts`, `colors.ts`, `json-ld.ts` |
| CSS Modules | **kebab-case** `.module.css` | `starfield.module.css` |
| CSS Module classes | **kebab-case** (BEM-style) | `.stars__large`, `.rango-card--blue` |
| Global CSS classes | **kebab-case** (BEM-style) | `.hero__title-stroke`, `.navbar--solid` |
| Data constants | **UPPER_SNAKE_CASE** | `NAV_LINKS`, `ACTIVIDADES`, `VALORES`, `FAQS`, `RANGOS` |

### Imports

All internal imports use `@/` path alias:
```typescript
import Navbar from "@/app/components/Navbar";
import { NAV_LINKS } from "@/lib/constants";
import { useScrollNav } from "@/app/hooks/useScrollNav";
```

**No relative imports** across directory boundaries — use `@/` always.

### Props

- Inline interface definitions in the same file (not separate type files):
  ```typescript
  interface ValueCardProps {
    title: string;
    text: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    color: string;
  }
  ```
- Destructured props in function signatures
- `forwardRef` only when the component genuinely needs a ref forwarded (currently only `CtaButton`)
- `...rest` spread pattern for passthrough props
- `className` as optional prop when the component needs to compose styles

### TypeScript

- **Strict mode** is enabled (`"strict": true`) — no type loopholes
- **No `any` types** — use `unknown` and type narrowing if the shape is truly unknown
- **Interfaces** for data shapes, **`Record<K, V>`** for maps, **`ComponentType<SVGProps<...>>`** for icon props
- All public functions and exports must have explicit return types

---

## Styling — 3-Layer System

### Layer 1: Tailwind CSS 4 (Primary)
- ALL component styles use Tailwind utility classes first
- Theme defined via `@theme inline` in `globals.css`
- CSS custom properties via `var(--color-*)` in Tailwind class names: `text-[var(--color-yellow)]`
- **No inline styles** except for computed/dynamic values (scroll position, menu position, dynamic gradients)

### Layer 2: CSS Modules
- Only for styles too complex for Tailwind (e.g., `starfield.module.css` with 180+ box-shadows)
- **DO NOT create new CSS Modules** without explicit approval — this is an escape hatch, not a pattern

### Layer 3: Global CSS (globals.css)
- Custom fonts (`@font-face`), keyframes (`@keyframes`), BEM-class effects
- Text-stroke with `@supports` progressive enhancement
- Component-specific classes for effects Tailwind can't express

### Decision Heuristic

| Situation | Solution |
|-----------|----------|
| Layout, spacing, colors, typography, responsive | Tailwind utilities |
| State variants (hover, focus, active) | Tailwind variants |
| 180+ pseudo-elements with computed values | CSS Module |
| Text stroke, scanlines, complex @keyframes | Global CSS BEM class |
| Dynamic style values from JS | Inline `style` prop |

**No styled-components, no CSS-in-JS, no separate CSS files per component.**

---

## Accessibility Standards

Accessibility is **non-negotiable**. Every component must comply:

### Required on Every Interactive Element
- `aria-label` on: hamburger, carousel buttons, WhatsApp float, map, back-to-top, social links
- `aria-hidden="true"` on: decorative SVGs, starfield, icons that repeat visible text
- `aria-expanded` on toggle elements
- `aria-current` on active navigation items

### Required on Overlays/Modals
- `role="dialog"`, `aria-modal="true"` on overlays
- Focus trap via `useFocusTrap` (Tab/Shift+Tab cycling)
- `inert` on background content (mobile menu)
- Escape key closes the overlay

### Motion & Reduced Motion
- **ALWAYS** wrap animations in `prefers-reduced-motion` check
- `scroll-behavior: smooth` replaced with `auto` when `prefers-reduced-motion: reduce`
- Starfield, progress bar, back-to-top button must respect the preference

### Screen Reader Only
- Use `sr-only` class for instructions that are visual-only (scroll hints, external link indicators)
- Skip-to-content link must be the first focusable element

### Semantic HTML
- `<main>`, `<nav>`, `<section>`, `<footer>` — no `<div>` with role when a semantic element exists
- `<details>/<summary>` for accordions — no custom JS accordion (already migrated from `useAccordion`)

---

## Testing Standards

### Unit/Integration Tests (Vitest + React Testing Library)

**Test files**: `app/components/__tests__/*.test.tsx`

**Pattern to follow**:
```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  it("does something specific", async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    // ...
  });
});
```

**What to test**:
- Rendering: does the component render all expected elements?
- Interaction: do buttons, links, toggles respond correctly?
- Accessibility: are ARIA attributes present and correct?
- States: loading, error, empty, edge cases
- Keyboard: Tab order, Enter/Space activation, Escape dismiss

**Mocks**: `vi.mock()` for `next/image`, `next/link`, custom hooks. Keep mocks minimal — mock only what's necessary.

**Running**: `npm run test` (Vitest)

### E2E Tests (Playwright)

**Test files**: `tests/e2e/*.spec.ts`

**What to test in E2E**: Full user flows that span multiple components — not what unit tests already cover.

### When to Write Tests

- **New component**: at minimum, a render test + ARIA attribute checks
- **New interaction**: userEvent test for the interaction path
- **Bug fix**: regression test that reproduces the bug FIRST, then fix
- **Refactor**: existing tests must pass — update if behavior intentionally changed

---

## Commit Convention

**Format**: `type(scope): description`

| Type | When |
|------|------|
| `feat` | New feature or section |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Tooling, config, dependencies |
| `refactor` | Code restructure without behavior change |
| `test` | Adding or updating tests |
| `style` | Formatting, CSS-only changes |
| `perf` | Performance improvement |

**Scopes**: `a11y`, `security`, `ui`, `typography`, `perf`, `seo`, `build`, `ci`, `deps`

**Examples**:
```
feat(a11y): add focus trap to mobile menu
fix(security): add CSP headers
chore(deps): update next to 16.2.10
```

**Commit language**: English for technical commits, Spanish acceptable for content-only changes.
**NO Co-Authored-By or AI attribution** in commits.

---

## Documentation

### Files to Update When Making Changes

| Change | Update |
|--------|--------|
| New component | `ARCHITECTURE.md` — add to component catalog |
| New section on page | `ARCHITECTURE.md` — update component tree + `README.md` — update structure |
| New hook | `ARCHITECTURE.md` — add to hook catalog |
| New data structure | `docs/content.md` — update content editor guide |
| Dependency change | `README.md` — update tech stack |
| Build/config change | `README.md` + `docs/development.md` |

### Doc Locations

| File | Audience | Purpose |
|------|----------|---------|
| `README.md` | Developers | Quickstart, stack, scripts |
| `ARCHITECTURE.md` | Developers | Component tree, data flow, patterns |
| `AGENTS.md` | AI agents | THIS FILE — authoritative rules |
| `docs/development.md` | Developers | Detailed onboarding |
| `docs/content.md` | Content editors | How to update constants.ts |
| `openspec/specs/` | SDD | Specification-driven contracts |

**Do NOT create new documentation files in the repo root.** Use `docs/` for supplementary docs, `openspec/` for specs.

---

## SDD (Spec-Driven Development)

SDD artifacts live in `openspec/`. Active specs: `project-overview`, `architecture`, `developer-guide`, `code-quality`, `web-standards`, `content-guide`.

**When to use SDD**: Changes with genuine ambiguity — multiple possible approaches, architectural impact, cross-cutting concerns, or user-facing behavior changes that need specification before implementation.

**When NOT to use SDD**: Bugfixes, mechanical refactors, content updates, CSS-only changes, understood tweaks.

If SDD is used, follow the phase sequence: `propose → spec → design → tasks → apply → verify → archive`. The orchestrator handles routing. Engram stores artifacts with topic keys `sdd/{change-name}/{phase}`.

---

## File-Specific Rules

### `lib/constants.ts`
- **Read-only** for content editors. Programmatic changes only when adding new content types.
- All exported arrays of objects must have stable interfaces.
- New content types need an exported interface AND a corresponding JSON-LD update in `lib/json-ld.ts`.

### `app/globals.css`
- `@theme inline` block defines design tokens — don't remove existing tokens.
- `@keyframes` and BEM classes go at the bottom of the file.
- New custom properties follow the `--color-{name}` naming convention.

### `app/layout.tsx`
- Metadata object must stay complete — `openGraph`, `geo.*`, `ICBM` must remain.
- JSON-LD injection via `generateLocalBusiness()` — don't remove.
- Font loading via `next/font/google` — don't switch to self-hosted without measuring CLS.

### `app/page.tsx`
- Section order is intentional and reflects the user journey. Don't reorder without explicit approval.
- Every section component must wrap content in a semantic `<section>` with an `id`.
