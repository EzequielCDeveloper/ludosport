# Exploration: Fix Audit Warnings & Suggestions

**Change**: fix-audit-warnings-suggestions
**Source**: `docs/software-quality-audit-2026-07-27.md`
**Date**: 2026-07-28
**Scope**: All WARNING + SUGGESTION findings, excluding font-related (JD-B-16) and already-done (JD-A-07)

---

## Summary

| Severity | Total | Already Fixed (Critical Cycle) | Still Present | Actionable |
|----------|-------|-------------------------------|---------------|------------|
| WARNING/SERIOUS | 27 | 8 (see below) | 19 | 19 |
| SUGGESTION/MODERATE | 19 | 2 (JD-A-07, partial JD-A-08) | 17 | 17 |
| INFO/MINOR (in scope) | 5 | 0 | 5 | 5 |
| **TOTAL** | **51** | **10** | **41** | **41** |

**Estimated total effort**: ~20-24 hours across 13 logical groups

---

## Already Fixed by Critical Cycle (No Action Needed)

These findings were addressed in `fix-critical-findings` and confirmed in code:

| ID | Finding | Evidence of Fix |
|----|---------|----------------|
| JD-B-01 | Hero invisible Firefox | `@supports` progressive enhancement in `globals.css:127-133` |
| HE-07 | StarWarsCrawl no skip | Skip button at `StarWarsCrawl.tsx:194-208` |
| HE-14/A11Y-01 | No reduced-motion JS | `useSyncExternalStore` at `StarWarsCrawl.tsx:16-24`, rAF gated at line 45 |
| HE-21/JD-B-02 | MapSection no error | `try/catch` + `error` state at `MapSection.tsx:19,65-67` |
| A11Y-02 | Map no tabIndex | `tabIndex={0}` at `MapSection.tsx:113` |
| JD-B-03 | CI no tests | `npm run test` at `ci.yml:22` |
| JD-A-03 | Missing HSTS | Header at `next.config.ts:33-35` |
| JD-A-07 | No CSP report-uri | `report-uri /csp-violations` at `next.config.ts:15` |
| A11Y-09 | Focus trap (dup HE-08) | Addressed together with HE-08 |
| HE-02 | Spinner infinite (dup HE-21) | Fixed with MapSection error state |
| HE-05 | text-stroke cross-browser (dup JD-B-01) | Fixed with @supports |

---

## Findings Still Present — Detailed Analysis

### GROUP 1: NavbarClient.tsx (A11Y-06, HE-08, JD-B-08, HE-17)

**File**: `app/components/NavbarClient.tsx` (152 lines, "use client")
**Dependencies**: `useScrollNav` hook, `NAV_LINKS` constant, `next/image`, `next/link`

#### A11Y-06: Menu mobile sin `role="dialog"` ni `aria-modal`

**Current state**: PRESENT
```tsx
// Lines 100-106 — mobile menu overlay
<div
  ref={menuRef}
  className="fixed top-0 w-[75%] max-w-xs h-full bg-[var(--color-black-2)] ..."
  style={{ right: menuOpen ? "0" : "-100%" }}
  aria-hidden={!menuOpen}
  {...(!menuOpen ? { inert: true } : {})}
>
```
No `role="dialog"`, no `aria-modal="true"`, no `aria-label` or `aria-labelledby`.

**Fix**: Add `role="dialog"`, `aria-modal="true"`, `aria-label="Menú de navegación"` when menu is open.

**Effort**: Low (15 min)

#### HE-08: Menú mobile sin focus trap

**Current state**: PRESENT
The menu has good escape mechanisms (Escape key, backdrop click, close button, link click) but NO focus trap. Users can Tab out of the open menu into background content.

Lines 22-26 move focus to first link on open, and line 16-19 returns focus to hamburger on close. But there is no Tab/Shift+Tab boundary enforcement.

**Fix**: Implement focus trap — on Tab at last link, wrap to close button. On Shift+Tab at first link (close button), wrap to last link.

**Dependencies**: Could extract a `useFocusTrap` hook for reuse.
**Effort**: Medium (1-1.5 h)

#### JD-B-08: `inert` sin fallback

**Current state**: PRESENT
```tsx
// Line 105
{...(!menuOpen ? { inert: true } : {})}
```
No feature detection. In browsers without `inert` support (Firefox < 112, Safari < 15.5), keyboard users can Tab into hidden menu links.

**Fix**: Add feature detection `'inert' in HTMLElement.prototype`. If unsupported, apply `tabIndex={-1}` to menu links when closed.

**Gotcha**: The polyfill approach is heavier than needed. Since target browsers are modern enough, the fallback can just be `tabIndex={-1}` on the container div when closed.

