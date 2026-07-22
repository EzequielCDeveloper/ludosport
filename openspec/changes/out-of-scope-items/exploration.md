# Exploration: Out-of-Scope Items

**Change Name**: `out-of-scope-items`
**Date**: 2026-07-21
**Explorer**: sdd-explore

---

## 1. Tests — Add Test Infrastructure

### Current State

Zero test infrastructure. No test runner, no test files, no test configuration. The `package.json` scripts only include `dev`, `build`, `start`, and `lint`. No test dependencies are installed.

### Affected Files

- `package.json` — needs dev dependencies + test script
- Project root — needs `vitest.config.mts` config file
- New test files for key components

### Options

#### Option A: Vitest (Recommended — Next.js 16 official recommendation)

This is what Next.js 16 docs officially recommend for unit testing. Vitest is faster than Jest, shares Vite config patterns, and has first-class TypeScript support.

- **Dependencies to install**:
  ```
  npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
  ```
- **Config**: Single `vitest.config.mts` file (~10 lines)
- **Test format**: Standard test files alongside components or in `__tests__/`
- **Coverage**: Built-in via `vitest --coverage` (uses c8/istanbul)

#### Option B: Jest

The legacy option. Works but needs more config (`jest.config.ts`, `jest-environment-jsdom`, custom transform for TypeScript). Slower than Vitest.

#### Option C: Playwright (E2E only)

Would add E2E tests but doesn't replace unit tests. Higher setup cost, slower feedback loop.

### What to Test First

Priority order based on complexity and value:

1. **NavbarClient.tsx** — Most complex client component
   - States: menu open/closed, desktop vs mobile, scroll state
   - Interactions: hamburger click, Escape key, backdrop click, link click closes menu
   - Focus management: focus moves to first link when menu opens, returns to hamburger on close
   - Keyboard navigation

2. **FAQs.tsx** — Simple but good for a first test
   - `<details>` `<summary>` pattern
   - Toggle behavior, accessibility attributes

3. **Actividades.tsx** — Carousel with navigation
   - Arrow key navigation, dot indicators, disabled states
   - `useHorizontalCarousel` hook

4. **MapSection.tsx** — Leaflet lazy loading
   - Async import, spinner rendering, map initialization
   - Cleanup on unmount

5. **StarWarsCrawl.tsx** — Complex scroll-driven animation
   - AnimationFrame-based rendering, opacity lerp, transform updates
   - Hardest to test — may need mocking of `getBoundingClientRect`

### Recommended Approach

**Option A: Vitest + React Testing Library**

Minimal setup, officially recommended by Next.js 16, great DX with TypeScript.

### Effort Estimate

| Sub-task | Effort |
|----------|--------|
| Install deps + config vitest.config.mts | 30 min |
| First test (FAQs or simple component) | 30 min |
| NavbarClient comprehensive tests | 2-3 hours |
| Actividades carousel tests | 1-2 hours |
| MapSection Leaflet tests | 1-2 hours |
| **Total** | **Medium (4-8 hours)** |

---

## 2. CI/CD Pipeline

### Current State

No `.github/` directory exists. No CI/CD pipeline at all. No `netlify.toml` in project root. Deployment is manual from local via Netlify dashboard.

### Package Scripts Available

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

No test or type-check scripts exist.

### Options

#### Option A: GitHub Actions + Netlify Deploy

**Pros**: Free for public repos, full control, standard in the ecosystem.
**Cons**: Requires managing secrets, slightly more setup.

Minimal workflow:

```yaml
name: CI
on: [pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - run: npm ci
      - run: npx tsc --noEmit    # type-check
      - run: npm run lint          # lint
      - run: npm run build         # build
```

For Netlify deploy, add a deploy job or use Netlify's GitHub integration (dashboard-based, no workflow needed).

#### Option B: Netlify-only (no GitHub Actions)

Use Netlify's built-in GitHub integration — auto-deploys from `main` branch. Configure via `netlify.toml` or Netlify dashboard.

**Pros**: Less YAML, simpler.
**Cons**: No PR-level quality gates (lint/type-check before deploy).

#### Option C: Netlify + GitHub Actions quality gates

Hybrid: GitHub Actions runs lint + type-check on every PR (blocking), Netlify handles deploy from `main`.

**Pros**: Best of both worlds — fast quality feedback on PRs, simple deploy.
**Cons**: Two systems to maintain.

### Recommended Approach

**Option C**: GitHub Actions quality gates (lint + type-check + build) on every PR, and Netlify auto-deploy from `main` via Netlify's native GitHub integration.

Add a `type-check` script to `package.json`:
```json
"type-check": "tsc --noEmit"
```

