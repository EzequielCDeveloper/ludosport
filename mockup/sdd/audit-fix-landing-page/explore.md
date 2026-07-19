# Exploration: audit-fix-landing-page

**Context:** Ludo Sport Drake Academy — P7, single-page fencing academy landing page.
**Stack:** Static HTML5 / CSS3 / vanilla JS, no build step, no test runner.
**Audit source:** `heuristic_audit.csv` (24 rows, Nielsen + WCAG)
**Artifact store:** `openspec/`

---

## Issue 1 — Color Contrast: 10 elements below WCAG AA (High)

### Where it manifests

The worst three contrast patterns found in `main.css`:

| Pattern | CSS rule | Foreground | Background | Contrast | Font size | AA normal | AA large |
|---------|----------|-----------|------------|----------|-----------|-----------|----------|
| Footer copyright | `.footer__copy` (line 955) | `#444` | `#000` | **2.16:1** | 0.75rem (12px) | FAIL | FAIL |
| Activity number badge | `.actividad-card__num` (line 639) | `rgba(220,53,69,0.15)` | `#1a1a1a` | **1.13:1** | 2.5rem (40px) | FAIL | FAIL |
| Value card title | `.valor-card__title` (line 466) | `#dc3545` | `#1a1a1a` | **3.84:1** | 1.2rem (19.2px) | FAIL | PASS |

