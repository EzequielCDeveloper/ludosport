"use client";

import { useState, useEffect } from "react";

export function useScrollNav() {
  const [isSolid, setIsSolid] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    // Feature detection: skip IntersectionObserver in unsupported environments (SPEC-FAWS-047)
    // Safe defaults: navbar transparent (isSolid=false), activeSection='hero'
    const hasIO = "IntersectionObserver" in window;

    const onScroll = () => setIsSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!hasIO) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const sections = [
      "hero",
      "propuesta",
      "profesor",
      "actividades",
      "rangos",
      "faqs",
      "contacto",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return { isSolid, activeSection };
}
