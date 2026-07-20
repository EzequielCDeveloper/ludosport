# Proposal: Alineación Visual Mockup → Next.js

## Intent

Corregir los ~70 errores de diseño introducidos durante la transpilación del mockup HTML/CSS/JS a Next.js 16, restaurando la identidad visual Star Wars del diseño original: paleta amarillo/negro/cyan, botones sable de luz, fondos oscuros sin secciones de color, tipografía Anton en elementos clave, y bordes rectos.

## Scope

### In Scope

La landing page completa de Ludo Sport Drake Academy en Next.js. Cada sección será auditada contra el mockup y corregida:

1. **Navbar** — fondo transparente inicial, font-display en links, CTA azul oscuro
2. **Hero** — fondo con radial-gradients rojo+azul + scanlines, badge rojo, título amarillo con text-stroke, subtítulo blanco, botones cyan/outline cuadrados
3. **Valores** — sin bg de sección, títulos amarillos, cards con border-top amarillo, sin rounded
4. **Profesor** — quote blanco con borde rojo, lead gris, imagen con grayscale, sin borde decorativo
5. **Actividades** — sin bg de sección, título amarillo
6. **Rangos** — sin bg de sección, título amarillo, cards con backdrop-filter + box-shadow, hover translateX, card V especial
7. **FAQs** — sin bg de sección, título amarillo, divider color #222
8. **CTA Final** — fondo con radial-gradients, título amarillo, info cards con left border, botón cyan sable de luz
9. **Footer** — bg #000, links en Anton
10. **WhatsApp Float** — cuadrado
11. **Global** — body text amarillo 85%, secciones sin bg, títulos amarillos, botones cuadrados sin rounded, scroll-hint en Anton

### Out of Scope

- El contenido textual (FAQs, actividades, valores) — ya está correcto
- SEO / metadata / JSON-LD — no hay diferencias de diseño
- Funcionalidad del carrusel, FAQ accordion, sección tracking — ya funcionan
- La auditoría heurística del mockup original (cambio `audit-fix-landing-page` existente)

## Approach

Ola 1 — **Global + Navbar + Hero** (identidad visual completa, ~8 archivos)
Ola 2 — **Secciones interiores** (Valores, Profesor, Actividades, Rangos, FAQs ~6 archivos)
Ola 3 — **CTA Final + Footer + WhatsApp** (~4 archivos)
Ola 4 — **Ajustes finos** (Skip link, animaciones, SVGs, dividers, live region ~5 archivos)

Cada ola es un commit independiente y verificable.

## Affected Areas

| Área | Archivos |
|------|----------|
| Layout y estilos globales | `app/globals.css`, `app/layout.tsx` |
| Navbar | `app/components/Navbar.tsx`, `app/components/NavbarClient.tsx` |
| Hero | `app/components/Hero.tsx` |
| Valores | `app/components/Valores.tsx`, `app/components/ValueCard.tsx` |
| Profesor | `app/components/Profesor.tsx` |
| Actividades | `app/components/Actividades.tsx` |
| Rangos | `app/components/Rangos.tsx` |
| FAQs | `app/components/FAQs.tsx` |
| CTA Final | `app/components/CtaFinal.tsx` |
| Footer | `app/components/Footer.tsx` |
| WhatsApp | `app/components/WhatsAppFloat.tsx` |
| Starfield | `app/styles/starfield.module.css` |

## Risks & Rollback

| Riesgo | Prob. | Mitigación |
|--------|-------|------------|
| Regresión visual en build | Baja | `bun run build` después de cada ola |
| Color de body amarillo afecta legibilidad | Media | Mantener 85% opacidad como en mockup. Verificar contraste |
| Scroll-hint animation conflict | Baja | Usar mismas keyframes que mockup |

Cada ola = commit independiente. Revertir por commit si hay problemas.

## Dependencies

Ninguna — cambio puramente visual sobre componentes existentes.

## Success Criteria

- [ ] Body text: amarillo `rgba(255,232,31,0.85)` sobre fondo negro
- [ ] Navbar: fondo transparente → sólido al scrollear, links en Anton, CTA azul
- [ ] Hero: radial-gradients + scanline, badge rojo, título amarillo, text-stroke 4px amarillo, botones cyan/outline
- [ ] Secciones: sin bg propio, títulos amarillos
- [ ] Botones: cuadrados (sin border-radius)
- [ ] Cards: sin rounded, con backdrop-filter
- [ ] Rangos card V: estilo especial diferenciado
- [ ] CTA Final: radial-gradients, botón cyan sable de luz
- [ ] Footer: bg #000, links en Anton
- [ ] WhatsApp: sin rounded
- [ ] `bun run build` exitoso
- [ ] `npx tsc --noEmit` sin errores
