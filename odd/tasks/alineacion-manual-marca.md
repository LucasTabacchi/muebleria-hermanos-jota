# Alineación con Manual de Marca Hermanos Jota

## Objetivo
Alinear la aplicación React/Vite activa con el manual de marca provisto por el usuario: color, tipografía, tratamiento de logo, voz y contacto.

## Problema y por qué
La auditoría verificó que el storefront activo usa una paleta y tipografía distintas de las especificadas, anima indebidamente el logo y no presenta el logo invertido correcto en el footer.

## Alcance autorizado
- Corregir `client/index.html`, `client/public/css/styles.css` y, si hace falta para datos de contacto, componentes React bajo `client/src`.
- No modificar contenido de catálogo ni backend.
- Preservar accesibilidad, responsive design y comportamiento existente.

## Restricciones
- Paleta exacta: Siena Tostado #A0522D, Verde Salvia #87A96B, Alabastro Cálido #F5E6D3, Vara de Oro #D4A437, Rosa Polvoriento #C47A6D.
- Inter como tipografía primaria y Playfair Display para títulos editoriales.
- Logo sin transformaciones y en Alabastro sobre fondos oscuros.
- TDD: desactivado; no hay configuración ni elección explícita que lo active. Runner de verificación: `npm run test --workspace=client`.

## Estrategia de entrega
- Estrategia: ask-on-risk.
- Pronóstico: ~180 líneas modificadas.
- Ruta: delegated direct (trigger writer: CSS, HTML y posiblemente JSX son archivos no triviales).

## Tareas
- [x] TASK-1: Aplicar tokens cromáticos, tipografías y reglas de logo exigidas por el manual en la aplicación activa. Ruta: delegated; evidencia: `client/index.html` carga Inter 300/400/500/700 y Playfair Display; `client/public/css/styles.css` define los cinco tokens oficiales, elimina transformaciones del logo, establece espacio de protección y aplica la marca Alabastro en el footer.
- [x] TASK-2: Completar contacto visible, ejecutar pruebas/lint/build y verificar visualmente la portada. Ruta: delegated; evidencia: `client/src/pages/ContactPage.jsx` muestra `info@hermanosjota.com.ar`; `npm run test --workspace=client` (10/10), `npm run lint --workspace=client` y `npm run build --workspace=client` finalizaron correctamente.

## Criterios de aceptación
- La aplicación servida por Vite usa los cinco HEX oficiales.
- El cuerpo usa Inter y los títulos usan Playfair Display con las guías del manual.
- El logo no se rota, escala ni deforma; el footer lo muestra en Alabastro.
- Los datos de contacto del manual están visibles y coinciden.
- Tests, lint y build del cliente finalizan correctamente.

## Progreso y evidencia
- TASK-1 y TASK-2 completadas. Los tokens oficiales y la tipografía están en los activos servidos por Vite; el logo no tiene animaciones y la variante del footer se filtra a Alabastro.
- Verificaciones: tests 10/10, lint y build del cliente correctos.

## Próximo paso
- Revisar el commit de la corrección y decidir si se publica.