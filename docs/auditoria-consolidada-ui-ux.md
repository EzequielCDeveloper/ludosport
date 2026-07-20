# Auditoría UI/UX Consolidada — Ludosport

**Fecha**: 2026-07-19
**Proyecto**: Ludosport Drake Academy (Next.js)
**Alcance**: 16 componentes, 21 archivos, single-page app

---

## Resumen Ejecutivo

El proyecto Ludosport muestra una base sólida en diseño responsive y semántica HTML, pero arrastra deudas técnicas de UI/UX que afectan la experiencia general. Los problemas más críticos están en la gestión de errores (ausencia de `error.tsx`/`not-found.tsx`), el manejo de foco y teclado en el menú móvil (bloquea a usuarios de teclado y lectores de pantalla), y la inconsistencia del sistema de diseño (colores hardcodeados, bordes acentuados en posiciones distintas, dos lenguajes visuales de CTA). Ningún issue es irrecuperable — la mayoría se resuelve con refactor dirigido en componentes específicos, sin cambios arquitectónicos profundos.

- Total hallazgos únicos: **32**
- Por severidad: Crítico: **4** | Alto: **7** | Medio: **14** | Bajo: **7**
- Por categoría: Usabilidad: **13** | Accesibilidad: **13** | Consistencia Visual: **6**

---

## Quick Wins (Alto Impacto, Bajo Esfuerzo)

| # | Issue | Categoría | Esfuerzo |
|---|-------|-----------|----------|
| 1 | Agregar `aria-hidden="true"` a SVGs decorativos (FAQs, Hero, Actividades, Footer, WhatsApp) | ♿ Accesibilidad | 15 min |
| 2 | Fijar alt text del logo (`alt=""`) e imagen del profesor (`alt` descriptivo) | ♿ Accesibilidad | 15 min |
| 3 | Agregar `aria-label="Navegación principal"` al `<nav>` | ♿ Accesibilidad | 5 min |
| 4 | Agregar `"(se abre en nueva ventana)"` a links `target="_blank"` | ♿ Accesibilidad | 30 min |
| 5 | Agregar padding a iconos sociales en Footer (target size 24×24px) | ♿ Accesibilidad | 15 min |
| 6 | Agregar etiqueta visible al WhatsApp Float (aria-label + tooltip) | 🎨 Usabilidad | 30 min |
| 7 | Agregar `aria-current="page"` al nav link activo | 🎨 Usabilidad | 20 min |
| 8 | Linkear el logo a la home | 🎨 Usabilidad | 10 min |

---

## Hallazgos por Categoría

### Usabilidad (Heurística)

Issues de la evaluación heurística de Nielsen, excluyendo los que se solapan con accesibilidad o consistencia visual.

#### Críticos / Altos

| # | Issue | Severidad | Esfuerzo |
|---|-------|-----------|----------|
| U01 | **Crear `error.tsx` y `not-found.tsx`** — Sin manejo de errores, pantalla en blanco o 404 en inglés | 🔴 Crítico | 2h |
| U02 | **Sin link a home** — El logo no redirige a la raíz; el usuario no tiene escape básico | 🔴 Alto | 10 min |
| U03 | **Menú móvil no cierra al clickear fuera del overlay** — El overlay existe pero no tiene handler de cierre | 🔴 Alto | 1h |
| U04 | **Sin botón "Volver arriba"** — Navegación larga sin escape rápido al header | 🟡 Medio | 1h |
| U05 | **Sin feedback de página activa** — Nav sin `aria-current="page"` ni estilo distintivo | 🟡 Medio | 20 min |
| U06 | **Nav label "Valores" no coincide con section id `#propuesta`** — El anchor no encuentra el destino esperado | 🟡 Medio | 10 min |

#### Medios

| # | Issue | Severidad | Esfuerzo |
|---|-------|-----------|----------|
| U07 | **Imágenes placeholder repetidas en carrusel** — Misma imagen duplicada sin variación | 🟡 Medio | 1h |
| U08 | **WhatsApp Float sin etiqueta visible** — Solo icono, sin texto que describa la acción | 🟡 Medio | 30 min |
| U09 | **Mapa embebido con legibilidad reducida** — Escala o contraste del iframe subóptimo | 🟡 Medio | 30 min |
| U10 | **Sin live region para feedback asíncrono** — Loading/resultados no se anuncian a screen readers | 🟡 Medio | 30 min |
| U11 | **Clickable `<span>` sin semántica de botón/link** — Múltiples instancias sin `role="button"`, `tabindex` ni manejo de teclado | 🟡 Medio | 1h |

