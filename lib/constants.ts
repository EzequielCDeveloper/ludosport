// ─── Academia ───────────────────────────────────────────
export const ACADEMY = {
  name: "Ludo Sport Drake Academy",
  shortName: "DRAKE ACADEMY",
  whatsapp: "+526531649951",
  whatsappUrl: "https://wa.me/526531649951",
  address: "Callejón Jalisco, entre Soto y Pesqueira, San Luis Río Colorado, Sonora",
  coordinates: { lat: 32.461111, lng: -114.795667 },
  /** Geo metadata string for meta tags: "lat;lng" */
  coordinatesMeta: "32.461111;-114.795667",
  /** Geo metadata string for meta tags: "lat, lng" */
  coordinatesICBM: "32.461111, -114.795667",
  cp: "83447",
  sameAs: {
    facebook: "https://facebook.com/ludosportdrake",
    instagram: "https://instagram.com/ludosportdrake",
    tiktok: "https://tiktok.com/@ludosportdrake",
  },
  schedule: "Jue-Vie 5-7pm · Sáb 4:30-7pm",
  pricing: "1ra gratis · $200 MXN 1ra sem · $300 MXN semanal · 50% 2do hermano",
  founded: 2014,
};

// ─── LudoSport ───────────────────────────────────────────
/** External authoritative references for GEO citation (R02). */
export const LUDOSPORT_REFERENCES = {
  description:
    "LudoSport es una disciplina deportiva internacional de esgrima con sables de madera," +
    " originada en Italia. Combina técnica, estrategia y desarrollo personal en un formato" +
    " competitivo y seguro. Drake Academy es una academia afiliada a la red internacional" +
    " de LudoSport, operando en San Luis Río Colorado, Sonora, México.",
  officialSite: "https://www.ludosport.net/",
  networkNote:
    "LudoSport cuenta con academias en más de 10 países. La metodología, los rangos y" +
    " las técnicas están estandarizados internacionalmente, garantizando una formación" +
    " consistente y de calidad en cada academia de la red.",
} as const;

// ─── Nav Links ─────────────────────────────────────────--
export interface NavLink {
  href: string;
  label: string;
  cta?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: "#propuesta", label: "Valores" },
  { href: "#profesor", label: "Maestro" },
  { href: "#actividades", label: "Actividades" },
  { href: "#rangos", label: "Rangos" },
  { href: "#faqs", label: "FAQ" },
  { href: "#contacto", label: "Contacto", cta: true },
];

// ─── StarWarsCrawl ───────────────────────────────────────
export const CRAWL_TEXTS: string[] = [
  "En una época donde las pantallas dominan el tiempo libre de los jóvenes...",
  "Encontrar actividades que promuevan el ejercicio, la disciplina y la convivencia sana se ha vuelto más importante que nunca.",
  "Por ello nace Drake Academy, un espacio dedicado al desarrollo físico y personal de niños, jóvenes y adultos mediante la práctica de LudoSport.",
  "Una disciplina deportiva moderna que combina acondicionamiento físico, coordinación, estrategia, trabajo en equipo y autocontrol.",
];

// ─── Actividades ─────────────────────────────────────────
/** Subtitle displayed under the ACTIVIDADES heading. */
export const ACTIVIDADES_SUBTITLE = "10 disciplinas que transforman";

// ─── Map Section ─────────────────────────────────────────
export const MAP_STRINGS = {
  popupHtml: "<strong>Drake Academy</strong><br/>LudoSport San Luis Río Colorado",
  loadingText: "Cargando mapa...",
  errorTitle: "No se pudo cargar el mapa",
  fallbackLinkText: "Ver en Google Maps",
} as const;

// ─── Profesor ────────────────────────────────────────────
export const PROFESOR = {
  heading: "EL MAESTRO",
  name: "Maestro Vazquez",
  quote: "El verdadero dominio comienza con el dominio de uno mismo",
  bio: "Fundador de Ludo Sport Drake Academy, el Maestro Vazquez ha dedicado su vida a la enseñanza del sable de madera como herramienta de formación integral. Su metodología combina técnicas clásicas de esgrima con principios de desarrollo personal, creando un entorno donde cada alumno descubre su potencial atlético y su fuerza interior.",
  imageSrc: "/photos/profesor.webp",
  imageAlt: "Instructor de esgrima con sable de madera junto a un alumno en el área de entrenamiento de Drake Academy",
} as const;

// ─── Valores ─────────────────────────────────────────────
import type { ComponentType, SVGProps } from "react";
import DisciplinaIcon from "@/app/components/icons/DisciplinaIcon";
import PerseveranciaIcon from "@/app/components/icons/PerseveranciaIcon";
import AutocontrolIcon from "@/app/components/icons/AutocontrolIcon";

export interface Valor {
  title: string;
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  color: string; // theme color name for left border
}

