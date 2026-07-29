import { ACADEMY } from "@/lib/constants";
import CtaButton from "@/app/components/CtaButton";

export default function CtaFinal() {
  const waUrl = new URL(ACADEMY.whatsappUrl);

  return (
    <section id="contacto" className="relative py-24 overflow-hidden">
      {/* Background with radial gradients */}
      <div
        className="absolute inset-0 cta__bg-gradients"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider text-[var(--color-yellow)] mb-6 animate-fade-up">
          TU PRIMER DUELO TE ESPERA
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12 animate-fade-up">
          Primera clase gratis. Sin compromiso. Solo tú y el sable.
        </p>

        {/* Info grid */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 animate-fade-up">
          <div className="bg-white/[0.03] p-4 border-t-4 [border-top-color:var(--color-blue)] hover:shadow-[0_-5px_15px_rgba(13,110,253,0.25)] transition-shadow duration-200">
            <span className="block font-display text-sm text-white uppercase tracking-widest mb-2">
              Horarios
            </span>
            <span className="font-body text-white">{ACADEMY.schedule}</span>
          </div>
          <div className="bg-white/[0.03] p-4 border-t-4 [border-top-color:var(--color-yellow)] hover:shadow-[0_-5px_15px_rgba(255,232,31,0.2)] transition-shadow duration-200">
            <span className="block font-display text-sm text-white uppercase tracking-widest mb-2">
              Ubicación
            </span>
            <span className="font-body text-white">
              Callejón Jalisco, entre Soto y Pesqueira
            </span>
          </div>
          <div className="bg-white/[0.03] p-4 border-t-4 [border-top-color:var(--color-red)] hover:shadow-[0_-5px_15px_rgba(220,53,69,0.25)] transition-shadow duration-200">
            <span className="block font-display text-sm text-white uppercase tracking-widest mb-2">
              Costo
            </span>
            <span className="font-body text-white">{ACADEMY.pricing}</span>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <CtaButton
          href={waUrl.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby="wa-hint"
          aria-label="Quiero mi primera clase gratis (se abre en WhatsApp)"
          variant="cyan"
          className="text-lg px-10 py-4 animate-fade-up"
        >
          Quiero mi primera clase gratis
        </CtaButton>
      </div>
    </section>
  );
}