### Netlify Deploy Settings

Current domain: `fluffy-lamington-27c3ae.netlify.app`

No `netlify.toml` currently exists. For Next.js 16 on Netlify, the recommended approach is the `@netlify/plugin-nextjs` plugin (auto-detected by Netlify). A minimal `netlify.toml` could be added for explicit config:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Effort Estimate

| Sub-task | Effort |
|----------|--------|
| GitHub Actions workflow for PR quality | 1-2 hours |
| Netlify GitHub integration setup | 30 min |
| Add type-check script + verify | 15 min |
| **Total** | **Low (1-2 hours)** |

---

## 3. Placeholder Images

### Current State

3 unique image files in `public/placeholders/`:
- `kids-training.jpg`
- `kid-learning-with-teacher.jpg`
- `kid-tired.jpg`

**Distribution across 10 activities** (from `lib/constants.ts`):

| Image | Activities |
|-------|-----------|
| `kids-training.jpg` | 1, 5, 9 |
| `kid-learning-with-teacher.jpg` | 2, 4, 7, 10 |
| `kid-tired.jpg` | 3, 6, 8 |

Additionally, `Profesor.tsx` also uses `kid-learning-with-teacher.jpg` as the instructor image.

### Affected Files

- `public/placeholders/` — 7 new images needed (to make all 10 activities + 1 profesor unique)
- `lib/constants.ts` — update `image` paths in `ACTIVIDADES` array (10 entries)
- `app/components/Profesor.tsx` — update instructor image path

### Options

#### Option A: Royalty-Free Stock Photos

Unsplash, Pexels, Pixabay — search for "kids training", "martial arts", "saber fencing", "sports coaching".

- **Pros**: Free, high quality, real photography
- **Cons**: Limited relevance to LudoSport specifically, may need attribution (check license)

#### Option B: AI-Generated Placeholders

DALL-E, Midjourney, or Leonardo.ai — generate custom LudoSport-themed images.

- **Pros**: Tailored to the content (kids with light sabers), consistent aesthetic
- **Cons**: Cost (credits/subscription), quality variability, some platforms restrict "saber/lightsaber" prompts

#### Option C: Commission Photography

Hire a local photographer for a shoot at the actual academy.

- **Pros**: Real students, real location, authentic branding
- **Cons**: $200-$500 cost, scheduling, coordination

#### Option D: Mixed Approach

Use royalty-free stock for generic activities (coordination, teamwork) and commission 2-3 for the most important activities (technical training, combat).

### Recommended Approach

**Option A (Stock Photos)** as immediate fix, with a recommendation to commission real photography in the future when budget allows. For stock photos, curate images that match the activity descriptions closely.

### Image Dimensions

Current images in the carousel use `width={600} height={400}` (3:2 aspect ratio). New images should conform to this ratio to avoid distortion.

### Effort Estimate

| Sub-task | Effort |
|----------|--------|
| Find 10 suitable stock photos + crop to 3:2 | 1 hour |
| Update 10 image paths in constants.ts | 15 min |
| Update Profesor image | 5 min |
| **Total** | **Low (1-2 hours)** |

---

## 4. CSS Extraction — Replace Inline Styles

### Current State

**16 inline `style={{}}` objects** across 8 component files. The task estimated 17 — actual count is 16.

### Count and Classification

#### Dynamic (runtime-computed, must stay inline or use CSS variables)

| # | File | Line | Use | Dynamic? |
|---|------|------|-----|----------|
| 1 | `NavbarClient.tsx` | 103 | `right: menuOpen ? "0" : "-100%"` | ✅ State-dependent |

This is the only truly dynamic style — it controls the mobile menu slide-in animation based on the `menuOpen` state.

#### Static (can migrate to CSS classes or Tailwind utilities)

| # | File | Line | Properties |
|---|------|------|-----------|
| 1 | `Hero.tsx` | 10 | `background` — radial gradients |
| 2 | `Hero.tsx` | 20 | `background` — scanline repeating gradient |
| 3 | `Hero.tsx` | 56 | `textShadow` on CTA link |
| 4 | `Hero.tsx` | 86 | `zIndex`, `background` — bottom fade |
| 5 | `CtaFinal.tsx` | 9 | `background` — radial gradients |
| 6 | `CtaFinal.tsx` | 54 | `boxShadow`, `textShadow` on button |
| 7 | `MapSection.tsx` | 90 | `height`, `width`, `background` on Leaflet container |
| 8 | `Actividades.tsx` | 45 | `boxShadow` on activity card |
| 9 | `ValueCard.tsx` | 15 | `backdropFilter`, `WebkitBackdropFilter`, `boxShadow` |
| 10 | `Rangos.tsx` | 25 | `backdropFilter` (conditional), `boxShadow` (conditional) |
| 11 | `StarWarsCrawl.tsx` | 100 | `transform`, `opacity` — initial state |
| 12 | `StarWarsCrawl.tsx` | 104 | `position`, `inset`, `zIndex` — passed to Starfield |
| 13 | `StarWarsCrawl.tsx` | 110 | `height`, `background` — top fade gradient |
| 14 | `StarWarsCrawl.tsx` | 122 | `transformOrigin`, `willChange` — text content |
| 15 | `Starfield.tsx` | 10 | Passthrough of `style` prop (relies on consumer to set) |

