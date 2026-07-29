# Delta Spec: Fix Critical Audit Findings

## ADDED Requirements

### cross-browser-hero

#### SPEC-FCF-001: Hero Title Visible in Firefox
The system MUST render a visible hero title in browsers lacking `-webkit-text-stroke` support, at both desktop and mobile breakpoints.

**Acceptance**: Firefox desktop and mobile show readable title text. Chrome/Safari retain original stroke effect.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Firefox desktop | User loads page in Firefox | Hero section renders | Title displays as solid color, not transparent |
| 2 | Firefox mobile | Firefox viewport < 768px | Hero section renders | Title displays as solid color (1.5px stroke fallback) |
| 3 | Webkit desktop | User loads page in Chrome | Hero section renders | Title renders with `-webkit-text-stroke` outline |

### crawl-accessibility (HE-07, HE-14, A11Y-01)

#### SPEC-FCF-002: Reduced Motion JS Guard
The system MUST check `prefers-reduced-motion: reduce` and render StarWarsCrawl text at full opacity without animation transforms when active.

**Acceptance**: System does not start `requestAnimationFrame` loop when reduced motion is preferred. Text is fully opaque and static.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Reduced motion | OS `prefers-reduced-motion: reduce` is active | StarWarsCrawl mounts | Text renders static at opacity 1, no 3D transforms, no rAF loop |
| 2 | Normal motion | No reduced-motion preference | StarWarsCrawl mounts | Scroll-driven animation with transforms runs normally |

#### SPEC-FCF-003: Skip/Dismiss Button
The system MUST provide a visible, keyboard-accessible skip button on the StarWarsCrawl overlay that scrolls to the next content section when activated.

**Acceptance**: Button is visible, receives clicks, scrolls to `#propuesta`. Usable via keyboard (Enter/Space). Pointer events work despite overlay `pointer-events-none`.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Click skip | Crawl overlay is visible | User clicks "Saltar intro" | Animation stops, page scrolls to `#propuesta`, content is static |
| 2 | Keyboard skip | Crawl overlay is visible, button focused | User presses Enter or Space | Same result as click — scroll to next section |
| 3 | Reduced motion + skip | `prefers-reduced-motion: reduce` is active, skip button present | User clicks skip | Scrolls to `#propuesta` (static content already rendered) |

### map-error-handling (HE-21, JD-B-02)

#### SPEC-FCF-004: Dynamic Import Error Recovery
The system MUST catch failures from `import("leaflet")` and render a static address fallback with a Google Maps link.

**Acceptance**: Spinner does not persist indefinitely. Error fallback shows address text and `https://maps.google.com/?q=32.461111,-114.795667` link.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Import fails | Leaflet CDN unreachable (network, adblocker) | MapSection mounts | Error state renders academy address + "Ver en Google Maps" link |
| 2 | Slow network | Connection takes > 10s | MapSection mounts | Loading spinner transitions to error fallback eventually |

#### SPEC-FCF-005: Unmount-Safe Cleanup
The system MUST ignore import resolution when the component unmounts before the dynamic import completes — no state update and no error logged.

**Acceptance**: Quick navigation away during slow import produces no console error or `unhandledrejection`.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Unmount during import | `import("leaflet")` is pending | User navigates away (component unmounts) | No state update, no error surfacing |

### map-keyboard-access (A11Y-02)

#### SPEC-FCF-006: Map Container Keyboard Focus
The map container MUST have `tabIndex={0}` so keyboard users can Tab into the interactive Leaflet map.

**Acceptance**: Tab key reaches the map container. Screen reader announces `aria-label`. Leaflet zoom controls remain functional after focus.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Tab into map | Keyboard user navigates the page | User presses Tab to reach map section | Map container receives focus, `aria-label` is announced |
| 2 | Screen reader navigation | Screen reader user browses page | Focus lands on map container | The `aria-label` describing map location is read aloud |

### security-headers (JD-A-01, JD-A-03)

#### SPEC-FCF-007: Environment-Conditional CSP
The system MUST include `report-uri` in CSP only in production. Development MAY keep `unsafe-inline` without reporting.

**Acceptance**: Production responses include CSP `report-uri`. Development responses retain current CSP behavior.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Production CSP | `NODE_ENV=production` | Page is served | CSP header includes `report-uri` directive |
| 2 | Development CSP | `NODE_ENV=development` | Page is served | CSP includes `unsafe-inline`, no `report-uri` (existing behavior) |

#### SPEC-FCF-008: HSTS Header
The system MUST include `Strict-Transport-Security: max-age=63072000; includeSubDomains` on all responses.

**Acceptance**: Every HTTP response includes the HSTS header. `preload` is NOT included (irreversible for `*.netlify.app`).

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | HSTS present | Site deployed to any environment | Browser requests any page | Response includes HSTS header with `max-age=63072000; includeSubDomains` |

### ci-test-execution (JD-B-03)

#### SPEC-FCF-009: CI Runs Tests
The CI pipeline MUST execute `npm run test` after the build step. Existing 2 test files MUST pass.

**Acceptance**: CI workflow shows `npm run test` step. Pipeline fails when any test fails; passes when all pass.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | All tests pass | Code with passing tests is pushed | CI workflow runs | Pipeline succeeds, test results visible in CI log |
| 2 | Test failure | Code with a failing test is pushed | CI workflow runs `npm run test` | Pipeline fails, commit is blocked from merge |
