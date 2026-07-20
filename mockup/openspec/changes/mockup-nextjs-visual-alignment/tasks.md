# Tasks: Alineación Visual Mockup → Next.js

## Review Workload Forecast

Full diff: ~500–700 líneas modificadas. Con `force-chained` + `stacked-to-main`:

| Work Unit | Focus | Est. Lines | Rollback |
|-----------|-------|------------|----------|
| 1 — Global + Navbar + Hero | globals.css, layout, navbar, hero | ~200–250 | Revert commit 1 |
| 2 — Secciones interiores | Valores, Profesor, Actividades, Rangos, FAQs | ~250–350 | Revert commit 2 |
| 3 — CTA + Footer + WhatsApp | CtaFinal, Footer, WhatsAppFloat | ~100–150 | Revert commit 3 |

Todas las olas están por debajo de 400 líneas individualmente.

---

## Wave 1 — Global + Navbar + Hero

**T1.1 Global styles** — `app/globals.css`
- [x] Agregar `--color-cyan: #4bd5ee` al bloque `@theme`
- [x] Agregar keyframes del mockup si alguna falta (`fadeUp`, `fadeDown`, `bounceY`, `starScroll`)
- [x] Ajustar clase `.navbar--solid` si es necesario

**T1.2 Body text color** — `app/layout.tsx`
- [x] Cambiar `className="... text-white ..."` del body a `className="... text-[rgba(255,232,31,0.85)] ..."`
- [x] Mantener `bg-[var(--color-black-2)]`

**T1.3 Navbar background** — `app/components/Navbar.tsx`
- [x] Quitar `bg-[var(--color-black-2)]/80 backdrop-blur-md`
- [x] Dejar que el hook `useScrollNav` y la clase `navbar--solid` manejen el background

**T1.4 Navbar links and CTA** — `app/components/NavbarClient.tsx`
- [x] Links nav: cambiar `font-body` → `font-display`, `tracking-wider` → `tracking-[0.08em]`
- [x] CTA Contacto: cambiar bg de red a azul oscuro (`bg-[#0a58ca]`)
- [x] Ajustar hover CTA a `hover:bg-[var(--color-red-dark)]` (mantener hover rojo como mockup)

**T1.5 Hero background** — `app/components/Hero.tsx`
- [x] Reemplazar gradiente simple por dos divs: `hero__bg` con radial-gradients (rojo 30%/40%, azul 70%/60%)
- [x] Agregar `hero__overlay` con `repeating-linear-gradient` scanline
- [x] Mantener z-index: 0 para bg, z-index: 1 para content

**T1.6 Hero badge** — `app/components/Hero.tsx`
- [x] Badge "Primera clase gratis": bg rojo (`bg-[var(--color-red)]`), texto blanco, `font-display`, uppercase, sin rounded, padding específico

**T1.7 Hero title** — `app/components/Hero.tsx`
- [x] "LUDO SPORT": cambiar de `text-white` a `text-[var(--color-yellow)]`
- [x] "DRAKE ACADEMY": `WebkitTextStroke: '4px var(--color-yellow)'`, `WebkitTextFillColor: 'transparent'`, color rojo de fallback. Mobile: 1.5px stroke

**T1.8 Hero subtitle** — `app/components/Hero.tsx`
- [x] Texto principal: cambiar de gris a blanco
- [x] Texto pequeño ("Para niños y jóvenes..."): cambiar de `white/60` a gris

**T1.9 Hero buttons** — `app/components/Hero.tsx`
- [x] Botón primario "Quiero mi primera clase": cyan border 2px, transparent bg, glow effects, font-display, sin rounded
- [x] Botón secundario "Ver actividades": white border 2px, transparent bg, sin rounded
- [x] Hover primario: fill cyan, text black
- [x] Hover secundario: fill white, text black

**T1.10 Scroll hint** — `app/components/Hero.tsx`
- [x] Cambiar `font-body` → `font-display` en scroll hint text

**Verify**: `bun run build` exitoso, `npx tsc --noEmit` sin errores

---

## Wave 2 — Secciones Interiores

**T2.1 Valores section** — `app/components/Valores.tsx`
- [x] Quitar `bg-[var(--color-black-3)]` del section
- [x] Título: cambiar de `text-white` a `text-[var(--color-yellow)]`