The remaining 7 failures are other DOM instances of `.actividad-card__num` (9 total cards) plus other low-contrast text combinations using `var(--gray)` (#888) on dark backgrounds under certain contexts.

**CSS variables involved:**
- `--gray: #888` — used in 8+ selectors (notably `#444` in footer is a hardcoded exception)
- `--red: #dc3545` — used for headings on dark backgrounds
- The `rgba(220,53,69,0.15)` on `.actividad-card__num` is a hardcoded literal, not a variable

### What needs to change

1. **`--gray` variable** — needs to be lightened to at least `#b3b3b3` (min 4.5:1 on `#000`) or adjust all backgrounds to be lighter
2. **`--red` variable** — needs to be lightened to at least `#e85a6a` for normal text on `#1a1a1a` (target 4.5:1), or backgrounds lightened
3. **`.footer__copy`** — change from `#444` to at least `#767676` (4.5:1 on `#000`) or lighter
4. **`.actividad-card__num`** — remove the 15% transparency, use a proper opaque color with sufficient contrast (e.g., `rgba(220,53,69,0.5)` at minimum, or a light gray)

### Recommended approach

Lighten the `--gray` token and the `--red` token to meet WCAG AA 4.5:1 against `#000` and `#1a1a1a` backgrounds. This single-variable change fixes most instances. For the hardcoded exception (`rgba` in `.actividad-card__num` and `#444` in `.footer__copy`), make targeted local changes.

- New `--gray`: `#b3b3b3` (5.97:1 on `#000`, 5.37:1 on `#111`)
- New `--red`: `#f06070` (5.1:1 on `#1a1a1a`, 5.5:1 on `#000`)
- `.actividad-card__num` color → `rgba(220,53,69,0.35)` (min 3.1:1 on `#1a1a1a` for the 40px display text)
- `.footer__copy` color → `#767676` (4.5:1 on `#000`)

### Cross-file dependencies

- `main.css` only — all color tokens and hardcoded values are here
- No JS or HTML changes needed for this fix
- Verify with a contrast checker after changes

---

## Issue 2 — No home page link (logo links to `#`) (High)

### Where it manifests

`main.html` line 18:
```html
<a href="#" class="navbar__logo">
```

### What needs to change

The logo `<a>` must link to a sensible "home" destination. For a single-page site, the options are:
- `href="/"` — site root (canonical)
- `href="#hero"` — top of the page (consistent with all other section links)

### Recommended approach

Use `href="/"` for the canonical home link. This is semantically correct and works with or without JS. The `#` is a placeholder that provides no escape route.

In a single-page site, `#hero` is a viable fallback since it scrolls to the hero section (same as top-of-page for most users). But `/` is more standard.

### Cross-file dependencies

- `main.html` line 18 only
- No CSS or JS changes needed

---

## Issue 3 — Target size: 15 targets < 24×24 CSS px (Medium)

### Where it manifests

Two groups of undersized targets in `main.html`:

**Group A — Nav links without padding (6 targets, lines 28–33 on desktop):**
The 6 regular `.navbar__link` elements have no padding at desktop viewport (`min-width: 768px`). The `<a>` has only `font-size: 0.85rem` (~13.6px) text with `letter-spacing` — the clickable area is exactly the text bounding box, which is ~13.6px tall. The CTA link (`.navbar__link--cta`, line 33) has `padding: 0.5rem 1.3rem` so it passes.

**Group B — Scroll dots (9 targets, main.js lines 63–68):**
Each `.actividades__dot` is a `<button>` with fixed CSS size of `12px × 12px` (lines 690–691 in CSS). This is half the minimum recommended touch target.

**Total: 6 + 9 = 15 targets — matches the audit.**

### What needs to change

**Nav links:** Add `padding: 0.5rem 0` to `.navbar__link` (desktop), giving minimum height ~13.6px + 16px = ~29.6px — passes 24px. No width concern since each link is naturally wider than 24px due to text length.

**Scroll dots:** Increase from 12px to at least 24px. Since they sit in a flex row with `gap: 0.5rem`, the visual spacing will adjust naturally.

### Recommended approach

**Nav links** — add to `main.css` at the `.navbar__link` rule (line 238):
```css
.navbar__link {
  padding: 0.5rem 0;  /* new — minimum touch target */
}
```
The existing `navbar__link--cta` already has padding, so it won't be affected.

**Scroll dots** — update `.actividades__dot` from 12px to 24px:
```css
.actividades__dot {
  width: 24px;
  height: 24px;
}
```
The `border-radius: 0` keeps them square — consider `border-radius: 50%` for a more standard dot appearance, but that's a visual choice, not required by WCAG.

### Cross-file dependencies

- `main.css` lines 238 and 690 — CSS changes only
- `main.js` no changes needed (dots are built dynamically but sizes come from CSS)
- `main.html` no changes

---

## Issue 4 — No "you are here" feedback in nav (Medium)

### Where it manifests

`main.html` lines 28–33: 7 nav links with no `aria-current` attribute and no visual distinction for the current section. In a single-page site, "current page" is the same as "current section" — the user needs to know which section they're viewing.

### What needs to change

- Add `aria-current="page"` to the active nav link dynamically
- Style the active nav link distinctly (e.g., `color: var(--red)` or an underline)

### Recommended approach

Use an IntersectionObserver in `main.js` to track which section is in view, then:
1. Set `aria-current="page"` on the matching nav link (remove from others)
2. Toggle a CSS class like `.navbar__link--active` for visual styling

**In `main.css`** — add:
```css
.navbar__link--active,
.navbar__link[aria-current="page"] {
  color: var(--red);
}
```

**In `main.js`** — add an IntersectionObserver that watches all section elements (`#propuesta`, `#profesor`, `#actividades`, `#rangos`, `#faqs`, `#contacto`) and updates the corresponding nav link:

```javascript
// Track active section for aria-current
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__link');
if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const isMatch = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('navbar__link--active', isMatch);
          if (isMatch) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }); // offset for fixed nav
  sections.forEach(s => navObs.observe(s));
}
```

### Cross-file dependencies

- `main.html` — no structural changes, but links need to match section IDs exactly (already do)
- `main.css` — new `.navbar__link--active` rule
- `main.js` — new IntersectionObserver for section tracking

---

## Issue 5 — No live region for async status updates (Medium)

### Where it manifests

There is no `aria-live` region in `main.html`. However, the current site has **no async operations** — no fetch calls, no form submissions, no dynamic status changes. The FAQ accordion and carousel are synchronous. This is a preemptive fix.

### What needs to change

Add a hidden `aria-live="polite"` container (or `role="status"`) to `main.html` so that if async feedback is added later (e.g., a contact form, booking flow), status announcements reach screen readers.

### Recommended approach

Add to `main.html` just inside `<body>`:
```html
<div aria-live="polite" aria-atomic="true" class="visually-hidden" id="liveRegion"></div>
```

Add a `.visually-hidden` utility to `main.css`:
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Cross-file dependencies

- `main.html` — new live region element
- `main.css` — new `.visually-hidden` utility class
- `main.js` — no changes needed now, but future async code will target `#liveRegion`

---

## Issue 6 — 8 spans styled as clickable without proper semantics (Medium)

### Where it manifests

The 9 `.actividad-card__num` spans (`main.html` lines 143–223) are `<span>` elements styled with large display font (`font-size: 2.5rem`, `font-family: var(--font-display)`). Their visual prominence (large number badges) makes them look like interactive elements, but they are semantically inert and not focusable.

The audit flags 8 of these 9 instances.

### What needs to change

Two options:
1. **Make them interactive** — if they should be clickable (e.g., expand card details), convert to `<button>` elements
2. **Reduce visual weight** — if they're purely decorative, tone down styling so they don't appear interactive

### Recommended approach

These are purely decorative badges — they don't have click handlers and shouldn't. The fix is to **reduce their visual prominence** by using a smaller font and a less intense color. Recommendation:

```css
.actividad-card__num {
  font-size: 1.2rem;    /* was 2.5rem */
  color: var(--gray);    /* was rgba(...) — also fixes contrast issue #1 */
}
```

This simultaneously fixes the contrast problem (Issue 1) and removes the false affordance of interactivity.

If the intent is to eventually make them interactive (e.g., clicking a card number opens details), then convert to `<button>` elements and add `tabindex` / keyboard handling. But that's scope creep — fix the false affordance now.

### Cross-file dependencies

- `main.css` only — `.actividad-card__num` rules at lines 636–643

---

## Issue 7 — No skip-to-content link (Low)

### Where it manifests

`main.html` has no skip-to-content link. The first focusable element on the page is the `.navbar__logo` link (`<a href="#">`), which means keyboard users tab through 7 nav links before reaching the main content.

### What needs to change

Add a "Saltar al contenido" link as the first focusable element in `<body>`.

### Recommended approach

Add after the `<body>` opening tag in `main.html`:
```html
<a href="#hero" class="skip-link">Saltar al contenido</a>
```

Add to `main.css`:
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 10000;
  padding: 0.5rem 1rem;
  background: var(--red);
  color: var(--white);
  font-family: var(--font-display);
  font-size: 0.85rem;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}
