# Spec: Re-Audit Fixes — Mockup Alignment (Round 2)

## Global Styles

### G-COLOR-01 — Section Subtitle Color
- **Priority**: MUST
- **Spec**: Section subtitles (`section__subtitle`) SHALL be `color: var(--sw-yellow)` (#ffe81f).
- **Rationale**: Mockup `.section__subtitle` uses `color: var(--yellow)` (#ffe81f). Currently gray.
- **Affects**: `Valores.tsx`, `Actividades.tsx`, `Rangos.tsx`, `FAQs.tsx`, `CtaFinal.tsx`

### G-FORMAT-01 — Section Subtitle Format
- **Priority**: MUST
- **Spec**: Section subtitles SHALL have `text-transform: uppercase` and `letter-spacing: 0.05em`.
- **Rationale**: Mockup `.section__subtitle` uses `text-transform: uppercase` and `letter-spacing: 0.05em`.

### G-PADDING-01 — Section Padding
- **Priority**: SHOULD
- **Spec**: Section padding SHALL be `5rem` (80px) top and bottom.
- **Rationale**: Mockup `section { padding: 5rem 0 }`. Currently `py-24` (6rem = 96px).
- **Affects**: All section components: `Valores`, `Profesor`, `Actividades`, `Rangos`, `FAQs`, `CtaFinal`

### G-CONTAINER-01 — Container Width
- **Priority**: SHOULD
- **Spec**: Container SHALL approximate `min(90vw, 1200px)`.
- **Rationale**: Mockup `--container: min(90vw, 1200px)`. Currently Tailwind `container` with breakpoint max-widths. Evaluate if visual difference matters.

### G-LINEHEIGHT-01 — Body Line-Height
- **Priority**: SHOULD
- **Spec**: Body SHALL have `line-height: 1.65`.
- **Rationale**: Mockup `body { line-height: 1.65 }`.

### G-ANCHOR-01 — Smooth Scroll
- **Priority**: SHOULD
- **Spec**: `html` SHALL have `scroll-behavior: smooth`.
- **Rationale**: Mockup `html { scroll-behavior: smooth }`.

### G-STAR-01 — Duplicate Keyframe
- **Priority**: SHOULD
- **Spec**: The `starScroll` keyframe SHALL be defined in only ONE place (the CSS module `starfield.module.css`), not duplicated in `globals.css`.
- **Rationale**: Currently defined in both `globals.css` and `starfield.module.css`.

### G-OPACITY-01 — Navbar Solid Opacity
- **Priority**: MUST
- **Spec**: The navbar solid background SHALL be `rgba(0, 0, 0, 0.92)`.
- **Rationale**: Mockup `.navbar--solid` uses `background: rgba(0, 0, 0, 0.92)`. Currently 0.95.
- **Affects**: `app/globals.css` `.navbar--solid` rule

## Navbar

### NAV-HOVER-01 — Link Hover Color
- **Priority**: MUST
- **Spec**: Navbar link hover color SHALL be `var(--yellow)` (#ffe81f).
- **Rationale**: Mockup `.navbar__link:hover` uses `color: var(--yellow)`. Currently white.
- **Affects**: `NavbarClient.tsx`

### NAV-LOGO-01 — Logo Border Radius
- **Priority**: MUST
- **Spec**: Navbar logo image SHALL NOT have `rounded-full`.
- **Rationale**: Mockup logo is square. Currently `rounded-full`.
- **Affects**: `Navbar.tsx` and `Footer.tsx`

### NAV-HAMBURGER-01 — Bar Size
- **Priority**: SHOULD
- **Spec**: Hamburger bars SHALL be `26px wide × 3px tall` with `5px gap`.
- **Rationale**: Mockup `.navbar__toggle-bar` uses `width: 26px; height: 3px` and `gap: 5px`. Currently `w-6 h-0.5` (24px × 2px) and `gap-1.5` (6px).
- **Affects**: `NavbarClient.tsx`

## Hero

### HERO-ANIM-01 — Entrance Animation Delays
- **Priority**: MUST
- **Spec**: Hero child animations SHALL use specific delays and `animation-fill-mode: both`:
  - Badge: `fadeDown 0.6s ease-out 0.2s both`
  - Title: `fadeUp 0.7s ease-out 0.3s both`
  - Subtitle: `fadeUp 0.7s ease-out 0.45s both`
  - CTAs: `fadeUp 0.7s ease-out 0.6s both`
  - Scroll-hint: `fadeUp 0.7s ease-out 0.8s both` + `bounceY 2s ease-in-out infinite 1s`
- **Rationale**: Mockup defines these exact delays and fill-modes. Currently animations have no delay and no `both`.

### HERO-BTN-01 — Hover/Active States
- **Priority**: MUST
- **Spec**: All hero buttons SHALL:
  - Hover: `transform: scale(1.05)`
  - Active: `transform: scale(0.97)`
  - Transition: `transform, background, color` all `0.3s ease-out`
- **Rationale**: Mockup `.btn:hover` and `.btn:active` states.

### HERO-BTN-02 — Primary Button Glow
- **Priority**: MUST
- **Spec**: The cyan primary button SHALL have:
  - `box-shadow: 0 0 10px rgba(75,213,238,0.2), inset 0 0 5px rgba(75,213,238,0.1)`
  - `text-shadow: 0 0 2px rgba(75,213,238,0.5)`
  - Hover: `box-shadow: 0 0 20px rgba(75,213,238,0.6), inset 0 0 10px rgba(75,213,238,0.4)`
- **Rationale**: Mockup `.btn--primary` and `.btn--primary:hover` shadow values.
- **Note**: Currently only outer shadow is set. Missing inset shadow and text-shadow.

### HERO-SCROLL-01 — Scroll Hint Animation
- **Priority**: MUST
- **Spec**: The scroll hint SHALL have both an entrance animation AND a looping bounce:
  - Entrance: `fadeUp 0.7s ease-out 0.8s both`
  - Infinite: `bounceY 2s ease-in-out infinite 1s`
- **Rationale**: Mockup uses two comma-separated animations on the same element.

### HERO-TITLE-01 — Mobile Letter-Spacing
- **Priority**: SHOULD
- **Spec**: At ≤767px, hero title SHALL use `letter-spacing: 0.02em`.
- **Rationale**: Mockup media query.

### HERO-SMALL-01 — `<389px` Breakpoint
- **Priority**: SHOULD
- **Spec**: At ≤389px:
  - Hero title: `font-size: 2.2rem`
  - Hero CTAs: `flex-direction: column; align-items: center`
  - Buttons: `width: 100%; max-width: 280px`
- **Rationale**: Mockup media query `@media (max-width: 389px)`.

### HERO-CONTENT-01 — Content Padding
- **Priority**: SHOULD
- **Spec**: Hero content SHALL have `padding: 6rem 0 4rem`.
- **Rationale**: Mockup `.hero__content` uses `padding: 6rem 0 4rem`.

## Valores

### VAL-COLOR-01 — Card Text Color
- **Priority**: SHOULD
- **Spec**: Card paragraph text SHALL be `color: var(--gray-light)` (#ccc).
- **Rationale**: Mockup `.valor-card__text` uses `var(--gray-light)`. Currently `--color-gray-aa` (#aaa).
- **Affects**: `ValueCard.tsx`

## Profesor

### PROF-TITLE-01 — Section Title Alignment
- **Priority**: MUST
- **Spec**: The Profesor section title ("EL MAESTRO") SHALL be `text-align: left`.
- **Rationale**: Mockup uses `section__title--left` for this section. Currently center-aligned.
- **Affects**: `Profesor.tsx`

### PROF-STAGGER-01 — Image Stagger
- **Priority**: SHOULD
- **Spec**: The profesor image wrapper SHALL have the `stagger` class for entrance animation.
- **Rationale**: Mockup has `stagger` class on the image wrapper. Currently missing.

## Rangos

### RANGO-BADGE-01 — Badge Font Size
- **Priority**: MUST
- **Spec**: Rank badge (I, II, III, IV, V) SHALL be `font-size: 2.8rem`.
- **Rationale**: Mockup `.rango-card__badge` uses `font-size: 2.8rem`. Currently `text-3xl` (1.875rem = 30px).
- **Affects**: `Rangos.tsx`

### RANGO-HOVER-01 — Per-Rank Hover Shadows
- **Priority**: MUST
- **Spec**: Each rank card SHALL have a color-specific hover box-shadow:
  - I (blue): `-5px 0 15px rgba(13,110,253,0.2)`
  - II (green): `-5px 0 15px rgba(0,200,83,0.2)`
  - III (yellow): `-5px 0 15px rgba(255,232,31,0.15)`
  - IV (purple): `-5px 0 15px rgba(156,39,176,0.2)`
  - V (white): `-5px 0 15px rgba(255,255,255,0.2)`
- **Rationale**: Mockup has per-rank hover box-shadows. Currently generic translateX only.
- **Affects**: `Rangos.tsx`

### RANGO-BORDER-01 — Border Colors
- **Priority**: SHOULD
- **Spec**: 
  - Green rank border: `rgba(0, 200, 83, 0.5)` (not `#2ff923`)
  - Purple rank border: `rgba(156, 39, 176, 0.5)` (not `border-purple-500` #a855f7)
- **Rationale**: Mockup uses specific green (#00c853 at 0.5) and purple (#9c27b0 at 0.5).
- **Affects**: `Rangos.tsx`, `lib/constants.ts`

### RANGO-SPACING-01 — Card Padding
- **Priority**: SHOULD
- **Spec**: Card SHALL have `padding: 2rem 1.8rem`.
- **Rationale**: Mockup `.rango-card` uses `padding: 2rem 1.8rem`. Currently `p-6` (1.5rem).
- **Affects**: `Rangos.tsx`

### RANGO-SPACING-02 — Badge Margin
- **Priority**: SHOULD
- **Spec**: Badge SHALL have `margin-bottom: 0.3rem`.
- **Rationale**: Mockup `.rango-card__badge` uses `margin-bottom: 0.3rem`. Currently `mb-3` (0.75rem).
- **Affects**: `Rangos.tsx`

## Actividades

### ACT-BG-01 — Card Background Opacity
- **Priority**: SHOULD
- **Spec**: Card background SHALL be `rgba(255, 255, 255, 0.015)`.
- **Rationale**: Mockup uses `rgba(255,255,255,0.015)`. Currently `bg-white/5` (0.05).
- **Affects**: `Actividades.tsx`

### ACT-BORDER-01 — Card Border Opacity
- **Priority**: SHOULD
- **Spec**: Card border SHALL be `rgba(255, 255, 255, 0.06)`.
- **Rationale**: Mockup uses `rgba(255,255,255,0.06)`. Currently `border-white/10` (0.1).
- **Affects**: `Actividades.tsx`

### ACT-SHADOW-01 — Card Inset Shadow
- **Priority**: SHOULD
- **Spec**: Card SHALL have `box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`.
- **Rationale**: Mockup uses this box-shadow. Currently missing inset highlight.
- **Affects**: `Actividades.tsx`

### ACT-BLUR-01 — Backdrop Blur
- **Priority**: SHOULD
- **Spec**: Card backdrop-filter SHALL be `blur(2px)`.
- **Rationale**: Mockup uses `backdrop-filter: blur(2px)`. Currently `backdrop-blur-sm` (~4px Tailwind).
- **Affects**: `Actividades.tsx`

### ACT-CAROUSEL-01 — 1440px+ Breakpoint
- **Priority**: SHOULD
- **Spec**: At ≥1440px, carousel cards SHALL have `flex: 0 0 25vw; max-width: 380px`.
- **Rationale**: Mockup media query `@media (min-width: 1440px)`.
- **Affects**: `Actividades.tsx`

### ACT-CAROUSEL-02 — Arrow SVGs
- **Priority**: SHOULD
- **Spec**: Arrow SVGs SHALL match mockup paths:
  - Prev: `M15 18l-6-6 6-6`
  - Next: `M9 6l6 6-6 6`
  - viewBox: `0 0 24 24`
- **Rationale**: Mockup uses these paths. Currently different.
- **Affects**: `Actividades.tsx`

### ACT-CAROUSEL-03 — Controls Padding
- **Priority**: SHOULD
- **Spec**: Controls container SHALL have `padding: 2rem 5vw`.
- **Rationale**: Mockup uses `padding: 2rem 5vw`. Currently no padding-bottom equivalent.
- **Affects**: `Actividades.tsx`

## FAQs

### FAQ-LOCATION-01 — Location Data Fix
- **Priority**: MUST
- **Spec**: FAQ answer for "¿Dónde están ubicados?" SHALL say "San Luis Río Colorado, Sonora" instead of "Hermosillo, Sonora".
- **Rationale**: Real location is SLRC. Mockup had wrong city.
- **Affects**: `lib/constants.ts`

### FAQ-FORMAT-01 — Costos Format
- **Priority**: SHOULD
- **Spec**: FAQ costos answer SHALL use `<strong>` tags for "Horarios:" and "Costos:" with `<br><br>` separator, matching the mockup HTML formatting.
- **Rationale**: Mockup uses HTML formatting. Currently plain text.
- **Affects**: `lib/constants.ts` (FAQ answer string)

### FAQ-TRIGGER-01 — Open State Color
- **Priority**: SHOULD
- **Spec**: FAQ trigger SHALL NOT change color when open (stays white, only turns yellow on hover).
- **Rationale**: Mockup `faq-item__trigger` stays white unless hovered. Currently turns yellow when open.
- **Affects**: `FAQs.tsx`

## CTA Final

### CTA-TEXT-01 — Description Text Color
- **Priority**: SHOULD
- **Spec**: CTA description text (`Primera clase gratis...`) SHALL be `color: var(--gray-light)` (#ccc).
- **Rationale**: Mockup `.cta-final__text` uses `var(--gray-light)`. Currently `--color-gray-aa` (#aaa).
- **Affects**: `CtaFinal.tsx`

### CTA-BTN-02 — Hover Scale
- **Priority**: MUST
- **Spec**: CTA button SHALL have `hover: scale(1.05)`.
- **Rationale**: Mockup `.btn--blue-glow:hover` includes `transform: scale(1.05)`. Currently missing.
- **Affects**: `CtaFinal.tsx`

### CTA-BTN-03 — Hover Inset Shadow
- **Priority**: MUST
- **Spec**: CTA button hover SHALL include `inset 0 0 10px rgba(75,213,238,0.4)`.
- **Rationale**: Mockup `.btn--blue-glow:hover` shadow includes inset layer.
- **Affects**: `CtaFinal.tsx`

### CTA-INFO-01 — Padding
- **Priority**: SHOULD
- **Spec**: Info cards SHALL have `padding: 1rem`.
- **Rationale**: Mockup `.cta-final__info-item` uses `padding: 1rem`. Currently `p-6` (1.5rem).
- **Affects**: `CtaFinal.tsx`

## Footer & WhatsApp

### FOOTER-BORDER-01 — Border Colors
- **Priority**: SHOULD
- **Spec**: Footer `border-top` SHALL be `1px solid #1a1a1a`.
- **Rationale**: Mockup uses `border-top: 1px solid #1a1a1a`. Currently `border-white/10`.
- **Affects**: `Footer.tsx`

### FOOTER-LAYOUT-01 — Desktop Layout
- **Priority**: SHOULD
- **Spec**: Footer SHALL be single column layout with centered text (no grid).
- **Rationale**: Mockup footer is a single column. Currently `sm:grid-cols-3`.
- **Affects**: `Footer.tsx`

### FOOTER-LINKS-01 — Links Layout
- **Priority**: SHOULD
- **Spec**: Footer links SHALL be displayed horizontally with `flex-wrap: wrap; justify-content: center; gap: 1.2rem`.
- **Rationale**: Mockup uses horizontal flex. Currently vertical list with `space-y-2`.
- **Affects**: `Footer.tsx`

### WA-SHADOW-01 — WhatsApp Box Shadow
- **Priority**: SHOULD
- **Spec**: WhatsApp button SHALL have `box-shadow: 0 4px 16px rgba(37,211,102,0.4)` with hover `0 6px 24px rgba(37,211,102,0.5)`.
- **Rationale**: Mockup uses green-specific shadows. Currently `shadow-lg` (neutral gray).
- **Affects**: `WhatsAppFloat.tsx`

### WA-POSITION-01 — Desktop Position
- **Priority**: SHOULD
- **Spec**: At ≥768px, WhatsApp SHALL be at `bottom: 2rem; right: 2rem`.
- **Rationale**: Mockup media query adjusts position. Currently `bottom-6 right-6` on all sizes.
- **Affects**: `WhatsAppFloat.tsx`

## Accessibility

### A11Y-LIVE-01 — Live Region
- **Priority**: MUST
- **Spec**: The page SHALL include `<div aria-live="polite" role="status" class="visually-hidden">` near the end of `<body>`.
- **Rationale**: Mockup has this element. Currently missing in Next.js.
- **Affects**: `app/layout.tsx`

### A11Y-SKIP-01 — Skip Link Styling
- **Priority**: MUST
- **Spec**: The skip link on focus SHALL:
  - Position: `top: 0; left: 0` (not `top-4 left-4`)
  - `z-index: 1001` (not `z-[100]`)
  - `padding: 0.75rem 1.5rem`
  - `font-family: var(--font-display)`
  - `font-size: 1.125rem`
  - `letter-spacing: 0.06em`
  - `text-transform: uppercase`
  - Square corners (no `rounded`)
- **Rationale**: Mockup `.skip-link:focus` styles.
- **Affects**: `SkipLink.tsx`

### A11Y-SKIP-02 — Visually Hidden Utility
- **Priority**: SHOULD
- **Spec**: The `.visually-hidden` class SHALL match mockup's exact clip values: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; padding: 0; margin: -1px`.
- **Rationale**: Mockup uses this exact pattern for screen reader utilities.
- **Affects**: `app/globals.css` or `SkipLink.tsx`

## Data

### DATA-LOCATION-01 — Unify to SLRC
- **Priority**: MUST
- **Spec**: ALL location references SHALL use "San Luis Río Colorado, Sonora":
  - `lib/constants.ts` `ACADEMY.address`
  - `lib/constants.ts` FAQ "¿Dónde están ubicados?" answer (change "Hermosillo" → "San Luis Río Colorado")
  - `app/layout.tsx` metadata description (already SLRC)
- **Rationale**: Real location is San Luis Río Colorado, Sonora. Mockup had "Hermosillo" incorrectly.
- **Affects**: `lib/constants.ts`

## Scenarios

### S1: Subtítulos en amarillo
```
Given la página carga
When se ven los subtítulos de sección
Then SHALL ser color amarillo (#ffe81f)
And SHALL tener text-transform uppercase
And SHALL tener letter-spacing 0.05em
```

### S2: Animaciones de Hero
```
Given la página carga
When el Hero se renderiza
Then los elementos SHALL aparecer con delays progresivos
And el scroll-hint SHALL tener bounceY infinito después de la entrada
```

### S3: Botones con hover
```
Given un botón CTA
When el usuario hace hover
Then el botón SHALL escalar a 1.05
When el usuario hace click
Then el botón SHALL escalar a 0.97
```

### S4: Rangos con hover por color
```
Given un card de rango
When el usuario hace hover
Then el card SHALL translateX(6px)
And SHALL tener una sombra del color del rango
```

### S5: Ubicación consistente
```
Given cualquier referencia a la ubicación en la página
When se lee el texto
Then SHALL decir "San Luis Río Colorado, Sonora"
```

### S6: Accesibilidad
```
Given la página
When se inspecciona el DOM
Then SHALL existir un div con aria-live="polite"
And el skip link SHALL tener z-index 1001 y font-display
```

### S7: Build integrity
```
Given el código
When se ejecuta bun run build
Then SHALL compilar sin errores
And npx tsc --noEmit SHALL reportar cero errores
```
