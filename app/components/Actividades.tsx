"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ACTIVIDADES, ACTIVIDADES_SUBTITLE } from "@/lib/constants";
import { useHorizontalCarousel } from "@/app/hooks/useHorizontalCarousel";

export default function Actividades(): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentIndex, scrollTo, next, prev, isFirst, isLast } =
    useHorizontalCarousel(scrollRef, ACTIVIDADES.length);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  return (
    <section id="actividades" className="py-24 overflow-y-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          ACTIVIDADES
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12">
          {ACTIVIDADES_SUBTITLE}
        </p>
      </div>

      {/* Scroll-snap carousel */}
      <div
        ref={scrollRef}
        className="actividades__scroll w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Carrusel de actividades — usa las flechas para navegar"
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
        {/* SPEC-FAWS-017: sr-only keyboard navigation hint */}
        <span className="sr-only">
          Usa las flechas izquierda y derecha para navegar entre actividades
        </span>
        <div className="actividades__track flex gap-6 px-[5vw]">
          {ACTIVIDADES.map((actividad) => (
            <article
              key={actividad.num}
              className="actividad-card flex-[0_0_85vw] md:flex-[0_0_45vw] lg:flex-[0_0_30vw] 2xl:flex-[0_0_25vw] 2xl:max-w-[380px] max-w-[400px] md:max-w-[380px] lg:max-w-[360px] bg-white/[0.015] backdrop-blur-[2px] border border-white/[0.06] border-b-4 border-b-[var(--color-yellow)]/40 overflow-hidden snap-start transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div className="aspect-[3/2] overflow-hidden">
                {imgErrors[actividad.num] ? (
                  <div className="w-full h-full bg-[var(--color-black-2)] flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="text-[var(--color-gray-aa)]"
                    >
                      <path
                        d="M12 14l3-3m0 0l3 3m-3-3v8M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={actividad.image}
                    alt={actividad.imageAlt}
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [actividad.num]: true }))
                    }
                  />
                )}
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
          className="w-11 h-11 flex items-center justify-center bg-[var(--color-yellow)] text-black transition-[filter,transform,opacity] duration-300 hover:brightness-75 hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2 items-center">
          {ACTIVIDADES.map((actividad, i) => (
            <button
              key={actividad.num}
              onClick={() => scrollTo(i)}
              className={`w-6 h-6 border-2 transition-colors duration-300 ${
                i === currentIndex
                  ? "bg-[var(--color-yellow)] border-[var(--color-yellow)]"
                  : "bg-[var(--color-black-3)] border-[var(--color-gray-aa)]"
              }`}
              aria-label={`Ir a actividad ${i + 1}`}
              aria-current={i === currentIndex ? "true" : "false"}
            />
          ))}
          {/* SPEC-FAWS-016: visible position counter */}
          <span
            className="font-body text-sm text-[var(--color-yellow)] ml-2 tabular-nums"
            aria-live="polite"
          >
            {currentIndex + 1} / {ACTIVIDADES.length}
          </span>
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={isLast}
          className="w-11 h-11 flex items-center justify-center bg-[var(--color-yellow)] text-black transition-[filter,transform,opacity] duration-300 hover:brightness-75 hover:scale-110 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
