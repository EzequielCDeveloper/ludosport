# Design: Alineación Visual Mockup → Next.js

## Technical Approach

Cuatro olas progresivas, cada una independiente y verificable con `bun run build` y `npx tsc --noEmit`.

| Ola | Enfoque | Spec IDs | Componentes |
|-----|---------|----------|-------------|
| 1 — Global + Navbar + Hero | Identidad visual base | GLOBAL-*, NAV-*, HERO-*, STAR-* | `globals.css`, `layout.tsx`, `Navbar.tsx`, `NavbarClient.tsx`, `Hero.tsx` |
| 2 — Secciones interiores | Valores, Profesor, Actividades, Rangos, FAQs | VAL-*, PROF-*, RANGOS-* | `Valores.tsx`, `ValueCard.tsx`, `Profesor.tsx`, `Actividades.tsx`, `Rangos.tsx`, `FAQs.tsx` |
| 3 — CTA Final + Footer + WhatsApp | Secciones finales | CTA-*, FOOTER-*, WA-* | `CtaFinal.tsx`, `Footer.tsx`, `WhatsAppFloat.tsx` |
| 4 — Build + TypeScript check | Verificación final | S8 (Build Integrity) | N/A |

## Architecture Decisions

### AD1: CSS custom properties + Tailwind utilities vs Pure Tailwind

| Opción | Tradeoff |
|--------|----------|
| **CSS custom properties + Tailwind** (chosen) | Mantiene consistencia con mockup. Permite `var(--color-yellow)` y `var(--sw-cyan)`. Coexiste con Tailwind utility classes existentes. Sin refactor masivo. |
| Pure Tailwind `text-yellow-300` | No hay yellow exacto `#ffe81f` en Tailwind default. Requeriría configuración `@theme` exacta. Más borderline. |

**Rationale**: El proyecto ya usa `--color-yellow`, `--color-cyan` en `globals.css:9-12`. Las agregamos al `@theme` de Tailwind para que funcionen como utility classes. Donde Tailwind no cubra un valor exacto del mockup (como `rgba(255,232,31,0.85)`), usamos CSS custom properties inline.

### AD2: Navbar solid background via Tailwind class toggle vs CSS class toggle

| Opción | Tradeoff |
|--------|----------|
| **Tailwind arbitrary values toggle** (chosen) | El hook `useScrollNav` ya existe y hace el toggle. Solo cambiar la clase que agrega: de `navbar--solid` CSS a clases Tailwind inline. Elimina dependencia de CSS externo para navbar. |
| Mantener CSS `.navbar--solid` en `globals.css` | Funciona, pero duplica estilos. La regla ya existe (línea 80-83). Se puede mantener y ajustar. |

**Rationale**: La regla `.navbar--solid` ya existe en `globals.css`. Es más simple mantenerla y solo cambiar el color a transparente el estado inicial, dejando que el hook existente agregue la clase.

### AD3: Section backgrounds — Tailwind conditional vs CSS

| Opción | Tradeoff |
|--------|----------|
| **Quitar bg classes** (chosen) | Simplemente eliminar `bg-[var(--color-black-2)]` y `bg-[var(--color-black-3)]` de los componentes. El body ya tiene `bg-[var(--color-black-2)]` en layout.tsx. |
| Agregar CSS global `.section { background: transparent }` | Más declarativo pero oculta decisiones a nivel componente. |

**Rationale**: Cada componente de sección tiene una clase `bg-*` explícita. Quitarla es directo y visible en el diff. El fondo negro global viene del layout.

### AD4: Hero gradient backgrounds — Tailwind vs inline style

| Opción | Tradeoff |
|--------|----------|
| **Inline style** (chosen) | Los radial-gradients del mockup son complejos (posiciones específicas, múltiples capas). Tailwind no soporta radial-gradient con posiciones arbitrarias fácilmente. |
| Tailwind arbitrary gradient | `bg-[radial-gradient(...)]` funciona pero es menos legible para múltiples capas superpuestas. |

