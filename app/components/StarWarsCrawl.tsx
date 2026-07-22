"use client";

import { useEffect, useRef } from "react";
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

  // On the first frame, measure and set the spacer height
  useEffect(() => {
    const tick = () => {
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!panel || !content) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // First frame: measure content, set spacer height, init
      if (!initiated.current) {
        const vh = window.innerHeight;
        const contentH = content.scrollHeight || vh;
        travelRef.current = contentH + vh;
        const budget = Math.round((contentH + vh) * 0.7);
        panel.style.height = `${budget}px`;
        initiated.current = true;
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

      // ── Text scroll: only when spacer top is past viewport top ──
      if (rect.top <= 0 && rect.bottom > 0) {
        // progress 0→1 as user scrolls through the panel
        const progress = Math.max(0, Math.min(1, -rect.top / panelH));
        const travel = travelRef.current;

        content.style.transform = `perspective(250px) rotateX(5deg) translateY(${Math.round(-progress * travel)}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Spacer div — occupies page space, drives scroll progress */}
      <div ref={panelRef} className="w-full" aria-hidden="true" />

      {/* Fixed panel — floats on top when section is in view */}
      <div
        ref={sectionRef}
        className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none"
        style={{ transform: "translateZ(0)", opacity: 0 }}
      >
        {/* Black backdrop with stars */}
        <div className="absolute inset-0 bg-black">
          <Starfield style={{ position: "absolute", inset: 0, zIndex: 0 }} />
        </div>

        {/* Top fade — vanishing point */}
        <div
          className="absolute inset-x-0 top-0 z-10 pointer-events-none crawl__top-fade"
        />

        {/* Text content */}
        <div className="relative z-20 w-full max-w-4xl px-4">
          <div
            ref={contentRef}
            className="w-full crawl__content"
          >
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
                En una época donde las pantallas dominan
                <br />
                el tiempo libre de los jóvenes...
              </p>

              <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
                Encontrar actividades que promuevan
                <br />
                el ejercicio, la disciplina y la
                <br />
                convivencia sana se ha vuelto
                <br />
                más importante que nunca.
              </p>

              <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
                Por ello nace Drake Academy,
                <br />
                un espacio dedicado al desarrollo
                <br />
                físico y personal de niños, jóvenes
                <br />
                y adultos mediante la práctica de
                <br />
                LudoSport.
              </p>

              <p className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify">
                Una disciplina deportiva moderna
                <br />
                que combina acondicionamiento físico,
                <br />
                coordinación, estrategia, trabajo en
                <br />
                equipo y autocontrol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
