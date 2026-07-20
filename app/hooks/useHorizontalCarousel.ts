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
      const el = ref.current;
      const step = snapWidth();
      if (!el || step <= 0) return;
      const clamped = Math.max(0, Math.min(index, totalCards - 1));
      el.scrollTo({ left: clamped * step, behavior: "smooth" });
      setCurrentIndex(clamped);
      currentIdxRef.current = clamped;
    },
    [ref, snapWidth, totalCards],
  );

  const next = useCallback(() => {
    if (currentIdxRef.current < totalCards - 1) {
      scrollTo(currentIdxRef.current + 1);
    }
  }, [totalCards, scrollTo]);

  const prev = useCallback(() => {
    if (currentIdxRef.current > 0) {
      scrollTo(currentIdxRef.current - 1);
    }
  }, [scrollTo]);

  // Sync currentIndex from scroll position (RAF-throttled)
  useEffect(() => {
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
  }, [ref, snapWidth]);

  return {
    currentIndex,
    scrollTo,
    next,
    prev,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalCards - 1,
  };
}
