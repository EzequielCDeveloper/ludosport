import { RANGOS } from "@/lib/constants";
import { BORDER_COLORS, TEXT_COLORS } from "@/lib/colors";

export default function Rangos() {
  return (
    <section id="rangos" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          SISTEMA DE RANGOS
        </h2>
        <p className="font-body text-[var(--color-yellow)] text-center uppercase tracking-[0.05em] mb-4">
          Cinco niveles de maestría en el arte del sable
        </p>
        <p className="font-body text-white/60 text-center text-sm max-w-lg mx-auto mb-12">
          Los colores de cada rango siguen la temática de Star Wars y Drake Academy, no el sistema tradicional de cinturones de artes marciales.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {RANGOS.map((rango) => {
            const isMaestro = rango.nivel === "V";
            const baseClasses = isMaestro
              ? "bg-white/[0.02] border border-white/[0.08] border-t-4 [border-top-color:rgba(255,255,255,0.6)]"
              : `bg-white/[0.015] border border-white/[0.06] border-t-4 ${BORDER_COLORS[rango.color] || "border-white/20"}`;
            return (
              <div
                key={rango.nivel}
                className={`${baseClasses} px-[1.8rem] py-8 hover:-translate-y-[6px] transition-transform duration-300 backdrop-blur-[2px] ${isMaestro ? "rango-card--maestro" : "rango-card--default"} ${"rango-card--" + rango.color}`}
              >
                <span
                  className={`inline-block font-display text-[2.8rem] mb-[0.3rem] ${TEXT_COLORS[rango.color] || "text-white"}`}
                >
                  {rango.nivel}
                </span>
                <h3 className="font-display text-xl text-white mb-2">
                  {rango.titulo}
                </h3>
                <p className="font-body text-sm text-white leading-relaxed">
                  {rango.descripcion}
                </p>
              </div>
            );
          })}
        </div>

        <p className="font-body text-white/50 text-center text-xs max-w-lg mx-auto mt-8">
          El avance entre rangos depende de evaluación individual. No hay un
          tiempo fijo — cada alumno progresa a su propio ritmo según técnica,
          asistencia y actitud.
        </p>
      </div>
    </section>
  );
}
