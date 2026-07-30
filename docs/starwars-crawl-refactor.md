---
last-reviewed: 2026-07-30
---

# StarWarsCrawl — Refactor Proposal

**Status**: superseded  
**Scope**: `app/components/StarWarsCrawl.tsx`  
**Resolution**: This refactor was NOT implemented. The component was instead simplified to **static text** — all scroll-driven animation, rAF loop, overlay, and skip button were removed entirely. See [`starwars-crawl-static-implementation.md`](./starwars-crawl-static-implementation.md) for the actual final implementation.  
**Driver (original)**: scroll-sync logic consolidated in a single `useEffect` with mixed responsibilities (layout measurement, opacity lerp, transform sync).

---

## Current Architecture (problem)

The component runs a single `requestAnimationFrame` loop inside one `useEffect` that handles three concerns in a single closure:

| Responsibility | Implementation |
|---|---|
| Layout measurement | `content.scrollHeight` on first frame → sets spacer height |
| Scroll progress sync | `panel.getBoundingClientRect()` every frame → computes `progress` 0..1 |
| Animation application | lerps opacity with exponential time constant, sets `transform` on content |

**Consequences**:

- The hook is ~70 lines with no separation of concerns, making it hard to read and test.
- `getBoundingClientRect` is called every frame regardless of whether the component is in the viewport, forcing a layout reflow on the compositor thread.
- State is kept in `useRef` values that React does not track — the opacity lerp's `opacityRef` and `lastTimeRef` are invisible to React DevTools.
- The animation loop cannot be reused by any other component (e.g. a parallax background or a credits-style outro).

---

## Proposed Refactor: Extract scroll-sync to a custom hook

### `useScrollCrawl(ref, options)` → `{ progress, isActive }`

Encapsulate the spacer measurement, rAF loop, progress computation, and opacity lerp into a single reusable hook. The component becomes a pure presentation layer that reads derived values and applies styles.

```ts
// app/hooks/useScrollCrawl.ts (new file)
function useScrollCrawl(
  contentRef: RefObject<HTMLElement>,
  options?: { fadeZone?: number; tau?: number }
): {
  progress: number;   // 0..1, lerped; 0 when inactive
  opacity: number;     // 0..1, lerped with exponential damping
  isActive: boolean;   // true when spacer is in viewport
} { /* ... */ }
```

### Component after refactor

```tsx
export default function StarWarsCrawl() {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { progress, opacity, isActive } = useScrollCrawl(contentRef);

  // Component owns ONLY presentation. No rAF loop, no measurement, no lerp.
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.opacity = String(opacity);
    }
  }, [opacity]);

  const travel = /* derived from measurement inside the hook */;
  const translateY = Math.round(-progress * travel);

  return (
    <>
      <div ref={panelRef} className="w-full" aria-hidden="true" />
      <div ref={sectionRef} className="fixed inset-0 z-40 ..." style={{ opacity: 0 }}>
        {/* ... backdrop, stars, top-fade ... */}
        <div
          ref={contentRef}
          className="w-full crawl__content"
          style={{
            transform: `perspective(250px) rotateX(5deg) translateY(${translateY}px)`,
          }}
        >
          {/* ... title + crawl text ... */}
        </div>
      </div>
    </>
  );
}
```

### Benefits

1. **Testability** — `useScrollCrawl` can be tested in isolation with a simulated scroll container (jsdom + fake timers for rAF).
2. **Reusability** — the same hook can drive parallax effects, fade-in sections, or a credits-style outro with different options.
3. **React-aligned state** — `progress` and `opacity` are returned as values that React can track, making them visible in DevTools and compatible with `useEffect` / `useMemo`.
4. **Readability** — the component file drops from ~170 lines to ~90, and each line expresses intent instead of implementation.
5. **Viewport optimization (easy extension)** — the hook can internally use `IntersectionObserver` to pause the rAF loop when the spacer is far outside the viewport, saving CPU on long pages.

### Migration path

1. Create `app/hooks/useScrollCrawl.ts` — extract the measurement + rAF + lerp logic from the current `useEffect`.
2. Update `StarWarsCrawl.tsx` to consume the hook and apply styles reactively.
3. Remove dead refs (`rafRef`, `travelRef`, `initiated`, `opacityRef`, `lastTimeRef`) from the component.
4. Verify visually: the crawl animation must behave identically to the current implementation (same perspective, same rotation, same scroll mapping, same opacity fade-in/out timing).

### Risks

- **Low**: the extraction is a mechanical move of existing logic into a hook. The math and timing constants (fadeZone, tau) remain unchanged.
- The `useScrollCrawl` hook still uses `getBoundingClientRect` in a rAF loop — the refactor does not change the animation model, only its encapsulation. A future migration to CSS scroll-driven animations (`animation-timeline: view()`) would replace the hook entirely.

---

## Long-term vision

CSS `animation-timeline: view()` (Chromium 115+) allows the entire crawl to be expressed declaratively with zero JavaScript in the animation hot path. Once Firefox and Safari ship support, the `useScrollCrawl` hook can be replaced with a single CSS rule:

```css
.crawl__content {
  animation: crawl linear;
  animation-timeline: view();
  animation-range: entry 0% exit 100%;
}
@keyframes crawl {
  from { transform: perspective(250px) rotateX(5deg) translateY(0); }
  to   { transform: perspective(250px) rotateX(5deg) translateY(-100vh); }
}
```

The extraction into a hook today makes that migration trivial: swap the hook for a CSS class, and the component is unchanged.

---

## Related

- `app/components/StarWarsCrawl.tsx` — current implementation
- `app/globals.css` lines 370–380 — `.crawl__top-fade` and `.crawl__content` base styles
- `app/components/Starfield.tsx` — backdrop component (independent from scroll logic)
