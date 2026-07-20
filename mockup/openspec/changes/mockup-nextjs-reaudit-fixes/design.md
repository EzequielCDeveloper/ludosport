# Design: Re-Audit Fixes — Mockup Alignment (Round 2)

## Technical Approach

5 waves secuenciales (stacked-to-main). Cada wave independiente y verificable.

| Wave | Focus | Spec IDs | Archivos | Est. líneas |
|------|-------|----------|----------|-------------|
| 1 — Global | CSS variables, layout, data, constants | G-*, DATA-* | globals.css, layout.tsx, constants.ts | ~80-120 |
| 2 — Navbar + Hero | Navbar, Hero components | NAV-*, HERO-* | Navbar.tsx, NavbarClient.tsx, Hero.tsx | ~100-150 |
| 3 — Secciones | Valores, Profesor, Actividades, Rangos, FAQs | VAL-*, PROF-*, ACT-*, RANGO-*, FAQ-* | 6 componentes | ~120-180 |
| 4 — CTA + Footer + WhatsApp | Secciones finales | CTA-*, FOOTER-*, WA-* | 3 componentes | ~60-100 |
| 5 — Accesibilidad + Responsive | Skip link, breakpoints, cleanup | A11Y-*, HERO-SMALL, HERO-TITLE | SkipLink.tsx, globals.css | ~40-80 |

## Architecture Decisions

### AD1: Tailwind arbitrary values vs inline styles for animations
**Decision**: Usar clases CSS en `globals.css` con nombres como `.hero__animation--badge`, `.hero__animation--title`, etc., e importarlas o aplicarlas como className.
**Rationale**: Las animaciones con delays específicos y `fill-mode: both` no se pueden expresar limpiamente con Tailwind utilities. Crear clases CSS específicas es más mantenible y se acerca más al mockup.

### AD2: Per-rank hover shadows — CSS vs conditional className
**Decision**: Usar CSS con selectores `:nth-child` en clases específicas en `globals.css` para los hover shadows de rangos.
**Rationale**: Hay 5 colores distintos. Un selector CSS por rank es más limpio que ternarios en JSX. La clase `.rango-card` ya existe conceptualmente.

### AD3: Container width — Tailwind container vs arbitrary
**Decision**: Mantener Tailwind `container` con `mx-auto` pero ajustar los `max-w-*` breakpoints para aproximar `min(90vw, 1200px)`. Si no es exacto, es aceptable.
**Rationale**: Cambiar a `min(90vw, 1200px)` rompería la consistencia con el resto del ecosistema Tailwind. La diferencia visual es mínima en la práctica.

### AD4: Duplicate starScroll keyframes
**Decision**: Eliminar `@keyframes starScroll` de `app/globals.css` y mantener solo la del CSS module `starfield.module.css`.
**Rationale**: La animación se usa exclusivamente en el componente Starfield que importa el CSS module. La definición en globals.css es redundante.

### AD5: Footer layout — grid vs flex
**Decision**: Cambiar footer de `sm:grid-cols-3` a layout single-column centrado con links horizontales, como el mockup.
**Rationale**: El mockup no usa grid en el footer. Es un layout vertical centrado con links en fila.

## File Changes by Wave

### Wave 1 — Global
| File | Change |
|------|--------|
| `globals.css` | Fix navbar solid opacity: 0.95 → 0.92. Add line-height: 1.65 to body. Add scroll-behavior: smooth to html. Remove duplicate @keyframes starScroll. Add `.visually-hidden` class. Add per-rank hover shadow classes. |
| `layout.tsx` | Add `<div aria-live="polite">` near end of body. No other changes. |
| `constants.ts` | Change FAQ address from "Hermosillo" → "San Luis Río Colorado". Fix FAQ costos formatting. |

### Wave 2 — Navbar + Hero
| File | Change |
|------|--------|
| `Navbar.tsx` | Remove `rounded-full` from logo Image |
| `NavbarClient.tsx` | Nav links hover: white → yellow. Hamburger: 26px×3px, gap 5px. Remove `rounded-full` if present. |
| `Hero.tsx` | Add CSS animation classes with delays + fill-mode both. Add hover scale(1.05) + active scale(0.97). Add inset glow + text-shadow to cyan button. Add scroll-hint dual animation. Add padding. Add <389px responsive. Add mobile letter-spacing. |

### Wave 3 — Secciones
| File | Change |
|------|--------|
| `Valores.tsx` | Subtitle: amarillo, uppercase, letter-spacing |
| `ValueCard.tsx` | Text color: #ccc |
| `Profesor.tsx` | Title: text-align left. Add stagger class to image wrapper. |
| `Actividades.tsx` | Subtitle: amarillo, uppercase. Card bg/border/shadow/blur fix. 1440px breakpoint. Arrow SVGs. Controls padding. |
| `Rangos.tsx` | Badge 2.8rem. Padding 2rem 1.8rem. Badge margin 0.3rem. Per-rank hover shadows (via globals.css class). Border colors update. |
| `FAQs.tsx` | Subtitle: amarillo. Trigger open: no color change. |

### Wave 4 — CTA + Footer + WhatsApp
| File | Change |
|------|--------|
| `CtaFinal.tsx` | Text color #ccc. Button hover scale. Button hover inset shadow. Info padding 1rem. |
| `Footer.tsx` | Remove `rounded-full` from logo. Border colors #1a1a1a. Single column layout. Links horizontal. |
| `WhatsAppFloat.tsx` | Box-shadow verde. Desktop position bottom-8 right-8. |

### Wave 5 — Accesibilidad + Responsive
| File | Change |
|------|--------|
| `SkipLink.tsx` | Fix z-index: 1001. Fix padding. Add font-display. Add uppercase + letter-spacing. Remove rounded. Fix position top-0 left-0. |
| `globals.css` | Add <389px media queries for hero. Add 1440px+ carousel query if not in Wave 3. Add hero animation classes. |
| `layout.tsx` | (already updated in Wave 1) |

## Testing Strategy

| Paso | Comando | Verifica |
|------|---------|----------|
| TypeScript | `npx tsc --noEmit` | Sin errores |
| Build | `bun run build` | Compilación exitosa |
| Lint | `bun run lint` | Sin errores |

## Threat Matrix

No routing, shell, subprocess, or security boundaries. Pure visual/styling changes.
