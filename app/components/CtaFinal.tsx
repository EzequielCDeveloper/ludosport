import { ACADEMY } from "@/lib/constants";

export default function CtaFinal() {
  return (
    <section id="contacto" className="relative py-24 overflow-hidden">
      {/* Background with radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 25% 50%, rgba(13, 110, 253, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 75% 50%, rgba(220, 53, 69, 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[var(--color-yellow)] tracking-wider mb-6 animate-fade-up">
          TU PRIMER DUELO TE ESPERA
        </h2>
        <p className="font-body text-lg text-[var(--color-gray-light)] mb-12 animate-fade-up">
          Primera clase gratis. Sin compromiso. Solo tú y el sable.
        </p>

        {/* Info grid */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 animate-fade-up">
          <div className="bg-white/[0.03] p-4 border-t-[3px] [border-top-color:var(--color-blue)] hover:shadow-[0_-5px_15px_rgba(13,110,253,0.25)] transition-shadow duration-200">
            <span className="block font-display text-sm text-[var(--color-gray-aa)] uppercase tracking-widest mb-2">
              Horarios
            </span>
            <span className="font-body text-white">
              {ACADEMY.schedule}
            </span>
          </div>
          <div className="bg-white/[0.03] p-4 border-t-[3px] [border-top-color:var(--color-yellow)] hover:shadow-[0_-5px_15px_rgba(255,232,31,0.2)] transition-shadow duration-200">
            <span className="block font-display text-sm text-[var(--color-gray-aa)] uppercase tracking-widest mb-2">
              Ubicación
            </span>
            <span className="font-body text-white">
              Callejón Jalisco, entre Soto y Pesqueira
            </span>
          </div>
          <div className="bg-white/[0.03] p-4 border-t-[3px] [border-top-color:var(--color-red)] hover:shadow-[0_-5px_15px_rgba(220,53,69,0.25)] transition-shadow duration-200">
            <span className="block font-display text-sm text-[var(--color-gray-aa)] uppercase tracking-widest mb-2">
              Costo
            </span>
            <span className="font-body text-white">
              {ACADEMY.pricing}
            </span>
          </div>
        </div>

        {/* Map */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-up rounded-sm overflow-hidden border border-white/[0.06]">
          <iframe
            src="https://maps.google.com/maps?q=32.461111,-114.795667&z=15&output=embed"
            width="100%"
            height="280"
            style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Drake Academy"
          />
        </div>

        {/* WhatsApp CTA */}
        <a
          href={ACADEMY.whatsappUrl}
          target="_blank"
          rel="noopener"
          className="inline-block font-display text-lg uppercase tracking-wider text-[var(--color-cyan)] bg-transparent border-2 border-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black px-10 py-4 hover:scale-[1.05] active:scale-[0.97] cta-btn--cyan transition-all duration-300 animate-fade-up"
          style={{ boxShadow: '0 0 10px rgba(75,213,238,0.2), inset 0 0 5px rgba(75,213,238,0.1)', textShadow: '0 0 2px rgba(75,213,238,0.5)' }}
        >
          Quiero mi primera clase gratis
        </a>
      </div>
    </section>
  );
}
