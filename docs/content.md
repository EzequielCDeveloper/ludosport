---
last-reviewed: 2026-07-21
---

# Content Editor Guide: Ludo Sport Drake Academy

> Guide for academy staff and content editors who need to update the site content without modifying component logic.

## Content Architecture

All editable content lives in a single file:

```
lib/constants.ts
```

This file exports typed arrays and objects that drive every section of the landing page. When you update a constant, the corresponding section automatically reflects the change on the next build — no component code changes needed.

**CRITICAL**: `lib/constants.ts` is the ONLY file you should edit for content changes. See [What NOT to Change](#what-not-to-change) below.

---

## Updating Activities

There are 10 activity cards displayed in the carousel (`#actividades` section).

**File**: `lib/constants.ts` → `ACTIVIDADES` array

**Activity structure**:

```typescript
{
  num: number;       // Display order (1-10)
  title: string;     // Activity title
  text: string;      // Short description
  image: string;     // Path to image (e.g., "/placeholders/kids-training.jpg")
  imageAlt: string;  // Accessibility alt text
}
```

**Example — changing activity #3 (Acondicionamiento Físico Adaptado)**:

1. Open `lib/constants.ts`
2. Locate the `ACTIVIDADES` array (around line 78)
3. Find the entry with `num: 3`
4. Modify the fields you want to change:

```typescript
{
  num: 3,
  title: "Nuevo Título de Actividad",
  text: "Nueva descripción para esta actividad.",
  image: "/placeholders/new-image.jpg",
  imageAlt: "Descripción de la imagen",
}
```

**To add a new activity**: Add a new entry with `num: 11` (or the next available number) to the end of the array.

**To remove an activity**: Delete the entry from the array. The carousel will render the remaining items.

> The JSON-LD structured data for search engines is auto-generated from these entries — see [JSON-LD Auto-Generation](#json-ld-auto-generation).

---

## Updating FAQs

There are 6 FAQ items displayed in the accordion (`#faqs` section).

**File**: `lib/constants.ts` → `FAQS` array

**FAQ structure**:

```typescript
{
  question: string;  // The question text
  answer: string;    // The answer (supports HTML)
}
```

**Example — adding a new FAQ**:

```typescript
{
  question: "¿Pregunta nueva?",
  answer: "Respuesta para la nueva pregunta.",
}
```

### ⚠️ HTML in Answers

The `answer` field supports HTML because some answers contain formatted content (e.g., pricing tables with line breaks and bold text). This is rendered via `dangerouslySetInnerHTML`.

**Allowed HTML**: `<strong>`, `<br>`, `<em>`, `<p>` — inline formatting only.

**Example of HTML content**:

```typescript
{
  question: "¿Cuáles son los horarios y costos?",
  answer: "<strong>Horarios:</strong> Jueves y Viernes de 5:00 a 7:00 pm.<br><br><strong>Costos:</strong> $300 semanal.",
}
```

> The FAQ page structured data (`schema.org/FAQPage`) is auto-generated from these entries.

---

## Updating Ranks

There are 5 rank levels displayed in the progression grid (`#rangos` section).

**File**: `lib/constants.ts` → `RANGOS` array

**Rank structure**:

```typescript
{
  nivel: string;       // Roman numeral (I, II, III, IV, V)
  titulo: string;      // Rank title (e.g., "Iniciado", "Aprendiz")
  descripcion: string; // Short description
  color: string;       // Color mapping name
}
```

**Color mapping constraints**:

| Color Value | Visual Effect |
|-------------|---------------|
| `"blue"`    | Blue border + text accent |
| `"green"`   | Green border + text accent |
| `"yellow"`  | Yellow border + text accent |
| `"purple"`  | Purple border + text accent |
| `"white"`   | White border + text accent |

You can only use colors from this list. The actual color values are CSS variables defined in `app/globals.css`. Adding a new color requires a developer to update the component's color mapping.

**Example — changing Rank I (Iniciado)**:

```typescript
{
  nivel: "I",
  titulo: "Iniciado",
  descripcion: "Fundamentos del sable, posturas base, primeros movimientos. El comienzo del camino.",
  color: "blue",
}
```

---

## Updating Values

There are 3 core values displayed in the values grid (`#propuesta` section).

**File**: `lib/constants.ts` → `VALORES` array

**Value structure**:

```typescript
{
  title: string;                            // Value name
  text: string;                             // Description
  icon: ComponentType<SVGProps<SVGSVGElement>>;  // Icon component reference
  color: string;                            // Color mapping name
}
```

**Example — changing a value**:

```typescript
{
  title: "Disciplina",
  text: "Nueva descripción para la disciplina.",
  color: "yellow",
}
```

### 🚩 Icons Require Developer Help

The `icon` field references a React component from `app/components/icons/`. The 3 icons are:

| Icon Component | File |
|----------------|------|
| `DisciplinaIcon` | `app/components/icons/DisciplinaIcon.tsx` |
| `PerseveranciaIcon` | `app/components/icons/PerseveranciaIcon.tsx` |
| `AutocontrolIcon` | `app/components/icons/AutocontrolIcon.tsx` |

Changing an icon requires a developer to create a new SVG icon component and update the import in `lib/constants.ts`. Do NOT attempt to change icon files yourself.

---

## Map Coordinates

The academy's map location is displayed in the `MapSection` component.

**File**: `lib/constants.ts` → `ACADEMY.coordinates`

```typescript
export const ACADEMY = {
  // ...
  coordinates: { lat: 32.461111, lng: -114.795667 },
  // ...
};
```

**To update the map location**:

1. Find the new coordinates (e.g., from Google Maps right-click → "What's here?")
2. Update both `ACADEMY.address` (text) and `ACADEMY.coordinates` (lat/lng)
3. Verify the map renders correctly at the new location

> The coordinates in `ACADEMY` are consumed by `lib/json-ld.ts` for geo metadata in search results, and by `MapSection.tsx` for the Leaflet map. Updating `ACADEMY.coordinates` propagates to both.

---

## Image Replacement

Activity images and placeholder files live in:

```
public/placeholders/
```

Current placeholder images:

| File | Currently Used By |
|------|-------------------|
| `kids-training.jpg` | Activities 1, 5, 9 |
| `kid-learning-with-teacher.jpg` | Activities 2, 4, 7, 10 + Profesor |
| `kid-tired.jpg` | Activities 3, 6, 8 |

Images are referenced in the `ACTIVIDADES` array via the `image` field (path) and `imageAlt` field (alt text for accessibility).

**To replace an image**:

1. Add the new image to `public/placeholders/`
2. Update the `image` field in the relevant `ACTIVIDADES` entry to `"/placeholders/new-filename.jpg"`
3. Update `imageAlt` with a descriptive text for screen readers

**Recommended image dimensions**: 800×600px for consistent card sizing across breakpoints.

---

## JSON-LD Auto-Generation

The site includes structured data (JSON-LD) for search engines — this powers rich results in Google. The structured data is **auto-generated** from the same constants you edit:

| Search Entity | Generated From |
|---------------|----------------|
| **LocalBusiness** | `ACADEMY` (name, address, geo, telephone, opening hours, social profiles) |
| **Services** (×10) | `ACTIVIDADES` — each activity becomes a `schema.org/Service` entity |
| **FAQPage** | `FAQS` — Q&A pairs mapped to `Question`/`Answer` schema |

The generation happens in `lib/json-ld.ts` and is injected into the page via `<script type="application/ld+json">` in the root layout.

**You do NOT need to update JSON-LD separately.** When you change activities or FAQs, the structured data updates automatically on the next build.

---

## What NOT to Change

Do NOT modify these files for content changes:

| Path | Reason |
|------|--------|
| `app/components/*.tsx` | Component logic — changing these can break the layout, behavior, or build |
| `app/hooks/*.ts` | Custom hooks — interactivity logic |
| `app/layout.tsx` | Root layout — fonts, metadata, HTML structure |
| `app/page.tsx` | Page composition — section order and imports |
| `app/globals.css` | Global styles, theme variables, animations |
| `app/styles/*.css` | CSS modules (starfield) |
| `app/error.tsx` | Error page |
| `app/not-found.tsx` | 404 page |
| `app/sitemap.ts` | Sitemap configuration |
| `app/robots.ts` | Robots.txt configuration |
| `eslint.config.mjs` | Linting configuration |
| `next.config.ts` | Next.js configuration and security headers |
| Any `.tsx` or `.css` file elsewhere | Component or style files |

**Rule of thumb**: If you need to change text, images, or structured data — edit `lib/constants.ts`. If you need something that doesn't fit in `lib/constants.ts`, ask a developer.
