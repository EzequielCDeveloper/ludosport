# Tasks: Re-Audit Fixes — Mockup Alignment (Round 2)

## Review Workload Forecast

| Wave | Focus | Est. Lines | Rollback |
|------|-------|------------|----------|
| 1 — Global | CSS, layout, data constants | ~80-120 | Revert commit 1 |
| 2 — Navbar + Hero | Navbar, Hero components | ~100-150 | Revert commit 2 |
| 3 — Secciones | 6 section components | ~120-180 | Revert commit 3 |
| 4 — CTA + Footer + WhatsApp | 3 componentes finales | ~60-100 | Revert commit 4 |
| 5 — Accesibilidad + Responsive | SkipLink, breakpoints | ~40-80 | Revert commit 5 |

Cada wave < 400 líneas. `force-chained` + `stacked-to-main`.

---

## Wave 1 — Global

**T1.1 Navbar solid opacity** — `app/globals.css`
- [x] In `.navbar--solid`, change `rgba(0, 0, 0, 0.95)` → `rgba(0, 0, 0, 0.92)`

**T1.2 Body line-height** — `app/globals.css`
- [x] Add `line-height: 1.65` to the `body` rule

**T1.3 Smooth scroll** — `app/globals.css`
- [x] Add `html { scroll-behavior: smooth }` or use Tailwind `scroll-smooth` class

**T1.4 Remove duplicate starScroll** — `app/globals.css`
- [x] Remove the `@keyframes starScroll` block from globals.css (keep it in `starfield.module.css`)

**T1.5 Add `.visually-hidden` utility** — `app/globals.css`
- [x] Add `.visually-hidden` class with mockup's exact clip values

**T1.6 Add per-rank hover shadow classes** — `app/globals.css`
- [x] Add CSS classes for each rank's hover shadow effect: `.rango-card--blue:hover`, `.rango-card--green:hover`, `.rango-card--yellow:hover`, `.rango-card--purple:hover`, `.rango-card--white:hover`
- [x] Each with color-specific `-5px 0 15px rgba(...)` box-shadow

**T1.7 Add hero animation classes** — `app/globals.css`
- [x] Add `.hero__animation--badge`, `.hero__animation--title`, `.hero__animation--subtitle`, `.hero__animation--ctas`, `.hero__animation--scroll` with specific delays and `animation-fill-mode: both`

**T1.8 Location data fix** — `lib/constants.ts`
- [x] FAQ answer for "¿Dónde están ubicados?": change "Hermosillo, Sonora" → "San Luis Río Colorado, Sonora"
- [x] Verify `ACADEMY.address` already says SLRC

**T1.9 FAQ costos formatting** — `lib/constants.ts`
- [x] Restore `<strong>` tags for "Horarios:" and "Costos:" labels with `<br><br>` separator in the FAQ answer string (currently plain text)
- [x] Update FAQs.tsx to use `dangerouslySetInnerHTML` for answer rendering

**T1.10 Add aria-live region** — `app/layout.tsx`
- [x] Add `<div aria-live="polite" role="status" className="visually-hidden" />` inside `<body>` after `{children}`

**Verify**: `npx tsc --noEmit` y `bun run build`

---

## Wave 2 — Navbar + Hero

**T2.1 Logo rounded** — `app/components/Navbar.tsx`
- [x] Remove `rounded-full` from the logo `<Image>` element

**T2.2 Navbar hover color** — `app/components/NavbarClient.tsx`
- [x] Desktop links: change `hover:text-white` → `hover:text-[var(--color-yellow)]`
- [x] Mobile links: change `hover:text-white` → `hover:text-[var(--color-yellow)]`

**T2.3 Hamburger size** — `app/components/NavbarClient.tsx`
- [x] Change `w-6 h-0.5` → `w-[26px] h-[3px]` on hamburger bars
- [x] Change `gap-1.5` → `gap-[5px]` on hamburger container

**T2.4 Hero animation delays** — `app/components/Hero.tsx`
- [x] Badge: apply `hero__animation--badge` className
- [x] Title h1: apply `hero__animation--title` className
- [x] Subtitle p: apply `hero__animation--subtitle` className
- [x] CTAs div: apply `hero__animation--ctas` className
- [x] Scroll hint: apply `hero__animation--scroll` className
- [x] Remove individual `animate-fade-up`, `animate-fade-down`, `animate-bounce-y` classes (replaced by animation classes)