**Rationale**: Dos elementos separados (`.hero__bg` y `.hero__overlay`) con estilos inline `style={{}}` es la traducción más directa del mockup y más mantenible.

### AD5: Button square corners — Tailwind utility vs CSS reset

| Opción | Tradeoff |
|--------|----------|
| **Quitar `rounded`/`rounded-lg`** (chosen) | Los botones en Next.js usan clases Tailwind `rounded` explícitamente. Quitarlas es directo. |
| CSS global `button, a { border-radius: 0 !important }` | Muy agresivo, podría afectar elementos no previstos. |

**Rationale**: Cada `rounded` o `rounded-lg` es explícito en el JSX. Quitarlos uno por uno es más seguro y visible en el diff.

## File Changes by Wave

### Wave 1: Global + Navbar + Hero

| File | Action | Descripción |
|------|--------|-------------|
| `app/globals.css` | Modify | Agregar `--color-cyan: #4bd5ee` al `@theme`. Agregar keyframes del mockup si faltan. Ajustar clase `.navbar--solid`. |
| `app/layout.tsx` | Modify | Cambiar className del body: de `text-white` a `text-[rgba(255,232,31,0.85)]` |
| `app/components/Navbar.tsx` | Modify | Quitar `bg-[var(--color-black-2)]/80 backdrop-blur-md`. Dejar fondo por defecto (transparente). El `useScrollNav` agrega `navbar--solid` al scrollear. |
| `app/components/NavbarClient.tsx` | Modify | Links nav: cambiar `font-body` → `font-display`, tracking específico. CTA: cambiar bg rojo → azul `#0a58ca` |
| `app/components/Hero.tsx` | Modify | Reemplazo completo: background con radial-gradients + scanlines, badge rojo, título amarillo con text-stroke, subtítulos colores correctos, botones cyan/outline cuadrados, scroll-hint font-display |

### Wave 2: Secciones interiores

| File | Action | Descripción |
|------|--------|-------------|
| `app/components/Valores.tsx` | Modify | Quitar `bg-[var(--color-black-3)]`. Title: cambiar a `text-[var(--color-yellow)]` |
| `app/components/ValueCard.tsx` | Modify | Quitar `rounded-lg`. Quitar hover effect. Agregar border-top amarillo, backdrop-filter, box-shadow |
| `app/components/Profesor.tsx` | Modify | Quitar `bg-[var(--color-black-2)]`. Quitar offset border. Agregar grayscale filter. Quote: blanco + borde rojo. Lead: gris |
| `app/components/Actividades.tsx` | Modify | Quitar `bg-[var(--color-black-2)]`. Title: cambiar a `text-[var(--color-yellow)]` |
| `app/components/Rangos.tsx` | Modify | Quitar `bg-[var(--color-black-3)]`. Agregar backdrop-filter, box-shadow. Hover: translateX. Maestro (V): estilo especial |
| `app/components/FAQs.tsx` | Modify | Quitar `bg-[var(--color-black-3)]`. Title: cambiar a `text-[var(--color-yellow)]`. Divider: #222 |

### Wave 3: CTA + Footer + WhatsApp

| File | Action | Descripción |
|------|--------|-------------|
| `app/components/CtaFinal.tsx` | Modify | Fondo: radial-gradients. Title: amarillo. Info cards: left border, sin rounded, labels grises. Button: cyan sable de luz |
| `app/components/Footer.tsx` | Modify | bg: `#000`. Links: `font-display` |
| `app/components/WhatsAppFloat.tsx` | Modify | Quitar `rounded-full` |

## Testing Strategy

| Paso | Comando | Verifica |
|------|---------|----------|
| Build | `bun run build` | Sin errores de compilación |
| TypeScript | `npx tsc --noEmit` | Sin errores de tipos |
| Lint | `bun run lint` | Sin errores de linting |
| Visual | Renderizado local `bun run dev` + comparación contra mockup/main.html | Coincidencia visual |

## Threat Matrix

No hay routing, shell, subprocess, VCS automation, o process-integration boundaries. Cambios puramente visuales en componentes React + CSS.