**Effort**: Low (30 min)

#### HE-17: Secciones sin `aria-labelledby`

**Current state**: PRESENT
The `<nav>` at line 40 has `aria-label="Navegación principal"` (good). But sections throughout the page (not in this file) lack `aria-labelledby`. The SkipLink component is referenced here but the fix belongs to individual section components.

**Effort for this file**: N/A (handled in Section component group)

---

### GROUP 2: StarWarsCrawl.tsx (JD-B-06, HE-01, JD-B-18, A11Y-13)

**File**: `app/components/StarWarsCrawl.tsx` (236 lines, "use client")
**Dependencies**: `Starfield` component, `useSyncExternalStore`

#### JD-B-06: Doble control del `transform` (DOM + React)

**Current state**: PRESENT
```tsx
// Line 103 — rAF mutates DOM directly:
content.style.transform = `perspective(250px) rotateX(5deg) translateY(${Math.round(-progress * travel)}px)`;

// Lines 225-227 — React sets initial inline style:
<div
  ref={contentRef}
  className="w-full crawl__content"
  style={{ transform: "perspective(250px) rotateX(5deg) translateY(0px)" }}
>
```

**Impact**: If any state change triggers a re-render, React resets transform to `translateY(0px)` briefly before rAF overwrites it, causing a visual jump.

**Fix**: Remove the inline `style` prop from the JSX. Set the initial transform via ref in `useEffect` before starting the rAF loop. Alternative: use a CSS class for the initial state and let rAF take over.

**Effort**: Low (30 min)

#### HE-01: Sin indicador de progreso de scroll

**Current state**: PRESENT
The StarWarsCrawl has a skip button (added in critical cycle) but no visual progress indicator. Users don't know how much scroll remains.

**Fix**: Add a subtle "Scroll para continuar" hint that fades after first scroll, OR a thin vertical progress bar on the side of the crawl panel.

**Effort**: Low (30 min)

#### JD-B-18: Medidas no se recalculan en resize

**Current state**: PRESENT
```tsx
// Lines 31-41 — measurement runs once:
if (!initiated.current) {
  const vh = window.innerHeight;
  const contentH = content.scrollHeight || vh;
  travelRef.current = contentH + vh;
  const budget = Math.round((contentH + vh) * 0.7);
  panel.style.height = `${budget}px`;
  initiated.current = true;
}
```
`initiated.current` prevents re-measurement. After viewport resize, the spacer height and travel distance are stale.

**Fix**: Add a `resize` event listener (debounced) that resets `initiated.current = false` and re-measures. Must also recalculate if `reducedMotion` or `skipped` changes.

**Effort**: Low (30 min)

#### A11Y-13: `<br>` tags en texto del crawl

**Current state**: PRESENT
```tsx
// Lines 128-165 — crawl text uses <br> mid-sentence:
<p className="font-body ...">
  En una época donde las pantallas dominan
  <br />
  el tiempo libre de los jóvenes...
</p>
```
Four `<p>` blocks each contain 2-4 `<br>` tags that fragment reading for screen readers.

**Fix**: Remove `<br>` tags and let text flow naturally. The visual line-breaking is cosmetic and can be achieved with CSS `max-width` on the text container or simply letting the text wrap.

**Effort**: Low (15 min)

---

### GROUP 3: Actividades.tsx + useHorizontalCarousel.ts (A11Y-04, A11Y-10, HE-15, HE-16, HE-19, JD-B-05, JD-B-07)

**Files**: `app/components/Actividades.tsx` (124 lines), `app/hooks/useHorizontalCarousel.ts` (95 lines)
**Dependencies**: `ACTIVIDADES` constant (10 items), `next/image`

#### A11Y-04: Dots sin `aria-current`

**Current state**: PRESENT
```tsx
// Actividades.tsx lines 92-103
<button
  key={actividad.num}
  onClick={() => scrollTo(i)}
  className={`w-6 h-6 border-2 ... ${i === currentIndex ? "bg-[var(--color-yellow)] ..." : "..."}`}
  aria-label={`Ir a actividad ${i + 1}`}
/>
```
No `aria-current` or `aria-pressed` to indicate active dot.

**Fix**: Add `aria-current={i === currentIndex ? "true" : "false"}`.

**Effort**: Low (5 min)

#### A11Y-10: Carrusel sin `role` ni instrucciones de teclado

**Current state**: PRESENT
```tsx
// Actividades.tsx lines 25-38
<div
  ref={scrollRef}
  className="actividades__scroll overflow-x-auto ..."
  tabIndex={0}
  onKeyDown={(e) => { ... }}
>
```
Has `tabIndex={0}` and keyboard handler but no `role="region"`, `aria-roledescription`, or `aria-label` with instructions.

