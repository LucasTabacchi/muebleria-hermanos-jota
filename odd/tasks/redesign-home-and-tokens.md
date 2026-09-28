# Rediseño visual: Sistema de Tokens y Home (Landing Page Insignia)

## Objetivo
Implementar un rediseño de alta gama para Hermanos Jota combinando principios de `distinctive-ui`, `landing-page-design`, `frontend-design` y `antigravity-design-expert`. Establecer una dirección estética editorial y táctil de ebanistería contemporánea con profundidad espacial (elevación ingrávida, microinteracciones fluidas, sombras multicapa) y optimización de conversión, sin alterar contratos de accesibilidad ni romper tests existentes.

## Alcance
- Inyección de tipografías distintivas en `client/index.html` (Google Fonts: Playfair Display + Plus Jakarta Sans).
- Modernización y estructuración de tokens CSS en `client/public/css/styles.css` (variables de profundidad, elevaciones suaves, paleta cromática orgánica, curvas de aceleración y glassmorphism refinado).
- Rediseño del Navbar / Header flotante con transición, soporte accesible y contador animado.
- Rediseño de la Home (Landing Page): Hero asimétrico con alta conversión, grilla de productos destacados con efecto flotante (`antigravity`), bloque editorial de Filosofía, tarjetas de Sustentabilidad y Programa Herencia Viva, y banner de visita al taller.
- Preservar selectores, roles ARIA y textos de prueba para garantizar compatibilidad con `App.test.jsx`.

## Tareas

- [x] TASK-1: Configurar tipografía en `client/index.html` y modernizar tokens del sistema de diseño en `client/public/css/styles.css` (paleta, elevaciones multicapa, glassmorphism y curvas de movimiento).
- [x] TASK-2: Rediseñar el Header/Navbar con comportamiento flotante, desenfoque de fondo sutil y microinteracciones de navegación.
- [x] TASK-3: Rediseñar la sección Hero de la Home enfocada en conversión (CRO), composición editorial y profundidad espacial de imagen.
- [x] TASK-4: Rediseñar las secciones de la Home (Destacados con hover antigravedad en `ProductCard`, Filosofía del taller, tarjetas de Sustentabilidad y métricas de Herencia Viva).
- [ ] TASK-5: Refinar el Footer con grilla arquitectónica y verificar la suite completa de Vitest (`npm test`), build (`npm run build`) y lint (`npm run lint`).

## Verificación
- Vitest: `npm test` en `client/`
- Build: `npm run build` en `client/`
- Lint: `npm run lint` en `client/`
