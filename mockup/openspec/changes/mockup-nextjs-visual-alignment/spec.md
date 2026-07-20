# Spec: Alineación Visual Mockup → Next.js

## 1. Global Styles

### 1.1 Body Text Color
- **ID**: GLOBAL-COLOR-01
- **Priority**: MUST
- **Description**: The body text color SHALL be `rgba(255, 232, 31, 0.85)` (yellow at 85% opacity).
- **Rationale**: Mockup `main.css:17` uses `rgba(255, 232, 31, 0.85)` — Star Wars yellow for body text.
- **Component**: `app/globals.css` (or `app/layout.tsx`)
- **Current**: `text-white`

### 1.2 Section Backgrounds
- **ID**: GLOBAL-BG-01
- **Priority**: MUST
- **Description**: Section backgrounds SHALL be transparent. Sections that currently have `bg-[var(--color-black-2)]` or `bg-[var(--color-black-3)]` MUST have those classes removed.
- **Rationale**: Mockup relies on the black body background and starfield. No section has its own background color.
- **Components**: `Valores.tsx`, `Profesor.tsx`, `Actividades.tsx`, `Rangos.tsx`, `FAQs.tsx`

### 1.3 Section Title Color
- **ID**: GLOBAL-TITLE-01
- **Priority**: MUST
- **Description**: All `section__title` elements SHALL use `text-[var(--color-yellow)]` (#ffe81f).
- **Rationale**: Mockup `.section__title` uses `var(--sw-yellow)`.
- **Components**: All section components
- **Current**: `text-white`

### 1.4 Button Border Radius
- **ID**: GLOBAL-BTN-01
- **Priority**: MUST
- **Description**: All buttons (`.btn`, `a.btn--*`, action buttons) SHALL have `border-radius: 0` (square). No `rounded`, `rounded-lg`, or `rounded-full` on interactive elements.
- **Rationale**: Mockup `.btn` has `border-radius: 0`.
- **Components**: `Hero.tsx`, `CtaFinal.tsx`, `NavbarClient.tsx`

### 1.5 Font Usage — Display
- **ID**: GLOBAL-FONT-01
- **Priority**: SHOULD
- **Description**: Titles, nav links, buttons, scroll hint, and CTA elements SHALL use `font-display` (Anton). `font-body` (Pathway Gothic One) SHALL be used for descriptive text only.
- **Rationale**: Mockup uses `var(--font-display)` for all prominent text.
- **Components**: All

## 2. Navbar

### 2.1 Background Transparency
- **ID**: NAV-BG-01
- **Priority**: MUST
- **Description**: The navbar SHALL have `background: transparent` initially. It SHALL transition to `rgba(0, 0, 0, 0.92)` when `window.scrollY > 60`.
- **Rationale**: Mockup `main.css:238-253` starts transparent, adds `.navbar--solid` class on scroll.
- **Components**: `Navbar.tsx`
- **Current**: `bg-[var(--color-black-2)]/80 backdrop-blur-md` always

### 2.2 Nav Link Font
- **ID**: NAV-FONT-01
- **Priority**: MUST
- **Description**: Nav links (`navbar__link`) SHALL use `font-display` with `letter-spacing: 0.08em`, `text-transform: uppercase`, and color `var(--gray-light)` (#ccc).
- **Rationale**: Mockup `.navbar__link` uses `font-family: var(--font-display)` and `letter-spacing: 0.08em`.
- **Components**: `NavbarClient.tsx`
- **Current**: `font-body`, `tracking-wider`

### 2.3 CTA Button Color
- **ID**: NAV-CTA-01
- **Priority**: MUST
- **Description**: The Contacto CTA button SHALL have background `#0a58ca` (blue-dark), white text.
- **Rationale**: Mockup `.navbar__link--cta` uses `background: var(--blue-dark)`.
- **Components**: `NavbarClient.tsx`
- **Current**: Red (`--color-red`)

## 3. Hero

### 3.1 Background
- **ID**: HERO-BG-01
- **Priority**: MUST
- **Description**: The hero section SHALL have two radial gradient overlays: a red ellipse at 30%/40% and a blue ellipse at 70%/60%, plus a repeating-linear-gradient scanline overlay.
- **Rationale**: Mockup `main.css:794-823` defines `.hero__bg` with these gradients and `.hero__overlay` with scanlines.
- **Components**: `Hero.tsx`
- **Current**: Simple `bg-gradient-to-b from-transparent via-black-2/60 to-black-2`

### 3.2 Badge "Primera clase gratis"
- **ID**: HERO-BADGE-01
- **Priority**: MUST
- **Description**: The badge SHALL have `background: var(--red)`, `color: var(--white)`, `font-family: var(--font-display)`, square corners, and `text-transform: uppercase`.
- **Rationale**: Mockup `.hero__badge` styles.
- **Components**: `Hero.tsx`
- **Current**: Transparent with yellow border, `rounded-full`, `font-body`

### 3.3 Title — "LUDO SPORT"
- **ID**: HERO-TITLE-01
- **Priority**: MUST
- **Description**: The "LUDO SPORT" line SHALL be `color: var(--sw-yellow)` (#ffe81f).
- **Rationale**: Mockup `main.css:848` sets `color: var(--sw-yellow)` on `.hero__title`.
- **Components**: `Hero.tsx`
- **Current**: `text-white`

### 3.4 Title — "DRAKE ACADEMY"
- **ID**: HERO-TITLE-02
- **Priority**: MUST
- **Description**: The "DRAKE ACADEMY" line SHALL have `-webkit-text-stroke: 4px var(--yellow)` and `-webkit-text-fill-color: transparent`, with `color: var(--red)`.
- **Rationale**: Mockup `.hero__title-line--alt` styles.
- **Components**: `Hero.tsx`
- **Current**: `text-stroke: 2px red`

### 3.5 Subtitle Color
- **ID**: HERO-SUB-01
- **Priority**: MUST
- **Description**: The main subtitle SHALL be `color: var(--white)`. The small subtitle SHALL be `color: var(--gray)`.
- **Rationale**: Mockup `.hero__subtitle` and `.hero__subtitle-small`.
- **Components**: `Hero.tsx`
- **Current**: Main in gray, small in white/60

### 3.6 Primary Button — Cyan Sable de Luz
- **ID**: HERO-BTN-01
- **Priority**: MUST
- **Description**: The primary CTA button SHALL have `background: transparent`, `color: var(--sw-cyan)`, `border: 2px solid var(--sw-cyan)`, glow effects, and square corners.
- **Rationale**: Mockup `.btn--primary` styles.
- **Components**: `Hero.tsx`
- **Current**: Red background, rounded

### 3.7 Secondary Button — Outline White
- **ID**: HERO-BTN-02
- **Priority**: MUST
- **Description**: The secondary CTA button SHALL have `background: transparent`, `color: var(--white)`, `border: 2px solid var(--white)`, square corners.
- **Rationale**: Mockup `.btn--outline` styles.
- **Components**: `Hero.tsx`
- **Current**: `border-white/30`, rounded

### 3.8 Scroll Hint Font
- **ID**: HERO-SCROLL-01
- **Priority**: SHOULD
- **Description**: The scroll hint text SHALL use `font-family: var(--font-display)`.
- **Rationale**: Mockup `.hero__scroll-hint` uses `font-family: var(--font-display)`.
- **Components**: `Hero.tsx`
- **Current**: `font-body`

## 4. Valores

### 4.1 Card Styling
- **ID**: VAL-CARD-01
- **Priority**: MUST
- **Description**: Cards SHALL have `border-top: 3px solid rgba(255, 232, 31, 0.2)`, `backdrop-filter: blur(2px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.5)` with `inset 0 1px 0 rgba(255,255,255,0.1)`, and square corners.
- **Rationale**: Mockup `.valor-card` styles.
- **Components**: `ValueCard.tsx`
- **Current**: `border: 1px white/10`, `rounded-lg`, no top border

### 4.2 No Hover Effect
- **ID**: VAL-CARD-02
- **Priority**: SHOULD
- **Description**: Value cards SHALL NOT have a hover border color change.
- **Rationale**: Mockup has no hover effect on value cards.
- **Components**: `ValueCard.tsx`
- **Current**: `hover:border-[var(--color-yellow)]/30`

## 5. Profesor

### 5.1 Quote Styling
- **ID**: PROF-QUOTE-01
- **Priority**: MUST
- **Description**: The quote SHALL have `color: var(--white)`, `border-left: 4px solid var(--red)`, `font-family: var(--font-display)`.
- **Rationale**: Mockup `.profesor__quote` uses white text and red left border.
- **Components**: `Profesor.tsx`
- **Current**: Yellow text, yellow border

### 5.2 Lead Text Color
- **ID**: PROF-LEAD-01
- **Priority**: MUST
- **Description**: The lead paragraph SHALL be `color: var(--gray-light)` (#ccc).
- **Rationale**: Mockup `.profesor__lead` uses `var(--gray-light)`.
- **Components**: `Profesor.tsx`
- **Current**: Cyan (`var(--color-cyan)`)

### 5.3 Image Treatment
- **ID**: PROF-IMG-01
- **Priority**: MUST
- **Description**: The image SHALL NOT have a decorative offset border. The image SHALL have `filter: grayscale(0.3)` with hover transition to `grayscale(0)` and `scale(1.03)`.
- **Rationale**: Mockup has no border, uses grayscale filter with hover effect.
- **Components**: `Profesor.tsx`
- **Current**: Red offset border, no grayscale

## 6. Rangos

### 6.1 Card Styling
- **ID**: RANGOS-CARD-01
- **Priority**: MUST
- **Description**: Rank cards SHALL have `backdrop-filter: blur(2px)`, `box-shadow: 0 8px 32px rgba(0,0,0,0.5)` with `inset 0 1px 0 rgba(255,255,255,0.1)`, square corners, and individual color-coded left borders.
- **Rationale**: Mockup `.rango-card` base styles.
- **Components**: `Rangos.tsx`
- **Current**: `bg-white/5`, no blur, no shadow, rounded

### 6.2 Hover Effect
- **ID**: RANGOS-HOVER-01
- **Priority**: MUST
- **Description**: On hover, cards SHALL use `transform: translateX(6px)` with a color-specific box-shadow.
- **Rationale**: Mockup `.rango-card:hover` uses translate + shadow.
- **Components**: `Rangos.tsx`
- **Current**: `bg-white/10`

### 6.3 Maestro (V) Special Card
- **ID**: RANGOS-CARD-V-01
- **Priority**: MUST
- **Description**: The fifth card (Maestro) SHALL have a distinctive style: extra background, different border, enhanced shadow.
- **Rationale**: Mockup has special styling for `.rango-card:nth-child(5)`.
- **Components**: `Rangos.tsx`

## 7. CTA Final

### 7.1 Background
- **ID**: CTA-BG-01
- **Priority**: MUST
- **Description**: The CTA section SHALL have two radial gradients: blue at 25%50% and red at 75%50%.
- **Rationale**: Mockup `.cta-final__bg` uses these radial gradients.
- **Components**: `CtaFinal.tsx`
- **Current**: `bg-gradient-to-b from-red/20 via-black-2 to-black-2`

### 7.2 Title Color
- **ID**: CTA-TITLE-01
- **Priority**: MUST
- **Description**: The title SHALL be `color: var(--sw-yellow)`.
- **Rationale**: Mockup `.cta-final__title` uses `var(--sw-yellow)`.
- **Components**: `CtaFinal.tsx`
- **Current**: White

### 7.3 Info Cards
- **ID**: CTA-INFO-01
- **Priority**: MUST
- **Description**: Info items SHALL have individual colored left borders (blue, yellow, red), `background: rgba(255,255,255,0.03)`, square corners, and label color `var(--gray)`.
- **Rationale**: Mockup `.cta-final__info-item` and `__info-label` styles.
- **Components**: `CtaFinal.tsx`
- **Current**: `bg-white/5`, `rounded-lg`, full border, cyan labels

### 7.4 Primary Button
- **ID**: CTA-BTN-01
- **Priority**: MUST
- **Description**: The CTA button SHALL use the cyan sable de luz style (`btn--blue-glow`): transparent bg, cyan border, glow effects, square corners.
- **Rationale**: Mockup `.btn--blue-glow` styles.
- **Components**: `CtaFinal.tsx`
- **Current**: Red background, `rounded-lg`, shadow

## 8. Footer

### 8.1 Background Color
- **ID**: FOOTER-BG-01
- **Priority**: MUST
- **Description**: The footer SHALL have `background: #000` (black).
- **Rationale**: Mockup `.footer` uses `background: var(--black)` which is `#000`.
- **Components**: `Footer.tsx`
- **Current**: `#111`

### 8.2 Link Font
- **ID**: FOOTER-FONT-01
- **Priority**: SHOULD
- **Description**: Footer links SHALL use `font-display`.
- **Rationale**: Mockup `.footer__links a` uses `font-family: var(--font-display)`.
- **Components**: `Footer.tsx`
- **Current**: `font-body`

## 9. WhatsApp Float

### 9.1 Border Radius
- **ID**: WA-SHAPE-01
- **Priority**: MUST
- **Description**: The WhatsApp float button SHALL have square corners (no `rounded-full`).
- **Rationale**: Mockup `.whatsapp-float` has no `border-radius` specified.
- **Components**: `WhatsAppFloat.tsx`
- **Current**: `rounded-full`

## 10. Starfield

### 10.1 CSS Module
- **ID**: STAR-CSS-01
- **Priority**: MUST
- **Description**: The starfield CSS module SHALL remain unchanged (it was correctly ported).
- **Rationale**: The CSS-only starfield matches the mockup implementation.
- **Components**: `app/styles/starfield.module.css`

## Scenarios

### S1: Visual Identity — Page Load
```
Given the user visits the landing page
When the page finishes loading
Then the body text SHALL be yellow (#ffe81f at 85% opacity)
And the background SHALL be black (#000)
And the navbar SHALL be transparent
And the starfield SHALL be animating behind the content
```

### S2: Navbar — Scroll Behavior
```
Given the page is scrolled past 60px
When the scroll event fires
Then the navbar SHALL have a solid background (rgba(0,0,0,0.92))
```

### S3: Hero — Title Style
```
Given the hero section is visible
When the user views the title
Then "LUDO SPORT" SHALL be yellow
And "DRAKE ACADEMY" SHALL have a 4px yellow text-stroke with transparent fill
```

### S4: Hero — Buttons
```
Given the hero section is visible
When the user views the CTA buttons
Then the primary button SHALL have a cyan border with glow effect
And the secondary button SHALL have a solid white border
And both SHALL have square corners
```

### S5: Section Titles
```
Given any content section (Valores, Profesor, Actividades, Rangos, FAQs, CTA)
When the section title is rendered
Then the title SHALL be yellow (#ffe81f)
And the section SHALL have no colored background (transparent, showing starfield)
```

### S6: Rank Card Hover
```
Given a rank card in the Rangos section
When the user hovers over it
Then the card SHALL translate 6px to the right
And the left border color accent SHALL glow
```

### S7: CTA Final — Info Cards
```
Given the CTA Final section
When the info cards are rendered
Then each card SHALL have a colored left border (blue/yellow/red)
And the cards SHALL NOT have rounded corners
And the labels SHALL be gray
```

### S8: Build Integrity
```
Given the codebase
When `bun run build` is executed
Then the build SHALL exit with code 0
And when `npx tsc --noEmit` is executed
Then TypeScript SHALL report zero errors
```
