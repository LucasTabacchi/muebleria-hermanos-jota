# Mueblería Hermanos Jota

Proyecto de comercio electrónico del Sprint 2 para la mueblería Hermanos Jota,
desarrollado exclusivamente con tecnologías del lado del cliente. La experiencia
de compra se simula en el navegador: no hay backend, cobros ni envío real de mensajes.

## Sitio desplegado

[Visitar Mueblería Hermanos Jota en Netlify](https://muebleria-hermanosjota.netlify.app/)

El despliegue corresponde a la rama `main` del repositorio de
[Lucas Tabacchi](https://github.com/LucasTabacchi/muebleria-hermanos-jota).
En la última verificación, el enlace respondió HTTP 401 (acceso no autorizado).
Antes de la entrega, se debe habilitar el acceso público en Netlify y comprobar
el sitio en una ventana de incógnito.

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

El sitio no requiere instalar paquetes ni ejecutar un proceso de compilación.

## Ejecución local

Con Python 3 instalado, ejecutar desde la raíz del repositorio:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abrir [el sitio local](http://127.0.0.1:8000) en el navegador. Para detener el
servidor, presionar `Ctrl+C`. Al verificar la persistencia del carrito, mantener
la misma dirección y el mismo puerto.

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

Las pruebas de desarrollo requieren Node.js 18 o posterior, sin dependencias adicionales:

```sh
node --test tests/productos.test.cjs
```

Comprobaciones manuales en el navegador:

1. Revisar todas las páginas en anchos de 320, 375, 600, 768 y 1440 píxeles, sin
   desbordamiento horizontal y con los enlaces de navegación y el contador visibles.
2. Probar los destacados, el buscador y los enlaces al detalle de cada producto.
3. Confirmar que las imágenes del detalle muestren el producto completo, sin recortes.
4. Verificar los materiales del Aparador Uspallata y la capacidad de carga y los
   estantes ajustables de la Biblioteca Recoleta.
5. Agregar productos, cambiar de página, recargar y eliminar productos del carrito.
6. Enviar datos inválidos y válidos en contacto, comprobando los errores y el éxito simulado.

## Equipo y pendientes de entrega

La consigna requiere cinco integrantes. La lista completa de nombres está pendiente
de confirmación y debe incorporarse antes de la entrega. Cada integrante debe
realizar aportes reales registrados en el historial del repositorio.

También queda pendiente confirmar el acceso público al despliegue y repetir allí
las comprobaciones del navegador. Este README no certifica que esos requisitos
de entrega ya estén completos.
