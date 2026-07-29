# Delta Spec: Fix Audit Warnings & Suggestions

**Change**: fix-audit-warnings-suggestions  
**Scope**: 41 WARNING + SUGGESTION findings across 13 groups → 47 requirements  
**Source**: `docs/software-quality-audit-2026-07-27.md` sections 5-7  
**Capabilities modified**: `web-standards`, `code-quality`  
**Capabilities added**: `scroll-progress`, `back-to-top`, `image-error-handling`

---

## G1: A11Y Quick Wins

### SPEC-FAWS-001: Carousel Dots aria-current (A11Y-04)

The system MUST set `aria-current="true"` on the active carousel dot button and `aria-current="false"` on inactive dots, updating on every scroll or programmatic navigation.

**Acceptance**: Screen reader announces which dot represents the currently visible activity.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Active dot | Carousel shows activity 3 of 10 | Screen reader reads dots | Active dot announces `aria-current="true"`, others `"false"` |
| 2 | Navigation | User clicks dot 5 | Carousel scrolls to activity 5 | Dot 5 becomes `aria-current="true"`, dot 3 becomes `"false"` |

### SPEC-FAWS-002: Loading Page Live Region (A11Y-05, JD-B-11)

The system MUST wrap the loading spinner in an element with `role="status"`, `aria-live="polite"`, and `aria-busy="true"`, plus a visually-hidden text "Cargando página...".

**Acceptance**: Screen readers announce loading state. `aria-busy` is present on the wrapper.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Route transition | User triggers navigation | Loading page renders | Screen reader announces "Cargando página..." via live region |
| 2 | ARIA attributes | Loading page is visible | DOM is inspected | Wrapper has `role="status"`, `aria-live="polite"`, `aria-busy="true"` |

### SPEC-FAWS-003: Footer Heading Hierarchy (A11Y-07)

The system MUST use `<h3>` tags for Footer sub-headings ("Navegación", "Contacto") instead of `<h4>`, maintaining sequential heading levels.

**Acceptance**: Heading outline skips no levels between the last page `<h2>` and Footer headings.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader outline | User navigates headings | Reaches Footer | Headings read as `<h3>` not `<h4>`, no level skip |

### SPEC-FAWS-004: MapSection Heading (A11Y-08)

The system MUST render an `<h2>` heading (e.g., "UBICACIÓN") above the map container in MapSection, styled consistently with other section headings.

**Acceptance**: Heading exists in DOM, is visible, and screen readers can navigate to it.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Heading navigation | Screen reader user browses by headings | Reaches MapSection | "UBICACIÓN" heading is announced at `<h2>` level |
| 2 | Visual consistency | Page renders | MapSection heading visible | Styled consistently with other section headings (yellow, font-display) |

### SPEC-FAWS-005: Reduced Motion Smooth Scroll (A11Y-11)

The system MUST override `scroll-behavior: smooth` to `scroll-behavior: auto` when `prefers-reduced-motion: reduce` is active.

**Acceptance**: CSS media query `@media (prefers-reduced-motion: reduce)` sets `scroll-behavior: auto`.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Reduced motion active | OS preference is `reduce` | Page loads, user scrolls | Scrolling is instant (no smooth animation) |
| 2 | Normal motion | No reduced-motion preference | User scrolls | Smooth scrolling works normally |

### SPEC-FAWS-006: Hero Scroll Hint Screen Reader (A11Y-12)

The system MUST replace the `title` attribute on the non-interactive Hero scroll hint div with a `<span className="sr-only">` containing the same text.

**Acceptance**: `title` attribute is removed. Screen readers announce the hint text.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | User reaches Hero bottom | Screen reader reads content | "Desplázate hacia abajo para conocer más" is announced via sr-only span |
| 2 | No title on div | DOM is inspected | Hero scroll hint div has no `title` attribute | Only `sr-only` span conveys the message |

---

## G2: Navbar Focus Trap

### SPEC-FAWS-007: Mobile Menu Dialog Semantics (A11Y-06)

The system MUST set `role="dialog"`, `aria-modal="true"`, and `aria-label="Menú de navegación"` on the mobile menu overlay when open. These attributes MUST be removed when closed.

