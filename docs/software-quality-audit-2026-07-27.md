# Software Quality Audit — Ludosport

**Fecha**: 2026-07-27  
**Alcance**: Auditoría integral de calidad de software sobre el landing page de Ludosport Drake Academy  
**Auditores**: 4 subagentes especializados (Heurística UX, WCAG 2.2 AA, Security/Risk, Reliability/Robustness)  
**Repositorio**: `ludosport` — Next.js 16 App Router, TypeScript strict, Tailwind CSS 4  
**URL producción**: https://fluffy-lamington-27c3ea.netlify.app

---

## Tabla de contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Metodología](#2-metodología)
3. [Hallazgos — BLOCKER](#3-hallazgos--blocker)
4. [Hallazgos — CRITICAL](#4-hallazgos--critical)
5. [Hallazgos — WARNING / SERIOUS](#5-hallazgos--warning--serious)
6. [Hallazgos — SUGGESTION / MODERATE](#6-hallazgos--suggestion--moderate)
7. [Hallazgos — INFO / MINOR](#7-hallazgos--info--minor)
8. [Fortalezas](#8-fortalezas)
9. [Plan de remediación recomendado](#9-plan-de-remediación-recomendado)
10. [Referencia cruzada por archivo](#10-referencia-cruzada-por-archivo)

---

## 1. Resumen Ejecutivo

| Auditoría | Hallazgos | 🔴 BLOCKER | 🔴 CRITICAL | 🟠 SERIOUS/WARNING | 🟡 MODERATE/SUGGESTION | 🔵 MINOR/INFO |
|-----------|-----------|------------|-------------|--------------------|------------------------|---------------|
| Heurística UX (Nielsen) | 22 | 0 | 3 | 11 | 4 | 4 |
| WCAG 2.2 AA | 14 | 0 | 2 | 9 | 0 | 3 |
| Security & Risk (Juez A) | 11 | 0 | 2 | 3 | 5 | 1 |
| Reliability (Juez B) | 17 | 1 | 2 | 7 | 7 | 0 |
| **TOTAL** | **64** | **1** | **9** | **30** | **16** | **8** |

### Top 5 problemas por gravedad e impacto

1. **JD-B-01** 🔴 Hero invisible en Firefox — `text-stroke` no funciona, texto transparente sin fallback
2. **JD-A-01** 🔴 CSP `unsafe-inline` en producción — anula protección anti-XSS
3. **HE-07 / HE-14 / A11Y-01** 🔴 StarWarsCrawl sin `prefers-reduced-motion` ni botón de escape — riesgo vestibular
4. **HE-21 / JD-B-02 / A11Y-02** 🔴 MapSection sin error handling ni keyboard access — infinite spinner + inaccesible
5. **JD-B-03** 🔴 CI no ejecuta tests — regresiones llegan a producción sin detección

---

## 2. Metodología

### 2.1 Auditorías ejecutadas

| Auditoría | Framework | Enfoque | Agente |
|-----------|-----------|---------|--------|
| **Heurística UX** | Nielsen's 10 Usability Heuristics | Análisis de código fuente de 21 componentes + 3 hooks. Evaluación de patrones de interacción, consistencia, prevención de errores, y feedback de sistema. | `general` |
| **WCAG 2.2 AA** | Web Content Accessibility Guidelines 2.2 | Análisis estático de HTML semántico, ARIA, contraste de color, estructura de headings, keyboard navigation, y focus management en 28 archivos fuente. | `general` |
| **Security & Risk** | OWASP + CSP + Dependency | Auditoría adversarial de vectores de inyección, XSS, CSP, clickjacking, data exposure, dependencias, y supply chain en 38 archivos. | `jd-judge-a` |
| **Reliability & Robustness** | Error handling + Edge cases + Performance | Auditoría adversarial de race conditions, memory leaks, null safety, type safety, cross-browser compat, animation reliability, y test gaps en 28 archivos. | `jd-judge-b` |

### 2.2 Escalas de severidad

**UX (Heurística)**:
- 0 = Cosmético | 1 = Menor | 2 = Moderado | 3 = Mayor | 4 = Catastrófico

**WCAG**:
- Critical = Bloquea acceso, riesgo legal | Serious = Barrera mayor | Moderate = Barrera parcial | Minor = Mejora pequeña

**Judgment Day**:
- BLOCKER = Crash garantizado, memory leak, pérdida de datos
- CRITICAL = Vulnerabilidad activa, exposición de datos, fallo probable en producción
- WARNING = Riesgo moderado, fallo bajo condiciones específicas
- SUGGESTION = Riesgo bajo, oportunidad de mejora
- INFO = Observación, no es un riesgo

### 2.3 Archivos auditados

38 archivos: 17 componentes + 3 iconos + 3 hooks + 3 lib + 5 app router files + next.config.ts + globals.css + starfield.module.css + ARCHITECTURE.md + package.json + tsconfig.json + vitest.config.mts + vitest.setup.ts + eslint.config.mjs + ci.yml + 2 test files

---

## 3. Hallazgos — BLOCKER

### JD-B-01: Hero title invisible en Firefox

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-01 |
| **Severidad** | 🔴 BLOCKER |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Cross-browser compatibility |
| **Ubicación** | `app/globals.css:122-127` |
| **Esfuerzo estimado** | Low (5 líneas de CSS) |

**Descripción**: El título principal del Hero (`LUDOSPORT / DRAKE ACADEMY`) es completamente invisible en Firefox. La regla `.hero__title-stroke` usa `-webkit-text-stroke: 4px var(--color-yellow)` combinado con `-webkit-text-fill-color: transparent`. Firefox ignora `-webkit-text-stroke` (no es un prefijo estándar para este motor) pero **sí aplica** `-webkit-text-fill-color: transparent`, resultando en texto transparente sin contorno visible.

**Evidencia**:
```css
.hero__title-stroke {
  color: var(--color-red);
  -webkit-text-stroke: 4px var(--color-yellow);
  -webkit-text-fill-color: transparent;   /* Firefox SÍ aplica esto */
  text-stroke: 4px var(--color-yellow);    /* Firefox IGNORA esto */
  text-fill-color: transparent;
}
```

**Impacto**: ~4% de usuarios de desktop (cuota de mercado de Firefox) no ven el nombre de la academia en el Hero. El área del título aparece en blanco. Es la primera impresión del sitio y el elemento de branding más importante.

**Recomendación**: Usar detección de features con `@supports`:
```css
/* Firefox y navegadores sin -webkit-text-stroke */
.hero__title-stroke {
  color: var(--color-yellow);
}

/* Solo navegadores que soportan el efecto de contorno */
@supports (-webkit-text-stroke: 4px var(--color-yellow)) {
  .hero__title-stroke {
    -webkit-text-stroke: 4px var(--color-yellow);
    -webkit-text-fill-color: transparent;
  }
}
```

---

## 4. Hallazgos — CRITICAL

### JD-A-01: CSP `unsafe-inline` en producción

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-01 |
| **Severidad** | 🔴 CRITICAL |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | CSP misconfiguration |
| **Ubicación** | `next.config.ts:7` |
| **Esfuerzo estimado** | Medium (requiere refactor de CSP + middleware) |

**Descripción**: El `Content-Security-Policy` incluye `script-src 'self' 'unsafe-inline'` en **todos los entornos**, incluido producción. La directiva `'unsafe-inline'` permite la ejecución de cualquier `<script>` inline y `javascript:` URLs, anulando completamente la protección anti-XSS que el CSP debería proveer.

**Evidencia**:
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  ...
`;
```

**Impacto**: Si se introduce cualquier vector XSS (migración futura a CMS, compromiso de dependencia, bug de renderizado de React), el CSP no ofrece ninguna protección. Un atacante podría inyectar `<script>malicious()</script>` y se ejecutaría sin restricción.

**Recomendación**: Implementar CSP estricto basado en nonces usando middleware de Next.js o el componente `next/script`. Mínimo documentar por qué `'unsafe-inline'` es necesario (probablemente por los scripts de hidratación de Next.js) y agregar un endpoint `report-uri` para monitorear violaciones antes de endurecer la política.

---

### HE-07: StarWarsCrawl sin mecanismo de skip/dismiss

| Campo | Detalle |
|-------|---------|
| **ID** | HE-07 |
| **Severidad** | 🔴 CRITICAL (Severity 3 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 3. User control and freedom |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:6-173` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El StarWarsCrawl toma control total del viewport con un overlay fijo (`pointer-events-none` en el panel). No existe ningún mecanismo para saltar, cerrar, o minimizar la animación. Usuarios con desórdenes vestibulares, sensibilidad al movimiento, o simplemente quienes encuentran el efecto desorientador están forzados a scrollear a través de toda la secuencia.

**Impacto**: Exclusión de usuarios con sensibilidad al movimiento (viola WCAG 2.3.3 Animation from Interactions). No hay forma de acceder al contenido debajo del crawl sin atravesar la animación completa, que para algunos puede causar náuseas o desorientación.

**Recomendación**: Agregar un botón "Saltar intro" en la parte superior del panel del crawl (sobrescribiendo `pointer-events-none` en ese elemento específico). Al click, hacer scroll automático hasta la siguiente sección. También renderizar contenido alternativo estático cuando `prefers-reduced-motion: reduce` está activo.

---

### HE-14: StarWarsCrawl ignora `prefers-reduced-motion` en JavaScript

| Campo | Detalle |
|-------|---------|
| **ID** | HE-14 |
| **Severidad** | 🔴 CRITICAL (Severity 3 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 5. Error prevention |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:18-88` |
| **Esfuerzo estimado** | Low |

**Descripción**: El loop de animación JavaScript (`requestAnimationFrame`) en StarWarsCrawl se ejecuta incondicionalmente. No verifica `prefers-reduced-motion` a nivel de JavaScript. Mientras que el CSS del starfield respeta la media query (`starfield.module.css`), el `transform` y `opacity` lerp del crawl continúa ejecutándose cada frame sin importar la preferencia del usuario.

**Evidencia**:
```typescript
// El rAF loop aplica transformaciones 3D cada frame sin verificar motion preference
const animate = () => {
  // ...cálculo de progreso...
  content.style.transform = `perspective(250px) rotateX(5deg) translateY(${...}px)`;
  rafRef.current = requestAnimationFrame(animate);
};
```

**Impacto**: Usuarios que configuraron `prefers-reduced-motion: reduce` a nivel de sistema operativo siguen experimentando la animación del crawl porque las media queries CSS no afectan transforms aplicados por JavaScript. Puede causar mareos en usuarios sensibles.

**Recomendación**: Al inicio del `useEffect`, verificar:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Renderizar contenido estático, sin animación
  if (contentRef.current) {
    contentRef.current.style.opacity = '1';
    contentRef.current.style.transform = 'none';
  }
  return; // No iniciar el rAF loop
}
```

---

### A11Y-01: StarWarsCrawl — Riesgo vestibular sin mitigación

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-01 |
| **Severidad** | 🔴 CRITICAL |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 2.2.2 Pause, Stop, Hide / 2.3.3 Animation from Interactions |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:18-88` |
| **Esfuerzo estimado** | Medium |

**Descripción**: La animación de scroll del crawl ejecuta un loop continuo de `requestAnimationFrame` que aplica `perspective(250px) rotateX(5deg) translateY(...)` sin verificar `prefers-reduced-motion`. Cada frame recalcula opacidad y transformaciones 3D sin importar las preferencias de movimiento del usuario. No hay mecanismo para pausar, detener u ocultar la animación.

**Impacto**: Usuarios con desórdenes vestibulares pueden experimentar náuseas, mareos o desorientación por las transformaciones 3D sostenidas. El efecto parallax completo no tiene ninguna vía de opt-out. Viola WCAG 2.2 SC 2.3.3 (Animation from Interactions) y SC 2.2.2 (Pause, Stop, Hide).

**Recomendación**: Misma que HE-14: agregar verificación de `prefers-reduced-motion` al mount y renderizar texto estático sin transformaciones. Complementar con HE-07: botón de skip visible.

---

### HE-21: MapSection sin estado de error

| Campo | Detalle |
|-------|---------|
| **ID** | HE-21 |
| **Severidad** | 🔴 CRITICAL (Severity 3 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 9. Help users recognize, diagnose, and recover from errors |
| **Ubicación** | `app/components/MapSection.tsx:15-72` |
| **Esfuerzo estimado** | Low |

**Descripción**: MapSection tiene estado de carga (spinner + texto `sr-only`) pero **no tiene estado de error**. Si el `import('leaflet')` dinámico falla (red lenta, adblocker, CDN caído), el spinner permanece girando eternamente. No hay `try/catch` alrededor del import dinámico, no hay timeout de fallback, y no hay error boundary a nivel de sección.

**Impacto**: Usuarios ven un spinner infinito sin indicación de qué falló. En conexiones 3G lentas, el mapa puede tardar 10+ segundos sin feedback de progreso. Si un adblocker bloquea el CDN de Leaflet, el mapa falla silenciosamente.

**Recomendación**: Envolver el import dinámico en `try/catch` y setear un estado de error. Implementar fallback con timeout:
```typescript
try {
  const L = (await import("leaflet")).default;
  // ... inicializar mapa
} catch (err) {
  if (!cancelled) setError(true);
}

// En el render:
if (error) {
  return (
    <div className="...">
      <p>No se pudo cargar el mapa.</p>
      <a href="https://maps.google.com/?q=32.461111,-114.795667">
        Ver ubicación en Google Maps
      </a>
    </div>
  );
}
```

---

### JD-B-02: MapSection — Unhandled promise rejection en import dinámico

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-02 |
| **Severidad** | 🔴 CRITICAL |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Error handling |
| **Ubicación** | `app/components/MapSection.tsx:17-63` |
| **Esfuerzo estimado** | Low |

**Descripción**: El import dinámico de Leaflet dentro de un IIFE async en `useEffect` no tiene `try/catch`. Si el CDN de Leaflet es inaccesible o el módulo falla al cargar, la promesa rechaza como `unhandled rejection` — React no captura errores de callbacks async en `useEffect`, por lo que ningún error boundary intercepta esto.

**Evidencia**:
```typescript
useEffect(() => {
  if (!containerRef.current || mapRef.current) return;
  let cancelled = false;
  (async () => {
    const L = (await import("leaflet")).default;  // ← SIN try/catch
    if (cancelled || !containerRef.current) return;
    // ...
  })();
}, []);
```

**Impacto**: Si Leaflet falla al cargar, la promesa rechaza como `unhandledrejection`. El spinner carga eternamente. El usuario nunca ve un mensaje de error ni el mapa, y no hay camino de recuperación programático.

**Recomendación**: Misma que HE-21. Envolver en `try/catch`, setear `error` state, renderizar fallback de dirección estática.

---

### A11Y-02: MapSection — Mapa no accesible por teclado

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-02 |
| **Severidad** | 🔴 CRITICAL |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 2.1.1 Keyboard |
| **Ubicación** | `app/components/MapSection.tsx:88-93` |
| **Esfuerzo estimado** | Low |

**Descripción**: El contenedor del mapa Leaflet tiene `role="application"` y `aria-label` pero **no tiene `tabIndex`**. El div no es focusable, por lo que usuarios de teclado no pueden llegar al mapa interactivo. Los controles de zoom, links de atribución, y el popup del marcador son inalcanzables vía teclado.

**Evidencia**:
```tsx
<div
  ref={containerRef}
  className="h-[380px] w-full rounded-sm"
  style={{ background: "#000" }}
  role="application"
  aria-label="Mapa interactivo mostrando la ubicación de Drake Academy"
  // FALTA: tabIndex={0}
/>
```

**Impacto**: Usuarios de solo-teclado no pueden acceder al mapa, controles de zoom, ni al popup de ubicación. Reciben un div negro con `aria-label` pero sin capacidad de interacción. Para un sitio cuyo CTA principal es "vení a nuestra ubicación", que el mapa sea inaccesible por teclado es una falla real.

**Recomendación**: Agregar `tabIndex={0}` al div contenedor del mapa. Adicionalmente, proveer alternativa textual a la ubicación (la dirección ya aparece en CtaFinal y Footer, pero un link explícito "Ver ubicación en texto" garantiza acceso a la información).

---

### JD-B-03: CI no ejecuta tests

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-03 |
| **Severidad** | 🔴 CRITICAL |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Test gap / CI reliability |
| **Ubicación** | `.github/workflows/ci.yml:10-21` |
| **Esfuerzo estimado** | Low (1 línea) |

**Descripción**: El workflow de CI ejecuta `tsc --noEmit`, `npm run lint`, y `npm run build` pero **omite completamente `npm run test`** (o `bun run test`). Existen tests en el codebase (`FAQs.test.tsx`, `NavbarClient.test.tsx`) con configuración completa de Vitest pero jamás se ejecutan en el pipeline.

**Evidencia**:
```yaml
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run build
      # ⚠️  AUSENTE: - run: npm run test
```

**Impacto**: Fallos de tests no bloquean PRs ni pushes a main. La inversión en escribir tests se desperdicia — regresiones en componentes testeados pasan CI y llegan a producción. Componentes críticos no testeados (MapSection, StarWarsCrawl, `useHorizontalCarousel`) tienen cero validación automatizada.

**Recomendación**: Agregar `- run: npm run test` (o `bun run test`) después del paso de build. Considerar también `NODE_ENV=production` para detectar errores específicos de entorno.

---

### JD-A-03: Falta header Strict-Transport-Security (HSTS)

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-03 |
| **Severidad** | 🔴 CRITICAL (elevado de WARNING por seguridad) |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Clickjacking / Transport security |
| **Ubicación** | `next.config.ts:25-43` |
| **Esfuerzo estimado** | Low (1 línea) |

**Descripción**: Falta el header `Strict-Transport-Security` (HSTS). Si bien `frame-ancestors 'none'` y `X-Frame-Options: DENY` están correctamente configurados para protección anti-clickjacking, no hay HSTS para forzar HTTPS y prevenir ataques de SSL stripping.

**Impacto**: Sin HSTS, un atacante en posición de man-in-the-middle podría potencialmente degradar la conexión a HTTP e interceptar tráfico. El directive CSP `upgrade-insecure-requests` solo actualiza requests de recursos, no la navegación inicial.

**Recomendación**: Agregar header:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
Nota: Vercel agrega HSTS automáticamente para dominios `vercel.app` y custom domains. Para deployments fuera de Vercel es esencial.

---

## 5. Hallazgos — WARNING / SERIOUS

### A11Y-03: Contraste ícono WhatsApp — 1.98:1 (mínimo 3:1)

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-03 |
| **Severidad** | 🟠 SERIOUS |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 1.4.11 Non-text Contrast (AA) |
| **Ubicación** | `app/components/WhatsAppFloat.tsx:11-19` |
| **Esfuerzo estimado** | Low (1 cambio de color) |

**Descripción**: El ícono SVG de WhatsApp usa fill blanco (`#FFFFFF`) sobre fondo circular verde (`#25D366`). La relación de contraste entre el blanco y el verde es aproximadamente 1.98:1, muy por debajo del mínimo 3:1 requerido para componentes UI y objetos gráficos (WCAG 2.1 SC 1.4.11).

**Impacto**: Usuarios con baja visión pueden no distinguir la forma del ícono de WhatsApp de su fondo. El propósito comunicativo del ícono (identificar el botón como WhatsApp) está comprometido.

**Recomendación**: Oscurecer el verde a al menos `#1a8a3f` (logra 3.1:1) o usar un ícono con silueta más oscura. Alternativa: agregar un borde oscuro a los paths SVG para asegurar que la forma del ícono siga siendo perceptible. El `aria-label` provee identificación textual, pero el glifo visual también debe cumplir requisitos de contraste.

---

### A11Y-04: Dots del carrusel sin `aria-current`

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-04 |
| **Severidad** | 🟠 SERIOUS |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.2 Name, Role, Value (A) |
| **Ubicación** | `app/components/Actividades.tsx:93-103` |
| **Esfuerzo estimado** | Low (1 atributo) |

**Descripción**: Los botones de dots del carrusel tienen `aria-label="Ir a actividad N"` pero carecen de `aria-current` o `aria-pressed` para indicar cuál slide está activo. El estado activo se transmite solo por estilo visual (fondo amarillo vs gris/transparente).

**Impacto**: Usuarios de screen reader que navegan los dots no pueden determinar cuál corresponde al slide visible. Cada dot se lee idéntico: "Ir a actividad 1", "Ir a actividad 2", sin indicación de estado.

**Recomendación**: Agregar `aria-current="true"` al dot activo y `aria-current="false"` a los inactivos. Alternativa: `aria-pressed="true"/"false"`.

---

### A11Y-05: Loading page sin `aria-live` / `role="status"`

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-05 |
| **Severidad** | 🟠 SERIOUS |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.3 Status Messages (AA) |
| **Ubicación** | `app/loading.tsx:1-12` |
| **Esfuerzo estimado** | Low (2 atributos) |

**Descripción**: La página de carga renderiza un spinner y texto "CARGANDO..." pero no tiene `aria-live`, `role="status"`, o `role="alert"` para anunciar el estado de carga a screen readers. Es un div estático sin semántica de región viva.

**Impacto**: Usuarios de screen reader no reciben feedback cuando una transición de página dispara el estado de carga. Pueden percibir la página como congelada o rota.

**Recomendación**: Agregar `role="status"` y `aria-live="polite"` al wrapper principal. Agregar `aria-busy="true"` y `<span className="sr-only">Cargando página...</span>`.

---

### A11Y-06: Menú mobile sin `role="dialog"` ni `aria-modal`

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-06 |
| **Severidad** | 🟠 SERIOUS |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.2 Name, Role, Value (A) |
| **Ubicación** | `app/components/NavbarClient.tsx:100-139` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El overlay del menú mobile es un `div` genérico sin `role="dialog"`, sin `aria-modal="true"`, y sin `aria-labelledby` apuntando a un heading. Los screen readers lo tratan como contenido plano en el flujo del documento.

**Impacto**: Usuarios de screen reader pueden no entender que un overlay de menú apareció. Pueden navegar más allá del overlay hacia el contenido de fondo, ya que nada fuera del menú se marca como `inert` cuando el menú está abierto.

**Recomendación**: Agregar `role="dialog"`, `aria-modal="true"`, y `aria-label="Menú de navegación"` al div overlay. Aplicar `inert` a los siblings del contenido principal cuando `menuOpen` es true.

---

### A11Y-07: Footer usa `<h4>` sin `<h3>` previo — jerarquía rota

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-07 |
| **Severidad** | 🟠 SERIOUS |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 1.3.1 Info and Relationships (A) |
| **Ubicación** | `app/components/Footer.tsx:31-52` |
| **Esfuerzo estimado** | Low (cambiar `h4` → `h3`) |

**Descripción**: Los sub-headings del Footer usan `<h4>` ("Navegación", "Contacto") sin `<h3>` previo en el documento. La jerarquía salta de `<h2>` (usado en secciones de la página) directamente a `<h4>`.

**Impacto**: Usuarios de screen reader que navegan por headings encuentran una jerarquía ilógica. El salto de nivel 2 a 4 rompe el outline del documento.

**Recomendación**: Cambiar ambos `<h4>` en Footer a `<h3>`.

---

### HE-11: Cuatro estilos distintos de CTA para la misma acción

| Campo | Detalle |
|-------|---------|
| **ID** | HE-11 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 4. Consistency and standards |
| **Ubicación** | `Hero.tsx:49-61`, `NavbarClient.tsx:81`, `CtaFinal.tsx:44-52`, `WhatsAppFloat.tsx:7-21` |
| **Esfuerzo estimado** | Medium |

**Descripción**: Los botones CTA usan **cuatro tratamientos visuales distintos** para la misma acción principal (contacto por WhatsApp): Hero usa borde cyan + borde blanco, Navbar usa fondo azul sólido, CtaFinal usa borde cyan con glow, WhatsAppFloat usa círculo verde. No hay componente CTA compartido ni design token consistente.

**Impacto**: Usuarios deben re-aprender el lenguaje visual para cada CTA. La misma acción se ve diferente según contexto, debilitando reconocimiento de marca y reduciendo escaneabilidad.

**Recomendación**: Extraer un componente `<CtaButton>` con variantes (`primary/cyan`, `secondary/white`, `whatsapp/green`) y usarlo consistentemente. Centraliza `target="_blank"`, `aria-label`, y construcción de URL de WhatsApp.

---

### HE-13: 15 secciones con markup repetido — sin componente `<Section>`

| Campo | Detalle |
|-------|---------|
| **ID** | HE-13 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 4. Consistency and standards |
| **Ubicación** | `app/page.tsx:17-36` |
| **Esfuerzo estimado** | Medium |

**Descripción**: La página compone 15 secciones como hijos directos de `<main>`. Cada sección repite patrones de layout (heading + subtitle + content grid) con markup casi idéntico en Valores, Actividades, Rangos, FAQs, y CtaFinal. Esto es una violación DRY que sugiere una abstracción faltante.

**Impacto**: Inconsistencias micro se acumulan: algunos subtitles usan `uppercase tracking-[0.05em]`, otros no; algunos headings son `text-4xl sm:text-5xl`, otros varían. Carga de mantenimiento — cambiar el patrón de layout requiere editar 10+ archivos.

**Recomendación**: Crear componente `<Section id title subtitle>{children}</Section>` que garantice jerarquía de headings, espaciado, y comportamiento responsive consistente.

---

### HE-20: Animaciones persistentes — Starfield 60s loop + StarWarsCrawl

| Campo | Detalle |
|-------|---------|
| **ID** | HE-20 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 8. Aesthetic and minimalist design |
| **Ubicación** | `StarWarsCrawl.tsx:90-171`, `Starfield.tsx:1-14`, `starfield.module.css` |
| **Esfuerzo estimado** | Medium |

**Descripción**: La animación del StarWarsCrawl ocupa un overlay full-viewport con un spacer de ~70% de (content height + viewport height). Combinado con la animación CSS persistente del Starfield (60s en loop durante toda la página), la página tiene movimiento continuo e inevitable. El "presupuesto de scroll" (~1500-2500px de spacer) es desproporcionado al valor informativo del texto del crawl.

**Impacto**: El crawl es "cool" en la primera visita pero se vuelve un obstáculo en visitas repetidas. El starfield decorativo, aunque `aria-hidden`, consume GPU y crea movimiento de fondo que compite con el contenido.

**Recomendación**: Renderizar el crawl solo en la primera visita (`localStorage` flag) o proveer botón de skip prominente. Para el starfield, reducir velocidad de animación o pausar cuando el usuario no está scrolleando activamente.

---

### JD-A-02: `dangerouslySetInnerHTML` en FAQs — patrón frágil

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-02 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Injection |
| **Ubicación** | `app/components/FAQs.tsx:35-38` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El contenido de respuestas FAQ se renderiza con `dangerouslySetInnerHTML` usando HTML crudo de `constants.ts`. Actualmente seguro porque el contenido es hardcoded, pero el patrón es frágil: si el contenido de FAQs alguna vez viene de un CMS, base de datos, o input de usuario, esto se convierte en un vector XSS directo sin sanitización.

**Evidencia**:
```tsx
<p dangerouslySetInnerHTML={{ __html: faq.answer }} />
```

**Impacto**: Si la fuente de contenido cambia a incluir input no confiable, un atacante podría inyectar HTML/JavaScript arbitrario. El CSP `'unsafe-inline'` (JD-A-01) no ofrecería protección.

**Recomendación**: Refactorizar respuestas FAQ para usar texto plano con renderizado estructurado (eliminar HTML de `constants.ts` y usar JSX para formato). O agregar DOMPurify como defensa en profundidad.

---

### JD-A-04: JSON-LD con `</script>` injection risk

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-04 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Injection |
| **Ubicación** | `lib/json-ld.ts:107`, `app/layout.tsx:61-64` |
| **Esfuerzo estimado** | Low |

**Descripción**: El contenido JSON-LD se inyecta vía `dangerouslySetInnerHTML` en un `<script type="application/ld+json">` usando `JSON.stringify()`, que **no escapa** los caracteres `<`, `>`, o HTML-significativos. Si alguna respuesta FAQ o descripción de actividad contuviera la secuencia `</script>`, cerraría prematuramente el tag de script.

**Impacto**: Actualmente no explotable — ningún valor en constantes contiene `</script>`. Sin embargo, el patrón es inseguro. Si alguien agrega contenido con `</script>` a `constants.ts`, la página se rompería o permitiría inyección.

**Recomendación**: Escapar todos los `<` en strings JSON-LD antes de inyectar: `jsonLd.replace(/</g, '\\u003c')`. Alternativa: usar el componente `Script` de Next.js con `strategy="beforeInteractive"`.

---

### JD-B-04: `useScrollNav` sin feature detection de `IntersectionObserver`

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-04 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case |
| **Ubicación** | `app/hooks/useScrollNav.ts:23-30` |
| **Esfuerzo estimado** | Low |

**Descripción**: `useScrollNav` crea un `IntersectionObserver` sin verificar disponibilidad, a diferencia de `useStaggerAnimation` que sí hace el check `'IntersectionObserver' in window` y tiene fallback. Si `IntersectionObserver` no está disponible, el componente lanza error.

**Impacto**: En entornos sin `IntersectionObserver` (navegadores muy viejos, webviews restringidos, ciertos entornos de test), `NavbarClient` crashea completamente. `IntersectionObserver` tiene ~97% soporte global, pero la falla es total.

**Recomendación**: Agregar guardia de feature detection consistente con `useStaggerAnimation`. Fallback: mostrar navbar como sólido y `activeSection` como `'hero'`.

---

### JD-B-05: `useHorizontalCarousel` con array vacío — `NaN` en state

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-05 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case |
| **Ubicación** | `app/hooks/useHorizontalCarousel.ts:36-47` |
| **Esfuerzo estimado** | Low |

**Descripción**: Cuando `totalCards` es 0 (array `ACTIVIDADES` vacío), `scrollTo` clampa a `Math.max(0, Math.min(index, -1)) = 0`. Pero el handler de scroll divide por `step=0` produciendo `NaN`, que al ser comparado con `currentIdxRef.current` resulta en `true` (porque `NaN !== 0`), causando `setCurrentIndex(NaN)`.

**Impacto**: Con array vacío, el carrusel entra en estado inconsistente: `currentIndex` se vuelve `NaN`, dots renderizan incorrectamente, y el guard `isLast` retorna `false` (`0 === -1` es `false`). En práctica, `ACTIVIDADES` es constante, así que solo se manifiesta durante desarrollo.

**Recomendación**: Guardia temprana al inicio del hook para `totalCards <= 1`, retornando controles deshabilitados.

---

### JD-B-06: StarWarsCrawl — doble control del `transform` (DOM + React)

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-06 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | State consistency |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:79,116` |
| **Esfuerzo estimado** | Low |

**Descripción**: El loop `rAF` muta directamente `content.style.transform` (línea 79), pero el mismo elemento tiene un `style` attribute inline puesto por React (`style={{ transform: "perspective(250px) rotateX(5deg) translateY(0px)" }}`, línea 116). Cualquier re-render de React resetearía el transform a su valor inicial.

**Impacto**: Actualmente benigno porque StarWarsCrawl no dispara re-renders. Pero es una bomba de tiempo: si alguien agrega `useState` o una suscripción de contexto, React brevemente resetearía el texto del crawl a `translateY(0px)` antes que el próximo frame del `rAF` lo sobrescriba, causando un "salto" o flicker.

**Recomendación**: Eliminar el `style` attribute inline del JSX y setear el transform inicial vía ref en `useEffect` antes de arrancar el loop `rAF`.

---

### JD-B-07: `useHorizontalCarousel` — `snapWidth` no se recalibra en resize

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-07 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case / Responsive |
| **Ubicación** | `app/hooks/useHorizontalCarousel.ts:26-34` |
| **Esfuerzo estimado** | Low |

**Descripción**: `snapWidth` captura el offset entre las primeras dos cards una vez. En resize de viewport (rotación de móvil, resize de desktop), los anchos de card cambian pero `snapWidth` se recalcula lazy vía `useCallback` — la referencia es estable pero el valor numérico cambia porque lee `ref.current` en cada llamada. Después de resize, `scrollLeft / newStep` puede no alinearse a un boundary entero de card.

**Impacto**: El indicador de dots puede desincronizarse hasta que el usuario vuelva a scrollear. Es una inconsistencia visual menor, no un crash.

**Recomendación**: Agregar `ResizeObserver` en el contenedor del carrusel que re-snappee al índice de card más cercano después de resize.

---

### JD-B-08: `inert` sin fallback para navegadores sin soporte

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-08 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Cross-browser compatibility |
| **Ubicación** | `app/components/NavbarClient.tsx:105` |
| **Esfuerzo estimado** | Low |

**Descripción**: El overlay del menú mobile usa el atributo `inert` para prevenir foco en items ocultos. `inert` no tiene soporte en Chrome < 102, Firefox < 112, o Safari < 15.5. En navegadores sin soporte, usuarios de teclado pueden hacer Tab hacia los links del menú off-screen (`right: -100%`).

**Impacto**: En navegadores sin soporte, cuando el menú mobile está cerrado, usuarios navegando por teclado pueden hacer Tab hacia links invisibles del menú. Experiencia confusa y desorientadora.

**Recomendación**: Detectar soporte de `inert` con `'inert' in HTMLElement.prototype`. Si no hay soporte nativo, aplicar `tabIndex={-1}` a links del menú cuando está cerrado.

---

### JD-B-09: Starfield — 180+ box-shadows con animación de 60s

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-09 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Performance |
| **Ubicación** | `app/styles/starfield.module.css:20-418` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El starfield CSS usa 180+ valores `box-shadow` en tres capas de pseudo-elementos, animados en loop `translateY` de 60s. En dispositivos móviles de gama baja, calcular y componer esta cantidad de box-shadows cada frame puede causar jank y consumo de batería.

**Impacto**: En dispositivos de gama baja, la animación del starfield consume GPU significativamente. Aunque `prefers-reduced-motion` desactiva la animación, usuarios que no activaron ese setting igual experimentan el costo. Puede causar frames caídos en toda la página.

**Recomendación**: Reducir cantidad de estrellas en mobile vía media query. Alternativa: usar `radial-gradient` con `background-size` para patrón de puntos, significativamente más barato de componer.

---

### JD-B-10: Coordenadas geo inconsistentes entre metadata y `constants.ts`

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-10 |
| **Severidad** | 🟠 WARNING |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | State consistency |
| **Ubicación** | `app/layout.tsx:42` vs `lib/constants.ts:8` |
| **Esfuerzo estimado** | Low |

**Descripción**: `geo.position` en metadata de `layout.tsx` usa `32.452;-114.7635`, mientras `ACADEMY.coordinates` en `constants.ts` usa `{lat: 32.461111, lng: -114.795667}` — aproximadamente **1.1 km de diferencia**. El metadata está hardcoded y desincronizado de la fuente canónica.

**Impacto**: Motores de búsqueda reciben datos de ubicación conflictivos. El JSON-LD dice una ubicación, los meta tags HTML dicen otra. Puede perjudicar SEO local y confundir resultados de búsqueda basados en mapa.

**Recomendación**: Derivar geo metadata de `ACADEMY.coordinates` en lugar de hardcodear.

---

### HE-21 (duplicado en SERIOUS): MapSection sin estado de error

*Ver sección CRITICAL arriba — este hallazgo aparece en ambas auditorías con distinto ID.*

---

### HE-01: StarWarsCrawl sin indicador de progreso de scroll

| Campo | Detalle |
|-------|---------|
| **ID** | HE-01 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 1. Visibility of system status |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:28-88` |
| **Esfuerzo estimado** | Low |

**Descripción**: El StarWarsCrawl no provee indicador textual de progreso ni pista visual de que el overlay es scroll-driven. Usuarios no familiarizados con intros de Star Wars pueden no entender que scrollear avanza el texto. La sección consume ~70% del viewport como spacer sin feedback de distancia restante.

**Impacto**: Visitantes nuevos pueden dejar de scrollear o scrollear erráticamente, perdiendo el contenido del crawl.

**Recomendación**: Agregar un indicador sutil de scroll (chevron o texto "Desplázate para continuar") que se desvanezca al empezar a scrollear.

---

### HE-04: Sin indicador global de progreso de scroll

| Campo | Detalle |
|-------|---------|
| **ID** | HE-04 |
| **Severidad** | 🟠 WARNING (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 1. Visibility of system status |
| **Ubicación** | `app/page.tsx:19` |
| **Esfuerzo estimado** | Low |

**Descripción**: 15 secciones sin indicador de progreso global (barra de progreso de scroll o indicador de sección más allá del link activo del navbar).

**Impacto**: Usuarios scrolleando por 15 secciones no tienen sentido de cuánto han avanzado o cuánto falta.

**Recomendación**: Agregar barra de progreso fija delgada en el top del viewport que se llene de 0-100%. Es un efecto de ~10 líneas usando `scrollY / (documentHeight - windowHeight)`.

---

### HE-08: Menú mobile sin focus trap

| Campo | Detalle |
|-------|---------|
| **ID** | HE-08 |
| **Severidad** | 🟠 WARNING (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 3. User control and freedom |
| **Ubicación** | `app/components/NavbarClient.tsx:100-106` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El menú mobile tiene excelentes mecanismos de escape (Escape, backdrop click, close button, link click) pero no atrapa el foco dentro del menú abierto. Usuarios pueden hacer Tab fuera del menú hacia contenido de fondo.

**Impacto**: Usuarios de teclado en mobile pueden salir del menú sin darse cuenta, llevando el foco a elementos ocultos detrás del overlay.

**Recomendación**: Implementar focus trap: al hacer Tab en el último link, volver al botón de cerrar. Shift+Tab del botón de cerrar al último link.

---

### HE-09: WhatsApp CTAs abren sin confirmación

| Campo | Detalle |
|-------|---------|
| **ID** | HE-09 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 3. User control and freedom |
| **Ubicación** | `CtaFinal.tsx:44-52`, `WhatsAppFloat.tsx:7-21` |
| **Esfuerzo estimado** | Low |

**Descripción**: Todos los CTAs de WhatsApp abren links externos sin confirmación ni advertencia. `rel="noopener noreferrer"` está presente (correcto), pero no hay paso intermedio antes de abandonar el sitio.

**Impacto**: Usuarios pueden disparar WhatsApp accidentalmente y perder posición de scroll. El WhatsAppFloat siempre visible hace más probables los taps accidentales en mobile.

**Recomendación**: Agregar `aria-describedby` con hint "Se abre en WhatsApp". Considerar diálogo de confirmación breve o asegurar espaciado táctil adecuado.

---

### HE-15: Carousel — state update redundante en boundary

| Campo | Detalle |
|-------|---------|
| **ID** | HE-15 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 5. Error prevention |
| **Ubicación** | `Actividades.tsx:29-38`, `useHorizontalCarousel.ts:49-59` |
| **Esfuerzo estimado** | Low |

**Descripción**: `scrollTo()` resetea `currentIndex` incluso cuando el valor clampeado es igual al índice actual, causando state update redundante y potencial re-render.

**Recomendación**: Agregar early return: `if (clamped === currentIdxRef.current) return;`.

---

### HE-16: Carrusel oculta cantidad de actividades; crawl oculta contenido debajo

| Campo | Detalle |
|-------|---------|
| **ID** | HE-16 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 6. Recognition rather than recall |
| **Ubicación** | `Actividades.tsx:25-69`, `StarWarsCrawl.tsx:90-171` |
| **Esfuerzo estimado** | Low |

**Descripción**: (1) El carrusel `snap-x snap-mandatory` solo muestra una fracción de una card. Usuarios deben interactuar para descubrir que hay 10 actividades. (2) El overlay fijo del crawl oculta todo contenido debajo — usuarios nuevos pueden no saber que hay 12 secciones más.

**Recomendación**: Agregar contador visible "3 / 10" junto a los dots del carrusel. Para el crawl, indicador persistente de "scroll para continuar".

---

### HE-18: Sin "back to top" ni navegación rápida entre secciones

| Campo | Detalle |
|-------|---------|
| **ID** | HE-18 |
| **Severidad** | 🟠 WARNING (Severity 2 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 7. Flexibility and efficiency of use |
| **Ubicación** | `app/page.tsx:17-36` |
| **Esfuerzo estimado** | Low |

**Descripción**: Página única con 15 secciones, sin botón "volver arriba" ni navegación flotante entre secciones. Usuarios en el footer deben scrollear manualmente ~8000px para volver al hero.

**Recomendación**: Agregar botón flotante "Volver arriba" que aparece después de scrollear pasado el hero.

---

### A11Y-08: MapSection sin heading

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-08 |
| **Severidad** | 🟠 MODERATE (elevado a SERIOUS) |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 2.4.6 Headings and Labels (AA) |
| **Ubicación** | `app/components/MapSection.tsx:74-97` |
| **Esfuerzo estimado** | Low |

**Descripción**: MapSection no tiene heading. Contiene un mapa Leaflet con `aria-label` en el contenedor, pero no hay `<h2>` o `<h3>` que usuarios de screen reader puedan usar para navegar a esta sección.

**Impacto**: Usuarios de screen reader no pueden localizar la sección del mapa mediante atajos de navegación por headings.

**Recomendación**: Agregar `<h2>` arriba del mapa, ej. "UBICACIÓN" o "ENCUÉNTRANOS".

---

### A11Y-09: Menú mobile sin focus trap

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-09 |
| **Severidad** | 🟠 MODERATE (elevado a SERIOUS) |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 2.1.2 No Keyboard Trap (A) |
| **Ubicación** | `app/components/NavbarClient.tsx:39-151` |
| **Esfuerzo estimado** | Medium |

**Descripción**: Mismo problema que HE-08 desde perspectiva WCAG. Cuando el menú mobile está abierto, no hay focus trap. El foco escapa a contenido de fondo invisible.

**Recomendación**: Misma que HE-08: focus trap + `inert` en `<main>` cuando `menuOpen` es true.

---

### A11Y-10: Carrusel sin `role` ni instrucciones de teclado

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-10 |
| **Severidad** | 🟠 MODERATE |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.2 Name, Role, Value (A) |
| **Ubicación** | `app/components/Actividades.tsx:25-39` |
| **Esfuerzo estimado** | Low |

**Descripción**: El contenedor del carrusel tiene `tabIndex={0}` pero carece de `role` o instrucciones indicando que ArrowLeft/ArrowRight controlan el scrolling.

**Recomendación**: Agregar `role="region"`, `aria-roledescription="carrusel"`, y `aria-label="Carrusel de actividades — usa las teclas de flecha para navegar"`.

---

## 6. Hallazgos — SUGGESTION / MODERATE

### JD-A-05: Error digest visible en producción

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-05 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Information disclosure |
| **Ubicación** | `app/error.tsx:38-41` |
| **Esfuerzo estimado** | Low |

**Descripción**: El `error.digest` de Next.js se muestra a usuarios en la página de error. No es un stack trace, pero puede usarse para correlation attacks.

**Recomendación**: Ocultar el digest en producción o reemplazar con ID genérico.

---

### JD-A-06: CSP `img-src` permite `blob:` y `data:`

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-06 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | CSP |
| **Ubicación** | `next.config.ts:9` |
| **Esfuerzo estimado** | Low |

**Descripción**: CSP `img-src` permite `blob:` y `data:` URI schemes. No son inherentemente peligrosos pero pueden usarse para exfiltrar datos si existe un vector XSS.

**Recomendación**: Remover `blob:` y `data:` de `img-src` a menos que sean necesarios (Leaflet carga vía HTTPS, no se usan blob/data images).

---

### JD-A-07: Sin endpoint de reporte CSP

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-07 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | CSP monitoring |
| **Ubicación** | `next.config.ts:5-16` |
| **Esfuerzo estimado** | Low |

**Descripción**: No hay `report-uri` o `report-to` en el CSP. Sin reporte de violaciones, los bypasses en producción pasan desapercibidos.

**Recomendación**: Agregar endpoint `report-uri`. Empezar con `Content-Security-Policy-Report-Only`.

---

### JD-A-08: `unsafe-eval` en desarrollo

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-08 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | CSP |
| **Ubicación** | `next.config.ts:7` |
| **Esfuerzo estimado** | Low |

**Descripción**: CSP incluye `'unsafe-eval'` en desarrollo. Aceptable para HMR/sourcemaps pero puede enmascarar patrones que fallarían en producción.

**Recomendación**: Documentar que `eval()` no funciona en producción. Considerar `devtool: 'cheap-module-source-map'` para eliminar `'unsafe-eval'`.

---

### JD-A-09: Permissions-Policy incompleta

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-09 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | CSP / Permissions |
| **Ubicación** | `next.config.ts:36-39` |
| **Esfuerzo estimado** | Low |

**Descripción**: `Permissions-Policy` restringe solo cámara, micrófono, y geolocalización. Features como `fullscreen`, `payment`, `autoplay`, `accelerometer` no están restringidas.

**Recomendación**: Extender a `accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()`.

---

### JD-B-11: Loading page sin `aria-busy`

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-11 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Accessibility |
| **Ubicación** | `app/loading.tsx:3-11` |
| **Esfuerzo estimado** | Low |

**Descripción**: El skeleton de carga no tiene `aria-busy`, `role="status"`, ni `aria-live`.

**Recomendación**: Agregar `role="status" aria-live="polite" aria-busy="true"` y `<span className="sr-only">Cargando página...</span>`.

---

### JD-B-12: Error page sin ruta de escape alternativa

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-12 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Error handling |
| **Ubicación** | `app/error.tsx:44-50` |
| **Esfuerzo estimado** | Low |

**Descripción**: Si el error es persistente, "Intentar de nuevo" reintenta el mismo error en loop. No hay ruta de escape alternativa.

**Recomendación**: Agregar `<Link href="/">Volver al inicio</Link>` junto al botón de retry.

---

### JD-B-13: `Rangos` — índice hardcoded para detectar "Maestro"

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-13 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case |
| **Ubicación** | `app/components/Rangos.tsx:17` |
| **Esfuerzo estimado** | Low |

**Descripción**: `const isMaestro = index === 4` — usa posición de array para determinar el rango maestro. Frágil a reordenamiento de datos.

**Recomendación**: Usar `rango.nivel === 'V'` o agregar campo `isMaestro` al interface `Rango`.

---

### JD-B-14: WhatsApp URL concatenación frágil

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-14 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case |
| **Ubicación** | `app/components/WhatsAppFloat.tsx:8` |
| **Esfuerzo estimado** | Low |

**Descripción**: `${ACADEMY.whatsappUrl}?text=...` asume URL base sin query params existentes. Si se agregan UTM tags, produce URL inválida con doble `?`.

**Recomendación**: Usar `new URL()` y `searchParams.set()` para construir la URL segura:
```typescript
const url = new URL(ACADEMY.whatsappUrl);
url.searchParams.set('text', 'Quiero informes sobre Drake Academy');
href={url.toString()}
```

---

### JD-B-15: `next/image` sin `onError` handler

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-15 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Error handling |
| **Ubicación** | `Profesor.tsx:13`, `Actividades.tsx:48` |
| **Esfuerzo estimado** | Low |

**Descripción**: Componentes `next/image` para imágenes placeholder no tienen `onError` handler. Si las imágenes se pierden, se muestran placeholders rotos sin indicación visual.

**Recomendación**: Agregar `onError` handler que muestre fallback estilizado (div con color de fondo e ícono).

---

### JD-B-16: FOUT (Flash of Unstyled Text) en Star Jedi font

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-16 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Font loading / UX |
| **Ubicación** | `app/globals.css:4-10` |
| **Esfuerzo estimado** | Low |

**Descripción**: `font-display: swap` en Star Jedi causa FOUT con fallback font (Anton). El cambio de Anton (ancho, blocky) a Star Jedi (alto, condensado) es visualmente marcado con el efecto text-stroke.

**Recomendación**: Considerar `font-display: block` con timeout corto (3s) o preload del font. Agregar transición CSS en elementos que usan el font.

---

### JD-B-17: Error boundary sin reporting externo

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-17 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Error handling / Monitoring |
| **Ubicación** | `app/error.tsx:10-14` |
| **Esfuerzo estimado** | Medium |

**Descripción**: El error boundary captura errores pero nunca los reporta a servicio de monitoreo externo. Errores en producción son invisibles para el equipo.

**Recomendación**: Agregar `useEffect` que reporte el error. Mínimo `console.error` en producción.

---

### JD-B-18: StarWarsCrawl — medidas no se recalculan en resize

| Campo | Detalle |
|-------|---------|
| **ID** | JD-B-18 |
| **Severidad** | 🟡 SUGGESTION |
| **Auditoría** | Reliability & Robustness (Juez B) |
| **Categoría** | Edge case / Responsive |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:27-34` |
| **Esfuerzo estimado** | Low |

**Descripción**: Spacer height y travel distance se miden una sola vez en el primer frame del rAF. Si el viewport cambia (rotación mobile, resize desktop), las posiciones de inicio/fin del crawl quedan stale.

**Recomendación**: Agregar listener de resize que resetee `initiated.current` y recalcule medidas.

---

### HE-03: Loading state con posible flash

| Campo | Detalle |
|-------|---------|
| **ID** | HE-03 |
| **Severidad** | 🟡 SUGGESTION (Severity 0 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 1. Visibility of system status |
| **Ubicación** | `app/loading.tsx:1-12` |
| **Esfuerzo estimado** | Low |

**Descripción**: `loading.tsx` muestra spinner con "CARGANDO..." pero en una SPA sin client-side navigation, este estado solo aparece en SSR inicial y puede flashear imperceptiblemente.

**Recomendación**: Considerar `Suspense` con `fallback={null}` para evitar flash.

---

### HE-06: Rangos — colores no mapean a progresión convencional de artes marciales

| Campo | Detalle |
|-------|---------|
| **ID** | HE-06 |
| **Severidad** | 🟡 SUGGESTION (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 2. Match between system and real world |
| **Ubicación** | `app/components/Rangos.tsx:15-39` |
| **Esfuerzo estimado** | Low |

**Descripción**: Iniciado (I) es azul en vez de blanco. La progresión blue→green→yellow→purple→white es más "lightsaber crystal lore" que artes marciales.

**Recomendación**: Cambiar a progresión de cinturones o hacer explícito el tema Star Wars.

---

### HE-10: FAQs permiten múltiples items abiertos simultáneamente

| Campo | Detalle |
|-------|---------|
| **ID** | HE-10 |
| **Severidad** | 🟡 SUGGESTION (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 3. User control and freedom |
| **Ubicación** | `app/components/FAQs.tsx:17-41` |
| **Esfuerzo estimado** | Low |

**Descripción**: `<details>` no enforcea single-open. Múltiples FAQs pueden estar abiertas simultáneamente alargando la página.

**Recomendación**: Usar atributo `name` en `<details>` para comportamiento accordion (soportado en navegadores modernos).

---

### HE-17: Secciones sin `aria-labelledby`

| Campo | Detalle |
|-------|---------|
| **ID** | HE-17 |
| **Severidad** | 🟡 SUGGESTION (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 6. Recognition rather than recall |
| **Ubicación** | `NavbarClient.tsx:45`, `SkipLink.tsx:3-9`, múltiples `<section>` |
| **Esfuerzo estimado** | Low |

**Descripción**: Las `<section>` no tienen `aria-labelledby` apuntando a su `<h2>`. Screen readers navegando por landmarks obtienen regiones sin nombre.

**Recomendación**: `<section aria-labelledby="actividades-heading">` donde el `id` está en el `<h2>`.

---

### HE-19: Carrusel sin instrucciones de teclado visibles

| Campo | Detalle |
|-------|---------|
| **ID** | HE-19 |
| **Severidad** | 🟡 SUGGESTION (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 7. Flexibility and efficiency of use |
| **Ubicación** | `app/components/Actividades.tsx:29-38` |
| **Esfuerzo estimado** | Low |

**Descripción**: Carrusel soporta ArrowLeft/ArrowRight pero no muestra hint al usuario.

**Recomendación**: `<span className="sr-only">Usa las flechas izquierda y derecha para navegar entre actividades</span>`.

---

## 7. Hallazgos — INFO / MINOR

### A11Y-11: `scroll-behavior: smooth` sin `prefers-reduced-motion`

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-11 |
| **Severidad** | 🔵 MINOR |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 2.3.3 / 3.2.2 |
| **Ubicación** | `app/globals.css:82-84` |
| **Esfuerzo estimado** | Low |

**Descripción**: `html { scroll-behavior: smooth; }` sin envolver en `@media (prefers-reduced-motion: no-preference)`.

**Recomendación**: Envolver en media query o sobrescribir con `scroll-behavior: auto` en `@media (prefers-reduced-motion: reduce)`.

---

### A11Y-12: `title` attribute en div no interactivo

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-12 |
| **Severidad** | 🔵 MINOR |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.2 |
| **Ubicación** | `app/components/Hero.tsx:64` |
| **Esfuerzo estimado** | Low |

**Descripción**: `<div title="Desplázate hacia abajo para conocer más">` — `title` en elemento no interactivo es inconsistentemente expuesto por screen readers.

**Recomendación**: Reemplazar con `<span className="sr-only">` o hacer el texto visible.

---

### A11Y-13: `<br>` tags en texto del crawl

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-13 |
| **Severidad** | 🔵 MINOR |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 1.3.3 Sensory Characteristics |
| **Ubicación** | `app/components/StarWarsCrawl.tsx:131-167` |
| **Esfuerzo estimado** | Low |

**Descripción**: El texto del crawl usa `<br>` manuales mid-sentence que fragmentan la lectura en screen readers.

**Recomendación**: Eliminar `<br>` y dejar fluir natural, o separar chunks lógicos en `<p>` individuales.

---

### A11Y-14: Doble `<br>` en tercera FAQ

| Campo | Detalle |
|-------|---------|
| **ID** | A11Y-14 |
| **Severidad** | 🔵 MINOR |
| **Auditoría** | WCAG 2.2 AA |
| **Categoría** | 4.1.1 Parsing |
| **Ubicación** | `FAQs.tsx:35-38`, `constants.ts:171` |
| **Esfuerzo estimado** | Low |

**Descripción**: La tercera FAQ (Horarios y Costos) tiene `<br><br>` en `dangerouslySetInnerHTML`, creando pausas extras en screen readers.

**Recomendación**: Sanitizar doble `<br>` a uno solo, o estructurar con `<dl>`.

---

### HE-02: MapSection — spinner infinito sin timeout

| Campo | Detalle |
|-------|---------|
| **ID** | HE-02 |
| **Severidad** | 🔵 MINOR (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 1. Visibility of system status |
| **Ubicación** | `MapSection.tsx:78-87` |
| **Esfuerzo estimado** | Low |

**Descripción**: Si el import dinámico falla, el spinner persiste sin timeout ni fallback. Relacionado con HE-21 y JD-B-02.

**Recomendación**: Misma que HE-21.

---

### HE-05: `text-stroke` — diferencias cross-browser menores

| Campo | Detalle |
|-------|---------|
| **ID** | HE-05 |
| **Severidad** | 🔵 MINOR (Severity 0 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 2. Match between system and real world |
| **Ubicación** | `Hero.tsx:29-36`, `globals.css:122-127` |
| **Esfuerzo estimado** | Low |

**Descripción**: Efecto `text-stroke` puede renderizar distinto en navegadores no-WebKit. Relacionado con JD-B-01 pero de menor gravedad.

---

### HE-12: Tokens `--radius-*` sin usar

| Campo | Detalle |
|-------|---------|
| **ID** | HE-12 |
| **Severidad** | 🔵 MINOR (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 4. Consistency and standards |
| **Ubicación** | `app/globals.css:21-24` |
| **Esfuerzo estimado** | Low |

**Descripción**: Variables CSS `--radius-sm/md/lg/full` definidas en `@theme inline` pero nunca consumidas por ningún componente. Design tokens muertos.

**Recomendación**: Eliminar o aplicar consistentemente a componentes card.

---

### HE-22: Sin ayuda contextual en secciones interactivas

| Campo | Detalle |
|-------|---------|
| **ID** | HE-22 |
| **Severidad** | 🔵 MINOR (Severity 1 en escala Nielsen) |
| **Auditoría** | Heurística UX |
| **Categoría** | 10. Help and documentation |
| **Ubicación** | `FAQs.tsx:17-41`, `CtaFinal.tsx` |
| **Esfuerzo estimado** | Low |

**Descripción**: FAQ cubre bien preguntas principales pero no hay ayuda contextual en carrusel, WhatsApp float, o flujo de primer visita.

---

### JD-A-10: Next.js 16 es canal canary

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-10 |
| **Severidad** | 🔵 INFO |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Dependency risk |
| **Ubicación** | `package.json:16` |
| **Esfuerzo estimado** | N/A |

**Descripción**: Next.js 16.2.10 es canal bleeding-edge/canary. Mayor riesgo de vulnerabilidades no descubiertas vs stable 15.x.

**Recomendación**: Monitorear changelog de canary. Si es posible, considerar pin a stable 15.x.

---

### JD-A-11: Número de teléfono público en bundle cliente

| Campo | Detalle |
|-------|---------|
| **ID** | JD-A-11 |
| **Severidad** | 🔵 INFO |
| **Auditoría** | Security & Risk (Juez A) |
| **Categoría** | Data exposure |
| **Ubicación** | `lib/constants.ts:5-6` |
| **Esfuerzo estimado** | N/A |

**Descripción**: Número de WhatsApp hardcoded en constante que termina en bundle cliente. Es un número público de negocio, no un secreto.

**Recomendación**: No requiere acción. Documentado para completitud.

---

## 8. Fortalezas

### Arquitectura y código

| # | Fortaleza |
|---|-----------|
| 1 | **Server Components por defecto** — 11 de 17 componentes son SC, reduciendo bundle JS cliente significativamente. Boundary SC/CC documentado con rationale claro. |
| 2 | **TypeScript strict mode** — `"strict": true` en tsconfig, sin `any` residual, sin type assertions inseguras. |
| 3 | **Single source of truth** — Todo el contenido en `lib/constants.ts` alimenta UI y JSON-LD, garantizando paridad SEO. |
| 4 | **Custom hooks bien encapsulados** — `useScrollNav`, `useStaggerAnimation`, `useHorizontalCarousel` con responsabilidades claras. |
| 5 | **StarWarsCrawl: frame-rate independent damping** — Usa `tau=0.08s` con delta-time capping a 0.1s, maneja correctamente tab backgrounding. |
| 6 | **MapSection: guardias de doble inicialización** — `mapRef.current` check y cancelación limpia en cleanup. |
| 7 | **`useHorizontalCarousel`: RAF throttle** — Usa `requestAnimationFrame` con flag `tick` booleano para evitar updates excesivos en scroll. |
| 8 | **Cleanup consistente en `useEffect`** — Event listeners removidos, `IntersectionObserver` disconnectados, `rAF` cancelado en todos los hooks. |
| 9 | **Keys estables** — Identificadores `href`, `num`, `question`, `nivel` como keys, sin index keys ni `Math.random()`. |
| 10 | **Zero JS accordion** — FAQs usa `<details>`/`<summary>` nativos, accesible sin JavaScript. |

### Seguridad

| # | Fortaleza |
|---|-----------|
| 11 | **Defense-in-depth anti-clickjacking** — `X-Frame-Options: DENY` + `frame-ancestors 'none'`. |
| 12 | **`poweredByHeader: false`** — Oculta `X-Powered-By`, reduce information leakage. |
| 13 | **Headers de seguridad sólidos** — `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `upgrade-insecure-requests`. |
| 14 | **CSP restrictivo en otras directivas** — `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`. |
| 15 | **Sin secrets en cliente** — Cero `NEXT_PUBLIC_*`, cero `process.env` en componentes cliente. |
| 16 | **Sin almacenamiento cliente** — Sin `localStorage`, `sessionStorage`, cookies. |
| 17 | **Sin código dinámico** — Sin `eval()`, `new Function()`, ni code execution dinámico. |
| 18 | **Sin redirects controlables por usuario** — Todos los destinos de navegación hardcodeados. |
| 19 | **Custom PostCSS plugin auditable** — `lib/postcss-fix/` es simple selector removal sin filesystem ni network access. |
| 20 | **`rel="noopener noreferrer"` en todos los links externos** — Previene tab-napping y referrer leakage. |

### Accesibilidad y UX

| # | Fortaleza |
|---|-----------|
| 21 | **SkipLink impecable** — `sr-only focus:not-sr-only`, primer elemento focusable, target en `<main id="main-content" tabIndex={-1}>`. |
| 22 | **NavbarClient: focus management completo** — Escape cierra, foco retorna al hamburger, `aria-expanded`, `inert` en overlay. |
| 23 | **Alt text de calidad** — 10 actividades con descripciones detalladas y contextuales, logo con alt descriptivo. |
| 24 | **Starfield con `aria-hidden` y `prefers-reduced-motion` en CSS** — Animación decorativa correctamente oculta de AT. |
| 25 | **MapSection: `aria-live="polite"` + `role="status"` en spinner** — Anuncia carga de mapa a screen readers. |
| 26 | **Carrusel: triple navegación redundante** — Arrow buttons + dot indicators + keyboard Left/Right. |
| 27 | **WhatsAppFloat: `aria-label` + tooltip desktop** — Identificación para screen readers y usuarios visuales. |
| 28 | **Footer: `aria-label` en links sociales** — Especifica plataforma y que abren en nueva ventana. |
| 29 | **`:focus-visible` global** — Anillo de foco cyan solo en navegación por teclado, no en clicks. |
| 30 | **HTML semántico** — `<nav>`, `<main>`, `<footer>`, `<section>`, `<button>` para toggles, `<a>` para links — sin divs clickeables. |
| 31 | **SEO completo** — OpenGraph metadata, JSON-LD (LocalBusiness, FAQPage, Services, WebPage), geo tags, sitemap.xml, robots.txt. |
| 32 | **`prefers-reduced-motion` en animaciones CSS** — Hero animations usan `animation-fill-mode: both` y no loop infinito. |

---

## 9. Plan de remediación recomendado

### Fase 1 — Críticos (Sprint 1 — 1-2 semanas)

**Objetivo**: Eliminar blockers y críticos que afectan usuarios reales hoy.

| Orden | ID | Tarea | Archivo | Esfuerzo |
|-------|-----|-------|---------|----------|
| 1 | JD-B-01 | Hero visible en Firefox — `@supports` fallback | `globals.css` | 30 min |
| 2 | A11Y-01, HE-14 | `prefers-reduced-motion` en JS del StarWarsCrawl | `StarWarsCrawl.tsx` | 1 h |
| 3 | HE-07 | Botón "Saltar intro" en StarWarsCrawl | `StarWarsCrawl.tsx` | 2 h |
| 4 | HE-21, JD-B-02 | Error handling en MapSection (try/catch + fallback) | `MapSection.tsx` | 1 h |
| 5 | A11Y-02 | `tabIndex={0}` en mapa Leaflet | `MapSection.tsx` | 15 min |
| 6 | JD-B-03 | Agregar `npm run test` al CI | `ci.yml` | 15 min |
| 7 | JD-A-01 | Endurecer CSP (nonces o documentar `unsafe-inline`) | `next.config.ts` | 4 h |
| 8 | JD-A-03 | Agregar header HSTS | `next.config.ts` | 15 min |

**Total Fase 1**: ~10 horas

### Fase 2 — Serios (Sprint 2 — 1-2 semanas)

**Objetivo**: Resolver problemas de accesibilidad y consistencia que degradan la experiencia.

| Orden | ID | Tarea | Archivo | Esfuerzo |
|-------|-----|-------|---------|----------|
| 1 | A11Y-06 | Menú mobile: `role="dialog"`, `aria-modal`, focus trap | `NavbarClient.tsx` | 3 h |
| 2 | A11Y-03 | Contraste ícono WhatsApp | `WhatsAppFloat.tsx` | 15 min |
| 3 | A11Y-04 | `aria-current` en dots del carrusel | `Actividades.tsx` | 15 min |
| 4 | A11Y-05 | `aria-live` + `role="status"` en loading | `loading.tsx` | 15 min |
| 5 | A11Y-07 | Footer `<h4>` → `<h3>` | `Footer.tsx` | 15 min |
| 6 | A11Y-08 | Heading en MapSection | `MapSection.tsx` | 15 min |
| 7 | JD-A-02 | Sanitizar o refactorizar `dangerouslySetInnerHTML` en FAQs | `FAQs.tsx`, `constants.ts` | 3 h |
| 8 | JD-A-04 | Escapar `</script>` en JSON-LD | `json-ld.ts`, `layout.tsx` | 30 min |
| 9 | JD-B-04 | Feature detection `IntersectionObserver` en `useScrollNav` | `useScrollNav.ts` | 15 min |
| 10 | JD-B-05 | Guardia `totalCards <= 1` en `useHorizontalCarousel` | `useHorizontalCarousel.ts` | 15 min |
| 11 | JD-B-06 | Eliminar doble control de transform en StarWarsCrawl | `StarWarsCrawl.tsx` | 30 min |
| 12 | JD-B-10 | Sincronizar coordenadas geo con `constants.ts` | `layout.tsx` | 15 min |
| 13 | HE-11 | Extraer componente `<CtaButton>` | Nuevo + 4 files | 3 h |

**Total Fase 2**: ~13 horas

### Fase 3 — Mejoras (Sprint 3 — 1-2 semanas)

**Objetivo**: Elevar calidad general, consistencia, y monitoreo.

| Orden | ID | Tarea | Archivo | Esfuerzo |
|-------|-----|-------|---------|----------|
| 1 | HE-13 | Crear componente `<Section>` | Nuevo + `page.tsx` | 3 h |
| 2 | HE-20 | Optimizar Starfield para mobile (reducir box-shadows) | `starfield.module.css` | 2 h |
| 3 | JD-B-09 | Alternativa ligera al starfield en mobile | `starfield.module.css` | 2 h |
| 4 | JD-A-07 | Agregar `report-uri` al CSP | `next.config.ts` | 1 h |
| 5 | JD-A-09 | Extender `Permissions-Policy` | `next.config.ts` | 15 min |
| 6 | JD-B-07 | `ResizeObserver` en carrusel para recalibrar en resize | `useHorizontalCarousel.ts` | 1 h |
| 7 | JD-B-08 | Fallback para `inert` en navegadores sin soporte | `NavbarClient.tsx` | 1 h |
| 8 | JD-B-12 | Link "Volver al inicio" en error page | `error.tsx` | 15 min |
| 9 | JD-B-14 | URL constructor para WhatsApp | `WhatsAppFloat.tsx`, `CtaFinal.tsx` | 30 min |
| 10 | JD-B-15 | `onError` en `next/image` | `Profesor.tsx`, `Actividades.tsx` | 30 min |
| 11 | JD-B-17 | Error reporting básico en error boundary | `error.tsx` | 30 min |
| 12 | HE-18 | Botón "Volver arriba" | Nuevo componente | 1 h |
| 13 | HE-01, HE-04 | Indicadores de progreso de scroll | `StarWarsCrawl.tsx`, `page.tsx` | 1 h |

**Total Fase 3**: ~14 horas

### Fase 4 — Pulido (Backlog)

| ID | Tarea | Esfuerzo |
|----|-------|----------|
| JD-A-05 | Ocultar error digest en producción | 15 min |
| JD-A-06 | Remover `blob:`/`data:` de img-src CSP | 15 min |
| JD-A-08 | Documentar `unsafe-eval` dev-only | 15 min |
| JD-A-10 | Evaluar downgrade a Next.js 15 stable | Investigación |
| HE-03 | Revisar loading state para evitar flash | 30 min |
| HE-05 | Test cross-browser de text-stroke | 30 min |
| HE-06 | Alinear colores de rangos con tema | 1 h |
| HE-10 | Single-open accordion con atributo `name` | 30 min |
| HE-12 | Aplicar o eliminar tokens `--radius-*` | 30 min |
| HE-15 | Early return en `scrollTo` del carrusel | 15 min |
| HE-16 | Contador "3/10" en carrusel | 30 min |
| HE-17 | `aria-labelledby` en `<section>`s | 1 h |
| HE-19 | Instrucciones de teclado en carrusel | 15 min |
| HE-22 | Ayuda contextual en secciones interactivas | 1 h |
| A11Y-09 | Focus trap en menú mobile (mismo que HE-08) | — |
| A11Y-10 | Role e instrucciones en carrusel | 15 min |
| A11Y-11 | `scroll-behavior` con `prefers-reduced-motion` | 15 min |
| A11Y-12 | `title` → `sr-only` en Hero scroll hint | 15 min |
| A11Y-13 | Eliminar `<br>` del texto del crawl | 30 min |
| A11Y-14 | Sanitizar doble `<br>` en FAQ #3 | 15 min |
| JD-B-11 | `aria-busy` en loading | 15 min |
| JD-B-13 | `isMaestro` por dato, no por índice | 30 min |
| JD-B-16 | Optimizar font loading de Star Jedi | 30 min |
| JD-B-18 | Recalcular medidas del crawl en resize | 1 h |

---

## 10. Referencia cruzada por archivo

| Archivo | Hallazgos |
|---------|-----------|
| `app/globals.css` | JD-B-01, HE-05, HE-12, A11Y-11, JD-B-16 |
| `next.config.ts` | JD-A-01, JD-A-03, JD-A-06, JD-A-07, JD-A-08, JD-A-09 |
| `app/components/StarWarsCrawl.tsx` | HE-07, HE-14, A11Y-01, HE-01, HE-16, JD-B-06, JD-B-18, A11Y-13 |
| `app/components/MapSection.tsx` | HE-21, JD-B-02, A11Y-02, HE-02, A11Y-08 |
| `app/components/NavbarClient.tsx` | HE-08, A11Y-06, A11Y-09, JD-B-08, HE-17 |
| `app/components/Actividades.tsx` | A11Y-04, A11Y-10, HE-15, HE-16, HE-19, JD-B-15 |
| `app/components/WhatsAppFloat.tsx` | A11Y-03, HE-09, JD-B-14 |
| `app/components/CtaFinal.tsx` | HE-09, HE-11 |
| `app/components/Hero.tsx` | HE-11, HE-05, A11Y-12 |
| `app/components/Footer.tsx` | A11Y-07 |
| `app/components/Rangos.tsx` | HE-06, JD-B-13 |
| `app/components/FAQs.tsx` | JD-A-02, HE-10, A11Y-14 |
| `app/components/Profesor.tsx` | JD-B-15 |
| `app/components/Starfield.tsx` | HE-20 |
| `app/components/SkipLink.tsx` | HE-17 |
| `app/page.tsx` | HE-13, HE-18, HE-04 |
| `app/layout.tsx` | JD-A-04, JD-B-10 |
| `app/loading.tsx` | A11Y-05, JD-B-11, HE-03 |
| `app/error.tsx` | JD-A-05, JD-B-12, JD-B-17 |
| `app/hooks/useScrollNav.ts` | JD-B-04 |
| `app/hooks/useHorizontalCarousel.ts` | JD-B-05, JD-B-07, HE-15 |
| `app/hooks/useStaggerAnimation.ts` | — (sin hallazgos; referencia positiva) |
| `lib/constants.ts` | JD-B-10, JD-A-11, A11Y-14 |
| `lib/json-ld.ts` | JD-A-04 |
| `lib/colors.ts` | — (sin hallazgos) |
| `app/styles/starfield.module.css` | JD-B-09, HE-20 |
| `.github/workflows/ci.yml` | JD-B-03 |
| `package.json` | JD-A-10 |
| `ARCHITECTURE.md` | — (sin hallazgos; referencia positiva) |

---

*Documento generado el 2026-07-27. Última modificación: 2026-07-27.*  
*Próxima revisión recomendada: después de completar Fase 2 de remediación.*
