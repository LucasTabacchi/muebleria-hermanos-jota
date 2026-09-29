# Alineación al 100% con Manual de Marca Hermanos Jota

## Objetivo
Corregir todos los desvíos detectados respecto al manual de marca en la aplicación activa y recursos del repositorio: logo sin efectos prohibidos, tipografía exacta con guía de usos, paleta de colores y voz de marca en catálogo, maderas nativas, acabados naturales y contacto con canal WhatsApp.

## Problema y por qué
La auditoría reveló violaciones al manual: sombra y bordes agregados en el logo, fondo circular defectuoso en el footer, títulos sin mayúsculas ni espaciado 0.1em en el cliente, alturas de línea no coincidentes (1.68 en vez de 1.6), botones con pesos 600 y 700 en vez de Inter Medium (500), catálogo con colores en inglés ("Sage Green", "Dusty Rose") y acabados no naturales (poliuretano, epoxi), ausencia de maderas nativas (algarrobo, quebracho, caldén) y contacto telefónico sin canal WhatsApp rotulado.

## Alcance autorizado
- Modificar estilos en `client/public/css/styles.css` y `css/styles.css`.
- Modificar componentes de cliente en `client/src/` (Header/Navbar, Footer, ContactPage, etc.).
- Alinear catálogo de productos en `backend/data/productos.js` y `js/productos.js` (colores en español, maderas nativas, acabados de bajo COV, corrección "FSCO" -> "FSC®").
- Preservar tests pasando y actualizar aserciones si alguna depende de los textos ajustados.
- Preservar comportamiento responsivo y accesibilidad.

## Restricciones
- Respetar los 5 colores exactos: Siena Tostado `#A0522D`, Verde Salvia `#87A96B`, Alabastro Cálido `#F5E6D3`, Vara de Oro `#D4A437`, Rosa Polvoriento `#C47A6D`.
- Tipografía primaria Inter (pesos 300, 400, 500, 700) y secundaria Playfair Display (400, 700).
- Prohibición estricta de efectos en el logo (sin drop-shadow, sin bordes circulares superpuestos, sin parches).
- TDD desactivado; runner: `npm test` (`npm test:backend` y `npm test:client`).

## Estrategia de entrega
- Estrategia: ask-on-risk.
- Pronóstico: ~250 líneas modificadas.
- Ruta por tarea: direct / delegated según cantidad de archivos.

## Tareas
- [x] TASK-1: Reglas de Logo y variantes limpia en Header y Footer. Eliminar sombras y bordes circulares en `.logo img`. Remover el fondo circular del footer para que `logo-alabastro.svg` respire limpio sobre fondo oscuro. Ajustar tamaño y área de protección.
- [x] TASK-2: Tipografía exacta y Tokens cromáticos. Aplicar mayúsculas, espaciado 0.1em y Siena Tostado en títulos principales; altura de línea 1.6 en cuerpo; Inter Medium (500) y 0.08em en botones; regla de leyendas (Inter Light 300, 9pt, 0.02em); fondo Alabastro Cálido donde corresponde.
- [x] TASK-3: Catálogo, Voz de marca, Maderas nativas y Acabados ecológicos. Traducir colores a español normado (Verde Salvia, Rosa Polvoriento, Siena Tostado, Alabastro Cálido); incorporar maderas nativas argentinas (algarrobo, caldén, quebracho); reemplazar acabados sintéticos por acabados naturales de bajo COV; corregir erratas "FSCO" por "FSC®".
- [ ] TASK-4: Contacto, Canal de WhatsApp y Datos del Showroom. Agregar canal WhatsApp explícito con enlace a wa.me; dirección completa; garantía 10 años en estructura y 5 años en acabados; sitio web oficial visible.
- [ ] TASK-5: Verificación integral, Pruebas, Linters y Build. Ejecutar suite de pruebas completa (backend y cliente), linter y build de producción.

## Criterios de aceptación
- Logo sin filtros de sombra ni bordes agregados; variante invertida del footer sin círculo de fondo.
- Tipografía cumple la tabla de guías (títulos en Playfair Display mayúsculas 0.1em, cuerpo 1.6, botones Inter Medium 0.08em).
- Catálogo 100% en español con paleta oficial, maderas nativas y acabados ecológicos.
- WhatsApp y dirección completa reflejados en contacto.
- Tests (backend y client), lint y build finalizan con éxito.

## Progreso y evidencia
- TASK-1 completada: se eliminaron sombras y bordes agregados del logo en header; se removieron fondos circulares y padding en footer para que el logo Alabastro se muestre limpio sobre fondo oscuro. Tests: 24/24 pasan. Commit: `af98664`.
- TASK-2 completada: títulos h1 con color Siena Tostado, mayúsculas y espaciado 0.1em; line-height 1.6 en body; botones con peso 500 (Inter Medium), mayúsculas y 0.08em; reglas de leyendas añadidas (Inter Light 300, 9pt, 0.02em). Tests: 24/24 pasan. Commit: `a22c463`.
- TASK-3 completada: catálogo en backend y frontend alineado a español normado con Verde Salvia, Rosa Polvoriento, Siena Tostado, Alabastro Cálido; incorporadas maderas nativas (algarrobo, caldén, quebracho); eliminados poliuretano y epoxi por acabados ecológicos y bajo COV; corregidas erratas FSCO a FSC®. Tests: 26/26 pasan.
