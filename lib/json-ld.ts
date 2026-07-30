import { ACADEMY, ACTIVIDADES, FAQS } from "@/lib/constants";

export function generateLocalBusiness(): string {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "SportsActivityLocation"],
        "@id": "https://ludosport.com/#business",
        name: "Ludo Sport Drake Academy",
        description:
          "Academia de esgrima deportiva con sables de madera. Clases para niños y jóvenes en San Luis Río Colorado. Disciplina, respeto y dominio personal.",
        url: "https://ludosport.com",
        telephone: ACADEMY.whatsapp,
        image: "https://ludosport.com/logo.jpeg",
        priceRange: "$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Callejón Jalisco, entre Soto y Pesqueira",
          addressLocality: "San Luis Río Colorado",
          addressRegion: "Sonora",
          addressCountry: "MX",
          postalCode: ACADEMY.cp,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: ACADEMY.coordinates.lat,
          longitude: ACADEMY.coordinates.lng,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Thursday", "Friday"],
            opens: "17:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "16:30",
            closes: "19:00",
          },
        ],
        areaServed: {
          "@type": "City",
          name: "San Luis Río Colorado",
          sameAs: "https://es.wikipedia.org/wiki/San_Luis_R%C3%ADo_Colorado",
        },
        sameAs: [
          ACADEMY.sameAs.facebook,
          ACADEMY.sameAs.instagram,
          ACADEMY.sameAs.tiktok,
        ],
        knowsAbout: [
          "Esgrima deportiva con sables de madera",
          "Esgrima deportiva",
          "Entrenamiento de coordinación",
          "Deporte de combate",
          "Acondicionamiento físico juvenil",
          "Entrenamiento de reflejos",
        ],
        parentOrganization: {
          "@type": "Organization",
          name: "Ludo Sport",
        },
      },
      // ─── Services (cada actividad como Service entity) ───
      ...ACTIVIDADES.map((actividad) => ({
        "@type": "Service",
        "@id": `https://ludosport.com/#service-${actividad.num}`,
        name: actividad.title,
        description: actividad.text,
        provider: { "@id": "https://ludosport.com/#business" },
        category: "Esgrima deportiva",
        audience: {
          "@type": "Audience",
          audienceType: "Niños y jóvenes desde los 7 años",
        },
      })),
      // ─── FAQPage (para GEO — LLMs priorizan FAQPage schema) ───
      {
        "@type": "FAQPage",
        "@id": "https://ludosport.com/#faq",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answerParts.map((p) => p.content).join(""),
          },
        })),
      },
      // ─── WebPage (refuerza entidad) ───
      {
        "@type": "WebPage",
        "@id": "https://ludosport.com/#webpage",
        url: "https://ludosport.com",
        name: "Ludo Sport Drake Academy — Esgrima con Sables de Madera",
        description:
          "Academia de esgrima deportiva con sables de madera en San Luis Río Colorado. Clases para niños y jóvenes. Primer clase gratis.",
        about: { "@id": "https://ludosport.com/#business" },
        mainEntity: { "@id": "https://ludosport.com/#faq" },
      },
    ],
  };

  return JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
}