**Acceptance**: Screen readers announce the overlay as a dialog. `aria-modal` prevents background interaction.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Menu opens | User taps hamburger | Mobile overlay appears | `role="dialog"`, `aria-modal="true"`, `aria-label="Menú de navegación"` are present |
| 2 | Menu closes | User taps close or Escape | Overlay hides | Dialog attributes are removed, `inert` re-applied |

### SPEC-FAWS-008: Mobile Menu Focus Trap (HE-08)

The system MUST trap keyboard focus within the open mobile menu. Tab at the last focusable element wraps to the first; Shift+Tab at the first wraps to the last.

**Acceptance**: Tab/Shift+Tab cycle never leaves the menu while open. All 4 escape mechanisms (Escape, backdrop, close btn, link click) still work.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Tab at last element | Focus on last menu link | User presses Tab | Focus wraps to close button (first element) |
| 2 | Shift+Tab at first | Focus on close button | User presses Shift+Tab | Focus wraps to last menu link |
| 3 | Escape still works | Menu is open, any element focused | User presses Escape | Menu closes, focus returns to hamburger button |

### SPEC-FAWS-009: Inert Fallback (JD-B-08)

The system MUST detect `inert` support via `'inert' in HTMLElement.prototype`. When unsupported, the system MUST apply `tabIndex={-1}` to the closed menu container to prevent keyboard access to hidden links.

**Acceptance**: In browsers without `inert`, Tab cannot reach off-screen menu links when closed.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | No inert support | Browser lacks `inert` (e.g., old Safari) | Menu is closed | Menu container has `tabIndex={-1}`, links unreachable via Tab |
| 2 | inert supported | Modern browser | Menu is closed | `inert` attribute is applied (existing behavior) |
| 3 | Menu opens | Any browser | Menu opens | `tabIndex={-1}` removed, menu links are focusable |

---

## G3: StarWarsCrawl Polish

### SPEC-FAWS-010: Single Transform Source (JD-B-06)

The system MUST NOT set an inline `style.transform` on the crawl content element via JSX. The initial transform MUST be applied via ref in `useEffect` before the rAF loop starts.

**Acceptance**: No `style` prop on the crawl content JSX element. Transform is controlled exclusively by rAF.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Initial render | StarWarsCrawl mounts | First frame renders | Transform is set via ref, not inline style prop |
| 2 | Re-render safety | Component re-renders (state change) | React reconciles | Transform is NOT reset to `translateY(0px)` — no visual jump |

### SPEC-FAWS-011: Crawl Scroll Progress Indicator (HE-01)

The system MUST display a subtle visual hint (e.g., "Scroll para continuar" text or chevron) that fades after the user starts scrolling the crawl.

**Acceptance**: Indicator visible on initial render, disappears after first scroll interaction.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Initial view | Crawl overlay is visible, no scroll yet | User sees the crawl | "Scroll para continuar" hint is visible |
| 2 | After scrolling | User scrolls down | First scroll event fires | Hint fades out (opacity → 0) |

### SPEC-FAWS-012: Crawl Resize Recalculation (JD-B-18)

The system MUST recalculate spacer height and travel distance when the viewport resizes. A debounced resize handler MUST reset measurements and re-apply them.

**Acceptance**: After viewport resize, the crawl spacer and animation range reflect the new dimensions.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Desktop resize | Crawl is active | User resizes browser window | Spacer height and travel distance update within 200ms |
| 2 | Mobile rotation | Device rotates | Viewport dimensions change | Measurements recalculate, animation continues correctly |

### SPEC-FAWS-013: Crawl Text Without br Tags (A11Y-13)

The system MUST NOT use `<br>` tags mid-sentence in crawl text paragraphs. Text MUST flow naturally, with visual line-breaking achieved via CSS `max-width` or natural wrapping.

**Acceptance**: No `<br>` elements inside crawl `<p>` tags. Text wraps naturally.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | User reads crawl text | Screen reader processes paragraphs | No artificial pauses from `<br>` mid-sentence |
| 2 | Visual rendering | Page renders | Crawl text visible | Text wraps naturally within container width |

---

## G4: Carousel A11Y + Fixes

### SPEC-FAWS-014: Carousel Region Role (A11Y-10)

The system MUST set `role="region"`, `aria-roledescription="carrusel"`, and `aria-label="Carrusel de actividades — usa las flechas para navegar"` on the carousel scroll container.