#### Bajos

| # | Issue | Severidad | Esfuerzo |
|---|-------|-----------|----------|
| U12 | **20 font sizes distintas** — Sin escala tipográfica definida | 🟢 Bajo | 2h |
| U13 | **Sin enlace de ayuda/soporte** — Usuarios trabados no tienen a dónde recurrir | 🟢 Bajo | 30 min |

---

### Accesibilidad (WCAG 2.2 AA)

Issues de accesibilidad agrupados por severidad. Target: Nivel AA.

#### Críticos / Altos

| # | Issue | WCAG | Esfuerzo |
|---|-------|------|----------|
| A01 | **Ausencia de `<main>` landmark** — Todo el contenido vive en un fragment; screen readers no pueden navegar por landmark | 1.3.1 A / 2.4.1 A | 30 min |
| A02 | **Mobile menu: keyboard trap + off-screen focus** — Links invisibles en tab order; sin focus management al abrir/cerrar; falta handler Escape | 2.1.1 A / 2.4.3 A | 4h |
| A03 | **Sin estilos `:focus-visible`** — Keyboard users no ven indicación visual de posición | 2.4.7 AA | 2h |
| A04 | **Contraste insuficiente en carrusel arrows (non-text)** — Icono blanco sobre fondo amarillo / disabled opacity 30% | 1.4.11 AA | 1h |
| A05 | **SVGs decorativos sin `aria-hidden="true"`** — En ValueCard, FAQs, Hero, Actividades, Footer, WhatsApp | 1.1.1 A | 15 min |

#### Medios

| # | Issue | WCAG | Esfuerzo |
|---|-------|------|----------|
| A06 | **Skip link target sin focus indicator** — `<span id="main-content">` invisible al recibir foco programático | 2.4.1 A | 30 min |
| A07 | **Iconos sociales en Footer < 24×24px target size** — SVGs de 22×22px sin padding | 2.5.8 AA | 15 min |
| A08 | **`<nav>` sin `aria-label`** — Falta identificación del rol de navegación | 4.1.2 A / 1.3.1 A | 5 min |
| A09 | **Logo `alt` redundante** — `alt="Drake Academy"` duplica el texto visible | 1.1.1 A | 5 min |
| A10 | **Profesor `alt` no descriptivo** — Describe la persona, no el contenido visual | 1.1.1 A | 10 min |
| A11 | **External links sin indicador de nueva ventana** — Links a WhatsApp y redes sociales no advierten `target="_blank"` | 2.4.4 A | 30 min |
| A12 | **`dangerouslySetInnerHTML` sin sanitizar en ValueCard** — Potencial XSS; falta validación de contenido | 4.1.1 A | 1h |

#### Bajos

| # | Issue | WCAG | Esfuerzo |
|---|-------|------|----------|
| A13 | **Empty `aria-live` div en layout** — Algunos lectores anuncian el live region vacío | 4.1.3 AA | 15 min |

---

### Consistencia Visual

Issues visuales agrupados por tipo (colores, bordes, componentes, espaciado, micro-interacciones, tipografía).

#### Altos

| # | Issue | Tipo | Esfuerzo |
|---|-------|------|----------|
| V01 | **Colores hardcodeados fuera de paleta** — `#00c853`, `#9c27b0` en Rangos; `#0a58ca` en Navbar CTA | 🎨 Colores | 2h |
| V02 | **Posición de borde acentuado inconsistente** — ValueCard: top, Actividades: bottom, Rangos: left | 🧩 Bordes | 1h |
| V03 | **Dos lenguajes visuales de CTA** — Navbar CTA filled blue (`#0a58ca`) vs Hero CTAs outlined cyan (`border-cyan-400`) | 🧩 Componentes | 1h |

#### Medios

| # | Issue | Tipo | Esfuerzo |
|---|-------|------|----------|
| V04 | **Subtítulos de sección inconsistentes** — Misma jerarquía visual con estilos distintos entre secciones | ✒️ Tipografía | 1h |
| V05 | **Transiciones con duraciones/valores inconsistentes** — Algunas usan `duration-300`, otras `duration-500`, sin criterio unificado | ⚡ Micro-interacciones | 1h |
| V06 | **Padding de cards sin escala consistente** — ValueCard, Actividades, Rangos usan paddings distintos sin relación armónica | 📐 Espaciado | 1h |

