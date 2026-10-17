# Mueblería Hermanos Jota

Ecommerce full stack con cliente React y API REST Express. La API persiste el catálogo de productos en MongoDB mediante Mongoose.

## Requisitos

- Node.js 22.22.1 o posterior.
- npm 10 o posterior.
- Una instancia MongoDB local o una URI de MongoDB Atlas.

## Instalación y ejecución local

```sh
npm install
```

1. Copiá `backend/.env.example` como `backend/.env` y completá `MONGODB_URI`.
2. Copiá `.env.example` como `client/.env` si necesitás cambiar la URL de la API.
3. Cargá el catálogo inicial una única vez (el comando es idempotente):

```sh
node backend/scripts/seed.js
```

4. Iniciá ambos procesos:

```sh
npm run dev
```

- Cliente React: [http://localhost:3000](http://localhost:3000)
- API Express: [http://localhost:3001](http://localhost:3001)

El backend **no inicia** si falta `MONGODB_URI` o no puede conectarse a MongoDB. Los archivos `.env` están ignorados por Git: nunca se versionan credenciales.

## Variables de entorno

### Backend: `backend/.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/muebleria-hermanos-jota
PORT=3001
```

### Cliente: `client/.env`

```env
VITE_API_URL=http://localhost:3001
```

## Cargar el catálogo inicial

`backend/scripts/seed.js` transforma `backend/data/productos.js` y hace *upsert* por `nombre`; puede ejecutarse las veces necesarias sin duplicar productos. Conserva cada ruta de imagen legacy en `imagenUrl` y comienza con `stock: 0`, ya que el catálogo original no contiene inventario.

```sh
node backend/scripts/seed.js
```

El seed no se ejecuta al levantar la API.

## API REST

| Método | Endpoint | Resultado |
| --- | --- | --- |
| `GET` | `/api/productos` | Devuelve todos los productos. |
| `GET` | `/api/productos/:id` | Devuelve un producto por ObjectId. |
| `POST` | `/api/productos` | Crea un producto y responde `201`. |
| `PUT` | `/api/productos/:id` | Actualiza un producto y devuelve el documento nuevo. |
| `DELETE` | `/api/productos/:id` | Elimina un producto y responde `204`. |

Campos obligatorios al crear: `nombre`, `precio`, `imagenUrl`. Los campos definidos por el sprint son `nombre`, `descripcion`, `precio`, `stock` e `imagenUrl`. Un id inválido o datos inválidos responden `400`; un producto inexistente responde `404`.

### Contrato para el frontend

- El identificador de navegación es `id` (alias serializado de MongoDB `_id`). Usar `id`, no el id numérico del catálogo legacy.
- Las respuestas incluyen **ambos** `imagenUrl` e `imagen` para compatibilidad. Las nuevas pantallas deben preferir `imagenUrl`; `imagen` permanece durante la transición.
- Las imágenes del seed conservan rutas relativas como `img/aparador Uspallata.png`, servidas por el cliente desde sus recursos públicos.
- El frontend debe construir las solicitudes con `VITE_API_URL` y no hardcodear `localhost`.

## Despliegue: handoff frontend/backend

1. Desplegar la API (por ejemplo, Render) con `MONGODB_URI` y `PORT` definidos como secretos del proveedor. Ejecutar el seed explícitamente contra la base de datos elegida; no incluir credenciales en el repositorio.
2. Configurar la URL pública de la API en el hosting del frontend (Vercel/Netlify): `VITE_API_URL=https://tu-api.example.com` y reconstruir el cliente.
3. Antes de producción, actualizar la lista de orígenes permitidos de CORS en `backend/app.js`: el valor actual permite solamente `http://localhost:3000`. Incluir allí el dominio HTTPS real del frontend, sin usar `*`.
4. Verificar desde el dominio publicado `GET /api/productos`, creación, actualización y eliminación de un producto de prueba.

La conexión remota y el despliegue requieren autorización explícita: esta guía no ejecuta operaciones sobre Atlas, Render, Vercel ni Netlify.

## Comandos de calidad

| Comando | Función |
| --- | --- |
| `npm run lint` | Ejecuta ESLint. |
| `npm test` | Ejecuta pruebas backend y frontend. |
| `npm run test:backend` | Ejecuta pruebas de integración de la API con MongoDB en memoria. |
| `npm run build` | Genera el build del cliente. |

## Arquitectura

```text
React client → Express API → MongoDB
```

- `client/`: interfaz React y consumo HTTP.
- `backend/models/Product.js`: esquema Mongoose.
- `backend/routes/productos.js`: CRUD de productos.
- `backend/config/database.js`: conexión Mongo reutilizable.
- `backend/scripts/seed.js`: inicialización idempotente del catálogo.

## Equipo

- Morales Carlos Ariel
- Tabacchi Lucas
- Kegalj Emiliano