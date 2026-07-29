"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

const getSnapshot = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max <= 0 ? 100 : (window.scrollY / max) * 100;
};

const getServerSnapshot = () => 0;

export default function ScrollProgress() {
  const pct = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] bg-[var(--color-yellow)] z-[100] scroll-progress-bar"
      style={{ width: `${pct}%` }}
    />
  );
}
