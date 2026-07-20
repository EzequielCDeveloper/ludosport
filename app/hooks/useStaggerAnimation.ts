"use client";

import { useState, useCallback, useEffect } from "react";

export function useStaggerAnimation(threshold = 0.15) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setEl(node);
  }, []);

  useEffect(() => {
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.querySelectorAll(".stagger").forEach((child) =>
        child.classList.add("stagger--visible"),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("stagger--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    el.querySelectorAll(".stagger").forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [el, threshold]);

  return ref;
}
