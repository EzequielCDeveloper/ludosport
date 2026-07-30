---
last-reviewed: 2026-07-30
---

# Ludo Sport Drake Academy

**Landing page para la academia de esgrima deportiva con sables de madera.**

Ludo Sport Drake Academy es un club de contact sport (esgrima con sables de madera) temático de Star Wars, ubicado en San Luis Río Colorado, Sonora, México. Este sitio es una landing page single-page construida con Next.js y App Router, desplegada en Cloudflare.

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Leaflet | 1.9.4 |
| Package Manager | bun (dev), npm (lockfile) |

## Prerequisites

- **Node.js** LTS (v20 or later)
- **bun** — [Install bun](https://bun.sh/docs/installation)

## Quickstart

```bash
# Clone the repository
git clone <repo-url>
cd ludosport

# Install dependencies
bun install

# Start the development server
bun dev

# Build for production (static export)
bun run build

# Run the linter
bun run lint

# Run unit/integration tests
bun run test
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start the Next.js development server (localhost:3000) |
| `bun run build` | Build the project for production — static export to `out/` |
| `bun start` | Start the production server (requires `bun run build` first) |
| `bun run preview` | Preview the static export locally (`npx serve out/`) |
| `bun run lint` | Run ESLint on the project |
| `bun run test` | Run Vitest unit/integration tests |
| `bun run test:watch` | Run Vitest in watch mode |
| `bun run test:e2e` | Run Playwright E2E tests |
| `bun run deploy` | Deploy to production via Cloudflare proxy |

## Project Structure

```
📁 ludosport/
 ├── 📁 app/
 │   ├── 📁 components/      → 20 UI components + __tests__ + icons
 │   ├── 📁 hooks/            → 4 custom hooks
 │   ├── 📁 styles/           → CSS module (starfield)
 │   ├── 📄 layout.tsx        → Root layout, metadata, JSON-LD
 │   ├── 📄 page.tsx          → Home page (composes all sections)
 │   ├── 📄 error.tsx         → Error boundary page
 │   ├── 📄 not-found.tsx     → 404 page
 │   ├── 📄 loading.tsx       → Loading skeleton
 │   ├── 📄 sitemap.ts        → Dynamic sitemap
 │   ├── 📄 robots.ts         → Robots.txt
 │   └── 📄 globals.css       → Global styles + Tailwind config
 ├── 📁 lib/
 │   ├── 📄 constants.ts        → Single source of truth (all content)
 │   └── 📄 json-ld.ts          → Structured data generator
 ├── 📁 public/
 │   ├── 📁 fonts/            → Self-hosted fonts (Star Jedi woff)
 │   ├── 📁 photos/           → Real activity & professor photos (webp)
 │   ├── 📄 favicon.ico       → LudoSport logo favicon
 │   └── 📄 logo.jpeg         → Academy logo (OG image)
 ├── 📁 deploy/
 │   ├── 📄 deploy.sh         → Cloudflare deployment script
 │   └── 📄 ludosport.nginx.conf → Nginx proxy config
 ├── 📁 tests/
 │   └── 📁 e2e/              → Playwright E2E test specs
 ├── 📁 docs/                 → Project documentation
 ├── 📁 openspec/             → SDD specifications
 ├── 📄 package.json
 ├── 📄 next.config.ts        → Static export config
 ├── 📄 tsconfig.json         → TypeScript strict mode
 ├── 📄 postcss.config.mjs
 └── 📄 eslint.config.mjs
```

## Deployment

The site is deployed on **Cloudflare** via a custom nginx proxy.

- **Live URL**: [https://ludosport.com](https://ludosport.com)
- **Build command**: `bun run build` (output: `out/`)
- **Deploy script**: `bun run deploy` → `deploy/deploy.sh`
- **Nginx config**: `deploy/ludosport.nginx.conf`
- **CI/CD**: GitHub Actions runs type-check, lint, build, and tests on every push

---

Internal architecture and developer guides are available in [`ARCHITECTURE.md`](./ARCHITECTURE.md) and the [`docs/`](./docs/) directory.
