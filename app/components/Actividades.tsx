"use client";

import { useRef } from "react";
import Image from "next/image";
import { ACTIVIDADES } from "@/lib/constants";
import { useHorizontalCarousel } from "@/app/hooks/useHorizontalCarousel";

export default function Actividades() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentIndex, scrollTo, next, prev, isFirst, isLast } =
    useHorizontalCarousel(scrollRef, ACTIVIDADES.length);

  return (
    <section id="actividades" className="py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          ACTIVIDADES
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12">
          9 disciplinas que transforman
        </p>
      </div>

      {/* Scroll-snap carousel */}
      <div
        ref={scrollRef}
        className="actividades__scroll overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            next();
            e.preventDefault();
          }
          if (e.key === "ArrowLeft") {
            prev();
            e.preventDefault();
          }
        }}
      >
        <div className="actividades__track flex gap-6 px-[5vw]">
          {ACTIVIDADES.map((actividad) => (
            <article
              key={actividad.num}
              className="actividad-card flex-[0_0_85vw] md:flex-[0_0_45vw] lg:flex-[0_0_30vw] 2xl:flex-[0_0_25vw] 2xl:max-w-[380px] max-w-[400px] md:max-w-[380px] lg:max-w-[360px] bg-white/[0.015] backdrop-blur-[2px] border border-white/[0.06] border-b-4 border-b-[var(--color-yellow)]/40 overflow-hidden snap-start transition-transform duration-300 hover:-translate-y-1.5"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }}
            >
              <div className="aspect-[3/2] overflow-hidden">
                <Image
                  src={actividad.image}
                  alt={actividad.imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="font-display text-base text-[var(--color-yellow)] block mb-1">
                  {String(actividad.num).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg tracking-wider uppercase text-white mb-2">
                  {actividad.title}
                </h3>
                <p className="font-body text-sm text-white leading-relaxed">
                  {actividad.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 px-[5vw] py-8">
        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={isFirst}
          className="w-11 h-11 flex items-center justify-center bg-[var(--color-yellow)] text-white transition-all duration-300 hover:brightness-75 hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {ACTIVIDADES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-6 h-6 border-2 transition-all duration-300 ${
                i === currentIndex
                  ? "bg-[var(--color-yellow)] border-[var(--color-yellow)]"
                  : "bg-[var(--color-black-3)] border-[var(--color-gray-aa)]"
              }`}
              aria-label={`Ir a actividad ${i + 1}`}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={isLast}
          className="w-11 h-11 flex items-center justify-center bg-[var(--color-yellow)] text-white transition-all duration-300 hover:brightness-75 hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
