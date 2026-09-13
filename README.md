# Mueblería Hermanos Jota

Proyecto de comercio para la mueblería Hermanos Jota,
desarrollado exclusivamente con tecnologías del lado del cliente. La experiencia
de compra se simula en el navegador: no hay backend, cobros ni envío real de mensajes.

## Sitio desplegado

[Visitar Mueblería Hermanos Jota](https://muebleria-hermanosjota.netlify.app/)

## Funcionalidades

- Inicio con presentación de la marca y cuatro productos destacados cargados dinámicamente.
- Catálogo de 11 productos con búsqueda y enlaces a sus fichas individuales.
- Detalle de producto con imagen, descripción, especificaciones, precio y botón para agregar al carrito.
- Carrito simulado con contador, eliminación de productos y persistencia en el navegador.
- Formulario de contacto con validación del lado del cliente y mensaje de éxito en pantalla.
- Diseño adaptable, HTML semántico y simulación de carga asíncrona del catálogo.

## Tecnologías

- HTML5, CSS3 en una hoja de estilos externa y Flexbox.
- JavaScript sin frameworks, manipulación del DOM, eventos y arreglos de objetos.
- Promesas y `setTimeout` para simular la carga de datos.
- `localStorage` para conservar el carrito simulado.
- ESLint y Prettier para mantener una base consistente de código.
- Husky, lint-staged y commitlint para automatizar controles antes de cada commit.

El sitio publicado no requiere un proceso de compilación. Las dependencias de Node.js
se utilizan solamente durante el desarrollo para ejecutar pruebas y controles de calidad.

## Ejecución local

Con Python 3 instalado, ejecutar desde la raíz del repositorio:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir [el sitio local](http://127.0.0.1:8000) en el navegador. Para detener el
servidor, presionar `Ctrl+C`. Al verificar la persistencia del carrito, mantener
la misma dirección y el mismo puerto.

## Configuración de desarrollo

Se requiere Node.js 22.22.1 o posterior únicamente para las herramientas de desarrollo.
Después de clonar el repositorio, instalar
las dependencias desde la raíz:

```sh
npm install
```

La instalación ejecuta `husky` mediante el script `prepare` y deja activos los hooks
locales de Git.

## Calidad de código

Los siguientes comandos permiten aplicar y verificar las reglas del proyecto:

```sh
npm run lint          # Analiza el JavaScript con ESLint
npm run format        # Formatea los archivos compatibles con Prettier
npm test              # Ejecuta las pruebas automatizadas
```

Antes de cada commit, `lint-staged` corrige con ESLint y formatea con Prettier los
archivos JavaScript que están preparados para confirmar. El hook `commit-msg`
también valida que el mensaje siga Conventional Commits, por ejemplo:

```text
feat: agregar filtro por categoría
fix: corregir contador del carrito
docs: actualizar instrucciones de instalación
```

Los tipos permitidos son `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`,
`perf`, `build` y `ci`. El encabezado del commit admite como máximo 100 caracteres.

## Estructura del repositorio

```text
index.html               Página de inicio
productos.html           Catálogo de productos
producto.html            Detalle seleccionado mediante un parámetro de la URL
contacto.html            Formulario de contacto
carrito.html             Carrito simulado
css/styles.css           Estilos compartidos y diseño adaptable
js/productos.js          Catálogo local y formato de precios
js/                      Comportamiento de las páginas y lógica del carrito
img/                     Imágenes de productos
logo.png                 Logotipo de la marca
tests/productos.test.cjs  Pruebas de regresión del catálogo
```

## Verificación

Para ejecutar toda la verificación disponible:

```sh
npm run lint
npm test
```

## Equipo

Morales Carlos Ariel
Tabacchi Lucas
Kegalj Emiliano
