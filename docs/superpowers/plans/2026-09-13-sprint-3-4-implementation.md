# Plan de implementación de los sprints 3 y 4

## Objetivo

Migrar el ecommerce estático a una aplicación cliente-servidor con Create React App y Express, manteniendo exactamente la identidad visual y cumpliendo la consigna académica.

## Restricciones

- Rama de trabajo permanente: `feature`.
- Issue aprobado: `#4`.
- Despliegue fuera de alcance; ambos servidores deben funcionar localmente.
- No retirar la versión estática hasta verificar paridad.
- No atribuir commits a integrantes que no realizaron el trabajo.
- La migración supera 400 líneas por el scaffold generado y la hoja de estilos. Se usará un único PR por la política aprobada de ramas permanentes, con commits atómicos y una excepción de tamaño documentada.

## Unidad 1 — Backend Express

### Pruebas primero

Crear pruebas de integración que exijan:

- `GET /api/productos` devuelve los once productos.
- `GET /api/productos/1` devuelve Aparador Uspallata.
- Identificador inválido devuelve `400`.
- Producto inexistente devuelve `404`.
- Ruta desconocida devuelve `404` con JSON estable.
- El logger registra método y URL.

Ejecutar las pruebas y confirmar que fallan porque la aplicación aún no existe.

### Implementación mínima

- Crear `backend/data/productos.js` como módulo.
- Crear `backend/routes/productosRoutes.js` con `express.Router`.
- Crear middlewares de logging, rutas no encontradas y errores.
- Crear `backend/app.js` sin abrir puerto para permitir pruebas.
- Crear `backend/server.js` con puerto `3001` configurable.
- Verificar pruebas y ejecución HTTP real.

### Commit

`feat(backend): add products REST API`

Rollback: revertir el commit elimina únicamente `/backend`.

## Unidad 2 — Scaffold y base visual del cliente

### Preparación

- Generar `/client` con Create React App por requisito de la consigna.
- Incorporar React Router.
- Copiar logo, imágenes y estilos actuales a las ubicaciones del cliente.
- Configurar el documento base, fuentes y metadatos.

### Pruebas primero

Crear una prueba de shell que exija Navbar, Footer y rutas base antes de completar los componentes.

### Implementación mínima

- Crear Navbar y Footer reutilizables.
- Crear las rutas Inicio, Productos, Contacto y Carrito.
- Mantener encabezado, navegación, footer y responsive actuales.
- Confirmar build de producción sin advertencias del proyecto.

### Commit

`feat(client): establish React application shell`

Rollback: revertir el commit elimina el scaffold y los recursos del cliente sin afectar el sitio estático.

## Unidad 3 — Catálogo y detalle desde la API

### Pruebas primero

Crear pruebas que exijan:

- Estado de carga inicial.
- Lista renderizada desde la respuesta HTTP.
- Filtrado por nombre y categoría.
- Estado de error con acción de reintento.
- Detalle existente, no encontrado y error.

Ejecutar y confirmar fallos por ausencia de componentes y servicio.

### Implementación mínima

- Crear `services/api.js` usando `fetch`.
- Crear ProductCard, ProductList y ProductDetail.
- Renderizar listas con `.map()` y `key={producto.id}`.
- Implementar estados condicionales de carga, éxito, vacío, 404 y error.
- Mantener tarjetas, detalle, imágenes y contenido visual actual.

### Commit

`feat(client): load catalog and product details from API`

Rollback: revertir el commit conserva el shell React y elimina únicamente las vistas dependientes de la API.

## Unidad 4 — Carrito y contacto

### Pruebas primero

Crear pruebas que exijan:

- Agregar productos actualiza contador y total.
- Eliminar y vaciar productos actualiza la UI.
- El carrito se inicializa y persiste en `localStorage`.
- El formulario controlado valida nombre, email y mensaje.
- Un formulario válido muestra confirmación y limpia sus campos.

### Implementación mínima

- Gestionar carrito con `useState` en App y persistencia con `useEffect`.
- Pasar contador a Navbar por props.
- Crear vista del carrito con eventos de React.
- Crear ContactForm controlado con `useState`.
- Mantener mensajes, estilos y comportamiento actual.

### Commit

`feat(client): migrate cart and contact interactions`

Rollback: revertir el commit conserva catálogo y detalle.

## Unidad 5 — Integración, CI y documentación

- Convertir la raíz en npm workspace para `/client` y `/backend`.
- Agregar comandos raíz de desarrollo, lint, pruebas y build.
- Ajustar ESLint para JSX, navegador, Node y pruebas.
- Actualizar GitHub Actions para ejecutar instalación, lint, pruebas y build.
- Reescribir README en español con instalación y ejecución de ambos servidores, arquitectura, endpoints y decisiones.
- Ejecutar el conjunto completo y comprobar HTTP real entre cliente y backend.

### Commit

`chore: integrate React and Express workspace`

Rollback: revertir el commit restaura las herramientas raíz anteriores sin eliminar las aplicaciones.

## Unidad 6 — Paridad y retiro del frontend heredado

- Comparar Inicio, Productos, Detalle, Contacto y Carrito en escritorio y móvil.
- Verificar teclado, foco visible, imágenes y navegación.
- Ejecutar lint, pruebas, build y `git diff --check`.
- Eliminar HTML, CSS, JavaScript y pruebas heredadas solamente cuando React alcance paridad.
- Mantener un commit separado para restauración sencilla.

### Commit

`refactor: retire legacy static storefront`

Rollback: revertir solamente este commit restaura toda la versión estática.

## Evidencia final

- Resumen de pruebas backend y frontend.
- Build exitoso de Create React App.
- Comprobación manual de `http://localhost:3001/api/productos`.
- Comprobación manual de `http://localhost:3000` conectada a la API.
- Capturas comparativas de las vistas principales.
- Matriz final de requisitos de Sprint 3/4.
