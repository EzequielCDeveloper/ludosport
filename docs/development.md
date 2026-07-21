---
last-reviewed: 2026-07-21
---

# Developer Guide: Ludo Sport Drake Academy

> Onboarding guide for developers setting up the project and contributing changes.

## Prerequisites

- **Node.js** v20 or later (LTS)
- **bun** — package manager and runtime. [Install bun](https://bun.sh/docs/installation)
- **git** — for version control

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd ludosport

# Install dependencies
bun install

# Start the development server
bun dev

# Build for production
bun run build

# Run the linter
bun run lint
```

The development server runs at `http://localhost:3000` by default.

> **First time?** Run `bun run build` after install to ensure everything compiles. The linter (`bun run lint`) checks both ESLint rules and TypeScript types via `eslint-config-next/typescript`.

## Project Conventions

### Server Components by Default

Components are **Server Components (SC)** by default. Use `"use client"` only when a component MUST use browser APIs:

- `useState`, `useEffect`, `useRef`, event handlers
- Custom hooks that consume browser APIs
- Dynamic browser-only imports (e.g., Leaflet)
- `dangerouslySetInnerHTML`

Client Components (CC) are leaf nodes in the tree — they never wrap Server Components. See [`ARCHITECTURE.md`](../ARCHITECTURE.md) for the full boundary rationale.

### File Naming

| Artifact | Convention | Example |
|----------|-----------|---------|
| Component files | PascalCase | `NavbarClient.tsx`, `StarWarsCrawl.tsx` |
| CSS classes (Tailwind) | kebab-case | `hover:bg-red`, `sm:grid-cols-2` |
| CSS module classes | kebab-case (BEM-style) | `.stars__large`, `.rango-card--blue` |
| Hook files | camelCase with `use` prefix | `useScrollNav.ts` |
| Constants | UPPER_SNAKE_CASE | `NAV_LINKS`, `ACTIVIDADES` |

### Styling

1. **Tailwind CSS 4** — primary approach. All layout, spacing, typography, colors, and responsive design use Tailwind utility classes. The theme lives in `globals.css` via `@theme inline` — no `tailwind.config.js`.
2. **CSS Modules** — used only for complex animations that are impractical in Tailwind. Currently only `app/styles/starfield.module.css`.
3. **Global CSS** (`app/globals.css`) — custom fonts (`@font-face`), keyframe animations (`fadeUp`, `fadeDown`, `bounceY`), component-specific overrides, and Leaflet dark theme overrides.

### TypeScript

Strict mode is enabled in `tsconfig.json`. The project uses path alias `@/*` → `./*` for clean imports:

```typescript
import Navbar from "@/app/components/Navbar";
import { NAV_LINKS } from "@/lib/constants";
```

## How to Add a New Section

Adding a new visual section to the page involves 4 steps:

### 1. Create the Component

```bash
# Server Component (default)
touch app/components/MyNewSection.tsx
```

```typescript
// app/components/MyNewSection.tsx
export default function MyNewSection() {
  return (
    <section id="my-section" className="py-16 px-4">
      <h2 className="font-display text-3xl text-yellow">My New Section</h2>
      <p className="font-body text-gray-aa">Content goes here.</p>
    </section>
  );
}
```

If the section needs interactivity (state, effects, browser APIs), add `"use client"` at the top.

### 2. Register in `page.tsx`

Import and render the component in `app/page.tsx` at the desired position in the section order:

```typescript
import MyNewSection from "@/app/components/MyNewSection";

// Inside the <main> element, at the position you want it to appear:
<MyNewSection />
```

The current section order (top to bottom) is: SkipLink, Starfield, Navbar, Hero, StarWarsCrawl, MisionVision, Valores, Profesor, Actividades, Rangos, FAQs, CtaFinal, MapSection, Footer, WhatsAppFloat.

### 3. Add Constants (If Needed)

If the section displays editable content (text, images, configurable data), define it in `lib/constants.ts`:

```typescript
export interface MyData {
  title: string;
  description: string;
}

export const MY_DATA: MyData[] = [
  { title: "Item 1", description: "Description 1" },
];
```

### 4. Update Navigation (If Needed)

If the section should appear in the navbar, add an entry to `NAV_LINKS` in `lib/constants.ts`:

```typescript
export const NAV_LINKS: NavLink[] = [
  // ...existing links
  { href: "#my-section", label: "My Section" },
];
```

The section's `id` attribute must match the `href` (e.g., `#my-section` → `id="my-section"`).

## Build & Deployment

### Production Build

```bash
bun run build
```

Output directory: `.next/` (Next.js default). The build compiles all components, type-checks TypeScript, optimizes assets, and generates static pages.

**Netlify** handles deployment:

- **Live URL**: [https://fluffy-lamington-27c3ae.netlify.app](https://fluffy-lamington-27c3ae.netlify.app)
- **Build command**: `bun run build`
- **Output directory**: `.next`
- **Auto-deploy**: Every commit to the default branch triggers an automatic deploy

## Code Style & Linting

The project uses **ESLint 9** with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

```bash
# Run the linter
bun run lint
```

Configuration lives in `eslint.config.mjs`. The ignore list (`.next/`, `out/`, `build/`, `next-env.d.ts`) is defined via `globalIgnores`.

TypeScript strict mode (`tsconfig.json` `"strict": true`) catches type-level issues during build — the linter and build together cover both style and type correctness.

## Troubleshooting

### Port Conflict

If port 3000 is already in use:

```bash
# Use a different port
bun dev --port 3001
```

Or find and kill the process:

```bash
lsof -ti:3000 | xargs kill -9
```

### Dependency Installation Issues

```bash
# Clear bun cache and reinstall
rm -rf node_modules .bun-cache
bun install

# If bun has issues, fall back to npm
npm install
```

### TypeScript Strict Errors

The project has `"strict": true` in `tsconfig.json`. Common causes:

- **Unused variables**: Remove or prefix with `_`
- **Implicit `any`**: Add explicit type annotations
- **Null checks**: Use optional chaining (`?.`) or nullish coalescing (`??`)
- **Missing module declaration**: Add a `.d.ts` file or install `@types/` package

```bash
# Run type-check only (without full build)
npx tsc --noEmit
```

### Tailwind Class Not Found

Tailwind v4 uses CSS-based configuration via `@theme inline`. If a class isn't working:

1. Check the class is a valid Tailwind utility (v4 syntax — some class names changed from v3)
2. Custom values must be defined in `globals.css` `@theme inline` block
3. Verify the class is not misspelled — Tailwind v4 is stricter about class name matching

### Build Fails with Leaflet Error

Leaflet is a browser-only library. If the build fails on a Leaflet import, ensure the component using it is a Client Component (`"use client"`) and uses dynamic import:

```typescript
const L = await import("leaflet");
```

This is already handled in `MapSection.tsx`.
