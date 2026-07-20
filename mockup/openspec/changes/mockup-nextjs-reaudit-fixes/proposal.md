# Proposal: Re-Audit Fixes — Mockup Alignment (Round 2)

## Intent

Corregir las ~144 diferencias restantes identificadas en la re-auditoría exhaustiva entre mockup y Next.js. La primera ronda restauró la identidad visual gruesa (colores, fondos, navbar, hero). Esta ronda afina: tipografía fluida, animaciones, espaciado, sombras, comportamiento responsive, accesibilidad y edge cases.

## Scope

### In Scope

**Correcciones de datos (HIGH):**
- D-130: Unificar ubicación como **San Luis Río Colorado, Sonora** (SLRC) en todos los archivos — el mockup decía Hermosillo pero la ubicación real es SLRC
- D-131: Texto de actividad 1 ya corregido (fundamenta → fundamental) — ok
- D-132: FAQ costos: restaurar formato `<strong>` + `<br>` perdido
- D-133: FAQ ubicación: cambiar "Hermosillo" → "San Luis Río Colorado"

**Correcciones visuales (HIGH):**
- D-004: Subtítulos de sección → amarillo (#ffe81f)
- D-071: Badge de rango → 2.8rem

**Alineación tipográfica (~20 items MEDIUM):**
- Font-sizes: reemplazar `text-{xs/sm/base/lg/xl/2xl/3xl/4xl}` fijos por valores `clamp()` del mockup donde aplique
- Letter-spacing: `tracking-wider/widest` → valores exactos `0.04em`, `0.06em`, `0.08em`
- Line-height: agregar `1.3`, `1.65`, `1.7`, `1.8` donde el mockup los especifica
- Section subtitle: uppercase + letter-spacing 0.05em

**Animaciones y transiciones (~12 items MEDIUM):**
- Hero: agregar delays escalonados (0.2s, 0.3s, 0.45s, 0.6s, 0.8s) + `fill-mode: both`
- Botones: hover `scale(1.05)`, active `scale(0.97)`, transition 0.3s
- Scroll-hint: restaurar animación dual (entrada fadeUp + bounceY infinita)
- Sombras de hover en botones cyan (inset + outer glow)
- Per-rank hover shadows en rangos

**Espaciado y padding (~15 items MEDIUM):**
- Section padding: `py-24` → `py-20` (5rem)
- Padding específico por componente (hero badge, buttons, info cards, etc.)
- Gap y margin values específicos del mockup

**Sombras y bordes (~10 items MEDIUM):**
- Card borders: opacidades correctas (0.06, 0.015, 0.5)
- Box-shadows: inset highlights, per-rank hover shadows
- WhatsApp box-shadow verde específico

**Responsive (~5 items MEDIUM):**
- Breakpoint <389px: hero title 2.2rem, CTAs column, full-width buttons
- Breakpoint 1440px+: carousel cards 25vw
- Hero title mobile letter-spacing 0.02em

**Accesibilidad (~6 items MEDIUM):**
- Falta `aria-live` region
- Skip link: z-index 1001, font-display, padding exacto
- Navbar hover: amarillo en vez de blanco

**Edge cases (~5 items MEDIUM):**
- Logo `rounded-full` → cuadrado (navbar + footer)
- Navbar solid opacity 0.95 → 0.92
- Duplicate `starScroll` keyframe
- `scroll-behavior: smooth` en html
- Container width: `min(90vw, 1200px)` vs Tailwind breakpoints

### Out of Scope

- Funcionalidad del carrusel / accordion (ya funciona correctamente)
- Contenido textual nuevo (solo corregir datos de ubicación)
- SEO / JSON-LD / metadata (ya están correctos)
- Nuevas features o secciones

## Approach

5 waves organizadas por archivo/componente para mantener commits enfocados:

| Wave | Focus | Files | Est. Lines |
|------|-------|-------|------------|
| 1 — Global | globals.css, layout.tsx, constants.ts | 3 | ~80-120 |
| 2 — Navbar + Hero | Navbar.tsx, NavbarClient.tsx, Hero.tsx | 3 | ~100-150 |
| 3 — Secciones | Valores, ValueCard, Profesor, Actividades, Rangos, FAQs | 6 | ~120-180 |
| 4 — CTA + Footer + WhatsApp | CtaFinal, Footer, WhatsAppFloat | 3 | ~60-100 |
| 5 — Accesibilidad + Responsive | SkipLink, starfield, responsive overrides | 3 | ~40-80 |

Cada wave es un commit independiente (stacked-to-main).

## Affected Areas

| Área | Archivos |
|------|----------|
| Global styles | `app/globals.css`, `app/layout.tsx` |
| Data | `lib/constants.ts` (FAQ address) |
| Navbar | `app/components/Navbar.tsx`, `NavbarClient.tsx` |
| Hero | `app/components/Hero.tsx` |
| Valores | `app/components/Valores.tsx`, `ValueCard.tsx` |
| Profesor | `app/components/Profesor.tsx` |
| Actividades | `app/components/Actividades.tsx` |
| Rangos | `app/components/Rangos.tsx` |
| FAQs | `app/components/FAQs.tsx` |
| CTA Final | `app/components/CtaFinal.tsx` |
| Footer | `app/components/Footer.tsx` |
| WhatsApp | `app/components/WhatsAppFloat.tsx` |
| SkipLink | `app/components/SkipLink.tsx` |
| Starfield | `app/styles/starfield.module.css` |

## Dependencies

- Wave 1 debe completarse antes que las demás (establece las variables globales)
- Waves 2-4 son independientes entre sí
- Wave 5 puede ir al final

## Success Criteria

- [ ] Subtítulos de sección en amarillo
- [ ] Badge de rango a 2.8rem
- [ ] Ubicación unificada como "San Luis Río Colorado, Sonora"
- [ ] Section padding consistente a 5rem (py-20)
- [ ] Hero animaciones con delays + fill-mode
- [ ] Botones con hover scale(1.05) + active scale(0.97)
- [ ] Rangos con per-rank hover shadows
- [ ] Logo sin rounded-full
- [ ] Navbar hover en amarillo
- [ ] Navbar solid opacity 0.92
- [ ] `aria-live` region presente
- [ ] Skip link con z-index 1001 + font-display
- [ ] `scroll-behavior: smooth` en html
- [ ] Breakpoint <389px implementado
- [ ] Breakpoint 1440px+ implementado
- [ ] WhatsApp box-shadow verde específico
- [ ] `bun run build` exitoso
- [ ] `npx tsc --noEmit` sin errores
- [ ] `bun run lint` sin errores

## Risks & Rollback

| Riesgo | Prob. | Mitigación |
|--------|-------|------------|
| Cambiar tamaños de fuente afecta layout | Baja | Cada wave verificable con build |
| Location change afecta FAQs | Baja | Solo 2 strings, diff visible |
| Hover states conflictivos | Baja | Inspección visual post-wave |

Cada wave = commit independiente. Revert sin afectar las demás.