export const VALORES: Valor[] = [
  {
    title: "Disciplina",
    text: "Cada movimiento, cada práctica, cada respiración — el dominio comienza con la constancia. Enseñamos a los alumnos que la verdadera fuerza nace de la repetición consciente.",
    icon: DisciplinaIcon,
    color: "yellow",
  },
  {
    title: "Perseverancia",
    text: "La constancia ante el desafío. Fomentamos la capacidad de mantenerse firmes ante los obstáculos, forjando un espíritu inquebrantable que busca la superación continua dentro y fuera del combate.",
    icon: PerseveranciaIcon,
    color: "yellow",
  },
  {
    title: "Autocontrol",
    text: "El dominio de la mente sobre el cuerpo. Promovemos la gestión de las emociones y la precisión en cada acción, entendiendo que el verdadero guerrero primero se vence a sí mismo.",
    icon: AutocontrolIcon,
    color: "yellow",
  },
];

// ─── Actividades ─────────────────────────────────────────
export interface Actividad {
  num: number;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
}

export const ACTIVIDADES: Actividad[] = [
  {
    num: 1,
    title: "Entrenamiento Técnico Progresivo",
    text: "Plan de formación escalonado que va de lo fundamental a lo avanzado. Cada etapa construye sobre la anterior, asegurando una base sólida antes de avanzar al siguiente nivel.",
    image: "/photos/actividad_01.webp",
    imageAlt: "Grupo de niños entrenando técnicas de sable de madera en formación",
  },
  {
    num: 2,
    title: "Ejercicios de Coordinación y Reacción",
    text: "Ejercicios específicos que desarrollan la sincronización de movimientos y los reflejos. El cuerpo aprende a reaccionar con velocidad y precisión ante cualquier estímulo del combate.",
    image: "/photos/actividad_02.webp",
    imageAlt: "Instructor guiando a un alumno en ejercicios de coordinación con sable",
  },
  {
    num: 3,
    title: "Acondicionamiento Físico Adaptado",
    text: "Preparación física diseñada según la edad y nivel de cada alumno. Trabajamos fuerza, resistencia y flexibilidad de forma segura y progresiva para que el cuerpo esté listo para el combate.",
    image: "/photos/actividad_03.webp",
    imageAlt: "Alumno recuperando el aliento después de una sesión de acondicionamiento físico",
  },
  {
    num: 4,
    title: "Técnicas de Respiración y Concentración",
    text: "Ejercicios de respiración consciente que enseñan a mantener la calma y la concentración bajo presión. Dominar el aire es dominar la mente y el combate.",
    image: "/photos/actividad_04.webp",
    imageAlt: "Alumno practicando técnicas de respiración guiado por el instructor",
  },
  {
    num: 5,
    title: "Juegos Estratégicos y Trabajo en Equipo",
    text: "Actividades lúdicas que desarrollan el pensamiento táctico y la colaboración. Los alumnos aprenden a crear estrategias y a confiar en sus compañeros.",
    image: "/photos/actividad_05.webp",
    imageAlt: "Niños resolviendo desafíos estratégicos en equipo durante el entrenamiento",
  },
  {
    num: 6,
    title: "Combates Controlados y Supervisados",
    text: "Práctica de combate en un entorno seguro con equipo de protección y supervisión constante. Cada duelo es guiado para maximizar el aprendizaje sin riesgos.",
    image: "/photos/actividad_03.webp",
    imageAlt: "Alumno hidratándose después de un combate controlado y supervisado",
  },
  {
    num: 7,
    title: "Misiones y Retos de Entrenamiento",
    text: "Desafíos temáticos que combinan habilidades técnicas, creatividad y toma de decisiones. Cada misión es una aventura diseñada para superar límites.",
    image: "/photos/actividad_07.webp",
    imageAlt: "Instructor explicando una misión de entrenamiento a un alumno atento",
  },
  {
    num: 8,
    title: "Evaluaciones de Progreso",
    text: "Sesiones periódicas de evaluación que miden el avance técnico, actitudinal y teórico de cada alumno. Feedback claro para saber exactamente qué mejorar y hacia dónde avanzar.",
    image: "/photos/actividad_08.webp",
    imageAlt: "Alumno haciendo una pausa durante su evaluación de progreso",
  },
  {
    num: 9,
    title: "Torneos Amistosos",
    text: "Competencias internas entre compañeros que fomentan el compañerismo y el espíritu deportivo. El verdadero premio es la experiencia y el crecimiento compartido.",
    image: "/photos/actividad_09.webp",
    imageAlt: "Niños celebrando después de un torneo amistoso de esgrima con sables",
  },
  {
    num: 10,
    title: "Eventos Especiales para Alumnos y Familias",
    text: "Exhibiciones, convivencias y celebraciones que invitan a las familias a ser parte activa del camino de sus hijos. La academia es una comunidad que trasciende el entrenamiento.",
    image: "/photos/actividad_05.webp",
    imageAlt: "Familias reunidas en un evento especial de la academia con alumnos e instructores",
  },
];

