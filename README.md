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

## Equipo
