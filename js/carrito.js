function obtenerCarrito() {

    const carritoGuardado =
        localStorage.getItem("carrito");

    if (carritoGuardado) {

        return JSON.parse(carritoGuardado);

    }

    return [];

}


function guardarCarrito(carrito) {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


function agregarProductoAlCarrito(producto) {

    const carrito =
        obtenerCarrito();


    carrito.push({

        id: producto.id,

        nombre: producto.nombre,

        precio: producto.precio

    });


    guardarCarrito(carrito);

    actualizarContadorCarrito();

}


function actualizarContadorCarrito() {

    const carrito =
        obtenerCarrito();


    const contadores =
        document.querySelectorAll(
            ".contador-carrito"
        );


    contadores.forEach((contador) => {

        contador.textContent =
            carrito.length;

    });

}


document.addEventListener(
    "DOMContentLoaded",
    actualizarContadorCarrito
);