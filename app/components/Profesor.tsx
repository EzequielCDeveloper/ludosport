"use client";

import { useState } from "react";
import Image from "next/image";
import { PROFESOR } from "@/lib/constants";

export default function Profesor() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="profesor" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md profesor__img-wrapper stagger">
              <div className="aspect-[5/6] relative">
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
                    src={PROFESOR.imageSrc}
                    alt={PROFESOR.imageAlt}
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
              {PROFESOR.heading}
            </h2>
            <h3 className="font-display text-2xl text-white mb-4">
              {PROFESOR.name}
            </h3>
            <blockquote className="font-display text-lg text-[var(--color-cyan)] italic border-l-4 border-[var(--color-cyan)] pl-6 mb-6">
              &ldquo;{PROFESOR.quote}&rdquo;
            </blockquote>
            <p className="font-body text-white leading-relaxed">
              {PROFESOR.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
