import { RANGOS } from "@/lib/constants";

const BORDER_COLORS: Record<string, string> = {
  blue: "[border-top-color:var(--color-blue)]",
  green: "[border-top-color:var(--color-green)]",
  yellow: "[border-top-color:var(--color-yellow)]",
  purple: "[border-top-color:var(--color-purple)]",
  white: "[border-top-color:white]",
};

const TEXT_COLORS: Record<string, string> = {
  blue: "text-[var(--color-blue)]",
  green: "text-[var(--color-green)]",
  yellow: "text-[var(--color-yellow)]",
  purple: "text-[var(--color-purple)]",
  white: "text-white",
};

export default function Rangos() {
  return (
    <section id="rangos" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          SISTEMA DE RANGOS
        </h2>
        <p className="font-body text-[var(--color-yellow)] text-center mb-12">
          Cinco niveles de maestría en el arte del sable
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {RANGOS.map((rango, index) => {
            const isMaestro = index === 4;
            const baseClasses = isMaestro
              ? "bg-white/[0.02] border border-white/[0.08] border-t-4 [border-top-color:rgba(255,255,255,0.6)]"
              : `bg-white/[0.015] border border-white/[0.06] border-t-4 ${BORDER_COLORS[rango.color] || "border-white/20"}`;
            return (
              <div
                key={rango.nivel}
                className={`${baseClasses} px-[1.8rem] py-8 hover:-translate-y-[6px] transition-transform duration-300 ${"rango-card--" + rango.color}`}
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
                <p className="font-body text-sm text-white leading-relaxed">
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
