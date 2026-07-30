import CtaButton from "@/app/components/CtaButton";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hero background gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, color-mix(in srgb, var(--color-red) 15%, transparent) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 70% 60%, color-mix(in srgb, var(--color-blue) 15%, transparent) 0%, transparent 60%)
          `,
        }}
      />
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 hero__scanline"
      />

      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-16">
        {/* Badge */}
        <span className="inline-block text-xs font-display uppercase tracking-[0.12em] text-white bg-[var(--color-red)] px-5 py-1.5 mb-8 hero__animation--badge">
          Primera clase gratis
        </span>

        {/* Title */}
        <h1 className="mb-6 hero__animation--title">
          <span className="block font-star-jedi hero__title-size leading-none tracking-[0.04em] hero__title-stroke">
            LUDOSPORT
          </span>
          <span className="block font-star-jedi hero__title-size leading-none tracking-[0.04em] mt-2 hero__title-stroke">
            DRAKE ACADEMY
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg sm:text-xl text-white max-w-2xl mx-auto mb-4 hero__animation--subtitle">
          Esgrima deportiva con sables de madera — disciplina, respeto y dominio
          personal
        </p>

        {/* GEO: Direct-answer definition (C02) — first 150 words */}
        <p className="font-body text-sm sm:text-base text-[var(--color-yellow)]/85 max-w-3xl mx-auto mb-6 hero__animation--definition">
          <strong>LudoSport</strong> es una disciplina deportiva moderna de esgrima con sables de
          madera que combina acondicionamiento físico, coordinación, estrategia,
          trabajo en equipo y autocontrol. Originada en Italia, se practica
          internacionalmente como un deporte de combate seguro y formativo.
        </p>

        <p className="font-body text-sm sm:text-base text-white max-w-2xl mx-auto mb-4 hero__animation--age">
          Para niños y jóvenes desde los 7 años. Los sables son de madera — sin
          filo, sin riesgo de corte. Primera clase gratis.
        </p>

        {/* GEO: Summary box / Key takeaways (O02) */}
        <div className="max-w-2xl mx-auto mb-10 text-left hero__animation--summary">
          <div className="border border-[var(--color-yellow)]/25 bg-[var(--color-yellow)]/[0.03] p-5 sm:p-6">
            <h2 className="font-display text-xs text-[var(--color-yellow)] uppercase tracking-[0.15em] mb-4">
              ¿Por qué LudoSport?
            </h2>
            <ul className="space-y-2.5">
              {[
                "Ejercicio físico completo sin impacto articular",
                "Desarrollo de disciplina, concentración y autocontrol",
                "Ambiente seguro con sables de madera y supervisión constante",
                "Sistema de rangos que premia el esfuerzo y la constancia",
                "Comunidad inclusiva para niños y jóvenes desde los 7 años",
              ].map((item) => (
                <li key={item} className="font-body text-sm text-white/80 flex items-start gap-2.5">
                  <span className="text-[var(--color-yellow)] mt-0.5 shrink-0" aria-hidden="true">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 hero__animation--ctas">
          <CtaButton href="#contacto" variant="cyan" className="text-base px-8 py-3">
            Quiero mi primera clase
          </CtaButton>
          <CtaButton href="#actividades" variant="white" className="text-base px-8 py-3">
            Ver actividades
          </CtaButton>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 text-white hero__animation--scroll">
          <span className="font-display text-xs uppercase tracking-widest">
            Descubre más
          </span>
          <span className="sr-only">Desplázate hacia abajo para conocer más</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 3v14M5 12l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Bottom fade to black — smooth visual bridge to StarWarsCrawl */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none hero__bottom-fade"
      />
    </section>
  );
}