**Acceptance**: Screen readers announce the container as a carousel region with navigation instructions.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | User tabs to carousel | Screen reader reads | Announces "carrusel, Carrusel de actividades — usa las flechas para navegar" |

### SPEC-FAWS-015: Carousel Redundant State Guard (HE-15)

The `scrollTo` function MUST return early without updating state when the clamped index equals the current index.

**Acceptance**: No redundant `setCurrentIndex` call when index hasn't changed.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Same index | Current index is 3 | `scrollTo(3)` is called | Function returns early, no re-render triggered |
| 2 | Different index | Current index is 3 | `scrollTo(5)` is called | State updates, carousel scrolls to card 5 |

### SPEC-FAWS-016: Carousel Counter Display (HE-16)

The system MUST display a visible counter (e.g., "3 / 10") next to the carousel dots, updating as the user navigates.

**Acceptance**: Counter shows current position and total, visible without interaction.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Initial render | Carousel loads with 10 activities | Counter visible | Shows "1 / 10" |
| 2 | Navigation | User scrolls to activity 7 | Counter updates | Shows "7 / 10" |

### SPEC-FAWS-017: Carousel Keyboard Instructions (HE-19)

The system MUST include a visually-hidden `<span className="sr-only">` with text "Usa las flechas izquierda y derecha para navegar entre actividades" inside the carousel container.

**Acceptance**: sr-only text is present in DOM, not visible, announced by screen readers.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | User focuses carousel | Screen reader reads | Hints about arrow key navigation |
| 2 | Visual | Page renders | No visual change | sr-only text is invisible to sighted users |

### SPEC-FAWS-018: Carousel Empty Array Guard (JD-B-05)

The `useHorizontalCarousel` hook MUST return early with disabled controls when `totalCards <= 0`. No `NaN` values MAY appear in state.

**Acceptance**: With empty ACTIVIDADES array, hook returns without error, `currentIndex` remains 0.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Empty array | ACTIVIDADES is empty | Hook initializes | `currentIndex` is 0, `scrollTo` is no-op, dots are empty |
| 2 | Normal array | ACTIVIDADES has items | Hook initializes | Normal carousel behavior |

### SPEC-FAWS-019: Carousel ResizeObserver Re-snap (JD-B-07)

The system MUST observe the carousel container with `ResizeObserver` and re-snap `scrollLeft` to the nearest card boundary after resize. The re-snap MUST NOT trigger a visible jump.

**Acceptance**: After resize, dots indicator matches the visible card. No desync.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Resize | User resizes browser | Carousel container changes width | scrollLeft snaps to nearest card, dot indicator updates |
| 2 | No jump | Resize occurs during animation | Container resizes | No visible jump — smooth re-snap |

---

## G5: Security Hardening

### SPEC-FAWS-020: CSP img-src Without blob/data (JD-A-06)

The system MUST NOT include `blob:` or `data:` in the CSP `img-src` directive. Image sources MUST be limited to `'self'` and explicit HTTPS origins.

**Acceptance**: CSP header `img-src` does not contain `blob:` or `data:`. Leaflet tiles and next/image still load correctly.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | CSP header | Production build | Response headers inspected | `img-src` lacks `blob:` and `data:` |
| 2 | Map tiles | Map loads | Leaflet requests tiles | Tiles load from `*.basemaps.cartocdn.com` (allowed by CSP) |
| 3 | Next image | Component renders | next/image requests optimized | Images load from `'self'` (allowed by CSP) |

### SPEC-FAWS-021: Document unsafe-eval Dev-Only (JD-A-08)

The system MUST include a comment in `next.config.ts` explaining that `'unsafe-eval'` is required for Next.js HMR/sourcemaps in development and is excluded from production.

**Acceptance**: Comment exists near the `unsafe-eval` reference. Production CSP does not include `unsafe-eval`.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Dev CSP | Development mode | CSP inspected | `unsafe-eval` present with explanatory comment |
| 2 | Prod CSP | Production mode | CSP inspected | `unsafe-eval` absent |

### SPEC-FAWS-022: Comprehensive Permissions-Policy (JD-A-09)