**T2.2 Value cards** — `app/components/ValueCard.tsx`
- [x] Quitar `rounded-lg`
- [x] Quitar `hover:border-[var(--color-yellow)]/30`
- [x] Quitar `border border-white/10`
- [x] Agregar `border-t-3 border-[var(--color-yellow)]/20` (border-top 3px amarillo 20%)
- [x] Agregar `backdrop-filter: blur(2px)` via style o clase
- [x] Agregar `shadow-[0_8px_32px_rgba(0,0,0,0.5)]` con `shadow-inset-t`

**T2.3 Profesor section** — `app/components/Profesor.tsx`
- [x] Quitar `bg-[var(--color-black-2)]` del section
- [x] Quitar decoración de borde rojo offset en imagen (el div con border-2 translate)
- [x] Agregar grayscale filter en imagen (`filter: grayscale(0.3)` + hover a `grayscale(0)`)
- [x] Lead text: cambiar de cyan a `text-[var(--color-gray-aa)]` (o `text-[#ccc]`)
- [x] Quote: cambiar de yellow/yellow a `text-white` con `border-l-4 border-[var(--color-red)]`
- [x] Quote font: `font-display`

**T2.4 Actividades section** — `app/components/Actividades.tsx`
- [x] Quitar `bg-[var(--color-black-2)]` del section
- [x] Título: cambiar de `text-white` a `text-[var(--color-yellow)]`

**T2.5 Rangos section** — `app/components/Rangos.tsx`
- [x] Quitar `bg-[var(--color-black-3)]` del section
- [x] Título: cambiar de `text-white` a `text-[var(--color-yellow)]`
- [x] Quitar `rounded-lg` de cards
- [x] Agregar backdrop-filter, box-shadow con inset
- [x] Hover: cambiar `bg-white/10` por translateX + box-shadow
- [x] Card V (Maestro): agregar estilos especiales (extra bg, border refinement)

**T2.6 FAQs section** — `app/components/FAQs.tsx`
- [x] Quitar `bg-[var(--color-black-3)]` del section
- [x] Título: cambiar de `text-white` a `text-[var(--color-yellow)]`
- [x] Divider: cambiar `divide-white/10` por `divide-[#222]`

**Verify**: `bun run build` exitoso, `npx tsc --noEmit` sin errores

---

## Wave 3 — CTA + Footer + WhatsApp

**T3.1 CTA Final background** — `app/components/CtaFinal.tsx`
- [x] Reemplazar gradiente simple por dos radial-gradients (azul 25%/50%, rojo 75%/50%) vía inline style o div separado
- [x] Título: cambiar de `text-white` a `text-[var(--color-yellow)]`

**T3.2 CTA Final info cards** — `app/components/CtaFinal.tsx`
- [x] Quitar `rounded-lg`, `border border-white/10`, `bg-white/5 backdrop-blur-sm`
- [x] Agregar `bg-white/[0.03]` simple, border-left coloreado (azul, amarillo, rojo), sin rounded, sin backdrop
- [x] Labels: cambiar de cyan a `text-[var(--color-gray-aa)]`

**T3.3 CTA Final button** — `app/components/CtaFinal.tsx`
- [x] Reemplazar bg rojo por estilo cyan sable de luz: transparent bg, cyan border 2px, glow, sin rounded, sin shadow

**T3.4 Footer** — `app/components/Footer.tsx`
- [x] bg: cambiar `bg-[var(--color-black-2)]` (#111) → `bg-black`
- [x] Links: cambiar `font-body` → `font-display`

**T3.5 WhatsApp float** — `app/components/WhatsAppFloat.tsx`
- [x] Quitar `rounded-full`

**Verify**: `bun run build` exitoso, `npx tsc --noEmit` sin errores

---

## Runtime Harness

```bash
bun run build     # Build check
npx tsc --noEmit  # Type check
bun run lint      # Lint check (recommended)
bun run dev       # Visual check (manual)
```

## Rollback Strategy

Cada wave = commit independiente. `git revert <commit-sha>` remueve esa wave limpiamente. Waves independientes — sin fallos en cascada entre fases.