**Total**: 15 static, 1 dynamic

#### Static Style Patterns

Most static inline styles fall into 3 categories:

1. **Gradients/backgrounds** (Hero, CtaFinal, StarWarsCrawl): Complex CSS gradients that are hard to express in Tailwind utility classes. These could become CSS classes alongside the component or in a shared CSS file.

2. **backdropFilter** (ValueCard, Rangos): Tailwind v4 supports `backdrop-blur-[2px]` — can be migrated directly.

3. **boxShadow** (ValueCard, Actividades, Rangos, CtaFinal): Tailwind v4 supports `shadow-[custom]` — can be migrated directly.

### Options

#### Option A: Convert to Tailwind v4 arbitrary values

Replace static inline styles with Tailwind arbitrary value classes:
- `backdropFilter: "blur(2px)"` → `backdrop-blur-[2px]`
- `boxShadow: "0 8px 32px rgba(0,0,0,0.5)"` → `shadow-[0_8px_32px_rgba(0,0,0,0.5)]`
- `textShadow: "0 0 2px ..."` → Tailwind v4 doesn't have textShadow utility → custom CSS class

**Pros**: No new files, stays in component, consistent with existing pattern.
**Cons**: Complex gradients remain ugly long strings in class names; textShadow needs custom CSS.

#### Option B: Extract to component-level CSS modules

Create `.module.css` files for components that have complex inline styles (Hero, CtaFinal, StarWarsCrawl, ValueCard).

**Pros**: Clean separation, proper CSS for complex gradients, better readability.
**Cons**: 4+ new CSS module files, context switching.

#### Option C: Hybrid — Tailwind for simple, CSS modules for complex

Use Tailwind arbitrary values for backdropFilter, boxShadow, zIndex, height/width. Use CSS modules or component CSS for complex gradients and textShadow.

**Pros**: Best fit per use case.
**Cons**: Two approaches to maintain.

### Recommended Approach

**Option C (Hybrid)**:

- **Tailwind arbitrary values** for: boxShadow, backdropFilter, zIndex, height, width, willChange, transformOrigin
- **Custom CSS** (inline `<style>` or CSS module) for: complex gradients (Hero scanlines, Hero fade, CtaFinal gradients, StarWarsCrawl fade gradients) and textShadow (not supported by Tailwind v4 utilities)
- **Keep inline** the 1 dynamic style (NavbarClient `right`)

### Effort Estimate

| Sub-task | Effort |
|----------|--------|
| Convert 6-8 boxShadow/backdropFilter to Tailwind | 30 min |
| Convert 5 complex gradients to CSS classes | 30 min |
| Convert textShadow to CSS class | 15 min |
| Verify no visual regressions | 30 min |
| **Total** | **Low (1-2 hours)** |

---

## 5. Dual Starfield Optimization

### Current State

**Two simultaneous Starfield instances** animate at the same time:

1. **Main Starfield** — rendered in `app/page.tsx` (line 21):
   - CSS default: `position: fixed; inset: 0; z-index: -1`
   - Runs `starScroll` animation (60s linear infinite, translateY -2400px)
   - Always visible behind all page content

2. **Crawl Starfield** — rendered inside `StarWarsCrawl.tsx` (line 104):
   - Overridden style: `{ position: "absolute", inset: 0, zIndex: 0 }`
   - Runs the same `starScroll` animation (both get the animation from the CSS module)
   - Visible only when the crawl overlay is visible (fixed overlay, z-index: 40)
   - Inside a fixed overlay with black background

**Problem**: Both starfields animate independently, meaning two sets of CSS pseudo-elements (240+ star dots, 100+ medium stars, 30 large stars) animate in parallel — unnecessary rendering work.

### Affected Files

- `app/page.tsx` — renders `<Starfield />`
- `app/components/StarWarsCrawl.tsx` — renders second `<Starfield />`
- `app/styles/starfield.module.css` — the animation definition

### Options

#### Option A: Conditional Hide Main Starfield During Crawl