The system MUST include the following directives in the Permissions-Policy header: `camera=()`, `microphone=()`, `geolocation=()`, `accelerometer=()`, `autoplay=()`, `fullscreen=(self)`, `gyroscope=()`, `magnetometer=()`, `payment=()`.

**Acceptance**: All 9 directives present. `fullscreen` allows `self`; all others are denied.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Header present | Any page request | Response headers inspected | Permissions-Policy includes all 9 directives |

### SPEC-FAWS-023: JSON-LD Script Injection Prevention (JD-A-04)

The system MUST escape `<` characters in JSON-LD output before injecting via `dangerouslySetInnerHTML`. The escape MUST use `\u003c` substitution.

**Acceptance**: JSON-LD string has no raw `<` characters. Structured data is still valid JSON-LD.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Normal content | Constants contain normal text | JSON-LD generated | `<` escaped to `\u003c`, browsers parse correctly |
| 2 | Hypothetical injection | A constant contains `</script>` | JSON-LD generated | The string is escaped, does NOT close the script tag |

---

## G6: Loading & Error

### SPEC-FAWS-024: Hide Error Digest in Production (JD-A-05)

The system MUST NOT display `error.digest` to users in production. The digest MAY be shown in development only.

**Acceptance**: Production error page shows no digest. Development may show it.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Production error | `NODE_ENV=production` | Error boundary renders | No "Error ID" text visible |
| 2 | Development error | `NODE_ENV=development` | Error boundary renders | Error digest MAY be displayed for debugging |

### SPEC-FAWS-025: Error Page Escape Route (JD-B-12)

The system MUST provide an alternative escape route on the error page — a "Volver al inicio" link to `/` — alongside the existing retry button.

**Acceptance**: Error page has both "Intentar de nuevo" button and "Volver al inicio" link.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Persistent error | Error boundary renders | User sees options | Both retry button and home link are visible |
| 2 | Click home link | User clicks "Volver al inicio" | Navigation occurs | User lands on home page `/` |

### SPEC-FAWS-026: Error Boundary Logging (JD-B-17)

The system MUST log errors to `console.error` when the error boundary catches them, including the error message and digest.

**Acceptance**: `console.error` is called with the error object. No external service required.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Error caught | Component throws | Error boundary renders | `console.error` called with error and digest |
| 2 | Production monitoring | Error occurs in production | Browser console inspected | Error is logged with digest for correlation |

### SPEC-FAWS-027: Loading State Flash Prevention (HE-03)

The system SHOULD minimize loading state flash during route transitions. The existing `loading.tsx` is acceptable; no mandatory change unless flash is visually disruptive.

**Acceptance**: Loading state renders without jarring visual flash. Consider `Suspense` with `fallback={null}` if flash occurs.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Fast transition | Route change takes < 100ms | Loading state | No perceptible flash (optional: null fallback) |
| 2 | Slow transition | Route change takes > 500ms | Loading state | Spinner is shown briefly, then content replaces it |

---

## G7: WhatsApp & URLs

### SPEC-FAWS-028: WhatsApp Icon Contrast (A11Y-03)

The system MUST ensure the WhatsApp SVG icon has a minimum 3:1 contrast ratio against its background. The approach MUST preserve brand recognition (green circle) while meeting WCAG 1.4.11.

**Acceptance**: Contrast ratio ≥ 3:1 between icon fill and background. Brand green preserved or dark stroke added.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Visual | Page renders | WhatsApp float visible | Icon shape clearly distinguishable from background |
| 2 | Contrast check | Color values inspected | Ratio calculated | Icon-to-background contrast ≥ 3:1 |

### SPEC-FAWS-029: WhatsApp External Link Hints (HE-09)

The system MUST add `aria-describedby` on WhatsApp CTAs pointing to a visually-hidden hint element with text "Se abre en WhatsApp".

**Acceptance**: Screen readers announce the external app hint. Hint is not visible to sighted users.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | User focuses WhatsApp CTA | Screen reader reads | Hint "Se abre en WhatsApp" announced |
| 2 | Visual | Page renders | No change for sighted users | sr-only hint is invisible |

### SPEC-FAWS-030: WhatsApp URL Construction (JD-B-14)

The system MUST construct WhatsApp URLs using the `URL` constructor and `searchParams.set()` instead of string concatenation. This prevents double `?` when query params exist.

