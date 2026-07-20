import { RANGOS } from "@/lib/constants";

const BORDER_COLORS: Record<string, string> = {
  blue: "[border-left-color:var(--color-blue)]",
  green: "[border-left-color:#00c853]",
  yellow: "[border-left-color:var(--color-yellow)]",
  purple: "[border-left-color:#9c27b0]",
  white: "[border-left-color:white]",
};

const TEXT_COLORS: Record<string, string> = {
  blue: "text-[var(--color-blue)]",
  green: "text-[#00c853]",
  yellow: "text-[var(--color-yellow)]",
  purple: "text-[#9c27b0]",
  white: "text-white",
};

export default function Rangos() {
  return (
    <section id="rangos" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          SISTEMA DE RANGOS
        </h2>
        <p className="font-body text-[var(--color-gray-aa)] text-center mb-12">
          Cinco niveles de maestría en el arte del sable
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {RANGOS.map((rango, index) => {
            const isMaestro = index === 4;
            const baseClasses = isMaestro
              ? "bg-white/[0.02] border border-white/[0.08] border-l-4 [border-left-color:rgba(255,255,255,0.6)]"
              : `bg-white/[0.015] border border-white/[0.06] border-l-4 ${BORDER_COLORS[rango.color] || "border-white/20"}`;
            return (
              <div
                key={rango.nivel}
                className={`${baseClasses} px-[1.8rem] py-8 hover:translate-x-[6px] transition-transform duration-300 ${'rango-card--' + rango.color}`}
                style={{
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  boxShadow: isMaestro
                    ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                    : "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className={`inline-block font-display text-[2.8rem] mb-[0.3rem] ${TEXT_COLORS[rango.color] || "text-white"}`}
                >
                  {rango.nivel}
                </span>
                <h3 className="font-display text-xl text-white mb-2">
                  {rango.titulo}
                </h3>
                <p className="font-body text-sm text-[var(--color-gray-aa)] leading-relaxed">
                  {rango.descripcion}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
