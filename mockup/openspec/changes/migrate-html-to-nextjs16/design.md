# Design: Migrate Static HTML to Next.js 16 App Router

## Technical Approach

Hybrid migration: Server Components by default, five isolated Client leaves owning one concern each via a dedicated React hook. Starfield ported as CSS Module (416-line box-shadow never touched). Layout via Tailwind v4 utilities. Design tokens, keyframes, and `@utility` classes in `globals.css` `@theme inline {}`. Fonts via `next/font/google` — Anton (`--font-display`), Pathway Gothic One (`--font-body`). Six stacked PRs to main.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Server/Client** | Page Server; 6 Client leaves | Zero JS upfront; islands hydrate independently |
| **Starfield** | CSS Module `starfield.module.css` | 416-line box-shadow never touched; Module scopes it |
| **Navbar** | Server shell + Client child | Logo/links static; only toggle + scroll IO needs client |
| **Valores** | Client wrapper + Server `ValueCard` | Observer at grid level; cards pure CSS stagger |
| **Actividades** | Single Client + hook | One ref manages scroll-snap, dots, arrows, keyboard |
| **FAQs** | Single Client + hook | Single-open state via `useState` + map |

## Data Flow

```
Request → layout.tsx (metadata, JSON-LD, fonts, geo tags)
           └→ page.tsx composes → SkipLink → Starfield → Navbar+NavbarClient
                → Hero → Valores+ValueCard×3 → Profesor
                → Actividades → Rangos → FAQs → CtaFinal → Footer → WhatsAppFloat
```
SSR flushes HTML. Client islands hydrate independently. No shared state.

## File Changes

| File | Action | What |
|------|--------|------|
| `app/layout.tsx` | Rewrite | Fonts, metadata, geo tags, JSON-LD |
| `app/page.tsx` | Rewrite | Compose 11 section components |
| `app/globals.css` | Rewrite | `@theme inline`, keyframes, base reset |
| `next.config.ts` | Modify | `headers()`, `remotePatterns` |
| `app/robots.ts` | Create | Allow all |
| `app/sitemap.ts` | Create | Single URL entry |
| `app/components/{SkipLink,Starfield,Hero,ValueCard,Profesor,Rangos,CtaFinal,Footer}.tsx` | Create (8) | Server components — static markup from mockup |
| `app/components/Navbar.tsx` | Create | Server shell (logo + links) |
| `app/components/NavbarClient.tsx` | Create | Client — toggle, scroll solid, IO section tracking |
| `app/components/Valores.tsx` | Create | Client — grid with stagger IO ref |
| `app/components/Actividades.tsx` | Create | Client — carousel + useHorizontalCarousel |
| `app/components/FAQs.tsx` | Create | Client — accordion + useAccordion |
| `app/components/WhatsAppFloat.tsx` | Create | Client — useScrollVisibility |
| `app/styles/starfield.module.css` | Create | Box-shadow positions, starScroll animation |
| `app/hooks/{useScrollNav,useStaggerAnimation,useHorizontalCarousel,useAccordion,useScrollVisibility}.ts` | Create (5) | One concern each, all cleanup on unmount |
| `lib/constants.ts` | Create | Data arrays (links, cards, actividades, FAQs, ranks) |
| `lib/json-ld.ts` | Create | `generateLocalBusiness()` |
| `public/logo.jpeg` | Create | Copy from `mockup/` |

## Interfaces / Contracts

```ts
useScrollNav(): { isSolid: boolean; activeSection: string }
useStaggerAnimation(ref: RefObject<HTMLElement>, threshold?: number): void  // cleanup: unobserve all
useHorizontalCarousel(ref: RefObject<HTMLElement>, n: number):
  { currentIndex: number; scrollTo, next, prev: () => void; isFirst: boolean; isLast: boolean }  // cleanup: remove scroll listener
useAccordion(): { openId: number | null; toggle: (id: number) => void }  // single-open invariant
useScrollVisibility(): { isVisible: boolean }  // cleanup: clearTimeout, remove scroll listener
generateLocalBusiness(): string  // returns <script> tag content
```

## Testing Strategy

| Layer | Approach |
|-------|----------|
| TypeScript | `npx tsc --noEmit` (strict) |
| Lint | `bun run lint` (eslint-config-next) |
| Build | `bun run build` — zero errors |
| Visual | Manual per PR, 8 sections match mockup |
| Interactive | Manual: carousel arrows/dots/keyboard, accordion, navbar toggle/solid, WhatsApp visibility |
| SEO | Inspect `<head>`, view source JSON-LD, browse `/robots.txt`, `/sitemap.xml` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

| PR | Scope | Risk |
|----|-------|------|
| 1 | Config, CSS foundation, lib, logo | Low |
| 2 | layout, page, 9 Server components | Low |
| 3a | Navbar + NavbarClient + hook | Low |
| 3b | Valores + stagger hook | Low |
| 3c | Actividades, FAQs, WhatsAppFloat, 3 hooks | Medium |
| 4 | `next/image` in all components | Low |
| 5 | robots, sitemap, metadata, headers | Low |

Each PR merges independently. Rollback = `git revert <sha>` per PR. `mockup/` preserved as reference.

## Open Questions

None.