**Acceptance**: Resulting URL is valid regardless of whether `whatsappUrl` already contains query params.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Base URL | `whatsappUrl` is `https://wa.me/123` | URL constructed | Result: `https://wa.me/123?text=...` |
| 2 | URL with params | `whatsappUrl` is `https://wa.me/123?ref=site` | URL constructed | Result: `https://wa.me/123?ref=site&text=...` (valid, no double `?`) |

---

## G8: Data Integrity

### SPEC-FAWS-031: Geo Coordinates From Constants (JD-B-10)

The system MUST derive all geo metadata (`geo.position`, `IBCM`, `places:location`) from `ACADEMY.coordinates` in `constants.ts`, not from hardcoded values.

**Acceptance**: Layout metadata matches `constants.ts` coordinates. No ~1.1km discrepancy.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Metadata render | Page loads | HTML meta inspected | `geo.position` matches `ACADEMY.coordinates.lat;lng` |
| 2 | Single source | `constants.ts` coordinates change | Page rebuilds | All geo metadata updates automatically |

### SPEC-FAWS-032: isMaestro By Data Field (JD-B-13)

The system MUST determine `isMaestro` by checking the rango's data property (e.g., `rango.nivel === "V"`) instead of array index position.

**Acceptance**: Reordering RANGOS array does not affect which card displays as "Maestro".

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Normal order | RANGOS in original order | Page renders | Nivel V card shows maestro styling |
| 2 | Reordered | RANGOS array reordered | Page renders | Nivel V card still shows maestro styling (not the card at index 4) |

---

## G9: FAQs Cleanup

### SPEC-FAWS-033: FAQ Structured Data (JD-A-02)

The system MUST NOT use `dangerouslySetInnerHTML` to render FAQ answers. Answers MUST be structured as JSX-compatible data (e.g., arrays of `{type: 'text' | 'strong', content: string}`) rendered with JSX elements.

**Acceptance**: No `dangerouslySetInnerHTML` in FAQs.tsx. FAQ content renders identically to current visual.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | FAQ render | FAQs component loads | Content visible | Answers show `<strong>` formatting where expected |
| 2 | No innerHTML | Code inspection | FAQs.tsx examined | No `dangerouslySetInnerHTML` present |
| 3 | JSON-LD parity | Structured data renders | JSON-LD inspected | FAQ schema still generated correctly from same data |

### SPEC-FAWS-034: FAQ Double br Removal (A11Y-14)

The system MUST NOT render consecutive `<br><br>` in FAQ answers. Visual separation between content blocks MUST be achieved via CSS margin/padding on separate elements.

**Acceptance**: No `<br><br>` sequences in rendered FAQ HTML.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | FAQ answer | Third FAQ (Horarios y Costos) renders | DOM inspected | No double `<br>` — blocks separated by styled elements |
| 2 | Screen reader | User reads FAQ | Screen reader processes | No redundant pauses from double line breaks |

### SPEC-FAWS-035: FAQ Accordion Single-Open (HE-10)

The system MUST add `name="faq-accordion"` to all `<details>` elements in FAQs, enabling native accordion behavior in supporting browsers.

**Acceptance**: In Chrome 120+, Firefox 130+, Safari 17.4+, opening one FAQ closes others. Older browsers allow multiple open (graceful degradation).

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Modern browser | Chrome 120+ | User opens FAQ #2, then FAQ #5 | FAQ #2 closes automatically |
| 2 | Older browser | Firefox 125 | User opens FAQ #2, then FAQ #5 | Both remain open (acceptable fallback) |

---

## G10: Global UX

### SPEC-FAWS-036: Scroll Progress Bar (HE-04) — NEW

The system MUST render a thin progress bar fixed to the top of the viewport that fills from 0% to 100% as the user scrolls the page. The bar MUST use `requestAnimationFrame` for smooth updates and MUST respect `prefers-reduced-motion`.

**Acceptance**: Progress bar visible, fills as user scrolls, does not interfere with content.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Top of page | User is at top | Bar renders | Width is 0% (or minimal) |
| 2 | Mid scroll | User scrolled 50% of page | Bar renders | Width is ~50% of viewport |
| 3 | Bottom of page | User reached bottom | Bar renders | Width is 100% |
| 4 | Reduced motion | `prefers-reduced-motion: reduce` | Bar renders | Bar is hidden or uses instant width (no animation) |