// ─── FAQs ────────────────────────────────────────────────
export type AnswerPart = { type: "text" | "strong"; content: string };

export interface FAQ {
  question: string;
  answerParts: AnswerPart[];
}

export const FAQS: FAQ[] = [
  {
    question: "¿Necesito experiencia previa?",
    answerParts: [
      { type: "text", content: "No, absolutamente no. Nuestro programa está diseñado desde cero para principiantes. Empezamos con fundamentos básicos y cada alumno avanza a su propio ritmo. Desde la primera clase aprenderás movimientos reales con sable de madera." },
    ],
  },
  {
    question: "¿Qué incluye la primera clase gratis?",
    answerParts: [
      { type: "text", content: "La primera clase incluye: introducción a la esgrima con sable de madera, calentamiento guiado, técnica básica de agarre y postura, ejercicios de desplazamiento y un duelo de práctica supervisado. Te prestamos el equipo necesario. Solo trae ropa cómoda y muchas ganas." },
    ],
  },
  {
    question: "¿Cuáles son los horarios y costos?",
    answerParts: [
      { type: "strong", content: "Horarios:" },
      { type: "text", content: " Jueves y Viernes de 5:00 a 7:00 pm, Sábados de 4:30 a 7:00 pm. " },
      { type: "strong", content: "Costos:" },
      { type: "text", content: " Primera clase completamente gratis. $200 la primera semana. $300 semanal después. 50% de descuento para el segundo hermano." },
    ],
  },
  {
    question: "¿Dónde están ubicados?",
    answerParts: [
      { type: "text", content: "Nos encontramos en Callejón Jalisco, entre Soto y Pesqueira, San Luis Río Colorado, Sonora. Es una ubicación céntrica y de fácil acceso. Contamos con espacio techado y todas las medidas de seguridad necesarias." },
    ],
  },
  {
    question: "¿Hay clases para diferentes edades?",
    answerParts: [
      { type: "text", content: "Sí. Trabajamos con dos segmentos principales: niños (de 7 a 12 años) y jóvenes (de 13 años en adelante). Adaptamos la intensidad, la técnica y los ejercicios según el grupo de edad, asegurando que cada alumno reciba la atención que necesita." },
    ],
  },
  {
    question: "¿Cómo funcionan los rangos?",
    answerParts: [
      { type: "text", content: "Nuestro sistema tiene 5 rangos: Iniciado (I), Aprendiz (II), Guerrero (III), Guardián (IV) y Maestro (V). Se avanza mediante evaluaciones periódicas que miden técnica, conocimiento, actitud y espíritu de compañerismo. Cada rango representa un nivel creciente de responsabilidad y maestría. " },
      { type: "strong", content: "Importante: " },
      { type: "text", content: "el tiempo para avanzar entre rangos varía según cada alumno — no hay un plazo fijo. La evaluación es individual y depende del progreso técnico, la asistencia y la actitud." },
    ],
  },
  {
    question: "¿Es seguro practicar esgrima con sables de madera?",
    answerParts: [
      { type: "text", content: "Sí, completamente. Los sables que utilizamos son de madera sin filo — no cortan. El entrenamiento incluye equipo de protección (careta y guantes) y todas las prácticas de combate son supervisadas por el instructor. El riesgo de lesión es comparable al de cualquier deporte de contacto controlado como karate o esgrima olímpica. " },
      { type: "strong", content: "Requisitos de seguridad: " },
      { type: "text", content: "los alumnos deben usar ropa cómoda, traer agua, y los menores de edad requieren autorización firmada de padre o tutor antes de la primera clase." },
    ],
  },
];

// ─── Rangos ──────────────────────────────────────────────
export interface Rango {
  nivel: string;
  titulo: string;
  descripcion: string;
  color: string; // theme color name
}

export const RANGOS: Rango[] = [
  {
    nivel: "I",
    titulo: "Iniciado",
    descripcion:
      "Fundamentos del sable, posturas base, primeros movimientos. El comienzo del camino.",
    color: "blue",
  },
  {
    nivel: "II",
    titulo: "Aprendiz",
    descripcion:
      "Combinaciones básicas, defensa y contraataque. El cuerpo empieza a recordar.",
    color: "green",
  },
  {
    nivel: "III",
    titulo: "Guerrero",
    descripcion:
      "Fluidez en combate, resistencia física, estrategia. El espíritu se templa en el duelo.",
    color: "yellow",
  },
  {
    nivel: "IV",
    titulo: "Guardián",
    descripcion:
      "Maestría técnica, liderazgo, enseñanza a principiantes. El conocimiento se comparte.",
    color: "purple",
  },
  {
    nivel: "V",
    titulo: "Maestro",
    descripcion:
      "Dominio completo del arte. El sable y el guerrero son uno. El camino nunca termina.",
    color: "white",
  },
];