```

### Cross-file dependencies

- `main.html` — new element as first child of `<body>`
- `main.css` — new `.skip-link` rules

---

## Issue 8 — No site search (Low)

### Where it manifests

No search input exists anywhere in `main.html`. This is a single-page landing site with ~9 sections and limited content (~400 lines of HTML). A search feature on this scale is arguably unnecessary per the Heuristics ("expert users have no accelerator"), but the audit flags it.

### What needs to change

Adding a full search engine is overkill for this site. The pragmatic fix is to provide a **section filter or quick-jump** that achieves the same goal: letting users bypass navigation to find content quickly.

### Recommended approach

Do NOT add a full text search — it creates a build dependency (lunr.js, fuse.js) or requires an external search service, both of which contradict the static-site constraint.

Instead, add a **keyboard shortcut** and/or a **quick-nav dropdown** in the navbar that lists all sections with descriptions. This gives expert users the "accelerator" the heuristic demands without the complexity of search indexing.

Minimal implementation: replicate the existing nav as a `<select>` or expandable search-like input that filters section titles client-side (pure JS, no dependencies).

If the audit must be satisfied literally, a <kbd>/</kbd> keyboard shortcut that focuses a section filter input is the lightest-weight option:

```html
<input type="search" id="quickNav" placeholder="Ir a sección..." class="quick-nav" 
       aria-label="Navegación rápida">