**Fix**: Add `role="region"`, `aria-roledescription="carrusel"`, `aria-label="Carrusel de actividades — usa las flechas para navegar"`.

**Effort**: Low (10 min)

#### HE-15: State update redundante en boundary

**Current state**: PRESENT
```tsx
// useHorizontalCarousel.ts lines 36-44
const scrollTo = useCallback(
  (index: number) => {
    const el = ref.current;
    const step = snapWidth();
    if (!el || step <= 0) return;
    const clamped = Math.max(0, Math.min(index, totalCards - 1));
    el.scrollTo({ left: clamped * step, behavior: "smooth" });
    setCurrentIndex(clamped);  // ← Always sets, even if same value
    currentIdxRef.current = clamped;
  },
  [ref, snapWidth, totalCards],
);
```

**Fix**: Add `if (clamped === currentIdxRef.current) return;` before the state update.

**Effort**: Low (5 min)

#### HE-16: Carrusel oculta cantidad de actividades

**Current state**: PRESENT
No counter like "3 / 10" visible. Dots show positions but not the total explicitly.

**Fix**: Add a visible counter `<span>3 / 10</span>` next to the dots.

**Effort**: Low (15 min)

#### HE-19: Carrusel sin instrucciones de teclado visibles

**Current state**: PRESENT
Keyboard handler exists but no visible hint.

**Fix**: Add `<span className="sr-only">Usa las flechas izquierda y derecha para navegar entre actividades</span>` inside the carousel container.

**Effort**: Low (5 min)

#### JD-B-05: `NaN` en array vacío

**Current state**: PARTIALLY MITIGATED
```tsx
// useHorizontalCarousel.ts lines 62-85
// Scroll handler:
const step = snapWidth();
if (step <= 0) return;  // ← Guards against step=0
const idx = Math.round(el.scrollLeft / step);
```
The scroll handler now has `step <= 0` guard. But `scrollTo` at line 43 still calls `setCurrentIndex(clamped)` unconditionally.

**Fix**: Add early return `if (totalCards <= 0) return;` at hook top, or guard in `scrollTo`.

**Effort**: Low (5 min)

#### JD-B-07: `snapWidth` no recalcula en resize

**Current state**: PRESENT
```tsx
// useHorizontalCarousel.ts lines 26-34
const snapWidth = useCallback(() => {
  const el = ref.current;
  if (!el) return 0;
  const track = el.firstElementChild;
  if (!track) return 0;
  const cards = track.children;
  if (cards.length < 2) return 0;
  return (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
}, [ref]);
```
`snapWidth()` reads fresh DOM values each call, so the VALUE updates on resize. But the carousel's `scrollLeft` is NOT re-snapped after resize, causing the index indicator to desync.

**Fix**: Add `ResizeObserver` on the container that re-snaps to the nearest card index after resize.

**Effort**: Medium (30 min - 1 h)

---

### GROUP 4: Security Hardening — next.config.ts (JD-A-06, JD-A-08, JD-A-09)

**File**: `next.config.ts` (49 lines)

#### JD-A-06: CSP `img-src` permite `blob:` y `data:`

**Current state**: PRESENT
```ts
// Line 9
img-src 'self' https://placehold.co https://*.basemaps.cartocdn.com https://*.openstreetmap.org blob: data:;
```
Leaflet tiles load via HTTPS, not blob/data. These schemes are unnecessary.

**Fix**: Remove `blob:` and `data:` from `img-src`.

**Gotcha**: Verify no other component uses data URIs (e.g., `next/image` placeholder). Check `Profesor.tsx` and `Actividades.tsx` — they use local paths, not data URIs. Safe to remove.

**Effort**: Low (5 min)

#### JD-A-08: `unsafe-eval` en desarrollo (documentar)

**Current state**: PRESENT (dev-only, acceptable)
```ts
// Line 7
script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
```
Already dev-only. Audit recommends documenting why.

**Fix**: Add a comment explaining `unsafe-eval` is required for Next.js HMR/sourcemaps in development.

**Effort**: Low (5 min)

#### JD-A-09: Permissions-Policy incompleta

**Current state**: PRESENT
```ts
// Lines 41-43
{
  key: "Permissions-Policy",
  value: "camera=(), microphone=(), geolocation=()",
},
```
Missing: `fullscreen`, `payment`, `autoplay`, `accelerometer`, `gyroscope`, `magnetometer`.

**Fix**: Extend to `"camera=(), microphone=(), geolocation=(), accelerometer=(), autoplay=(), fullscreen=(self), gyroscope=(), magnetometer=(), payment=()"`.

**Effort**: Low (10 min)

---

