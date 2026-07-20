# Interactive Sections Specification

## Purpose

Interactive behaviors from the mockup JS MUST be preserved in isolated Client Components at the leaf level, each owning a single concern via a dedicated React hook. All hooks MUST clean up event listeners and observers on unmount.

## Requirements

### Requirement: Navbar — Mobile Toggle

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client (NavbarClient) |

The Navbar MUST toggle its mobile menu open/closed when the hamburger button is clicked. The menu MUST close when any nav link is clicked.

#### Scenario: Hamburger toggles menu

- GIVEN the viewport is mobile width
- WHEN the hamburger button is clicked
- THEN the mobile menu opens
- AND clicking a link closes the menu

### Requirement: Navbar — Solid Background on Scroll

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client |

The Navbar MUST gain a solid background class when `window.scrollY > 60`. The background MUST be removed when scroll is ≤ 60.

#### Scenario: Scroll past threshold

- GIVEN the page is at the top
- WHEN the user scrolls past 60px
- THEN the navbar gains a solid background class
- AND scrolling back to top removes it

### Requirement: Navbar — Active Section Tracking

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client |

The Navbar MUST track which section is in view via `IntersectionObserver` with `rootMargin: "-50% 0px -50% 0px"`. The corresponding nav link MUST receive an active class and `aria-current="page"`.

#### Scenario: Section in view highlights link

- GIVEN the user scrolls to the "Valores" section
- WHEN `IntersectionObserver` fires at 50% root margin
- THEN the "Valores" nav link gets `aria-current="page"`
- AND other links lose it

### Requirement: Valores — Stagger Animation

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Server/Client | Client |

Valores cards MUST fade in sequentially when scrolled into view via `IntersectionObserver` (15% threshold) with staggered CSS animation delays. Cards MUST `unobserve` after triggering.

#### Scenario: Cards fade in on scroll

- GIVEN the Valores section is off-screen
- WHEN it scrolls into view at 15% visibility
- THEN each card fades in with increasing delay
- AND already-animated cards do not re-trigger

### Requirement: Actividades — Horizontal Carousel

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client |

The Actividades carousel MUST use CSS `scroll-snap-type: x mandatory` for horizontal scrolling. It MUST include prev/next arrow buttons, dot indicators synced with the visible card, and ArrowLeft/ArrowRight keyboard navigation.

#### Scenario: Arrows navigate cards

- GIVEN the carousel is at the first card
- WHEN the next arrow is clicked
- THEN the carousel scrolls to the second card
- AND the second dot becomes active

#### Scenario: Disabled state at bounds

- GIVEN the carousel is at the first card
- THEN the prev arrow is disabled
- WHEN navigating to the last card
- THEN the next arrow becomes disabled

#### Scenario: Keyboard navigation

- GIVEN the carousel has focus
- WHEN ArrowRight is pressed
- THEN the carousel advances one card
- AND ArrowLeft navigates back one card

#### Scenario: Dot click navigation

- GIVEN the carousel is at card 0
- WHEN dot index 3 is clicked
- THEN the carousel scrolls to card 3
- AND dot 3 becomes active

### Requirement: FAQ Accordion

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client |

FAQs MUST toggle open/closed on trigger click. Opening one item MUST close any other open item. Each trigger MUST manage `aria-expanded="true|false"`.

#### Scenario: Accordion opens and closes others

- GIVEN all FAQs are closed
- WHEN FAQ 1 trigger is clicked
- THEN FAQ 1 opens (aria-expanded="true")
- WHEN FAQ 2 trigger is clicked
- THEN FAQ 2 opens and FAQ 1 closes (aria-expanded="false")

### Requirement: WhatsApp Float Visibility

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Server/Client | Client |

The WhatsApp float MUST be visible when the user scrolls. If the user stops scrolling and is within 100px of the top, the button MUST hide after 2 seconds of inactivity.

#### Scenario: Float hides at top after idle

- GIVEN the page is scrolled below 100px
- WHEN the user scrolls back to the top and stops
- THEN after 2 seconds the WhatsApp float gains a hidden class

### Requirement: Hook Cleanup

| Attribute | Value |
|-----------|-------|
| Priority | P0 |
| Server/Client | Client (all hooks) |

Every custom hook (`useScrollNav`, `useStaggerAnimation`, `useHorizontalCarousel`, `useAccordion`, `useScrollVisibility`) MUST clean up all `addEventListener` and `IntersectionObserver` registrations in its `useEffect` return/cleanup function.

#### Scenario: Unmount removes listeners

- GIVEN a Client component mounts and registers observers
- WHEN the component unmounts
- THEN all observers and event listeners are disconnected
- AND no errors or stale callbacks fire
