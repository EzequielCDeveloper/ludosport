// ─── Academia ───────────────────────────────────────────
export const ACADEMY = {
  name: "Ludo Sport Drake Academy",
  shortName: "DRAKE ACADEMY",
  whatsapp: "+526531649951",
  whatsappUrl: "https://wa.me/526531649951",
  address: "Callejón Jalisco, entre Soto y Pesqueira, San Luis Río Colorado, Sonora",
  coordinates: { lat: 32.461111, lng: -114.795667 },
  cp: "83447",
  sameAs: {
    facebook: "https://facebook.com/ludosportdrake",
    instagram: "https://instagram.com/ludosportdrake",
    tiktok: "https://tiktok.com/@ludosportdrake",
  },
  schedule: "Jue-Vie 5-7pm · Sáb 4:30-7pm",
  pricing: "1ra gratis · $200 MXN 1ra sem · $300 MXN semanal · 50% 2do hermano",
};

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
    title: "Esgrima con Sable de Madera",
    text: "Técnica fundamental de ataque, defensa y desplazamiento. Dominio del sable como extensión del cuerpo.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Esgrima con Sable de Madera",
  },
  {
    num: 2,
    title: "Duelos Coreografiados",
    text: "Secuencias de combate predefinidas que desarrollan memoria muscular, coordinación y expresión artística.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Duelos Coreografiados",
  },
  {
    num: 3,
    title: "Entrenamiento de Reflejos",
    text: "Ejercicios de reacción y velocidad mental. El cuerpo que responde antes de que la mente lo piense.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Entrenamiento de Reflejos",
  },
  {
    num: 4,
    title: "Precisión y Puntería",
    text: "Técnicas de control milimétrico del sable. Golpes exactos a blancos específicos con máxima eficiencia.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Precisión y Puntería",
  },
  {
    num: 5,
    title: "Katas de Combate",
    text: "Formas estructuradas que integran técnica, fluidez y conciencia corporal en una sola secuencia armónica.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Katas de Combate",
  },
  {
    num: 6,
    title: "Defensa Personal",
    text: "Principios de protección y reacción aplicados a situaciones reales. Confianza que trasciende el entrenamiento.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Defensa Personal",
  },
  {
    num: 7,
    title: "Acondicionamiento Atlético",
    text: "Fuerza, resistencia y flexibilidad diseñados para el rendimiento en combate. El cuerpo es tu primer armamento.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Acondicionamiento Atlético",
  },
  {
    num: 8,
    title: "Control de Respiración",
    text: "Técnicas respiratorias para mantener la calma bajo presión. El ritmo del combate empieza en los pulmones.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Control de Respiración",
  },
  {
    num: 9,
    title: "Meditación Activa",
    text: "Ejercicios de atención plena en movimiento. La mente clara es el arma más poderosa del guerrero.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Meditación Activa",
  },
];

// ─── FAQs ────────────────────────────────────────────────
export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "No, absolutamente no. Nuestro programa está diseñado desde cero para principiantes. Empezamos con fundamentos básicos y cada alumno avanza a su propio ritmo. Desde la primera clase aprenderás movimientos reales con sable de madera.",
  },
  {
    question: "¿Qué incluye la primera clase gratis?",
    answer:
      "La primera clase incluye: introducción a la esgrima con sable de madera, calentamiento guiado, técnica básica de agarre y postura, ejercicios de desplazamiento y un duelo de práctica supervisado. Te prestamos el equipo necesario. Solo trae ropa cómoda y muchas ganas.",
  },
  {
    question: "¿Cuáles son los horarios y costos?",
    answer:
      "<strong>Horarios:</strong> Jueves y Viernes de 5:00 a 7:00 pm, Sábados de 4:30 a 7:00 pm.<br><br><strong>Costos:</strong> Primera clase completamente gratis. $200 la primera semana. $300 semanal después. 50% de descuento para el segundo hermano.",
  },
  {
    question: "¿Dónde están ubicados?",
    answer:
      "Nos encontramos en Callejón Jalisco, entre Soto y Pesqueira, San Luis Río Colorado, Sonora. Es una ubicación céntrica y de fácil acceso. Contamos con espacio techado y todas las medidas de seguridad necesarias.",
  },
  {
    question: "¿Hay clases para diferentes edades?",
    answer:
      "Sí. Trabajamos con dos segmentos principales: niños (de 7 a 12 años) y jóvenes (de 13 años en adelante). Adaptamos la intensidad, la técnica y los ejercicios según el grupo de edad, asegurando que cada alumno reciba la atención que necesita.",
  },
  {
    question: "¿Cómo funcionan los rangos?",
    answer:
      "Nuestro sistema tiene 5 rangos: Iniciado (I), Aprendiz (II), Guerrero (III), Guardián (IV) y Maestro (V). Se avanza mediante evaluaciones periódicas que miden técnica, conocimiento, actitud y espíritu de compañerismo. Cada rango representa un nivel creciente de responsabilidad y maestría.",
  },
];

// ─── Rango Colors ──────────────────────────────────────────
// Map of color names to actual values used in Rangos.tsx.
// Referenced as CSS variables for consistency with the theme system.
export const RANGO_COLORS: Record<string, { border: string; text: string }> = {
  blue: { border: "var(--color-blue)", text: "var(--color-blue)" },
  green: { border: "var(--color-green)", text: "var(--color-green)" },
  yellow: { border: "var(--color-yellow)", text: "var(--color-yellow)" },
  purple: { border: "var(--color-purple)", text: "var(--color-purple)" },
  white: { border: "white", text: "white" },
};

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