Use IntersectionObserver or scroll position to toggle opacity of the main starfield when the crawl section is in view.

**Pros**: No duplicate rendering during crawl.
**Cons**: Requires JS logic, adds complexity.

#### Option B: Z-Index Only (No Change)

The main starfield has `z-index: -1`, the crawl has a black backdrop. Both are visible but the black backdrop of the crawl covers the main starfield. The crawl's own starfield renders on top of the black background.

**Pros**: No changes needed — it already works visually.
**Cons**: 2x rendering for no visual benefit during most of the page scroll.

#### Option C: Single Starfield with Higher z-index, Remove Second

Remove the Starfield from StarWarsCrawl, keep only the main one. Give the main starfield a higher z-index and add a black background during the crawl section via a separate overlay element.

**Pros**: Single animation, less rendering.
**Cons**: Restructuring the crawl to not depend on its own starfield.

#### Option D: CSS-Only — Stop Main Animation During Crawl

Use `animation-play-state: paused` on the main starfield via a CSS class toggle when the crawl is visible.

**Pros**: Simple, minimal JS.
**Cons**: Still need scroll observation to toggle.

### Recommended Approach

**Option B (No Change)** for now — the visual result is correct and the performance impact of CSS box-shadow animations is negligible (GPU-composited). The main starfield behind the black crawl backdrop is invisible anyway.

If optimization is desired, **Option D** is the simplest: stop the main starfield animation during crawl using a CSS `animation-play-state` toggle.

### Effort Estimate

| Approach | Effort |
|----------|--------|
| Option B — No change | None |
| Option D — CSS animation toggle | Low (1 hour) |

---

## 6. ESLint Config Audit

### Current State

Config file: `eslint.config.mjs`

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### Findings

#### Flat Config Pattern
✅ Uses the correct ESLint 9 flat config format with `defineConfig()` from `eslint/config`.

#### eslint-config-next Subpath Imports
✅ `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` are valid exports in eslint-config-next 16.2.10.

#### ESLint Version
✅ ESLint ^9 matches the peer dependency requirement of eslint-config-next 16.2.10 (requires `eslint >= 9.0.0`).

#### `next lint` Removal
✅ The project uses `"lint": "eslint"` in package.json scripts, which aligns with Next.js 16 removing the `next lint` command. This is correct.

#### No Issues Found
The ESLint configuration is up-to-date and correct for the stack version.

### Potential Improvements (Optional)

1. **Tailwind CSS ESLint plugin**: Add `eslint-plugin-tailwindcss` to catch class ordering issues and duplicate classes.
2. **React Hooks exhaustive-deps**: The `eslint-config-next/typescript` preset already includes `eslint-plugin-react-hooks` (v7.0.0) — verify the `exhaustive-deps` rule is enabled.
3. **Glob patterns**: Consider ignoring `public/placeholders/` if linting image metadata files.

### Effort for Improvements

| Improvement | Effort |
|-------------|--------|
| None needed — current config is correct | 0 |
| Optional tailwindcss plugin | Low (15 min) |

---

## Summary Table

| Area | Current State | Recommended | Effort |
|------|---------------|-------------|--------|
| 1. Tests | Zero infrastructure | Vitest + RTL | Medium (4-8h) |
| 2. CI/CD | No .github/, no pipeline | GitHub Actions quality gates + Netlify auto-deploy | Low (1-2h) |
| 3. Placeholder Images | 3 images for 11 uses | Stock photos (Unsplash/Pexels) | Low (1-2h) |
| 4. CSS Extraction | 16 inline styles (15 static) | Hybrid — Tailwind + minimal CSS classes | Low (1-2h) |
| 5. Dual Starfield | 2 instances animate in parallel | No change (works correctly) | None |
| 6. ESLint Config | Next.js 16 flat config, correct | No changes needed | None |

### Total Effort (Rough Order)
- **6-14 hours total** across all areas
- ~75% of that is Test infrastructure
- CI/CD, Placeholder Images, and CSS Extraction are quick wins (1-2 hours each)

### Risks

1. **Vitest + Next.js 16 compatibility**: While officially recommended, the exact plugin versions need to be compatible with Next.js 16's build pipeline. Minor risk of version mismatch — verify at install time.
2. **Stock photo licensing**: Must verify attribution requirements for each image. Some free stock photos require attribution which may not fit the clean footer design.
3. **CSS extraction visual regressions**: Moving 15 inline styles to CSS/Tailwind requires visual review on all viewports.
4. **ESLint**: No risks — config is correct. Future ESLint v10 changes (ESLint 10 is in development) may eventually require changes, but not during this project.
