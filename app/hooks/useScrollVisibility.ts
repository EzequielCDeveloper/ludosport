"use client";

import { useState, useEffect } from "react";

export function useScrollVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sync initial scroll position — this is a single mount-time render,
    // not a cascading update pattern. The effect synchronizes React state
    // with an external value (window.scrollY), which is the documented use
    // case for useEffect.
    //
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.scrollY >= 100) setIsVisible(true);

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      setIsVisible(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.scrollY < 100) setIsVisible(false);
      }, 2000);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return { isVisible };
}
