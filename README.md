# Mueblería Hermanos Jota

Ecommerce full stack para Mueblería Hermanos Jota. El cliente React conserva la
identidad visual del sitio original y obtiene el catálogo desde una API REST local
desarrollada con Node.js y Express.

> La versión React + Express se ejecuta localmente por ahora. El despliegue del
> backend queda fuera del alcance actual.

## Inicio rápido

### Requisitos

- Node.js 22.22.1 o posterior.
- npm 10 o posterior, incluido con Node.js.
- Git para clonar el repositorio y utilizar los hooks de calidad.

### Instalación

Desde la raíz del repositorio:

```sh
npm install
```

La raíz utiliza **npm workspaces**, por lo que este único comando instala las
dependencias de `/client` y `/backend`. También configura los hooks locales de Husky.

### Ejecución de la aplicación completa

```sh
npm run dev
```

El comando inicia ambos procesos:

- Cliente React: [http://localhost:3000](http://localhost:3000)
- API Express: [http://localhost:3001](http://localhost:3001)

Para detenerlos, presionar `Ctrl+C`.

## Comandos disponibles

| Comando                 | Función                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `npm run dev`           | Inicia cliente y backend en paralelo con recarga durante el desarrollo. |
| `npm run dev:client`    | Inicia solamente el cliente React.                                      |
| `npm run dev:backend`   | Inicia solamente la API con el modo `watch` de Node.js.                 |
| `npm run start:client`  | Inicia solamente el cliente React con Vite.                             |
| `npm run start:backend` | Inicia solamente la API sin modo `watch`.                               |
| `npm run lint`          | Analiza JavaScript/JSX con ESLint y TypeScript con tsc.                 |
| `npm test`              | Ejecuta todas las pruebas de backend y frontend sin modo interactivo.   |
| `npm run test:backend`  | Ejecuta las pruebas de integración de la API.                           |
| `npm run test:client`   | Ejecuta las pruebas del cliente React sin observación continua.         |
| `npm run build`         | Genera la compilación de producción del cliente.                        |
| `npm run format`        | Formatea los archivos compatibles con Prettier.                         |

## Configuración

El cliente utiliza la variable `VITE_API_URL` para localizar el backend. El
valor predeterminado es `http://localhost:3001` y está documentado en `.env.example`.

Si necesitás modificarlo, copiá `.env.example` como `client/.env` antes de iniciar
el cliente:

```env
VITE_API_URL=http://localhost:3001
```

Los archivos `.env` locales no se versionan.

## Arquitectura

```text
/
├── client/                  Aplicación React + TypeScript creada con Vite
│   ├── public/              Recursos públicos e imágenes de la marca
│   └── src/
│       ├── components/      Navbar, Footer, tarjetas, listas, detalle y formulario
│       ├── pages/           Vistas asociadas a las rutas de la aplicación
│       ├── services/        Acceso centralizado a la API mediante fetch
│       └── utils/           Formato de precios y rutas de imágenes
├── backend/                 API REST con Node.js y Express
│   ├── data/                Catálogo local de productos
│   ├── middleware/          Registro, rutas no encontradas y errores
│   ├── routes/              Rutas organizadas con express.Router
│   └── tests/               Pruebas de integración con node:test y Supertest
└── .github/workflows/       Verificación automática de calidad
```

El frontend administra el carrito en `App` con `useState`, lo persiste en
`localStorage` y pasa el contador al `Navbar` mediante props. Las vistas de catálogo y
detalle consumen la API y muestran estados de carga, éxito y error.

## API REST

| Método | Endpoint             | Resultado                                           |
| ------ | -------------------- | --------------------------------------------------- |
| `GET`  | `/api/productos`     | Devuelve el catálogo completo en formato JSON.      |
| `GET`  | `/api/productos/:id` | Devuelve un producto o responde `404` si no existe. |

Ejemplos locales:

- [Catálogo completo](http://localhost:3001/api/productos)
- [Producto con identificador 1](http://localhost:3001/api/productos/1)

El backend incorpora `express.json()`, CORS, registro global de método y URL, y
manejadores centralizados de rutas inexistentes y errores.

## Decisiones técnicas

- **Vite + React + TypeScript:** reemplaza Create React App para disponer de un flujo de
  desarrollo y compilación moderno, tipado estático y builds rápidos.
- **Vitest + Testing Library:** ejecutan las pruebas del cliente en el mismo ecosistema
  ESM de Vite.
- **React Router 6.30.3:** conserva las rutas existentes y mantiene compatibilidad con
  la API utilizada por el cliente.
- **Catálogo en la API:** el cliente ya no mantiene productos locales; todas las vistas
  los solicitan al backend mediante `fetch`.
- **Ejecución local:** el despliegue del backend en Render se realizará en una etapa
  posterior. Por ahora, cliente y API deben ejecutarse juntos en la computadora local.
- **Migración incremental:** el frontend estático de la raíz se conserva como fallback
  porque Netlify todavía publica esa carpeta. Esta convivencia es transitoria hasta
  verificar la paridad y coordinar el despliegue conjunto de React y la API.

## Pruebas y calidad

Para reproducir localmente los controles obligatorios de GitHub Actions:

```sh
npm ci
npm run lint
npm test
npm run build
```

La integración continua usa Node.js 22.22.1 y exige el check **ESLint and tests** antes
de cada merge a `develop` o `main`. Además, Husky, lint-staged y commitlint controlan
los archivos preparados y los mensajes de commit.

## Flujo de ramas

- `feature`: integración continua de nuevas funcionalidades.
- `develop`: versión integrada y validada para la siguiente entrega.
- `bugfix`: correcciones planificadas que todavía no llegan a producción.
- `main`: versión estable.

El recorrido habitual es `feature` → `develop` → `main`, siempre mediante pull request.
Los pushes directos, force pushes y eliminaciones están protegidos en las ramas
principales.

## Sitio publicado

La [versión estática del Sprint 2](https://muebleria-hermanosjota.netlify.app/) continúa
disponible como fallback mientras Netlify publique la raíz. Este enlace todavía no
representa la migración React + Express y se reemplazará cuando se coordine el
despliegue del cliente junto con la API.

## Equipo

- Morales Carlos Ariel
- Tabacchi Lucas
- Kegalj Emiliano

Actualmente el historial Git contiene commits verificables de Lucas Tabacchi. Para
cumplir el requisito académico de participación de todos los integrantes, Carlos Ariel
Morales y Emiliano Kegalj deben aportar commits propios desde sus cuentas; no se debe
atribuir autoría de forma artificial.