```

With JS that matches input against section titles and scrolls on selection.

### Cross-file dependencies

- `main.html` — new search/quick-nav element (only if implementing)
- `main.css` — new `.quick-nav` styles
- `main.js` — new event handler for filtering and navigation

**"No fix" is also a valid option here** — the content is shallow enough that search adds no real value. Document the decision if this is deferred.

---

## Issue 9 — 20 distinct font sizes, no structured type scale (Low)

### Where it manifests

Counted across `main.css` — 20+ unique font-size values (many `clamp()` expressions, hardcoded rem/px values). Key offenders:

| Size | Used in |
|------|---------|
| `clamp(2.8rem, 10vw, 7rem)` | hero__title |
| `clamp(2rem, 5vw, 3.5rem)` | section__title, cta-final__title |
| `2.8rem` | rango-card__badge |
| `2.5rem` | actividad-card__num |
| `1.5rem` | navbar__logo-icon |
| `1.3rem` | navbar__logo |
| `clamp(1.8rem, 4vw, 2.5rem)` | profesor__stat-num |
| `clamp(1.5rem, 3vw, 2.2rem)` | profesor__name |
| `clamp(1.1rem, 2.5vw, 1.6rem)` | profesor__quote |
| `1.2rem` | btn--xl, valor-card__title |
| `1.1rem` | actividad-card__title |
| `1.05rem` | btn |
| `clamp(1rem, 2vw, 1.25rem)` | hero__subtitle, cta-final__text |
| `clamp(1rem, 2vw, 1.2rem)` | section__subtitle |
| `1rem` | faq-item__trigger, body default |
| `0.95rem` | valor-card__text, faq-content, cta-info-value |
| `0.9rem` / `0.9em` | rango-card__desc, hero__subtitle-small |
| `0.85rem` | navbar__link, hero__badge, actividad-card__text, profesor__lead, footer-contact |
| `0.8rem` | profesor__stat-label |
| `0.75rem` | hero__scroll-hint, footer__links a, footer__copy |
| `0.7rem` | cta-final__info-label |

Many of these are visually very close (e.g., 0.95rem and 1rem, 1.05rem and 1.1rem) — the differences don't communicate meaningful hierarchy.

### What needs to change

Consolidate to a **5–7 step type scale**. Recommendation:

| Step | CSS token | Size | Map to |
|------|-----------|------|--------|
| 1 (hero) | `--fs-hero` | `clamp(3rem, 10vw, 7rem)` | hero__title |
| 2 (display) | `--fs-display` | `clamp(2rem, 5vw, 3.5rem)` | section__title, cta-final__title |
| 3 (heading) | `--fs-heading` | `clamp(1.3rem, 2.5vw, 1.8rem)` | profesor__name, profesor__quote |
| 4 (subhead) | `--fs-subhead` | `clamp(1.1rem, 2vw, 1.3rem)` | section__subtitle, hero__subtitle, navbar__logo, card-titles |
| 5 (body) | `--fs-body` | `1rem` | base body, faq triggers, buttons (override with padding) |
| 6 (small) | `--fs-small` | `0.85rem` (13.6px) | nav links, badges, contacto labels |
| 7 (tiny) | `--fs-tiny` | `0.75rem` (12px) | scroll-hint, footer copy, stat labels |

This reduces 20+ distinct values to 7 steps with clear hierarchy.

### Recommended approach

Define the type scale in `:root` variables, then replace hardcoded font-size values with `var(--fs-*)` references. This is a **refactoring change** — it should NOT change any rendered sizes, just normalize the source of truth.

### Cross-file dependencies

- `main.css` only — every font-size declaration needs updating
- `main.html` no changes
- `main.js` no changes

---

## Issue 10 — No help/support/contact link found (Low)

### Where it manifests

The page has contact info (WhatsApp float, CTA section with schedules/address, footer with address), but there is no explicitly labeled "Help", "Soporte", "Contacto" link in the header or primary navigation.

The CTA link says "Inscribirme" (sign up) — the word "Contacto" appears only as an anchor (`#contacto`), but the nav link label is "Inscribirme", not "Contacto".

The footer has a WhatsApp number and address but no explicit "Contact us" link.

### What needs to change

Add a visible, labeled contact/support access point. The WhatsApp floating button already serves this function but may not be recognized as "help."

### Recommended approach

Two options:
1. **Rename the existing CTA nav link** from "Inscribirme" to "Contacto" — this is the simplest. The `#contacto` section already contains all contact info. The label change makes it clear this is the help/contact entry point.
2. **Add "Contacto" as an additional nav link** alongside "Inscribirme" (same anchor target).

Recommend option 1 — fewer nav links, clearer purpose. The WhatsApp float already handles quick contact, and the CTA section is the full contact/signup hub.

### Cross-file dependencies

- `main.html` line 33: change anchor text from `Inscribirme` to `Contacto`
- No CSS or JS changes

---

## Dependency summary

| Issue | Files changed | Risk |
|-------|--------------|------|
| 1. Color contrast | `main.css` only | Low — color token changes |
| 2. Home link | `main.html` only | Low — single href change |
| 3. Target size | `main.css` only | Low — padding, width/height |
| 4. aria-current | `main.css` + `main.js` | Medium — new observer, class toggle |
| 5. Live region | `main.html` + `main.css` | Low — static element + utility class |
| 6. Span semantics | `main.css` only | Low — CSS adjustment |
| 7. Skip link | `main.html` + `main.css` | Low — static element + CSS |
| 8. Site search | (deferred) | N/A — optional, requires JS |
| 9. Type scale | `main.css` only | Medium — refactoring many declarations |
| 10. Contact link | `main.html` only | Low — link text change |

**Cross-cutting:** Issues 1, 6, and 9 all interact in `main.css` — tackle them together to avoid conflicts.

**Files with the most changes:** `main.css` (issues 1, 3, 4, 5, 6, 7, 9), `main.html` (2, 5, 7, 10), `main.js` (4 only).

---

## Implementation order recommendation

1. **Phase 1 — Safety** (low risk, high impact): 2, 7, 10 (link fixes + skip link)
2. **Phase 2 — Accessibility** (medium risk): 1, 3, 4, 5, 6 (contrast, targets, semantics)
3. **Phase 3 — Polish** (lower priority): 9 (type scale)
4. **Deferred:** 8 (site search — not justified for this content volume)