### GROUP 5: Loading & Error Pages (A11Y-05, JD-B-11, HE-03, JD-A-05, JD-B-12, JD-B-17)

#### A11Y-05 + JD-B-11: Loading sin `aria-live`/`role="status"`/`aria-busy`

**Files**: `app/loading.tsx` (12 lines, Server Component)

**Current state**: PRESENT
```tsx
// loading.tsx lines 1-12
export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6" />
        <p className="font-display text-yellow-400/60 text-lg tracking-widest">
          CARGANDO...
        </p>
      </div>
    </div>
  );
}
```
No `role="status"`, no `aria-live`, no `aria-busy`, no sr-only text.

**Fix**: Add `role="status" aria-live="polite" aria-busy="true"` to the wrapper div. Add `<span className="sr-only">Cargando página...</span>`.

**Effort**: Low (10 min)

#### HE-03: Loading state con flash

**Current state**: PRESENT
As a Next.js `loading.tsx`, this shows during route transitions. The audit notes it may flash imperceptibly.

**Fix**: Low priority — consider `Suspense` with `fallback={null}` for smoother transitions. Or just keep as-is since it's cosmetic.

**Effort**: Low (15 min) — OPTIONAL, low impact

#### JD-A-05: Error digest visible en producción

**File**: `app/error.tsx` (74 lines, "use client")

**Current state**: PRESENT
```tsx
// Lines 38-41
{error.digest && (
  <p className="font-body text-xs text-white/30 mb-8">
    Error ID: {error.digest}
  </p>
)}
```
Digest is shown to users. Not a stack trace, but can be used for correlation attacks.

**Fix**: Hide in production: `{error.digest && process.env.NODE_ENV === "development" && (...)}`. Or replace with a generic "Reference ID" that maps to server-side logs.

**Effort**: Low (5 min)

#### JD-B-12: Error page sin ruta de escape alternativa

**Current state**: PRESENT
```tsx
// Lines 44-50
<button onClick={reset} ...>
  Intentar de nuevo
</button>
```
Only has retry. If error is persistent, user is stuck.

**Fix**: Add `<Link href="/">Volver al inicio</Link>` next to retry button.

**Effort**: Low (5 min)

#### JD-B-17: Error boundary sin reporting

**Current state**: PRESENT
```tsx
// Lines 9-15
export default function Error({ error, reset }: { ... }) {
  // No useEffect to report error
  return ( ... );
}
```

**Fix**: Add `useEffect(() => { console.error(error); }, [error])` at minimum. For production, consider a lightweight error reporting service or at minimum `console.error` with the digest.

**Dependencies**: No external service configured. Start with `console.error`.
**Effort**: Low (15 min)

---

### GROUP 6: Footer.tsx (A11Y-07)

**File**: `app/components/Footer.tsx` (118 lines, Server Component)

#### A11Y-07: Footer usa `<h4>` sin `<h3>` previo

**Current state**: PRESENT
```tsx
// Lines 31, 50
<h4 className="font-display text-xs ...">Navegación</h4>
<h4 className="font-display text-xs ...">Contacto</h4>
```
Heading hierarchy jumps from `<h2>` (used in page sections) to `<h4>`, skipping `<h3>`.

**Fix**: Change both `<h4>` to `<h3>`.

**Effort**: Low (2 min)

---

### GROUP 7: MapSection.tsx (A11Y-08)

**File**: `app/components/MapSection.tsx` (121 lines, "use client")

#### A11Y-08: MapSection sin heading

**Current state**: PRESENT
```tsx
// Lines 79-119
<section className="py-24">
  <div className="container ...">
    <div className="max-w-4xl mx-auto ...">
      {/* No <h2> or <h3> heading */}
      <div ref={containerRef} ... />
    </div>
  </div>
</section>
```

**Fix**: Add `<h2>UBICACIÓN</h2>` with matching styling above the map container. Follow the same pattern as other sections (yellow, font-display, centered).

**Effort**: Low (5 min)

---

### GROUP 8: FAQs.tsx + constants.ts (JD-A-02, A11Y-14, HE-10)

**Files**: `app/components/FAQs.tsx` (46 lines, "use client"), `lib/constants.ts` (234 lines)

#### JD-A-02: `dangerouslySetInnerHTML` en FAQs

**Current state**: PRESENT
```tsx
// FAQs.tsx lines 35-38
<p
  className="font-body text-base text-white leading-relaxed"
  dangerouslySetInnerHTML={{ __html: faq.answer }}
/>
```
```ts
// constants.ts line 171 — the HTML content:
"<strong>Horarios:</strong> Jueves y Viernes de 5:00 a 7:00 pm, Sábados de 4:30 a 7:00 pm.<br><br><strong>Costos:</strong> ..."
```
Currently safe (hardcoded), but fragile if content source changes.