### SPEC-FAWS-037: Back to Top Button (HE-18) — NEW

The system MUST render a floating "Volver arriba" button that appears after scrolling past the Hero section and scrolls smoothly to the top when activated. The button MUST be hidden when near the top.

**Acceptance**: Button appears/disappears based on scroll position. Click scrolls to top.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Past hero | User scrolled past Hero height | Button renders | "Volver arriba" button is visible |
| 2 | Near top | User is at top or Hero section | Button renders | Button is hidden |
| 3 | Click | Button is visible, user clicks | Navigation occurs | Page scrolls smoothly to top |
| 4 | Keyboard | Button focused | User presses Enter/Space | Page scrolls to top |

---

## G11: Starfield Optimization

### SPEC-FAWS-038: Starfield Off-Screen Pause (JD-B-09, HE-20)

The system MUST pause the starfield CSS animation when the Starfield component is not in the viewport. An IntersectionObserver MUST toggle animation playback state. The Starfield component boundary MAY change from Server Component to Client Component to support the observer.

**Acceptance**: When scrolled away from starfield, animation is paused. CPU/GPU usage drops.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | In viewport | User is at top of page | Starfield visible | Animation runs normally |
| 2 | Out of viewport | User scrolls to bottom | Starfield not visible | Animation is paused (`animation-play-state: paused`) |
| 3 | Returns | User scrolls back to top | Starfield visible again | Animation resumes |
| 4 | Reduced motion | `prefers-reduced-motion: reduce` | Any scroll position | Animation already disabled (existing behavior) |

---

## G12: Image Error Handling

### SPEC-FAWS-039: Image Fallback on Error (JD-B-15) — NEW

The system MUST render a styled fallback element when `next/image` fails to load. The fallback MUST include a background color and optional icon, preserving layout dimensions.

**Acceptance**: Broken images show a graceful placeholder, not a broken image icon.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Profesor image fails | Image src unreachable | onError fires | Styled div with background color renders in image's place |
| 2 | Actividad image fails | Activity image src unreachable | onError fires | Styled fallback renders, layout dimensions preserved |
| 3 | Normal load | Image src is valid | Image loads | Normal image renders (no fallback) |

---

## G13: Refactors

### SPEC-FAWS-040: CtaButton Shared Component (HE-11)

The system MUST provide a `<CtaButton>` component with 4 variants (`cyan`, `white`, `blue`, `whatsapp`) that centralize WhatsApp URL construction, `target="_blank"`, `rel="noopener noreferrer"`, and consistent `aria-label` patterns.

**Acceptance**: All 4 CTA contexts use `<CtaButton>` with appropriate variant. Visual output matches current design.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Hero CTA | Hero uses `<CtaButton variant="cyan">` | Renders | Same visual as current cyan border + white border style |
| 2 | Navbar CTA | Navbar uses `<CtaButton variant="blue">` | Renders | Same visual as current blue background style |
| 3 | CtaFinal CTA | CtaFinal uses `<CtaButton variant="cyan">` | Renders | Same visual as current cyan glow style |
| 4 | WhatsApp float | Float uses `<CtaButton variant="whatsapp">` | Renders | Same visual as current green circle style |

### SPEC-FAWS-041: Section Wrapper Component (HE-13)

The system MUST provide a `<Section id title subtitle>` component that renders consistent heading hierarchy, spacing, and responsive layout. Each page section MUST use this wrapper.

**Acceptance**: All sections use `<Section>`. Headings are consistently `<h2>`. Spacing is uniform.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Consistent headings | Page renders | All sections use Section | Every section has `<h2>` with consistent styling |
| 2 | Aria-labelledby | Section has `id` and `title` | Rendered | `<section aria-labelledby="id-heading">` with matching `id` on `<h2>` |
| 3 | Responsive | Mobile viewport | Section renders | Content adapts per existing responsive patterns |

### SPEC-FAWS-042: Rangos Color Tooltip (HE-06)

The system MUST add a brief explanatory note in the Rangos section subtitle explaining that the color progression follows the Star Wars / Drake Academy theme rather than traditional martial arts belt colors.

