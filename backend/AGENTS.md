# AGENTS.md — Backend de Mueblería Hermanos Jota

## Qué es este proyecto
API REST de un e-commerce de muebles. El frontend React en `/client` consume la API.

## Stack
- Node 22 · Express 5.2 · Mongoose 8.19 · CommonJS (`require` / `module.exports`).
- `dotenv` carga `backend/.env` desde `server.js` y `scripts/seed.js`.
- Pruebas de la práctica: `node --test tests/contrato.test.js`, con la API encendida en el puerto 3001.

## Estructura
- `server.js`: carga variables, conecta MongoDB y levanta el servidor.
- `app.js`: registra middlewares, routers, 404 y manejador central de errores.
- `config/database.js`: conexión a MongoDB.
- `models/`: modelos Mongoose.
- `routes/`: routers por recurso.
- `middleware/errorHandler.js`: normaliza errores como `{ "error": "mensaje" }`.
- `scripts/seed.js`: carga el catálogo inicial.

## Reglas de la API
- Rutas bajo `/api/<recurso-en-plural>`.
- Los errores deben responder `{ "error": "mensaje en español" }`.
- Códigos: 200 OK · 201 creado · 400 datos inválidos o id mal formado · 404 recurso inexistente · 409 duplicado · 500 error interno.
- El manejador central ya traduce `ValidationError` y `CastError` a 400. Al agregar duplicados de MongoDB, debe traducir el código 11000 a 409 allí.
- Los nombres actuales de Product se conservan: `nombre`, `descripcion`, `precio`, `stock`, `imagenUrl` y demás atributos del catálogo.

## Límites
- No modificar `.env` ni escribir connection strings en código.
- No renombrar rutas o campos existentes: el frontend depende de ellos.
- No refactorizar los `try/catch` existentes ni el CRUD actual fuera de la fase solicitada.
- No modificar archivos fuera del alcance de cada fase.

## Cómo trabajar
- Una fase por vez, siguiendo `docs/spec-categorias.md`.
- Tras cada fase, revisar el diff y ejecutar `npm test` con la API encendida.
- Registrar en `docs/registro-practica-ia.txt` todo cambio adicional que no haya pedido la especificación.


## Reglas de trabajo (agregadas después de la práctica de Categorías)

- Si una regla de este archivo choca con el código que ya existe, avisá y preguntá antes de refactorizar código que no es parte de la tarea.
- Si la spec no define un caso, preguntá. No decidas.
- NO cambies los mensajes ni el formato de respuestas que ya existen.
- NO mates procesos, liberes puertos ni reinicies el servidor sin pedir permiso.
- NO corras comandos que escriban en la base (npm test, npm run test:auth, npm run seed) sin avisar antes.
- Si la misma lógica va en dos rutas, usá una función o un middleware compartido.
- Al terminar cada fase, listá TODOS los archivos que tocaste, incluso los cambios de formato.

## Seguridad (autenticación)

- NO leas, muestres ni copies el contenido de `.env`. Si necesitás una variable nueva, agregá la clave vacía a `.env.example` y avisá.
- NO escribas secretos en el código: el secreto del token se lee de `process.env.JWT_SECRET`.
- NUNCA devuelvas la contraseña ni su hash en una respuesta, ni la pongas en el payload del token.
- NO instales paquetes que no estén en la spec (`bcrypt` o `bcryptjs`, y `jsonwebtoken`).
- NO modifiques `tests/auth.test.cjs`. Si una prueba falla, se corrige el backend.
- NO crees archivos de prueba nuevos sin pedir permiso. Las pruebas del contrato son las de `tests/auth.test.cjs`.
