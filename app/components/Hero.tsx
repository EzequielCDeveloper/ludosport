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
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(220, 53, 69, 0.15) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 70% 60%, rgba(13, 110, 253, 0.15) 0%, transparent 60%)
          `,
        }}
      />
      {/* Scanline overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgba(255, 255, 255, 0.015) 120px, rgba(255, 255, 255, 0.015) 121px)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-16">
        {/* Badge */}
        <span className="inline-block text-xs font-display uppercase tracking-[0.12em] text-white bg-[var(--color-red)] px-5 py-1.5 mb-8 hero__animation--badge">
          Primera clase gratis
        </span>

        {/* Title */}
        <h1 className="mb-6 hero__animation--title">
          <span className="block font-display hero__title-size leading-none tracking-[0.04em] hero__title-stroke">
            LUDOSPORT
          </span>
          <span className="block font-display hero__title-size leading-none tracking-[0.04em] mt-2 hero__title-stroke">
            DRAKE ACADEMY
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-lg sm:text-xl text-white max-w-2xl mx-auto mb-4 hero__animation--subtitle">
          Esgrima deportiva con sables de madera — disciplina, respeto y dominio
          personal
        </p>
        <p className="font-body text-sm sm:text-base text-white mb-10 hero__animation--age">
          Para niños y jóvenes desde los 7 años
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 hero__animation--ctas">
          <a
            href="#contacto"
            className="inline-block font-display text-base uppercase tracking-wider text-[var(--color-cyan)] bg-transparent border-2 border-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-black px-8 py-3 transition-[color,background-color,transform,box-shadow] duration-300 shadow-[0_0_10px_rgba(75,213,238,0.2),inset_0_0_5px_rgba(75,213,238,0.1)] hover:shadow-[0_0_20px_rgba(75,213,238,0.6),inset_0_0_10px_rgba(75,213,238,0.4)] hover:scale-[1.05] active:scale-[0.97]"
            style={{ textShadow: "0 0 2px rgba(75,213,238,0.5)" }}
          >
            Quiero mi primera clase
          </a>
          <a
            href="#actividades"
            className="inline-block font-display text-base uppercase tracking-wider text-white border-2 border-white hover:bg-white hover:text-black px-8 py-3 transition-[color,background-color,transform] duration-300 hover:scale-[1.05] active:scale-[0.97]"
          >
            Ver actividades
          </a>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 text-white hero__animation--scroll" title="Desplázate hacia abajo para conocer más">
          <span className="font-display text-xs uppercase tracking-widest">
            Descubre más
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 3v14M5 12l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
