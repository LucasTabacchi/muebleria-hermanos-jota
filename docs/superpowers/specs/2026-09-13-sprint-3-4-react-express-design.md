# Diseño de migración de los sprints 3 y 4

## Contexto

El proyecto actual es un ecommerce estático construido con HTML, CSS y JavaScript. Los datos de productos viven en el navegador y la carga asíncrona se simula con `setTimeout`. Los sprints 3 y 4 requieren reconstruir el frontend con React y crear una API REST con Node.js y Express, sin cambiar la identidad visual aprobada.

## Objetivos

- Crear una aplicación cliente-servidor con carpetas `/client` y `/backend`.
- Cumplir literalmente la consigna usando Create React App.
- Servir el catálogo desde Express, sin datos locales de productos en React.
- Mantener el diseño, contenido, imágenes y comportamiento visible del sitio actual.
- Ejecutar ambos servidores localmente con instrucciones claras.
- Verificar backend, frontend, integración y build mediante pruebas y CI.

## Fuera de alcance

- Despliegue del backend en Render.
- Pagos, autenticación, base de datos o envío real del formulario.
- Rediseño visual o modificación de la identidad de marca.
- Fabricación de commits en nombre de otros integrantes.

## Arquitectura

```text
/backend
  /data          Catálogo local de productos
  /middleware    Logger, 404 y manejador de errores
  /routes        Rutas modulares de productos
  /tests         Pruebas de integración HTTP
  app.js         Configuración de Express
  server.js      Inicio del servidor

/client
  /public        Logo, imágenes y documento HTML base
  /src
    /components  Componentes de interfaz
    /services    Cliente HTTP de la API
    App.js        Navegación y estado compartido
```

La API escuchará en `http://localhost:3001` y Create React App en `http://localhost:3000`. El cliente usará una variable `REACT_APP_API_URL`, con `http://localhost:3001` como valor de desarrollo. El `package.json` raíz usará npm workspaces para instalar y ejecutar ambos proyectos de forma reproducible.

## Contrato de la API

### `GET /api/productos`

- Respuesta `200` con el arreglo completo de productos en JSON.

### `GET /api/productos/:id`

- Respuesta `200` con un producto cuando el identificador existe.
- Respuesta `404` con un objeto JSON estable cuando no existe.
- Respuesta `400` cuando el identificador no es un entero positivo.

La aplicación usará `express.json()` y un logger global que registre método y URL. Las rutas se definirán con `express.Router`. Un middleware final atenderá rutas inexistentes y el manejador central convertirá errores en respuestas JSON sin exponer detalles internos.

## Componentes y estado de React

- `Navbar`: recibe mediante props el contador del carrito y gestiona la navegación visible.
- `Footer`: conserva la información institucional actual.
- `ProductCard`: representa un producto y emite el evento para ver su detalle.
- `ProductList`: renderiza tarjetas con `.map()` y `key={producto.id}`.
- `ProductDetail`: muestra el detalle, el estado no encontrado y la acción de agregar.
- `ContactForm`: formulario controlado con `useState`, validación y confirmación local.

`App.js` será la fuente de verdad del carrito durante la sesión. Inicializará el estado desde `localStorage`, persistirá cada cambio y pasará el contador a `Navbar` mediante props. La búsqueda, navegación, detalle y formulario usarán eventos de React.

## Flujo de datos y vistas

1. El cliente solicita `GET /api/productos` al iniciar.
2. La interfaz muestra una vista de carga mientras espera.
3. Una respuesta exitosa alimenta la lista y los destacados.
4. Un fallo muestra un mensaje accionable y permite reintentar.
5. La vista de detalle consulta `GET /api/productos/:id` y renderiza carga, éxito, no encontrado o error.
6. El carrito y el formulario funcionan localmente; no agregan endpoints fuera de la consigna.

La navegación usará React Router y conservará las vistas Inicio, Productos, Detalle, Contacto y Carrito con URLs estables. Esta decisión evita acoplar el historial del navegador al estado interno de `App.js` y permite probar cada vista de manera independiente.

## Preservación visual

- Se reutilizarán el logo, las once imágenes y la hoja de estilos como fuente de verdad visual.
- Se mantendrán colores, tipografías, espaciado, jerarquías, contenido y comportamiento responsive.
- La migración no introducirá una estética nueva ni componentes genéricos ajenos a la marca.
- Antes de retirar la versión estática se compararán las vistas principales en escritorio y móvil.

## Estrategia de migración

1. Crear y probar el backend sin modificar el sitio estático.
2. Crear el cliente React y migrar los componentes y recursos visuales.
3. Conectar React con la API y verificar estados de carga, éxito, vacío y error.
4. Actualizar scripts raíz, CI y README.
5. Retirar los archivos estáticos anteriores solamente después de demostrar paridad funcional y visual.

Cada etapa será un commit convencional y reversible. La rama permanente `feature` conservará el trabajo hasta abrir el PR hacia `develop`.

## Pruebas y calidad

### Backend

- Node Test Runner y Supertest para probar la aplicación Express sin abrir un puerto real.
- Listado completo de productos.
- Detalle existente.
- Identificador inválido.
- Producto inexistente.
- Ruta desconocida y formato de error.
- Ejecución del middleware de logging.

### Frontend

- Jest y React Testing Library, incluidos por Create React App, para verificar comportamiento visible.
- Estados de carga, éxito y error de la API.
- Renderizado de lista y detalle.
- Búsqueda de productos.
- Agregado y eliminación del carrito, contador y persistencia.
- Validación y envío simulado del formulario controlado.

### Integración y CI

- Instalación reproducible desde la raíz.
- ESLint para backend y frontend.
- Pruebas de ambos proyectos sin modo interactivo.
- Build de producción del cliente.
- GitHub Actions obligatorio antes de mergear.

## Documentación y entrega

El README quedará en español e incluirá integrantes, requisitos, instalación, variables de entorno, comandos para ejecutar ambos servidores, endpoints, estructura, decisiones arquitectónicas y comandos de verificación. El historial reflejará únicamente contribuciones reales; los demás integrantes deberán aportar al menos un commit propio para cumplir ese punto de la consigna.

## Criterios de aceptación

- Existen `/client` y `/backend` con responsabilidades separadas.
- React no contiene el arreglo local de productos y obtiene los datos mediante `fetch`.
- Todos los componentes, hooks, props, eventos, listas y estados condicionales exigidos están presentes.
- La API cumple los endpoints, middlewares, organización y errores requeridos.
- El diseño y la identidad visual coinciden con la versión actual.
- Ambos servidores funcionan localmente y están documentados.
- Lint, pruebas y build pasan localmente y en GitHub Actions.

## Rollback

Mientras no se retire la versión estática, cada etapa puede revertirse eliminando `/backend` o `/client` sin afectar el sitio actual. La eliminación final de archivos heredados será un commit independiente para permitir restaurarlos con un único revert.
