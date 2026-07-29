"use client";

import { useState, useEffect, useCallback, useRef, type RefObject } from "react";

interface CarouselState {
  currentIndex: number;
  scrollTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function useHorizontalCarousel(
  ref: RefObject<HTMLElement | null>,
  totalCards: number,
): CarouselState {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIdxRef = useRef(0);

  // Keep ref in sync with state for use inside callbacks
  useEffect(() => {
    currentIdxRef.current = currentIndex;
  }, [currentIndex]);

  const snapWidth = useCallback(() => {
    const el = ref.current;
    if (!el) return 0;
    const track = el.firstElementChild;
    if (!track) return 0;
    const cards = track.children;
    if (cards.length < 2) return 0;
    return (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
  }, [ref]);

  const scrollTo = useCallback(
    (index: number) => {
      // SPEC-FAWS-018: no-op when no cards
      if (totalCards <= 0) return;
      const el = ref.current;
      const step = snapWidth();
      if (!el || step <= 0) return;
      const clamped = Math.max(0, Math.min(index, totalCards - 1));
      // SPEC-FAWS-015: skip redundant state updates when index hasn't changed
      if (clamped === currentIdxRef.current) return;
      el.scrollTo({ left: clamped * step, behavior: "smooth" });
      setCurrentIndex(clamped);
      currentIdxRef.current = clamped;
    },
    [ref, snapWidth, totalCards],
  );

  const next = useCallback(() => {
    if (totalCards <= 0) return;
    if (currentIdxRef.current < totalCards - 1) {
      scrollTo(currentIdxRef.current + 1);
    }
  }, [totalCards, scrollTo]);

  const prev = useCallback(() => {
    if (totalCards <= 0) return;
    if (currentIdxRef.current > 0) {
      scrollTo(currentIdxRef.current - 1);
    }
  }, [scrollTo, totalCards]);

  // Sync currentIndex from scroll position (RAF-throttled)
  useEffect(() => {
    if (totalCards <= 0) return;
    const el = ref.current;
    if (!el) return;

    let tick = false;
    const onScroll = () => {
      if (!tick) {
        requestAnimationFrame(() => {
          tick = false;
          const step = snapWidth();
          if (step <= 0) return;
          const idx = Math.round(el.scrollLeft / step);
          if (idx !== currentIdxRef.current) {
            currentIdxRef.current = idx;
            setCurrentIndex(idx);
          }
        });
        tick = true;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref, snapWidth, totalCards]);

  // SPEC-FAWS-019: ResizeObserver re-snap to nearest card boundary (debounced 150ms)
  useEffect(() => {
    if (totalCards <= 0) return;
    if (!("ResizeObserver" in window)) return;
    const el = ref.current;
    if (!el) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const step = snapWidth();
        if (step <= 0) return;
        // Re-snap scrollLeft to nearest card boundary without triggering state change
        const nearestIdx = Math.round(el.scrollLeft / step);
        const targetScrollLeft = nearestIdx * step;
        if (Math.abs(el.scrollLeft - targetScrollLeft) > 1) {
          el.scrollLeft = targetScrollLeft;
        }
      }, 150);
    });

    observer.observe(el);
    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [ref, snapWidth, totalCards]);

  // SPEC-FAWS-018: return disabled controls when no cards (hooks already called above)
  if (totalCards <= 0) {
    return {
      currentIndex: 0,
      scrollTo: () => {},
      next: () => {},
      prev: () => {},
      isFirst: true,
      isLast: false,
    };
  }

  return {
    currentIndex,
    scrollTo,
    next,
    prev,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalCards - 1,
  };
}