**Approach A**: Replace HTML in constants with structured data (e.g., `answerParts: Array<{type: 'text' | 'strong', content: string}>`), render with JSX. Removes the need for `dangerouslySetInnerHTML`.
**Approach B**: Add DOMPurify as defense-in-depth.
**Approach C**: Keep as-is since content is 100% hardcoded and no CMS is planned. Add a code comment documenting the risk.

**Recommendation**: Approach A is cleanest but most work. Approach C is pragmatic. Given this is a landing page with no CMS, Approach C with a warning comment is acceptable. If the team plans to add a CMS, Approach A.

**Effort**: Approach A: Medium (2 h), Approach C: Low (5 min)

#### A11Y-14: Doble `<br>` en tercera FAQ

**Current state**: PRESENT
```ts
// constants.ts line 171
"<strong>Horarios:</strong>...<br><br><strong>Costos:</strong>..."
```

**Fix**: If keeping `dangerouslySetInnerHTML`, change `<br><br>` to `<br>`. If refactoring to structured data (JD-A-02 Approach A), this resolves automatically.

**Effort**: Depends on JD-A-02 approach

#### HE-10: FAQs permiten múltiples items abiertos

**Current state**: PRESENT
```tsx
// FAQs.tsx line 18
<details key={faq.question} className="group">
```
No `name` attribute for accordion behavior.

**Fix**: Add `name="faq-accordion"` to all `<details>` elements. Modern browsers (Chrome 120+, Firefox 130+, Safari 17.4+) support grouped `<details>` accordion behavior via the `name` attribute.

**Gotcha**: Fallback for older browsers — they'll still allow multiple open. This is acceptable progressive enhancement.

**Effort**: Low (5 min)

---

### GROUP 9: Rangos.tsx (JD-B-13, HE-06)

**File**: `app/components/Rangos.tsx` (44 lines, Server Component)

#### JD-B-13: `isMaestro` hardcoded por índice

**Current state**: PRESENT
```tsx
// Line 17
const isMaestro = index === 4;
```
Fragile to data reordering.

**Fix**: Use `rango.nivel === "V"` or add `isMaestro` to the `Rango` interface.

**Dependencies**: `RANGOS` constant, `Rango` interface in `constants.ts`.

**Effort**: Low (5 min)

#### HE-06: Colores no mapean a progresión de artes marciales

**Current state**: PRESENT
```ts
// constants.ts lines 198-233 — color progression:
// I → blue, II → green, III → yellow, IV → purple, V → white
```
The audit notes this is more "lightsaber crystal lore" than traditional martial arts belt progression (white → yellow → green → blue → purple/black).

**Fix options**:
1. Reorder colors to match martial arts belts
2. Keep as-is (Star Wars theme is intentional for the brand)
3. Add a tooltip explaining the ranking system

**Recommendation**: This is a BRAND DECISION. The Star Wars theme is core to Drake Academy's identity. Recommend keeping current colors and adding a brief explanatory note in the section subtitle. **Mark as won't-fix or defer.**

**Effort**: Low if changing, Low if adding explanation

---

### GROUP 10: WhatsApp & URL Safety (A11Y-03, HE-09, JD-B-14)

**Files**: `WhatsAppFloat.tsx` (22 lines), `CtaFinal.tsx` (56 lines)

#### A11Y-03: Contraste ícono WhatsApp 1.98:1

**Current state**: PRESENT
```tsx
// WhatsAppFloat.tsx line 14
<svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true">
```
White icon on `bg-[#25D366]` green = 1.98:1 contrast ratio. WCAG 1.4.11 requires 3:1 for UI components.

**Fix**: Darken the green to `#1a8a3f` (3.1:1 with white) OR change icon fill to a darker shade.

**Gotcha**: The official WhatsApp brand color IS `#25D366`. Changing it may conflict with brand guidelines. Alternative: add a subtle dark stroke/shadow to the icon paths to ensure shape visibility while keeping the brand green.

**Effort**: Low (10 min)

#### HE-09: WhatsApp CTAs abren sin confirmación

**Current state**: PRESENT
```tsx
// CtaFinal.tsx lines 44-52
<a href={ACADEMY.whatsappUrl} target="_blank" rel="noopener noreferrer" ...>
```
```tsx
// WhatsAppFloat.tsx lines 7-11
<a href={`${ACADEMY.whatsappUrl}?text=...`} target="_blank" rel="noopener noreferrer" ...>
```
No confirmation step, no `aria-describedby` hint.

**Fix**: Add `aria-describedby` pointing to a sr-only hint like "Se abre en WhatsApp". Full confirmation dialog is overkill for this use case.

**Effort**: Low (15 min)

