import Starfield from "@/app/components/Starfield";
import { CRAWL_TEXTS } from "@/lib/constants";

export default function StarWarsCrawl(): React.JSX.Element {
  return (
    <section id="historia" className="relative py-24 bg-black overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 z-0">
        <Starfield />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-20">
            <h2 className="font-star-jedi text-[var(--color-yellow)] text-3xl md:text-5xl tracking-wider mb-4">
              LUDOSPORT
            </h2>
            <p className="font-display text-[var(--color-yellow)] text-base md:text-lg uppercase tracking-[0.3em]">
              Ludo Sport Drake Academy
            </p>
          </div>

          {/* Content text */}
          <div className="space-y-10">
            {CRAWL_TEXTS.map((text, i) => (
              <p
                key={i}
                className="font-body text-[var(--color-yellow)] text-xl md:text-2xl leading-[1.8] text-justify"
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
