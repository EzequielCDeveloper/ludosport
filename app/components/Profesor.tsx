"use client";

import { useState } from "react";
import Image from "next/image";

export default function Profesor() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="profesor" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md profesor__img-wrapper stagger">
              <div className="aspect-[5/6]">
                {imgError ? (
                  <div className="absolute inset-0 bg-[var(--color-black-2)] flex items-center justify-center">
                    <svg
                      width="48"
                      height="48"
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
                    src="/placeholders/kid-learning-with-teacher.jpg"
                    alt="Instructor de esgrima con sable de madera junto a un alumno en el área de entrenamiento de Drake Academy"
                    fill
                    className="object-cover profesor__img"
                    sizes="(max-width: 768px) 100vw, 500px"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] tracking-wider mb-2 text-left">
              EL MAESTRO
            </h2>
            <h3 className="font-display text-2xl text-white mb-4">
              Maestro Vazquez
            </h3>
            <blockquote className="font-display text-lg text-[var(--color-cyan)] italic border-l-4 border-[var(--color-cyan)] pl-6 mb-6">
              &ldquo;El verdadero dominio comienza con el dominio de uno
              mismo&rdquo;
            </blockquote>
            <p className="font-body text-white leading-relaxed">
              Fundador de Ludo Sport Drake Academy, el Maestro Vazquez ha
              dedicado su vida a la enseñanza del sable de madera como
              herramienta de formación integral. Su metodología combina técnicas
              clásicas de esgrima con principios de desarrollo personal, creando
              un entorno donde cada alumno descubre su potencial atlético y su
              fuerza interior.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
