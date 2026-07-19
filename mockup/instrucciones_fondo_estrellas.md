# Instrucciones para el Fondo de Estrellas (Estilo Star Wars)

Para lograr que las estrellas abarquen toda la página y conservar los destellos luminosos rojo y azul, sigue estos 3 pasos en tu archivo `main.css`.

## Paso 1: Aplicar las estrellas de fondo fijo al Body
Busca la etiqueta `body` y reemplaza el fondo actual para agregar la imagen de estrellas. Usamos `fixed` para crear un efecto de profundidad al hacer scroll.

```css
body {
  font-family: "Pathway Gothic One", system-ui, sans-serif;
  font-size: var(--fs-base);
  line-height: 1.65;
  color: rgba(255, 232, 31, 0.85);
  -webkit-font-smoothing: antialiased;
  
  /* Nuevo fondo global con estrellas */
  background: url('./estrellas.jpg') fixed center/cover no-repeat, var(--black); 
}
```

## Paso 2: Quitar el fondo negro de las secciones
Varias secciones de la página tienen declarado `background: var(--black);`. Debes cambiar esto a `transparent` para que el fondo de estrellas del body sea visible.

```css
.valores,
.profesor,
.actividades,
.rangos,
.faqs,
.footer {
  background: transparent;
}
```

## Paso 3: Mantener los destellos sin tapar el fondo
Busca las clases `.hero__bg` y `.cta-final__bg`. Elimina únicamente el `var(--black)` al final de la propiedad `background` para que los destellos se apliquen sobre las estrellas.

```css
.hero__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 80% 60% at 30% 40%,
      rgba(220, 53, 69, 0.15) 0%,
      transparent 70%
    ),
    radial-gradient(
        ellipse 60% 50% at 70% 60%,
        rgba(13, 110, 253, 0.15) 0%,
        transparent 60%
      );
  z-index: 0;
}

.cta-final__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse at 25% 50%,
      rgba(13, 110, 253, 0.12) 0%,
      transparent 60%
    ),
    radial-gradient(
        ellipse at 75% 50%,
        rgba(220, 53, 69, 0.12) 0%,
        transparent 60%
      );
  z-index: 0;
}
```
