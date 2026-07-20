"use client";

import { useState, useEffect } from "react";

export function useScrollNav() {
  const [isSolid, setIsSolid] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setIsSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

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