#### Bajos

| # | Issue | Tipo | Esfuerzo |
|---|-------|------|----------|
| V07 | **Sin system-ui / font stack definido en variables** — La tipografía hereda defaults del agente de usuario | ✒️ Tipografía | 30 min |

---

## Priorización General

Todos los issues ordenados por prioridad (Crítico → Alto → Medio → Bajo), numerados globalmente.

| # | Issue | Categoría | Severidad | Esfuerzo |
|---|-------|-----------|-----------|----------|
| 1 | Crear `error.tsx` y `not-found.tsx` | Usabilidad | 🔴 Crítico | 2h |
| 2 | Ausencia de `<main>` landmark (WCAG 1.3.1 A) | Accesibilidad | 🔴 Crítico | 30 min |
| 3 | Mobile menu: keyboard trap + off-screen focus (WCAG 2.1.1 A) | Accesibilidad | 🔴 Crítico | 4h |
| 4 | Sin estilos `:focus-visible` (WCAG 2.4.7 AA) | Accesibilidad | 🔴 Crítico | 2h |
| 5 | Sin link a home (logo no redirige) | Usabilidad | 🔴 Alto | 10 min |
| 6 | Menú móvil no cierra al clickear fuera | Usabilidad | 🔴 Alto | 1h |
| 7 | Contraste carrusel arrows (WCAG 1.4.11 AA) | Accesibilidad | 🔴 Alto | 1h |
| 8 | SVGs decorativos sin `aria-hidden` (WCAG 1.1.1 A) | Accesibilidad | 🔴 Alto | 15 min |
| 9 | Colores hardcodeados fuera de paleta | Consistencia Visual | 🔴 Alto | 2h |
| 10 | Posición de borde acentuado inconsistente | Consistencia Visual | 🔴 Alto | 1h |
| 11 | Dos lenguajes visuales de CTA | Consistencia Visual | 🔴 Alto | 1h |
| 12 | Nav label "Valores" vs section `#propuesta` | Usabilidad | 🟡 Medio | 10 min |
| 13 | Sin feedback de página activa (`aria-current`) | Usabilidad | 🟡 Medio | 20 min |
| 14 | WhatsApp Float sin etiqueta visible | Usabilidad | 🟡 Medio | 30 min |
| 15 | Imágenes placeholder repetidas en carrusel | Usabilidad | 🟡 Medio | 1h |
| 16 | Mapa embebido con legibilidad reducida | Usabilidad | 🟡 Medio | 30 min |
| 17 | Sin live region para feedback asíncrono | Usabilidad | 🟡 Medio | 30 min |
| 18 | Clickable `<span>` sin semántica de botón | Usabilidad | 🟡 Medio | 1h |
| 19 | Sin botón "Volver arriba" | Usabilidad | 🟡 Medio | 1h |
| 20 | Skip link target sin focus indicator (WCAG 2.4.1 A) | Accesibilidad | 🟡 Medio | 30 min |
| 21 | Iconos sociales < 24×24px (WCAG 2.5.8 AA) | Accesibilidad | 🟡 Medio | 15 min |
| 22 | `<nav>` sin `aria-label` (WCAG 4.1.2 A) | Accesibilidad | 🟡 Medio | 5 min |
| 23 | Logo `alt` redundante (WCAG 1.1.1 A) | Accesibilidad | 🟡 Medio | 5 min |
| 24 | Profesor `alt` no descriptivo (WCAG 1.1.1 A) | Accesibilidad | 🟡 Medio | 10 min |
| 25 | External links sin new-window indicator (WCAG 2.4.4 A) | Accesibilidad | 🟡 Medio | 30 min |
| 26 | `dangerouslySetInnerHTML` sin sanitizar | Accesibilidad | 🟡 Medio | 1h |
| 27 | Subtítulos de sección inconsistentes | Consistencia Visual | 🟡 Medio | 1h |
| 28 | Transiciones con duraciones inconsistentes | Consistencia Visual | 🟡 Medio | 1h |
| 29 | Padding de cards sin escala consistente | Consistencia Visual | 🟡 Medio | 1h |
| 30 | 20 font sizes distintas — sin escala tipográfica | Usabilidad | 🟢 Bajo | 2h |
| 31 | Sin enlace de ayuda/soporte | Usabilidad | 🟢 Bajo | 30 min |
| 32 | Empty `aria-live` div en layout (WCAG 4.1.3 AA) | Accesibilidad | 🟢 Bajo | 15 min |
| 33 | Sin system-ui / font stack en variables | Consistencia Visual | 🟢 Bajo | 30 min |

