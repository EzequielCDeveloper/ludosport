"use client";

import { VALORES } from "@/lib/constants";
import ValueCard from "./ValueCard";
import { useStaggerAnimation } from "@/app/hooks/useStaggerAnimation";

export default function Valores() {
  const gridRef = useStaggerAnimation();

  return (
    <section id="propuesta" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          NUESTROS VALORES
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12">
          Forjamos carácter a través del arte del sable
        </p>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {VALORES.map((valor) => (
            <div key={valor.title} className="stagger">
              <ValueCard
                title={valor.title}
                text={valor.text}
                icon={valor.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
