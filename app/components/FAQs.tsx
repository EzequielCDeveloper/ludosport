"use client";

import { FAQS } from "@/lib/constants";

export default function FAQs() {
  return (
    <section id="faqs" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--color-yellow)] text-center tracking-wider mb-4">
          PREGUNTAS FRECUENTES
        </h2>
        <p className="font-body text-[var(--color-yellow)] uppercase tracking-[0.05em] text-center mb-12">
          Todo lo que necesitas saber antes de empezar
        </p>

        <div className="divide-y divide-[var(--color-black-3)]">
          {FAQS.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex cursor-pointer items-center justify-between py-5 font-display text-base tracking-wider uppercase text-left text-white hover:text-[var(--color-yellow)] transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0 text-white transition-transform duration-300 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </summary>
              <div className="pb-5">
                <p
                  className="font-body text-base text-white leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
