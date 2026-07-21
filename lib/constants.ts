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
    title: "Entrenamiento Técnico Progresivo",
    text: "Plan de formación escalonado que va de lo fundamental a lo avanzado. Cada etapa construye sobre la anterior, asegurando una base sólida antes de avanzar al siguiente nivel.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Entrenamiento Técnico Progresivo",
  },
  {
    num: 2,
    title: "Ejercicios de Coordinación y Reacción",
    text: "Ejercicios específicos que desarrollan la sincronización de movimientos y los reflejos. El cuerpo aprende a reaccionar con velocidad y precisión ante cualquier estímulo del combate.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Ejercicios de Coordinación y Reacción",
  },
  {
    num: 3,
    title: "Acondicionamiento Físico Adaptado",
    text: "Preparación física diseñada según la edad y nivel de cada alumno. Trabajamos fuerza, resistencia y flexibilidad de forma segura y progresiva para que el cuerpo esté listo para el combate.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Acondicionamiento Físico Adaptado",
  },
  {
    num: 4,
    title: "Técnicas de Respiración y Concentración",
    text: "Ejercicios de respiración consciente que enseñan a mantener la calma y la concentración bajo presión. Dominar el aire es dominar la mente y el combate.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Técnicas de Respiración y Concentración",
  },
  {
    num: 5,
    title: "Juegos Estratégicos y Trabajo en Equipo",
    text: "Actividades lúdicas que desarrollan el pensamiento táctico y la colaboración. Los alumnos aprenden a crear estrategias y a confiar en sus compañeros.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Juegos Estratégicos y Trabajo en Equipo",
  },
  {
    num: 6,
    title: "Combates Controlados y Supervisados",
    text: "Práctica de combate en un entorno seguro con equipo de protección y supervisión constante. Cada duelo es guiado para maximizar el aprendizaje sin riesgos.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Combates Controlados y Supervisados",
  },
  {
    num: 7,
    title: "Misiones y Retos de Entrenamiento",
    text: "Desafíos temáticos que combinan habilidades técnicas, creatividad y toma de decisiones. Cada misión es una aventura diseñada para superar límites.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Misiones y Retos de Entrenamiento",
  },
  {
    num: 8,
    title: "Evaluaciones de Progreso",
    text: "Sesiones periódicas de evaluación que miden el avance técnico, actitudinal y teórico de cada alumno. Feedback claro para saber exactamente qué mejorar y hacia dónde avanzar.",
    image: "/placeholders/kid-tired.jpg",
    imageAlt: "Evaluaciones de Progreso",
  },
  {
    num: 9,
    title: "Torneos Amistosos",
    text: "Competencias internas entre compañeros que fomentan el compañerismo y el espíritu deportivo. El verdadero premio es la experiencia y el crecimiento compartido.",
    image: "/placeholders/kids-training.jpg",
    imageAlt: "Torneos Amistosos",
  },
  {
    num: 10,
    title: "Eventos Especiales para Alumnos y Familias",
    text: "Exhibiciones, convivencias y celebraciones que invitan a las familias a ser parte activa del camino de sus hijos. La academia es una comunidad que trasciende el entrenamiento.",
    image: "/placeholders/kid-learning-with-teacher.jpg",
    imageAlt: "Eventos Especiales para Alumnos y Familias",
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