**T2.5 Hero button hover/active** — `app/components/Hero.tsx`
- [x] Add `hover:scale-[1.05] active:scale-[0.97] transition-all duration-300` to both hero buttons

**T2.6 Hero primary button glow** — `app/components/Hero.tsx`
- [x] Add `shadow-[0_0_10px_rgba(75,213,238,0.2),inset_0_0_5px_rgba(75,213,238,0.1)]` (multi-value with comma for two distinct shadows)
- [x] Add `text-shadow` via inline style: `style={{ textShadow: '0 0 2px rgba(75,213,238,0.5)' }}`
- [x] Add hover shadow: `hover:shadow-[0_0_20px_rgba(75,213,238,0.6),inset_0_0_10px_rgba(75,213,238,0.4)]`

**T2.7 Hero scroll-hint dual animation** — `app/components/Hero.tsx`
- [x] The scroll hint div has `hero__animation--scroll` class, which in globals.css handles both: `fadeUp 0.7s ease-out 0.8s both` (entrance) + `bounceY 2s ease-in-out infinite 1s` (infinite bounce after entrance)

**T2.8 Hero mobile letter-spacing** — `app/components/Hero.tsx` or `globals.css`
- [x] Add media query: `@media (max-width: 767px) { .hero__title { letter-spacing: 0.02em } }`

**T2.9 Hero content padding** — `app/components/Hero.tsx`
- [x] Add `pt-24 pb-16` (6rem top, 4rem bottom) to the hero content container

**Verify**: `npx tsc --noEmit` y `bun run build`

---

## Wave 3 — Secciones

**T3.1 Valores subtitle** — `app/components/Valores.tsx`
- [x] Change `<p>` subtitle: `text-[var(--color-gray-aa)]` → `text-[var(--color-yellow)]`
- [x] Add `uppercase tracking-[0.05em]`

**T3.2 Value card text** — `app/components/ValueCard.tsx`
- [x] Change `<p>` text: `text-[var(--color-gray-aa)]` → `text-[var(--color-gray-light)]`

**T3.3 Profesor title alignment** — `app/components/Profesor.tsx`
- [x] Add `text-left` to the h2 "EL MAESTRO" className

**T3.4 Profesor stagger** — `app/components/Profesor.tsx`
- [x] Add `stagger` class to the image wrapper div

**T3.5 Actividades subtitle** — `app/components/Actividades.tsx`
- [x] Change `<p>` subtitle: `text-[var(--color-gray-aa)]` → `text-[var(--color-yellow)]`
- [x] Add `uppercase tracking-[0.05em]`

**T3.6 Actividades card styling** — `app/components/Actividades.tsx`
- [x] Card bg: `bg-white/5` → `bg-white/[0.015]`
- [x] Card border: `border-white/10` → `border-white/[0.06]`
- [x] Card box-shadow: use inline style `boxShadow` for multi-value shadow with inset highlight
- [x] Card backdrop-filter: `backdrop-blur-sm` → `backdrop-blur-[2px]`
- [x] Keep existing bottom red border

**T3.7 Actividades 1440px+ breakpoint** — `app/components/Actividades.tsx`
- [x] Add responsive class for ≥1440px: `2xl:flex-[0_0_25vw] 2xl:max-w-[380px]`

**T3.8 Actividades arrow SVGs** — `app/components/Actividades.tsx`
- [x] Update SVG paths to match mockup
- [x] Remove `strokeLinecap` and `strokeLinejoin` attributes

**T3.9 Actividades controls padding** — `app/components/Actividades.tsx`
- [x] Change controls padding to `px-[5vw] py-8` (top+bottom 2rem)

**T3.10 Rangos badge font-size** — `app/components/Rangos.tsx`
- [x] Change `text-3xl` → `text-[2.8rem]`

**T3.11 Rangos card padding** — `app/components/Rangos.tsx`
- [x] Change `p-6` → `px-[1.8rem] py-8`

**T3.12 Rangos badge margin** — `app/components/Rangos.tsx`
- [x] Change `mb-3` → `mb-[0.3rem]`

**T3.13 Rangos hover shadows** — `app/components/Rangos.tsx`
- [x] Add `rango-card--${rango.color}` class to each card div
- [x] Green border/text: `var(--color-green)` → `#00c853`
- [x] Purple border/text: `purple-500` → `#9c27b0`