**Acceptance**: Tooltip or subtitle text explains the color system. Current colors are preserved.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Section renders | Rangos section visible | User reads subtitle | Brief note about Star Wars theme is visible |
| 2 | Colors unchanged | Visual inspection | Colors compared to before | Same color progression (blue→green→yellow→purple→white) |

### SPEC-FAWS-043: Remove Unused Radius Tokens (HE-12)

The system MUST remove the unused `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full` CSS custom properties from `globals.css` since they are not consumed by any component.

**Acceptance**: CSS custom properties for radius are absent from `globals.css`. No visual regressions.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | CSS inspection | Styles examined | `@theme inline` block | No `--radius-*` variables present |
| 2 | Visual parity | Page renders | All components compared | Identical to pre-change (Tailwind utilities unaffected) |

### SPEC-FAWS-044: Contextual Help for Interactive Sections (HE-22)

The system MUST provide screen-reader-only contextual help for interactive sections (carousel, FAQs). The help text MUST describe available interactions.

**Acceptance**: sr-only hints exist for carousel and FAQ sections. Other a11y fixes (A11Y-10, HE-19) may already cover part of this.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Carousel help | User focuses carousel | Screen reader reads | Instructions about arrow key navigation (covered by SPEC-FAWS-017) |
| 2 | FAQ help | User focuses FAQ section | Screen reader reads | Brief hint about expanding/collapsing answers |

### SPEC-FAWS-045: Loading Screen Reader Announcement (JD-B-11)

The system MUST include a `<span className="sr-only">Cargando página...</span>` within the loading page to provide a textual announcement for screen readers, distinct from the visible "CARGANDO..." text.

**Acceptance**: sr-only span exists in loading.tsx with the loading text.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Screen reader | Loading page is visible | Screen reader processes | "Cargando página..." is announced from sr-only span |
| 2 | Visual | Page renders | Sighted user sees loading | No duplicate visible text — sr-only span is invisible |

### SPEC-FAWS-046: Section aria-labelledby (HE-17)

The system MUST set `aria-labelledby` on each `<section>` element, pointing to the `id` of its `<h2>` heading. This gives screen reader landmark navigation meaningful section names.

**Acceptance**: Every `<section>` has `aria-labelledby` matching its heading `id`.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Landmark navigation | Screen reader user navigates landmarks | Reaches a section | Section announced with name from its heading |
| 2 | All sections | Page renders | All sections inspected | Each has `aria-labelledby` pointing to a valid heading `id` |

### SPEC-FAWS-047: IntersectionObserver Feature Detection (JD-B-04)

The `useScrollNav` hook MUST check `'IntersectionObserver' in window` before creating an observer. When unsupported, the hook MUST return safe defaults (navbar solid, `activeSection` = `'hero'`).

**Acceptance**: In environments without IntersectionObserver, navbar does not crash. It renders as solid with default active section.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | No IntersectionObserver | Browser lacks API (old webview) | useScrollNav mounts | Returns defaults, no crash, navbar is solid |
| 2 | Supported | Modern browser | useScrollNav mounts | Normal scroll-based behavior |

---

## Summary

| Group | Findings | Requirements | Scenarios |
|-------|----------|-------------|-----------|
| G1: A11Y Quick Wins | 7 | 6 | 8 |
| G2: Navbar Focus Trap | 3 | 3 | 8 |
| G3: StarWarsCrawl Polish | 4 | 4 | 7 |
| G4: Carousel A11Y + Fixes | 6 | 6 | 9 |
| G5: Security Hardening | 4 | 4 | 6 |
| G6: Loading & Error | 4 | 5 | 9 |
| G7: WhatsApp & URLs | 3 | 3 | 6 |
| G8: Data Integrity | 2 | 2 | 4 |
| G9: FAQs Cleanup | 3 | 3 | 6 |
| G10: Global UX | 2 | 2 | 8 |
| G11: Starfield Optimization | 2 | 1 | 4 |
| G12: Image Error Handling | 1 | 1 | 3 |
| G13: Refactors | 6 | 7 | 12 |
| **TOTAL** | **47** | **47** | **90** |

**Capability mapping**:
- G1-G9, G11 → Delta for `web-standards` (modified)
- G10 → New specs: `scroll-progress`, `back-to-top`
- G12 → New spec: `image-error-handling`
- G13 → Delta for `code-quality` + `web-standards` (modified)
