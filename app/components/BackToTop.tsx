"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

const getSnapshot = () => window.scrollY > window.innerHeight;

const getServerSnapshot = () => false;

export default function BackToTop() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Volver arriba"
      className={`back-to-top-btn fixed bottom-24 right-6 md:bottom-[104px] md:right-8 z-50 w-11 h-11 bg-[var(--color-yellow)] text-black flex items-center justify-center transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  );
}
