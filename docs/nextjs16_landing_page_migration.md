# Guía de Migración y Arquitectura: Landing Page en Next.js 16

Transpilar un proyecto clásico de **HTML, CSS y Vanilla JS** a **Next.js 16** (utilizando el App Router) es un paso excelente para mejorar el SEO, el rendimiento (Core Web Vitals) y la escalabilidad. Sin embargo, en el mundo de React es muy fácil caer en la **sobreingeniería**. 

Para una *landing page*, el objetivo principal es la velocidad de carga, la indexación en buscadores y mantener una base de código simple y mantenible.

---

## 1. Arquitectura Recomendada (Sin Sobreingeniería)

Para una página de aterrizaje, no necesitas patrones de arquitectura complejos (como Arquitectura Hexagonal o dominios ultra fragmentados). Basta con una separación pragmática y modular basada en los estándares del *App Router*.

```text
📦 mi-landing-page
 ┣ 📂 app
 ┃ ┣ 📜 layout.tsx         # Estructura base del HTML (html, body, fuentes)
 ┃ ┣ 📜 page.tsx           # Contenido principal de la landing (Server Component)
 ┃ ┗ 📜 globals.css        # Estilos globales y capas de Tailwind CSS
 ┣ 📂 components
 ┃ ┣ 📂 ui                 # Componentes genéricos y reutilizables (Botones, Inputs, Cards)
 ┃ ┗ 📂 sections           # Secciones específicas de la landing (Hero, Pricing, FAQ)
 ┣ 📂 lib                  # Funciones puras (formateo de fechas, utilidades, constantes)
 ┣ 📂 public               # Imágenes estáticas, SVGs, favicon y robots.txt
 ┗ 📜 next.config.ts       # Configuración básica del framework
```

**¿Por qué esta estructura?**
- **Modularidad Visual (`components/sections`)**: Evita tener un archivo `page.tsx` de 1000 líneas. Cada bloque lógico de la landing (ej. `HeroSection.tsx`, `Footer.tsx`) vive de forma independiente.
- **Cero Gestores de Estado Globales**: Para una landing page, **no instales Redux, Zustand, ni uses Context API** a menos que sea estrictamente necesario (por ejemplo, para un pequeño carrito de compras integrado). El estado local (`useState`) es suficiente.

---

## 2. Proceso de Transpilación (Paso a Paso)

### Paso A: De HTML puro a JSX (Componentes de Servidor)
Por defecto en Next.js 16 (App Router), todo es un **React Server Component (RSC)**. El servidor renderiza el HTML y el cliente solo descarga lo necesario.
1. Mueve el esqueleto de tu `index.html` (head, body) hacia `app/layout.tsx`.
2. Mueve el contenido principal de tu HTML a `app/page.tsx`.
3. Convierte atributos clásicos de HTML a sintaxis JSX: cambia `class` a `className`, `for` a `htmlFor`, y asegúrate de cerrar todas las etiquetas vacías (ej. `<hr />`, `<img />`).

### Paso B: CSS clásico a Tailwind CSS (o CSS Modules)
Tienes dos caminos pragmáticos sin sobrecomplicar el proyecto:
- **El camino conservador (CSS Modules):** Si no quieres rehacer tus estilos, renombra tus archivos `.css` a `[nombre].module.css` e impórtalos directamente (`import styles from './hero.module.css'`). Esto evita conflictos de clases sin aprender un nuevo framework.
- **El camino moderno (Tailwind CSS):** Si puedes invertir tiempo, transpilar tu CSS clásico a clases de Tailwind directamente en el JSX eliminará archivos muertos, reducirá el tamaño del empaquetado y mantendrá los estilos junto al componente estructural.

### Paso C: JavaScript (Vanilla) a React Hooks y Server Actions
El JS nativo típicamente maneja interactividad o peticiones de formularios. Así se migra correctamente:
- **Interactividad (Menús móviles, Acordeones, Carruseles):** Extrae la funcionalidad a componentes más pequeños, y añade la directiva `"use client"` en la primera línea de estos.  
  *⚠️ Regla de Oro:* **Empuja la directiva `"use client"` lo más profundo posible en el árbol.** No hagas que toda la sección sea cliente, aísla solo el botón interactivo o el modal.
- **Peticiones y Formularios (Contactos o Suscripción):** Olvídate de configurar endpoints manuales de API con `fetch`. En Next.js 16, utiliza **Server Actions**:

```tsx
// app/actions/contact.ts
"use server"

export async function submitContactForm(formData: FormData) {
  const email = formData.get('email');
  // Lógica segura de envío (ej. insertar a BD, enviar mail) 
  // Nunca se expone al cliente
}
```

---

## 3. Mejores Prácticas (Performance y SEO)

### 1. Exprime el ecosistema nativo (`next/image` y `next/font`)
El HTML crudo penaliza el *Layout Shift* (saltos de contenido al cargar).
- Reemplaza todas tus etiquetas `<img>` por `<Image />` de `next/image`. Define los anchos/altos nativos o usa `fill`.
- Usa la propiedad `priority` **únicamente** en la imagen *Above-The-Fold* (la principal del Hero) para que se precargue.
- Importa tus tipografías mediante `next/font/google` en el layout principal; esto descarga la fuente en el servidor de compilación y la sirve estáticamente, eliminando el parpadeo de carga.

### 2. Aprovecha la Caché por defecto
Next.js generará tu landing page de manera estática y la servirá desde una CDN con velocidad instantánea. **Para no romper esta optimización estática:**
- No utilices headers dinámicos (`cookies()`, `headers()`) ni leas los parámetros de búsqueda (`searchParams`) en el layout principal. Si lo haces, Next.js forzará un renderizado dinámico por cada petición (SSR), consumiendo servidor sin necesidad para una landing page.

### 3. SEO Optimizado mediante Metadata
No escribas tus etiquetas `<head>` a mano. En Next.js 16 debes exportar la constante `metadata` en el nivel superior de tu `page.tsx` o `layout.tsx`:

```tsx
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Landing Page - Conversión Máxima',
  description: 'Descripción amigable para Google, migrada desde mi sitio original.',
  openGraph: {
    title: 'Mi Landing Page',
    images: ['/imagen-compartir-redes.jpg']
  }
};
```

## Resumen para evitar la "Sobreingeniería"
1. **Mantenlo Plano:** No crees directorios complejos de `services/`, `repositories/`, `domains/` si la landing page no tiene lógica compleja de negocio. 
2. **Servidor por defecto, Cliente como excepción:** Renderiza todo como Server Component; solo usa `"use client"` para los nodos hojas (la UI interactiva).
3. **No uses bibliotecas externas de estado:** El estado de React (`useState`) acoplado de manera local es todo lo que necesitas para una página de captura o portafolio.