---

## Esfuerzo Relativo por Grupo

| Grupo | Issues | Esfuerzo estimado | Prioridad |
|-------|--------|-------------------|-----------|
| ♿ Accesibilidad | 13 | ~11h | Máxima — riesgo legal WCAG |
| 🎨 Usabilidad | 13 | ~10h | Alta — impacto directo en experiencia |
| 🎨 Consistencia Visual | 6 | ~7h | Media — impacto en mantenibilidad y marca |
| **Total** | **32** | **~28h** | |

---

## Recomendaciones Estratégicas

1. **Adoptar un Design Token System antes de seguir agregando componentes.** Los colores hardcodeados, paddings sin escala y bordes inconsistentes son síntomas de que no existe un sistema de diseño compartido. Extraer todas las decisiones visuales a variables CSS en `globals.css` (colores, espaciado 4px base, border-radius, transiciones, tipografía). Esto solo no resuelve los bugs actuales, pero evita que vuelvan a aparecer.

2. **Resolver los blockers de accesibilidad primero** — son los de menor esfuerzo relativo (~11h total) y los que tienen implicaciones legales (WCAG 2.2 AA). Además, varios se solapan con issues de usabilidad (menú móvil, foco, landmarks), así que arreglar accesibilidad mejora la usabilidad para todos.

3. **Unificar el lenguaje visual de CTA.** Tener un Navbar CTA filled blue y Hero CTAs outlined cyan confunde al usuario sobre cuál es la acción principal. Definir un único CTA primario (filled) y uno secundario (outlined) y aplicarlos consistentemente.

4. **No mezclar accesibilidad con refactor visual en el mismo PR.** Los cambios de accesibilidad son atómicos y de bajo riesgo (atributos ARIA, landmarks, focus styles). Los cambios visuales requieren decisión de diseño (qué color, qué espaciado). Dividir la remediación en dos tracks paralelos: (a) accesibilidad + bugs críticos, (b) consistencia visual + design tokens.

5. **Agregar un checklist de UI/UX al pipeline de PR.** Los issues recurrentes (SVGs sin aria-hidden, alt text redundante, colores fuera de paleta) se pueden detectar con linting automatizado (eslint-plugin-jsx-a11y, stylelint) antes de llegar a producción.

---

## Resumen por Fase

### Fase 1 — Evaluación Heurística (Nielsen)

Se evaluaron los 10 principios de Nielsen sobre el mockup completo. **25 hallazgos iniciales**, de los cuales 13 son únicos tras fusionar con las otras fases. El proyecto muestra buen dominio de los principios de "Reconocimiento antes que recuerdo" y "Consistencia interna" a alto nivel, pero falla en "Prevención de errores" (sin error.tsx) y "Control y libertad del usuario" (sin home link, menú sin escape). La salud general es **moderada** — los problemas son localizados y corregibles, no sistémicos.

### Fase 2 — Accesibilidad (WCAG 2.2 AA)

Se evaluaron 29 criterios WCAG 2.2 contra el código estático. **14 criterios FAIL**, 15 PASS. **13 issues únicos** tras fusión. Las fallas más graves están en Perceivable (1.1.1, 1.3.1, 1.4.11) y Operable (2.1.1, 2.4.3, 2.4.7). No hay issues en Understandable ni Robust que requieran cambios estructurales. La salud es **baja-moderada** — los blockers son pocos pero significativos (sin `<main>`, keyboard trap, sin focus-visible). Se estima ~11h para alcanzar conformancia AA.

### Fase 3 — Consistencia Visual

Se revisaron 15 aspectos de cohesión visual del diseño. **6 hallazgos únicos** tras fusión. El principal problema es la ausencia de un design system: colores fuera de paleta, bordes acentuados en posiciones arbitrarias, dos lenguajes de CTA, escalas de padding inconsistentes. La salud es **moderada-baja** — el sitio se ve bien a primera vista pero no pasa una inspección detallada de cohesión. Requiere decisión de diseño + refactor (~7h) para alinear todos los componentes.
