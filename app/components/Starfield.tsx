"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/starfield.module.css";

type Props = {
  /** Override styles (default: position: fixed; inset: 0; z-index: -1 from CSS) */
  style?: React.CSSProperties;
};

export default function Starfield({ style }: Props) {
  const [paused, setPaused] = useState(false);
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = starRef.current;
    if (!el) return;

    // Feature detection — graceful fallback: animation always runs
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = paused ? `${styles.stars} ${styles["stars--paused"]}` : styles.stars;

  return (
    <div ref={starRef} className={cls} style={style} aria-hidden="true">
      <span className={styles.stars__large} />
    </div>
  );
}