**T3.14 FAQs subtitle** — `app/components/FAQs.tsx`
- [x] Change `<p>` subtitle: `text-[var(--color-gray-aa)]` → `text-[var(--color-yellow)]`
- [x] Add `uppercase tracking-[0.05em]`

**T3.15 FAQs trigger open color** — `app/components/FAQs.tsx`
- [x] Remove the `isOpen ? "text-[var(--color-yellow)]" : ""` conditional from the trigger button className

**Verify**: `npx tsc --noEmit` y `bun run build`

---

## Wave 4 — CTA + Footer + WhatsApp

**T4.1 CTA subtitle** — `app/components/CtaFinal.tsx`
- [x] Change `<p>` description: `text-[var(--color-gray-aa)]` → `text-[var(--color-gray-light)]`

**T4.2 CTA button hover scale** — `app/components/CtaFinal.tsx`
- [x] Add `hover:scale-[1.05] active:scale-[0.97] transition-all duration-300` to the CTA button

**T4.3 CTA button hover inset shadow** — `app/components/CtaFinal.tsx`
- [x] Modify hover shadow: `hover:shadow-[0_0_20px_rgba(75,213,238,0.6)_inset_0_0_10px_rgba(75,213,238,0.4)]`

**T4.4 CTA info cards padding** — `app/components/CtaFinal.tsx`
- [x] Change `p-6` → `p-4` (1rem matching mockup)

**T4.5 Footer logo rounded** — `app/components/Footer.tsx`
- [x] Remove `rounded-full` from the logo `<Image>` element

**T4.6 Footer border colors** — `app/components/Footer.tsx`
- [x] Change outer border: `border-white/10` → `border-[#1a1a1a]`
- [x] Change copyright border: `border-white/10` → `border-[#1a1a1a]`

**T4.7 Footer layout** — `app/components/Footer.tsx`
- [x] Remove `sm:grid-cols-3` from the main grid div, keep single column (grid automatically stacks)
- [x] Change links from vertical list (`space-y-2`) to horizontal flex with `flex-wrap justify-center gap-5` (gap 1.2rem)

**T4.8 WhatsApp box-shadow** — `app/components/WhatsAppFloat.tsx`
- [x] Replace `shadow-lg` with `shadow-[0_4px_16px_rgba(37,211,102,0.4)]`
- [x] Add hover: `hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)]`

**T4.9 WhatsApp desktop position** — `app/components/WhatsAppFloat.tsx`
- [x] Add `md:bottom-8 md:right-8` (2rem at ≥768px)

**Verify**: `npx tsc --noEmit` y `bun run build`

---

## Wave 5 — Accesibilidad + Responsive

**T5.1 Skip link z-index** — `app/components/SkipLink.tsx`
- [x] Change `focus:z-[100]` → `focus:z-[1001]`

**T5.2 Skip link padding** — `app/components/SkipLink.tsx`
- [x] Change `focus:px-4 focus:py-2` → `focus:px-6 focus:py-3` (0.75rem 1.5rem)

**T5.3 Skip link font** — `app/components/SkipLink.tsx`
- [x] Add `focus:font-display focus:text-lg focus:tracking-wide focus:uppercase`

**T5.4 Skip link corners** — `app/components/SkipLink.tsx`
- [x] Remove `focus:rounded` (no rounded corners)

**T5.5 Skip link position** — `app/components/SkipLink.tsx`
- [x] Change `focus:top-4 focus:left-4` → `focus:top-0 focus:left-0`

**T5.6 Add `<389px` responsive overrides** — `app/globals.css`
- [x] Add `@media (max-width: 389px)` block:
  - `.hero__title`: `font-size: 2.2rem`
  - `.hero__ctas`: `flex-direction: column; align-items: center`
  - `.hero__ctas .btn`: `width: 100%; max-width: 280px`
  - (These match mockup's small-screen overrides)

**T5.7 Add 1440px+ carousel breakpoint** — if not already handled in T3.7
- [x] Already handled in T3.7 — `2xl:flex-[0_0_25vw] 2xl:max-w-[380px]` present in Actividades.tsx line 44

**Verify**: `npx tsc --noEmit` y `bun run build`

---

## Runtime Harness

```bash
npx tsc --noEmit  # Type check
bun run build      # Build
bun run lint       # Lint
```

## Rollback Strategy

Cada wave = commit independiente. `git revert <sha>` remueve esa wave. No hay fallos en cascada entre waves.
