# Migración de client a JavaScript puro

## Objetivo
Migrar el frontend dentro del directorio `client/` de TypeScript a JavaScript puro, eliminando TypeScript, configuraciones y tipos, preservando toda la funcionalidad y tests.

## Alcance
- Renombrar archivos `.tsx` a `.jsx` y `.ts` a `.js`.
- Eliminar anotaciones de tipos, interfaces y aserciones en los archivos de `client/src/`.
- Eliminar `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` y `src/types.ts`.
- Limpiar `client/package.json` quitando `typescript`, paquetes `@types/*` y chequeos de tipos en scripts.
- Actualizar `index.html` y `vite.config.js` para apuntar a las nuevas extensiones.
- Verificar tests, build y linting.

## Tareas

- [x] TASK-1: Limpiar `client/package.json` quitando `typescript`, `@types/react`, `@types/react-dom` y chequeos de tipos en scripts (`tsc`).
- [x] TASK-2: Borrar `client/tsconfig.json`, `client/tsconfig.app.json`, `client/tsconfig.node.json` y `client/src/types.ts`.
- [x] TASK-3: Renombrar archivos `.tsx` a `.jsx` y `.ts` a `.js`, y actualizar referencias en `client/index.html` y `client/vite.config.js`.
- [x] TASK-4: Eliminar anotaciones de tipos, interfaces e imports de tipos en los archivos de `client/src/`.
- [x] TASK-5: Verificar build (`npm run build`), tests (`npm test`) y linting (`npm run lint`).

## Verificación
- `npm run lint`: OK (ESLint en raíz y en workspace client).
- `npm test`: OK (13 tests backend en Node test runner, 9 tests en Vitest en client).
- `npm run build`: OK (Vite compila el bundle de producción sin TypeScript).
