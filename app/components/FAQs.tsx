"use client";

import { FAQS } from "@/lib/constants";
import { useAccordion } from "@/app/hooks/useAccordion";

export default function FAQs() {
  const { openId, toggle } = useAccordion();

  return (
    <section id="faqs" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          PREGUNTAS FRECUENTES
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12">
          Todo lo que necesitas saber antes de empezar
        </p>

        <div className="divide-y divide-[#222]">
          {FAQS.map((faq, index) => {
            const isOpen = openId === index;
            return (
              <div key={index} className="faq-item">
                <button
                  onClick={() => toggle(index)}
                  className="faq-item__trigger flex items-center justify-between w-full py-5 px-0 font-display text-base tracking-wider uppercase text-left text-white hover:text-[var(--color-yellow)] transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 text-white transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={isOpen ? "pb-5" : ""}>
                      <p
                        className="font-body text-base text-white leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
