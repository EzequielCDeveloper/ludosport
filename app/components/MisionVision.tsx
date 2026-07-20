export default function MisionVision() {
  return (
    <section id="mision-vision" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          MISIÓN Y VISIÓN
        </h2>
        <p className="font-body text-[var(--color-yellow)] text-center mb-12 text-lg">
          Nuestro propósito y destino
        </p>

        {/* Misión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          <div className="border-l-4 [border-left-color:var(--color-cyan)] pl-4">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-[var(--color-cyan)]">
              MISIÓN
            </h3>
          </div>
          <p className="font-body text-white text-lg md:text-xl leading-relaxed">
            Brindar un ambiente seguro, estructurado y respetuoso donde cada
            alumno desarrolle habilidades físicas y personales que trasciendan
            el entrenamiento y potencien su vida cotidiana.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] my-10 md:my-12 max-w-2xl mx-auto" />

        {/* Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
          <div className="border-l-4 [border-left-color:var(--color-cyan)] pl-4">
            <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-[var(--color-cyan)]">
              VISIÓN
            </h3>
          </div>
          <p className="font-body text-white text-lg md:text-xl leading-relaxed">
            Ser la academia donde cada alumno descubre una actividad que lo
            mantiene activo, aprende algo verdaderamente diferente y forja
            hábitos positivos que lo acompañan durante toda su vida.
          </p>
        </div>
      </div>
    </section>
  );
}