#### JD-B-14: WhatsApp URL concatenación frágil

**Current state**: PRESENT
```tsx
// WhatsAppFloat.tsx line 8
href={`${ACADEMY.whatsappUrl}?text=Quiero%20informes%20sobre%20Drake%20Academy`}
```
Assumes no existing query params. If UTM tags are added, produces double `?`.

**Fix**:
```ts
const url = new URL(ACADEMY.whatsappUrl);
url.searchParams.set('text', 'Quiero informes sobre Drake Academy');
```

**Effort**: Low (10 min)

---

### GROUP 11: Hero + SkipLink + Layout (A11Y-12, JD-B-10, JD-A-04)

#### A11Y-12: `title` en div no interactivo

**File**: `app/components/Hero.tsx` (84 lines, Server Component)

**Current state**: PRESENT
```tsx
// Line 64
<div className="flex flex-col items-center gap-2 text-white ..." title="Desplázate hacia abajo para conocer más">
```
`title` on non-interactive element is inconsistently exposed by screen readers.

**Fix**: Replace with `<span className="sr-only">Desplázate hacia abajo para conocer más</span>` inside the div.

**Effort**: Low (5 min)

#### JD-B-10: Coordenadas geo inconsistentes

**File**: `app/layout.tsx` (69 lines)

**Current state**: PRESENT
```tsx
// layout.tsx line 42
"geo.position": "32.452;-114.7635",
```
```ts
// constants.ts line 8
coordinates: { lat: 32.461111, lng: -114.795667 },
```
~1.1 km difference. Metadata is hardcoded, not derived from constants.

**Fix**: Derive geo metadata from `ACADEMY.coordinates`:
```tsx
"geo.position": `${ACADEMY.coordinates.lat};${ACADEMY.coordinates.lng}`,
IBCM: `${ACADEMY.coordinates.lat}, ${ACADEMY.coordinates.lng}`,
"places:location": `${ACADEMY.coordinates.lat},${ACADEMY.coordinates.lng}`,
```

**Effort**: Low (5 min)

#### JD-A-04: JSON-LD `</script>` injection risk

**Files**: `lib/json-ld.ts` (108 lines), `app/layout.tsx` (69 lines)

**Current state**: PRESENT
```tsx
// layout.tsx lines 61-64
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: jsonLd }}
/>
```
```ts
// json-ld.ts line 107
return JSON.stringify(schema, null, 2);
```
`JSON.stringify` does NOT escape `<`, `>`, or `</`. If any constant contained `</script>`, it would break the tag.

**Fix**: Escape `<` in the JSON string before injection:
```ts
return JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');
```

**Effort**: Low (10 min)

---

### GROUP 12: CSS & Global (A11Y-11, HE-12)

**File**: `app/globals.css` (389 lines)

#### A11Y-11: `scroll-behavior: smooth` sin `prefers-reduced-motion`

**Current state**: PRESENT
```css
// Lines 82-84
html {
  scroll-behavior: smooth;
}
```

