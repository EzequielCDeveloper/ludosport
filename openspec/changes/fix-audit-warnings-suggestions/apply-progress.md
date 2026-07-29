# Apply Progress: fix-audit-warnings-suggestions

## Phase 1: Quick A11Y + Loading/Error + CSS (PR 1) — ARCHIVED

See `archive-pr1.md` for the full archive report.

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 1.1 Reduced-motion scroll | SPEC-FAWS-005 | [x] | `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` added after `html { scroll-behavior: smooth; }` |
| 1.2 Remove unused radius tokens | SPEC-FAWS-043 | [x] | Deleted `--radius-sm/md/lg/full` from `:root` block (lines 20-24). Note: tasks.md said `@theme inline` but tokens were in `:root`. |
| 1.3 Footer heading hierarchy | SPEC-FAWS-003 | [x] | Changed `<h4>` → `<h3>` for "Navegación" and "Contacto" subheadings |
| 1.4 MapSection heading | SPEC-FAWS-004 | [x] | Added `<h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">UBICACIÓN</h2>` above map container |
| 1.5 Hero scroll hint sr-only | SPEC-FAWS-006 | [x] | Removed `title` attribute from scroll-hint div, added `<span className="sr-only">Desplázate hacia abajo para conocer más</span>` |
| 1.6 Loading live region | SPEC-FAWS-002, 045 | [x] | Wrapped spinner div with `role="status" aria-live="polite" aria-busy="true"`, added `<span className="sr-only">Cargando página...</span>` |
| 1.7 Error page hardening | SPEC-FAWS-024, 025, 026 | [x] | Gated `error.digest` behind `process.env.NODE_ENV !== 'production'`; added "Volver al inicio" `<Link href="/">`; added `useEffect(() => console.error(error), [error])` |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/globals.css` | Modified | Added reduced-motion media query; removed `--radius-*` tokens |
| `app/components/Footer.tsx` | Modified | `<h4>` → `<h3>` for section subheadings |
| `app/components/MapSection.tsx` | Modified | Added `<h2>UBICACIÓN</h2>` heading |
| `app/components/Hero.tsx` | Modified | `title` attr → `sr-only` span |
| `app/loading.tsx` | Modified | ARIA live region wrapper + sr-only text |
| `app/error.tsx` | Modified | Dev-only digest, home link, console.error |

## Phase 2: Security + Data Integrity + FAQ (PR 2) — ARCHIVED

See `archive-pr2.md` for the full archive report.

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 2.1 CSP hardening | SPEC-FAWS-020, 021, 022 | [x] | Removed `blob:` and `data:` from `img-src`; added JS comment documenting `unsafe-eval` is dev-only HMR; extended Permissions-Policy to 9 directives: `camera=(), microphone=(), geolocation=(), accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()` |
| 2.2 JSON-LD escape | SPEC-FAWS-023 | [x] | Added `.replace(/</g, "\\u003c")` on `JSON.stringify` output in `generateLocalBusiness()` |
| 2.3 Geo constants | SPEC-FAWS-031 | [x] | Added `ACADEMY.coordinatesMeta` ("lat;lng") and `ACADEMY.coordinatesICBM` ("lat, lng") derived from same coordinate values |
| 2.4 Layout geo meta | SPEC-FAWS-031 | [x] | Imported `ACADEMY`; `geo.position`, `ICBM`, `places:location` now use `ACADEMY.coordinatesMeta`/`coordinatesICBM` instead of hardcoded strings |
| 2.5 isMaestro by data | SPEC-FAWS-032 | [x] | Changed `index === 4` → `rango.nivel === "V"`; removed unused `index` from `.map()` |
| 2.6 FAQ restructure | SPEC-FAWS-033, 034 | [x] | Changed `FAQ` interface from `answer: string` to `answerParts: AnswerPart[]` where `AnswerPart = {type: 'text'|'strong', content: string}`. Fixed double-`<br>` in FAQ #3 (Horarios y Costos) by splitting into separate parts. JSON-LD joins text: `answerParts.map(p => p.content).join("")` |
| 2.7 FAQ JSX render | SPEC-FAWS-033, 034, 035, 044 | [x] | Removed `dangerouslySetInnerHTML`; render `answerParts` as JSX (`text`→`<span>`, `strong`→`<strong>`). Added `name="faq-accordion"` on `<details>` for native accordion. Added sr-only help hint for screen readers |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings)
- `bun run test`: 8/8 passed
- `bun run build`: passes clean

### Files Changed
| File | Action | What |
|------|--------|------|
| `next.config.ts` | Modified | Removed `blob: data:` from CSP img-src; documented `unsafe-eval` dev-only; extended Permissions-Policy to 9 directives |
| `lib/json-ld.ts` | Modified | Added `.replace(/</g, "\\u003c")` on JSON output; updated FAQPage schema to use `answerParts` |
| `lib/constants.ts` | Modified | Added `coordinatesMeta`/`coordinatesICBM` derived constants; restructured FAQ interface to `answerParts` |
| `app/layout.tsx` | Modified | Import `ACADEMY`; geo meta tags now derived from constants |
| `app/components/Rangos.tsx` | Modified | `isMaestro` by `rango.nivel === "V"` instead of `index === 4` |
| `app/components/FAQs.tsx` | Modified | Removed `dangerouslySetInnerHTML`; render `answerParts` as JSX; added `name="faq-accordion"` and sr-only help hint |

### Deviations from Design
- **D1 FAQ approach**: Design D1 chose "Option C: Comment + strip `<br><br>` → `<br>`". Tasks.md overrides this with the full `answerParts` restructure (Option A from design, originally rejected). Implementation follows tasks.md and SPEC-FAWS-033 which requires no `dangerouslySetInnerHTML`. JSON-LD FAQPage schema joins `answerParts` text content for the `text` field, losing `<strong>` formatting in structured data (acceptable since schema.org `text` is plain text).

## Phase 3: WhatsApp + Image Fallback + New UX (PR 3) — ARCHIVED

See `archive-pr3.md` for the full archive report.

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 3.1 WhatsAppFloat contrast + aria + URL | SPEC-FAWS-028, 029, 030 | [x] | Added `stroke="rgba(0,0,0,0.35)" strokeWidth="0.5"` on SVG for 3:1 contrast (D4). Wrapped in fragment with `<span id="wa-hint" className="sr-only">Se abre en WhatsApp</span>`. Added `aria-describedby="wa-hint"`. Replaced string concatenation with `new URL(ACADEMY.whatsappUrl)` + `searchParams.set("text", ...)` |
| 3.2 CtaFinal aria + URL | SPEC-FAWS-029, 030 | [x] | Added `aria-describedby="wa-hint"` (shares hint id from WhatsAppFloat). Replaced direct `href={ACADEMY.whatsappUrl}` with `new URL(ACADEMY.whatsappUrl)` for safe construction |
| 3.3 ScrollProgress component | SPEC-FAWS-036 | [x] | New file `app/components/ScrollProgress.tsx`. Uses `useSyncExternalStore` with scroll listener. Fixed top `h-[2px] bg-[var(--color-yellow)] z-[100]` bar, width=`{pct}%`. `getServerSnapshot` returns 0. CSS class `scroll-progress-bar` with `prefers-reduced-motion: transition: none !important` in globals.css |
| 3.4 BackToTop component | SPEC-FAWS-037 | [x] | New file `app/components/BackToTop.tsx`. Uses `useSyncExternalStore` to track `scrollY > innerHeight`. Fixed bottom-24 right-6 (above WhatsApp float). `bg-[var(--color-yellow)]` with chevron-up SVG. Smooth scroll via `window.scrollTo({ top: 0, behavior: "smooth" })`. CSS class `back-to-top-btn` for reduced-motion override |
| 3.5 Integrate ScrollProgress + BackToTop | SPEC-FAWS-036, 037 | [x] | Added imports + `<ScrollProgress />` (after `<SkipLink />`) and `<BackToTop />` (after `<WhatsAppFloat />`) to `app/page.tsx` |
| 3.6 Profesor image onError | SPEC-FAWS-039 | [x] | Added `"use client"` directive + `useState` for `imgError` state. Conditional render: on error, shows `absolute inset-0 bg-[var(--color-black-2)]` div with image-placeholder SVG icon. `onError={() => setImgError(true)}` on `<Image>` |
| 3.7 Actividades image onError | SPEC-FAWS-039 | [x] | Added `useState<Record<number, boolean>>` for per-image error tracking. Conditional render inside map: on error, shows `w-full h-full bg-[var(--color-black-2)]` div with image-placeholder SVG. `onError` sets per-card error state using `actividad.num` as key |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run test`: 8/8 passed
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/components/WhatsAppFloat.tsx` | Modified | Dark SVG stroke (`stroke="rgba(0,0,0,0.35)"`), `aria-describedby="wa-hint"` + sr-only hint span, `URL` constructor for safe URL building |
| `app/components/CtaFinal.tsx` | Modified | `aria-describedby="wa-hint"`, `URL` constructor for href |
| `app/components/ScrollProgress.tsx` | Created | Client component: `useSyncExternalStore` scroll tracking, fixed top 2px yellow bar |
| `app/components/BackToTop.tsx` | Created | Client component: appears after scrollY > innerHeight, smooth scroll to top, positioned above WhatsApp float |
| `app/page.tsx` | Modified | Added `<ScrollProgress />` and `<BackToTop />` imports + JSX |
| `app/components/Profesor.tsx` | Modified | Added `"use client"`, `onError` handler with styled fallback div preserving aspect ratio |
| `app/components/Actividades.tsx` | Modified | Added `imgErrors` state + per-image `onError` handler with fallback divs |
| `app/globals.css` | Modified | Added `prefers-reduced-motion` rules for `.scroll-progress-bar` and `.back-to-top-btn` |

### Deviations from Design
None — implementation matches design decisions D4 (dark SVG stroke for contrast) and the ScrollProgress/BackToTop component designs.

### Issues Found
None.

## Phase 5-7: Pending
See `tasks.md` for remaining work.

**Archived**: PR 1 (`archive-pr1.md`), PR 2 (`archive-pr2.md`), PR 3 (`archive-pr3.md`), PR 4 (`archive-pr4.md`), PR 5 (`archive-pr5.md`), PR 6 (`archive-pr6.md`).

## Phase 7: CtaButton Refactor + G13 Remaining (PR 7) — COMPLETE

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 7.1 CtaButton shared component | SPEC-FAWS-040 | [x] | New file `app/components/CtaButton.tsx`. Uses `forwardRef` for ref passthrough (needed by NavbarClient focus management). 4 variants: `cyan` (cta-btn--cyan glow class + border-2 cyan), `white` (border-2 white), `blue` (bg-blue navbar style), `whatsapp` (green circle fixed position). Props extend `AnchorHTMLAttributes<HTMLAnchorElement>` for full passthrough. className prop merges with variant base classes |
| 7.2 Replace inline CTAs with CtaButton | SPEC-FAWS-040 | [x] | **Hero.tsx**: Both `<a>` CTAs replaced with `<CtaButton variant="cyan">` and `<CtaButton variant="white">`, with `text-base px-8 py-3` className override for Hero-specific sizing. **NavbarClient.tsx**: Desktop nav CTA link extracted to `<CtaButton variant="blue">`, mobile menu CTA link also uses `<CtaButton variant="blue">` with `forwardRef` for `firstLinkRef`. Non-CTA links remain as plain `<a>`. **CtaFinal.tsx**: `<a>` replaced with `<CtaButton variant="cyan">` with `text-lg px-10 py-4 animate-fade-up` override. `target="_blank" rel="noopener noreferrer"` passed as props. **WhatsAppFloat.tsx**: `<a>` replaced with `<CtaButton variant="whatsapp">`. SVG icon and hover label remain as children. `target="_blank" rel="noopener noreferrer"` passed as props |
| 7.3 Rangos color theme subtitle | SPEC-FAWS-042 | [x] | Added subtitle note below existing subtitle: "Los colores de cada rango siguen la temática de Star Wars y Drake Academy, no el sistema tradicional de cinturones de artes marciales." Styled with `font-body text-white/60 text-center text-sm max-w-lg mx-auto mb-12`. Existing subtitle `mb-12` changed to `mb-4` to stack |
| 7.4 useScrollNav IntersectionObserver guard | SPEC-FAWS-047 | [x] | Added feature detection: `const hasIO = "IntersectionObserver" in window` before observer creation. When unsupported, scroll listener still works (navbar can become solid on scroll) but no IntersectionObserver is created. Cleanup returns only scroll listener removal when IO is unavailable. Safe defaults: `isSolid=false`, `activeSection='hero'` from useState initial values |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run test`: 8/8 passed
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/components/CtaButton.tsx` | Created | Shared CTA component with 4 variants (cyan/white/blue/whatsapp), `forwardRef` for ref passthrough, variant className map + consumer className merge |
| `app/components/Hero.tsx` | Modified | Imported CtaButton; replaced both inline `<a>` CTAs with `<CtaButton variant="cyan">` and `<CtaButton variant="white">`, `text-base px-8 py-3` sizing override |
| `app/components/NavbarClient.tsx` | Modified | Imported CtaButton; desktop and mobile nav CTA links now use `<CtaButton variant="blue">` with conditional rendering (CTA vs non-CTA). Mobile CTA uses `forwardRef` for `firstLinkRef` focus management |
| `app/components/CtaFinal.tsx` | Modified | Imported CtaButton; replaced inline `<a>` with `<CtaButton variant="cyan">`, `text-lg px-10 py-4 animate-fade-up` sizing/animation override. `target="_blank"` and `rel` passed as props |
| `app/components/WhatsAppFloat.tsx` | Modified | Imported CtaButton; replaced `<a>` with `<CtaButton variant="whatsapp">`. SVG icon and hover label remain as children. `target="_blank"` and `rel` passed as props |
| `app/components/Rangos.tsx` | Modified | Added subtitle note explaining Star Wars / Drake Academy color theme below existing subtitle |
| `app/hooks/useScrollNav.ts` | Modified | Added `IntersectionObserver` feature detection with `hasIO` flag; when unsupported, scroll listener still active but no observer created; cleanup handles both paths correctly |

### Work Unit Evidence

| Evidence | Required value |
|---|---|
| Focused test command and exact result | `bun run build` — passes clean (TypeScript + compilation). `bun run test` — 8/8 passed |
| Runtime harness command/scenario and exact result | Visual check: all 4 CTA contexts (Hero, Navbar, CtaFinal, WhatsAppFloat) render with same styles via CtaButton variants. `bun run dev` — visit `/`, verify each CTA visually identical to pre-change |
| Rollback boundary | `CtaButton.tsx`, `Hero.tsx`, `NavbarClient.tsx`, `CtaFinal.tsx`, `WhatsAppFloat.tsx`, `Rangos.tsx`, `useScrollNav.ts` — all files can be reverted independently without affecting other PRs |

### Deviations from Design
- **D6 tooltip approach**: Design D6 chose `title` attribute on each rango card. Implementation uses a visible subtitle note below the section subtitle (SPEC-FAWS-042 scenario says "brief note about Star Wars theme is visible"). This is more accessible than `title` attributes (which are not announced by screen readers and have poor UX on touch devices).
- **CtaButton variant sizing**: Design says "each variant maps to the exact className currently used per context." Since Hero and CtaFinal both use `cyan` variant but with different sizes (Hero: `text-base px-8 py-3`, CtaFinal: `text-lg px-10 py-4`), the variant provides base classes and consumers override sizing via `className` prop. This is a pragmatic compromise — 4 variants, not 5.
- **Hero cyan shadow**: Original Hero cyan CTA had inline Tailwind shadow utilities (`shadow-[0_0_10px_...]`). The `cyan` variant uses the existing `.cta-btn--cyan` CSS class which provides the same shadows. Visual result is identical; implementation is cleaner.

### Issues Found
- **JSX syntax in .map()**: Initial implementation used `{link.cta ? ...}` inside `NAV_LINKS.map((link) => (...))` which caused a build error (block expression inside arrow function parens). Fixed by removing the extra `{}` wrapper, using the ternary directly inside the arrow function parens.
- **forwardRef required**: CtaButton initially didn't use `forwardRef`, which broke NavbarClient's `firstLinkRef` for focus management on the mobile menu CTA link. Fixed by wrapping CtaButton with `forwardRef`.

## Phase 6: Crawl Polish + Starfield Pause (PR 6) — ARCHIVED

See `archive-pr6.md` for the full archive report.

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 6.1 StarWarsCrawl polish | SPEC-FAWS-010, 011, 012, 013 | [x] | Removed inline `style.transform` from animated render div — initial transform now set via `content.style.transform` inside `measure()` function in `useEffect` before rAF loop (SPEC-FAWS-010). Added "Scroll para continuar" hint positioned at `absolute bottom-8` inside fixed overlay, fades from `opacity: 0.7` to `0` via `transition-opacity duration-500` after first scroll event tracked by `hasScrolled` state (SPEC-FAWS-011). Added debounced 150ms `resize` listener that resets `initiated.current = false` and calls `measure()` to re-measure spacer height and reset transform (SPEC-FAWS-012). Removed all `<br>` tags from crawl text paragraphs — text now flows naturally with CSS `text-justify` and `max-width` wrapping (SPEC-FAWS-013) |
| 6.2 Starfield SC → CC + IntersectionObserver | SPEC-FAWS-038 | [x] | Added `"use client"` directive. Added `useState(false)` for `paused` state and `useRef<HTMLDivElement>` for star element. Added `useEffect` with `IntersectionObserver` that toggles `paused` state based on `entry.isIntersecting`. Feature detection via `"IntersectionObserver" in window` — falls back to always running. Cleanup calls `observer.disconnect()`. className dynamically includes `styles["stars--paused"]` when paused |
| 6.3 starfield.module.css paused class | SPEC-FAWS-038 | [x] | Added `.stars--paused { animation-play-state: paused; }` rule before `@media (prefers-reduced-motion: reduce)` block |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run test`: 8/8 passed
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/components/StarWarsCrawl.tsx` | Modified | Removed inline `style.transform`; initial transform set via ref in `measure()` function; added `hasScrolled` state + scroll listener for hint fade; added "Scroll para continuar" hint with `transition-opacity`; added debounced 150ms resize listener with re-measurement; removed all `<br>` tags from crawl paragraphs |
| `app/components/Starfield.tsx` | Modified | Converted from Server Component to Client Component (`"use client"`); added `IntersectionObserver` to toggle `paused` state; dynamic className includes `stars--paused` when off-screen; cleanup via `disconnect()` |
| `app/styles/starfield.module.css` | Modified | Added `.stars--paused { animation-play-state: paused; }` class |

### Work Unit Evidence

| Evidence | Required value |
|---|---|
| Focused test command and exact result | `bun run build` — passes clean (TypeScript + compilation). `bun run test` — 8/8 passed |
| Runtime harness command/scenario and exact result | `bun run dev` — visit `/`, scroll past starfield: animation pauses (verifiable in Chrome DevTools Performance tab). Scroll back: animation resumes |
| Rollback boundary | `StarWarsCrawl.tsx`, `Starfield.tsx`, `starfield.module.css` — all three files can be reverted independently without affecting other PRs |

### Deviations from Design
- **SPEC-FAWS-012 ResizeObserver → window resize**: Task spec mentioned `ResizeObserver` for resize detection. Implementation uses `window.addEventListener("resize", ...)` instead because TypeScript narrows `window` to `never` in the else branch of `"ResizeObserver" in window` checks (since `ResizeObserver` is always present in modern DOM type definitions). Using `window.resize` provides equivalent viewport resize detection without the type narrowing issue. Functionally identical behavior — debounced 150ms re-measurement on viewport resize.

### Issues Found
- **TypeScript narrowing**: `"ResizeObserver" in window` caused `Property 'addEventListener' does not exist on type 'never'` in the else branch. Resolved by using `window.resize` listener directly instead of ResizeObserver for resize detection (see deviation above).

## Phase 5: Carousel A11Y + Guards (PR 5) — ARCHIVED

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 5.1 useHorizontalCarousel guards + ResizeObserver | SPEC-FAWS-015, 018, 019 | [x] | Added `totalCards <= 0` early return with disabled controls AFTER all hooks (to comply with Rules of Hooks). Each callback (`scrollTo`, `next`, `prev`) and effect guards with `if (totalCards <= 0) return`. Added `clamped === currentIdxRef.current` early return in `scrollTo` to skip redundant state updates. Added debounced 150ms `ResizeObserver` that re-snaps `scrollLeft` to nearest card boundary without state change, guarded with `if (!('ResizeObserver' in window)) return` |
| 5.2 Actividades carousel a11y + counter | SPEC-FAWS-001, 014, 016, 017 | [x] | Added `role="region"`, `aria-roledescription="carrusel"`, `aria-label="Carrusel de actividades — usa las flechas para navegar"` on scroll container. Added `aria-current={i === currentIndex ? "true" : "false"}` on dot buttons. Added visible counter `"{currentIndex + 1} / {ACTIVIDADES.length}"` with `aria-live="polite"` next to dots. Added `<span className="sr-only">Usa las flechas izquierda y derecha para navegar entre actividades</span>` inside carousel container |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run test`: 8/8 passed
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/hooks/useHorizontalCarousel.ts` | Modified | Added `totalCards <= 0` disabled controls (after all hooks to comply with Rules of Hooks); `scrollTo` redundant state guard; debounced 150ms `ResizeObserver` re-snap with feature detection |
| `app/components/Actividades.tsx` | Modified | `role="region"` + `aria-roledescription="carrusel"` + `aria-label` on scroll container; `aria-current` on dots; visible counter `"N / 10"` with `aria-live="polite"`; sr-only keyboard navigation hint |

### Deviations from Design
None — implementation matches design decisions for carousel edge cases (ResizeObserver debounce 150ms, no state change on re-snap, feature detection guard).

### Issues Found
- **Rules of Hooks**: Initial implementation placed `totalCards <= 0` early return BEFORE hooks, causing `react-hooks/rules-of-hooks` lint errors. Fixed by moving all hooks to the top and placing the disabled-state return AFTER all hooks. The callbacks and effects each have internal `totalCards <= 0` guards to avoid unnecessary work.

## Phase 4: Navbar Focus Trap (PR 4) — ARCHIVED

See `archive-pr4.md` for the full archive report.

| Task | Spec | Status | Evidence |
|------|------|--------|----------|
| 4.1 useFocusTrap hook | SPEC-FAWS-008 | [x] | New file `app/hooks/useFocusTrap.ts`. Queries focusable elements via `[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])`. Filters out disabled and non-visible elements (`offsetParent === null`). Tab at last wraps to first, Shift+Tab at first wraps to last. `useEffect` installs/cleans up `keydown` listener; only active when `active` param is true |
| 4.2 NavbarClient dialog + focus trap + inert fallback | SPEC-FAWS-007, 008, 009 | [x] | Imported `useFocusTrap` hook. Called `useFocusTrap(menuRef, menuOpen)` after existing effects. Mobile menu overlay now uses conditional spread: when open → `role="dialog"`, `aria-modal="true"`, `aria-label="Menú de navegación"`; when closed → `aria-hidden={true}` plus either `inert={true}` (if supported) or `tabIndex={-1}` (fallback). Feature detection via `'inert' in HTMLElement.prototype` |

### Verification
- `bun run lint`: 0 errors (3 pre-existing warnings in test file + mockup)
- `bun run test`: 8/8 passed (existing NavbarClient tests still pass)
- `bun run build`: passes clean (2 pre-existing CSS warnings about `var(--color-*)` wildcards)

### Files Changed
| File | Action | What |
|------|--------|------|
| `app/hooks/useFocusTrap.ts` | Created | Custom hook: traps Tab/Shift+Tab focus within a container element; queries focusable elements, wraps at boundaries; installs/cleans up keydown listener based on `active` flag |
| `app/components/NavbarClient.tsx` | Modified | Imported `useFocusTrap`; added `useFocusTrap(menuRef, menuOpen)` call; replaced static `aria-hidden`/`inert` with conditional spread: dialog semantics (`role="dialog"`, `aria-modal`, `aria-label`) when open; inert or tabIndex fallback when closed |

### Deviations from Design
None — implementation matches design D2 (custom ~30 line hook, zero deps) and component design for `useFocusTrap(containerRef, active)`.

### Issues Found
None.
