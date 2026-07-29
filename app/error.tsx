"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Starfield from "@/app/components/Starfield";
import { NAV_LINKS } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Starfield />
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-xl">
          {/* Icono de error */}
          <p className="font-display text-[var(--color-red)] text-8xl sm:text-9xl font-bold leading-none mb-4">
            ¡
          </p>

          {/* Mensaje principal */}
          <h1 className="font-display text-[var(--color-yellow)] text-4xl sm:text-5xl uppercase tracking-wider mb-6">
            Algo salió mal
          </h1>

          {/* Explicación */}
          <p className="font-body text-[var(--color-gray-aa)] text-lg sm:text-xl mb-2 leading-relaxed">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </p>

          {/* ID de error para debugging — solo en desarrollo */}
          {process.env.NODE_ENV !== "production" && error.digest && (
            <p className="font-body text-xs text-white/30 mb-8">
              Error ID: {error.digest}
            </p>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={reset}
              className="font-display text-sm uppercase tracking-[0.15em] px-8 py-3 border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black transition-all duration-300"
            >
              Intentar de nuevo
            </button>
            <Link
              href="/"
              className="font-display text-sm uppercase tracking-[0.15em] px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Volver al inicio
            </Link>
          </div>

          {/* Enlaces a secciones */}
          <div className="mt-12">
            <p className="font-body text-xs text-[var(--color-gray-aa)] uppercase tracking-[0.15em] mb-4">
              Explora nuestras secciones
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={`/${link.href}`}
                  className="font-body text-sm text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