**Fix**:
```css
html {
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

**Effort**: Low (2 min)

#### HE-12: Tokens `--radius-*` sin usar

**Current state**: PRESENT
```css
// Lines 21-24
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```
None of these are consumed by any component. All border-radius in components uses Tailwind utilities (`rounded-sm`, `rounded-full`, etc.).

**Fix**: Either remove dead tokens OR apply them consistently via Tailwind `@theme` config. Removing is simpler.

**Recommendation**: Remove if not planned for future use. The Tailwind default radius scale is already available.

**Effort**: Low (5 min)

---

### GROUP 13: Global UX Enhancements (HE-04, HE-18, HE-11, HE-13, JD-B-04, JD-B-09, JD-B-15, HE-20, HE-22)

#### HE-04: Sin indicador global de progreso de scroll

**Current state**: PRESENT — no scroll progress bar anywhere.

**Fix**: Add a thin progress bar fixed to top of viewport. ~10 lines of client component code using `scrollY / (documentHeight - windowHeight)`.

**Effort**: Low (30 min) — new component needed

#### HE-18: Sin "back to top"

**Current state**: PRESENT — 15 sections, ~8000px page, no back-to-top button.

**Fix**: Add a floating "Volver arriba" button that appears after scrolling past Hero.

**Effort**: Low (30 min) — new component needed

#### HE-11: Cuatro estilos CTA distintos

**Current state**: PRESENT
- Hero: cyan border + white border (lines 49-60)
- Navbar: blue background (line 81)
- CtaFinal: cyan border with glow (lines 44-52)
- WhatsAppFloat: green circle (lines 7-21)

**Fix**: Extract `<CtaButton variant="cyan"|"white"|"whatsapp"|"blue">` shared component.

**Dependencies**: Used in 4 components. Need to ensure each context's styling is preserved.
**Effort**: Medium (2-3 h)

#### HE-13: 15 secciones sin componente `<Section>`

**Current state**: PRESENT
```tsx
// page.tsx lines 17-36 — 15 components as direct children of <main>
```
Each section repeats heading + subtitle + content pattern.

**Fix**: Create `<Section id title subtitle>{children}</Section>` component.

**Dependencies**: Touches every section component. Large refactor.
**Effort**: Medium (2-3 h) — HIGH IMPACT but HIGH RISK of regressions

#### JD-B-04: `useScrollNav` sin feature detection

**Current state**: PRESENT
```ts
// useScrollNav.ts lines 23-30
const observer = new IntersectionObserver(...)
```
No `'IntersectionObserver' in window` check, unlike `useStaggerAnimation.ts:15` which has it.

**Fix**: Add guard matching `useStaggerAnimation` pattern:
```ts
if (!("IntersectionObserver" in window)) {
  // Fallback: navbar stays solid, activeSection stays 'hero'
  return;
}
```

**Effort**: Low (10 min)

#### JD-B-09: Starfield 180+ box-shadows

**Current state**: PRESENT
```css
// starfield.module.css — 120 small stars (::before), 50 medium stars (::after), 15 large stars (.stars__large)
```
Animated with 60s `translateY` loop.

**Fix options**:
1. Reduce star count on mobile via media query
2. Replace with `radial-gradient` + `background-size` pattern (much cheaper)
3. Pause animation when not in viewport (IntersectionObserver)

**Recommendation**: Option 3 is the best balance — keep the visual effect but only animate when visible.

**Effort**: Medium (1-2 h)

#### JD-B-15: `next/image` sin `onError`

**Files**: `Profesor.tsx` (48 lines), `Actividades.tsx` (124 lines)

**Current state**: PRESENT
```tsx
// Profesor.tsx line 12-17
<Image
  src="/placeholders/kid-learning-with-teacher.jpg"
  alt="Instructor de esgrima..."
  fill
  className="object-cover profesor__img"
  sizes="(max-width: 768px) 100vw, 500px"
/>
```
```tsx
// Actividades.tsx lines 47-54
<Image
  src={actividad.image}
  alt={actividad.imageAlt}
  width={600}
  height={400}
  sizes="..."
  className="w-full h-full object-cover ..."
