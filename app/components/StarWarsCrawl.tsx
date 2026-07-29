"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Starfield from "@/app/components/Starfield";

export default function StarWarsCrawl() {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const travelRef = useRef(0);
  const initiated = useRef(false);
  const opacityRef = useRef(0);
  const lastTimeRef = useRef(0);

  const reducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  const [skipped, setSkipped] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Measure spacer height, set initial transform, run animation
  useEffect(() => {
    const content = contentRef.current;
    const panel = panelRef.current;

    // Measurement — reusable by resize handler
    const measure = () => {
      if (panel && content) {
        const vh = window.innerHeight;
        const contentH = content.scrollHeight || vh;
        travelRef.current = contentH + vh;
        const budget = Math.round((contentH + vh) * 0.7);
        panel.style.height = `${budget}px`;

        // Set initial transform via ref (SPEC-FAWS-010: no inline style prop)
        content.style.transform =
          "perspective(250px) rotateX(5deg) translateY(0px)";

        initiated.current = true;
      }
    };

    if (!initiated.current) {
      measure();
    }

    // When reduced motion or skipped: render static, no rAF loop
    if (reducedMotion || skipped) {
      if (sectionRef.current) {
        sectionRef.current.style.opacity = "1";
      }
      return;
    }

    const tick = () => {
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!panel || !content) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Read scroll progress through the spacer
      const rect = panel.getBoundingClientRect();
      const vh = window.innerHeight;
      const panelH = rect.height || vh;

      // ── Smooth opacity: fade in as spacer enters, fade out as it exits ──
      const fadeZone = Math.min(vh * 0.3, 250);

      // Entry: 0→1 when rect.top goes from +fadeZone to 0 (spacer top enters viewport)
      const entryRaw = 1 - rect.top / fadeZone;
      const entry = Math.max(0, Math.min(1, entryRaw));

      // Exit: 1→0 when rect.bottom goes from fadeZone to 0 (spacer bottom leaves viewport top)
      const exitRaw = rect.bottom / fadeZone;
      const exit = Math.max(0, Math.min(1, exitRaw));

      const targetOpacity = Math.min(entry, exit);

      // Lerp current opacity towards target so fast scroll (which jumps
      // rect.top) produces a smooth fade over time instead of an instant pop.
      // Frame-rate independent damping via an exponential time constant.
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;
      const tau = 0.08; // seconds — ~90% of target in ~184ms
      const alpha = 1 - Math.exp(-dt / tau);
      const diff = targetOpacity - opacityRef.current;
      if (Math.abs(diff) < 0.001) {
        opacityRef.current = targetOpacity;
      } else {
        opacityRef.current += diff * alpha;
      }

      if (sectionRef.current) {
        sectionRef.current.style.opacity = String(opacityRef.current);
      }

      // ── Text scroll transform — always applied so perspective is
      //     never missing during opacity fade-in (progress clamps to 0
      //     when spacer is above the viewport, keeping text at rest).
      const progress = Math.max(0, Math.min(1, -rect.top / panelH));
      const travel = travelRef.current;

      content.style.transform = `perspective(250px) rotateX(5deg) translateY(${Math.round(-progress * travel)}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Scroll hint fade: mark as scrolled on first scroll event (SPEC-FAWS-011)
    const onScroll = () => setHasScrolled(true);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Debounced resize recalculation (SPEC-FAWS-012)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initiated.current = false;
        measure();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [reducedMotion, skipped]);

  const renderContent = () => (
    <>
      {/* Title */}
      <div className="text-center mb-20">
        <h2 className="font-star-jedi text-[var(--color-yellow)] text-3xl md:text-5xl tracking-wider mb-4">
          LUDOSPORT
        </h2>
        <p className="font-display text-[var(--color-yellow)] text-base md:text-lg uppercase tracking-[0.3em]">
          Drake Academy
        </p>
      </div>

      {/* Crawl text */}
      <div className="space-y-10">
        <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
          En una época donde las pantallas dominan el tiempo libre de los jóvenes...
        </p>

        <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
          Encontrar actividades que promuevan el ejercicio, la disciplina y la convivencia sana se ha vuelto más importante que nunca.
        </p>

        <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
          Por ello nace Drake Academy, un espacio dedicado al desarrollo físico y personal de niños, jóvenes y adultos mediante la práctica de LudoSport.
        </p>

        <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
          Una disciplina deportiva moderna que combina acondicionamiento físico, coordinación, estrategia, trabajo en equipo y autocontrol.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Spacer div — occupies page space, drives scroll progress */}
      <div ref={panelRef} className="w-full" aria-hidden="true" />

      {/* Fixed panel — floats on top when section is in view */}
      <div
        ref={sectionRef}
        className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none"
        style={{
          transform: "translateZ(0)",
          opacity: reducedMotion || skipped ? 1 : 0,
        }}
      >
        {/* Black backdrop with stars */}
        <div className="absolute inset-0 bg-black">
          <Starfield style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        </div>

        {/* Top fade — vanishing point */}
        <div
          className="absolute inset-x-0 top-0 z-10 pointer-events-none crawl__top-fade"
        />

        {/* Skip button — accessible, pointer-events restored on overlay */}
        {!skipped && !reducedMotion && (
          <button
            type="button"
            onClick={() => {
              setSkipped(true);
              document
                .querySelector("#propuesta")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="absolute top-20 right-4 z-50 pointer-events-auto px-4 py-2 bg-white/10 text-yellow border border-yellow/30 rounded hover:bg-white/20 transition-colors"
            aria-label="Saltar introducción animada"
          >
            Saltar intro
          </button>
        )}

        {/* Text content */}
        <div className="relative z-20 w-full max-w-4xl px-4">
          {reducedMotion || skipped ? (
            /* Static render — no transforms, no animation */
            <div
              className="w-full"
              style={{ opacity: 1, transform: "none" }}
            >
              {renderContent()}
            </div>
          ) : (
            /* Animated render — crawl transforms driven by rAF */
            <div
              ref={contentRef}
              className="w-full crawl__content"
            >
              {renderContent()}
            </div>
          )}
        </div>

        {/* Scroll hint — fades out after first scroll (SPEC-FAWS-011) */}
        {!reducedMotion && !skipped && (
          <div
            className="absolute bottom-8 inset-x-0 z-30 flex justify-center pointer-events-none transition-opacity duration-500"
            style={{ opacity: hasScrolled ? 0 : 0.7 }}
            aria-hidden="true"
          >
            <span className="font-body text-[var(--color-yellow)] text-sm tracking-wider">
              Scroll para continuar
            </span>
          </div>
        )}
      </div>
    </>
  );
}
