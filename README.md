# Mueblería Hermanos Jota

E-commerce MERN de mobiliario: catálogo, autenticación con JWT, carrito persistente y pedidos asociados al cliente autenticado.

## Aplicación pública

- Frontend: [muebleria-hermanosjota.netlify.app](https://muebleria-hermanosjota.netlify.app/)
- Backend: se publica en Render desde `render.yaml`. Antes de publicar, copiá la URL pública de Render en `VITE_API_URL` de Netlify y la URL pública de Netlify en `FRONTEND_URL` de Render.

## Arquitectura

```text
React + Vite (Netlify) ── HTTPS/JSON ──> Express API (Render) ──> MongoDB Atlas
      │                                      │
      ├─ AuthContext: JWT y sesión            ├─ bcrypt + JWT middleware
      └─ CartContext: carrito local           └─ usuarios, productos y pedidos
```

El cliente almacena la sesión y el carrito en `localStorage`. Las llamadas de escritura y consulta de pedidos incluyen `Authorization: Bearer <token>`. El servidor obtiene el usuario desde el JWT y usa el precio del producto almacenado en la base: el cliente no decide precios ni el dueño del pedido.

## Funcionalidades

- Registro (`/registro`), login (`/login`), logout y sesión persistente.
- Perfil protegido (`/perfil`) y lista protegida de pedidos (`/mis-pedidos`).
- Catálogo, detalle, filtros, carrito global con React Context API y administración exclusiva para el rol `admin`.
- Finalización de compra: `POST /api/pedidos` asociado al usuario autenticado y vaciado del carrito solo ante éxito.

## Desarrollo local

Requiere Node.js 22.22.1 o posterior y una instancia de MongoDB.

```sh
npm install
cp backend/.env.example backend/.env
cp client/.env.example client/.env
npm run dev
```

Para desarrollo local dejá `VITE_API_URL` vacío; Vite redirige `/api` al backend local. En `backend/.env` configurá:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/muebleria-hermanos-jota
PORT=3001
JWT_SECRET=elegir-un-secreto-unico
FRONTEND_URL=http://localhost:3000
```

`MONGO_URI` también es aceptada como alternativa para la URI de Atlas. Nunca subir archivos `.env`, secretos ni credenciales al repositorio.

## API

| Método | Endpoint | Autenticación | Descripción |
| --- | --- | --- | --- |
| GET | `/api/productos` | No | Lista el catálogo. |
| GET | `/api/productos/:id` | No | Devuelve un producto. |
| POST | `/api/productos` | Admin | Crea un producto. |
| PUT | `/api/productos/:id` | Admin | Actualiza un producto. |
| DELETE | `/api/productos/:id` | Admin | Elimina un producto. |
| POST | `/api/usuarios/registro` | No | Crea un usuario con contraseña hasheada. |
| POST | `/api/usuarios/login` | No | Devuelve JWT y usuario público. |
| GET | `/api/usuarios/perfil` | JWT | Devuelve el perfil público. |
| POST | `/api/pedidos` | JWT | Registra un pedido a nombre del usuario del token. |
| GET | `/api/pedidos/mis-pedidos` | JWT | Devuelve únicamente los pedidos propios. |

## Pruebas

```sh
npm run test:api --workspace=backend
npm run test:client
npm run lint
npm run build
```

Las pruebas de pedidos usan MongoMemoryServer y no modifican Atlas. Las pruebas de contrato de autenticación se ejecutan por separado con el backend levantado y una URI configurada:

```sh
npm run test:auth --workspace=backend
```

## Despliegue

### Backend en Render

1. Crear un Web Service desde este repositorio; Render detecta `render.yaml`.
2. Definir `MONGODB_URI` con la URI de Atlas y `FRONTEND_URL` con la URL final de Netlify.
3. Conservar el `JWT_SECRET` generado por Render (o definir uno seguro). No copiarlo al frontend.

### Frontend en Netlify

1. Conectar el repositorio. `netlify.toml` instala dependencias, compila con Node 22 y publica `client/dist`.
2. Definir `VITE_API_URL` como la URL HTTPS del Web Service de Render, sin barra final.
3. Desplegar nuevamente y agregar la URL de Netlify en `FRONTEND_URL` del backend para CORS.

## Integrantes

- Morales Carlos Ariel
- Tabacchi Lucas
- Kegalj Emiliano