/>
```
No `onError` handler. If images fail, broken placeholders show.

**Fix**: Add `onError` handler that sets a fallback state and renders a styled div with background color and icon.

**Effort**: Low (30 min)

#### HE-20: Animaciones persistentes (Starfield + Crawl)

**Current state**: PARTIALLY ADDRESSED
- StarWarsCrawl now has skip button + reduced-motion respect (critical cycle)
- Starfield still animates 60s loop continuously across the entire page

The crawl is no longer an obstacle (skip available). The starfield performance concern remains.

**Fix**: Same as JD-B-09. Pause starfield when not in viewport.

**Effort**: Shared with JD-B-09

#### HE-22: Sin ayuda contextual en secciones interactivas

**Current state**: PRESENT
FAQs, carrusel, and WhatsApp float have no contextual help.

**Fix**: Low priority. Add `aria-describedby` hints where appropriate. Most of these overlap with A11Y-10 and HE-19 fixes.

**Effort**: Low (15 min) — mostly covered by other A11Y fixes

---

## Recommended Implementation Groupings

| Group | IDs | Files | Effort | Priority |
|-------|-----|-------|--------|----------|
| **G1: A11Y Quick Wins** | A11Y-04, A11Y-05, JD-B-11, A11Y-07, A11Y-08, A11Y-11, A11Y-12 | 5 files | ~30 min | HIGH |
| **G2: Navbar Focus Trap** | A11Y-06, HE-08, JD-B-08 | NavbarClient.tsx | ~1.5 h | HIGH |
| **G3: StarWarsCrawl Polish** | JD-B-06, HE-01, JD-B-18, A11Y-13 | StarWarsCrawl.tsx | ~1 h | MEDIUM |
| **G4: Carousel A11Y + Fixes** | A11Y-04, A11Y-10, HE-15, HE-16, HE-19, JD-B-05, JD-B-07 | Actividades.tsx + hook | ~1.5 h | HIGH |
| **G5: Security Hardening** | JD-A-06, JD-A-08, JD-A-09, JD-A-04 | next.config.ts + json-ld.ts | ~30 min | MEDIUM |
| **G6: Loading & Error** | JD-A-05, JD-B-12, JD-B-17, HE-03 | loading.tsx + error.tsx | ~30 min | MEDIUM |
| **G7: WhatsApp & URLs** | A11Y-03, HE-09, JD-B-14 | WhatsAppFloat.tsx + CtaFinal.tsx | ~30 min | MEDIUM |
| **G8: Data Integrity** | JD-B-10, JD-B-13 | layout.tsx + Rangos.tsx | ~10 min | MEDIUM |
| **G9: FAQs Cleanup** | JD-A-02 (approach C), A11Y-14, HE-10 | FAQs.tsx + constants.ts | ~15 min | MEDIUM |
| **G10: Global UX** | HE-04, HE-18 | New components + page.tsx | ~1 h | LOW |
| **G11: Starfield Optimization** | JD-B-09, HE-20 | starfield.module.css + Starfield.tsx | ~1.5 h | LOW |
| **G12: Image Error Handling** | JD-B-15 | Profesor.tsx + Actividades.tsx | ~30 min | LOW |
| **G13: Refactors (defer)** | HE-11, HE-13, HE-06, HE-12, HE-22, JD-B-04 | Multiple | ~5 h | BACKLOG |

**Total actionable effort**: ~13 h for G1-G12 (HIGH + MEDIUM + LOW priority)
**Backlog/deferred**: ~5 h for G13 (refactors and brand decisions)

---

## Gotchas & Cross-Cutting Concerns

1. **Focus trap (G2)** is the most complex single fix. Consider using `@floating-ui` or a lightweight `focus-trap-react` library rather than building from scratch. However, adding a dependency for one use case is heavy — a custom hook is ~30 lines.

2. **Section component (G13/HE-13)** is a large refactor touching every section. Recommend deferring to a separate change to avoid mixing concerns.

3. **CtaButton extraction (G13/HE-11)** also touches 4 components. The WhatsAppFloat has fundamentally different styling (circle, fixed position) — the "variant" approach needs careful design.

4. **`dangerouslySetInnerHTML` in FAQs (G9/JD-A-02)** — Approach A (structured data) is cleanest but changes the `FAQ` interface in `constants.ts`, which also feeds `json-ld.ts`. Both consumers must be updated.

5. **Starfield optimization (G11)** — IntersectionObserver approach requires converting Starfield to a client component (currently a server component). This changes the component boundary.

6. **WhatsApp brand color (G7/A11Y-03)** — Darkening the green conflicts with WhatsApp brand guidelines. The fix should preserve brand recognition while meeting contrast requirements. A dark stroke on the SVG paths may be the best compromise.

7. **ResizeObserver (G4/JD-B-07)** — ~97% browser support. For the tiny fraction without it, the desync is cosmetic-only. No fallback needed.

---

## Dependencies Map

```
ACTIVIDADES (constants.ts)
  └── Actividades.tsx → useHorizontalCarousel.ts
  
FAQS (constants.ts)
  ├── FAQs.tsx (dangerouslySetInnerHTML)
  └── json-ld.ts (FAQPage schema)

ACADEMY (constants.ts)
  ├── layout.tsx (geo metadata — JD-B-10)
  ├── WhatsAppFloat.tsx (URL construction — JD-B-14)
  ├── CtaFinal.tsx (whatsappUrl)
  └── MapSection.tsx (coordinates — already fixed)

RANGOS (constants.ts)
  └── Rangos.tsx (isMaestro — JD-B-13)

useScrollNav.ts
  └── NavbarClient.tsx (consumes isSolid, activeSection)

Starfield.tsx
  └── StarWarsCrawl.tsx (embedded in crawl)
  └── page.tsx (background)
  └── error.tsx (background)
```

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Focus trap breaks mobile menu escape routes | Low | High | Test all 4 escape mechanisms after implementation |
| Section component refactor causes visual regressions | Medium | High | Defer to separate change; do pixel-compare |
| Removing `blob:`/`data:` from CSP breaks something | Low | Medium | Test Leaflet map + next/image after change |
| ResizeObserver causes re-render loop | Low | Medium | Debounce; only re-snap, don't re-render |
| Starfield → client component increases bundle | Low | Low | Measure before/after; Starfield is already CSS-only |

---

## Ready for Proposal

**Yes.** The exploration is complete with 41 actionable findings across 13 groups. The orchestrator should present the groupings to the user and ask:

1. Do you want to tackle all groups (G1-G12) in one change, or split into multiple changes (e.g., "A11Y fixes" + "Security hardening" + "UX enhancements")?
2. Should G13 (refactors: Section component, CtaButton extraction) be included or deferred to a separate change?
3. For JD-A-02 (FAQs dangerouslySetInnerHTML): Approach A (structured data, 2h) or Approach C (comment + accept risk, 5 min)?
4. For HE-06 (Rangos colors): Change colors, add explanation, or keep as-is (brand decision)?
