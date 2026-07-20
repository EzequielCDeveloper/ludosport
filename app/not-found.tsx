import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Starfield from "@/app/components/Starfield";
import { NAV_LINKS } from "@/lib/constants";

export default function NotFound() {
  return (
    <>
      <Starfield />
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-xl">
          {/* 404 codigo destacado */}
          <p className="font-display text-[var(--color-red)] text-8xl sm:text-9xl font-bold leading-none mb-4">
            404
          </p>

          {/* Mensaje principal */}
          <h1 className="font-display text-[var(--color-yellow)] text-4xl sm:text-5xl uppercase tracking-wider mb-6">
            Página no encontrada
          </h1>

          {/* Explicación */}
          <p className="font-body text-[var(--color-gray-aa)] text-lg sm:text-xl mb-8 leading-relaxed">
            La página que buscas no existe o ha sido movida.
          </p>

          {/* Boton principal */}
          <Link
            href="/"
            className="inline-block font-display text-sm uppercase tracking-[0.15em] px-8 py-3 border-2 border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black transition-all duration-300"
          >
            Volver al inicio
          </Link>

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
