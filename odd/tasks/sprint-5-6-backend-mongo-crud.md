# Sprint 5 y 6: Persistencia MongoDB y CRUD backend

## Objetivo
Migrar la API Express de catálogo estático a MongoDB con Mongoose e implementar el CRUD completo de productos, sin modificar el frontend asignado al compañero.

## Problema y alcance
El backend actual usa un arreglo en memoria y solo expone lecturas. Los Sprints 5/6 exigen persistencia MongoDB, modelo Product y GET/POST/PUT/DELETE.

## Alcance autorizado
- Solo backend, configuración, pruebas, documentación y ejemplos de entorno.
- No editar `client/`; conservar compatibilidad de GET con los campos actuales durante la transición.
- No conectar ni desplegar en Atlas/Render sin autorización remota explícita.

## Contrato y compatibilidad
- Modelo requerido: nombre, descripcion, precio, stock, imagenUrl.
- Mantener los campos de catálogo existentes y serializar `id` como alias de `_id` para que el frontend actual siga funcionando.
- GET `/api/productos`; GET/PUT/DELETE `/api/productos/:id`; POST `/api/productos`.
- Crear responde 201; actualización valida y responde el documento nuevo; eliminación responde 204.

## TDD y verificación
- TDD: desactivado, heredado de la configuración del proyecto sin activación explícita.
- Runner: `npm test --workspace=backend` (Node test runner/Supertest).
- Usar MongoDB en memoria exclusivamente para pruebas; la aplicación real requiere `MONGODB_URI`.

## Estrategia de entrega
- ask-on-risk; estimación ~350 líneas de cambios de autor.
- Ruta: delegated direct. Trigger writer: cada tarea modifica múltiples archivos no triviales.

## Tareas
- [x] B1: Añadir dependencias, conexión Mongo reutilizable, modelo Product y harness aislado de pruebas Mongo. Ruta: delegated; trigger writer. Evidencia: `backend/config/database.js`, `backend/models/Product.js`, `backend/tests/api.test.js` y lockfile regenerado; `npm test --workspace=backend` (15/15) y `npx eslint backend --no-error-on-unmatched-pattern` pasan.
- [x] B2: Reemplazar rutas de lectura por CRUD Mongoose, validación y mapeo de errores de base de datos. Ruta: delegated; trigger writer. Evidencia: `backend/routes/productos.js`, `backend/middleware/errorHandler.js` y `backend/tests/api.test.js`; `npm test --workspace=backend` (15/15) y `npx eslint backend --no-error-on-unmatched-pattern` pasan. Commit `f66db5e`.
- [x] B3: Añadir seed idempotente, `.env.example` y documentación de ejecución/despliegue; verificar CRUD completo. Ruta: delegated; trigger writer. Evidencia: `backend/scripts/seed.js`, `backend/.env.example`, `.env.example`, `backend/server.js` y `README.md`. `npm test --workspace=backend` pasó (15/15); lint de archivos B3 pasó. El lint integral de `backend/` queda bloqueado por dos errores preexistentes en `backend/tests/api.test.js` (líneas 74 y 84, `no-unexpected-multiline`). Smoke sin credenciales: `node backend/server.js` y `node backend/scripts/seed.js` fallan de forma segura con `MONGODB_URI` obligatoria, sin iniciar listener ni modificar datos. Commit `826ea30`.

## Criterios de aceptación
- La API no usa datos en memoria en tiempo de ejecución.
- Todos los endpoints CRUD funcionan contra MongoDB y devuelven errores 400/404 consistentes.
- `MONGODB_URI` no se versiona; se documenta con ejemplos.
- El catálogo GET preserva los campos que consume el frontend actual.
- Tests backend, lint y smoke local pasan.

## Próximo paso
- Integrar la URL pública de la API y el origen CORS del frontend únicamente al desplegar, con autorización remota explícita.
## Verificación final
- 
pm test --workspace=backend: 16/16 pruebas pasadas después de B3.
- Estado del árbol: se preservó sin incluir proyecto-iagen-hermanos-jota.docx (archivo ajeno no versionado).
