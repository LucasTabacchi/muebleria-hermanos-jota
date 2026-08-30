const contenedorCarrito =
    document.querySelector("#carrito-productos");

const carritoTotal =
    document.querySelector("#carrito-total");

const botonVaciar =
    document.querySelector("#vaciar-carrito");


function mostrarCarrito() {

    const carrito = obtenerCarrito();

    contenedorCarrito.innerHTML = "";


    if (carrito.length === 0) {

        contenedorCarrito.innerHTML = `
            <div class="carrito-vacio">

                <h2>Tu carrito está vacío</h2>

                <p>
                    Todavía no agregaste ningún producto.
                </p>

                <a href="productos.html" class="boton">
                    Ver productos
                </a>

            </div>
        `;

        carritoTotal.textContent =
            formatearPrecio(0);

        return;
    }


    carrito.forEach((producto, indice) => {

        const elemento =
            document.createElement("article");


        elemento.classList.add(
            "producto-carrito"
        );


        elemento.innerHTML = `

            <div>

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${formatearPrecio(producto.precio)}
                </p>

            </div>


            <button
                class="eliminar-producto"
                type="button"
                aria-label="Eliminar ${producto.nombre} del carrito"
                data-indice="${indice}">

                Eliminar

            </button>

        `;


        contenedorCarrito.appendChild(
            elemento
        );

    });


    calcularTotal();

    activarBotonesEliminar();
}


function calcularTotal() {

    const carrito =
        obtenerCarrito();


    const total =
        carrito.reduce(
            (acumulador, producto) => {

                return acumulador +
                    producto.precio;

            },
            0
        );


    carritoTotal.textContent =
        formatearPrecio(total);
}


function activarBotonesEliminar() {

    const botones =
        document.querySelectorAll(
            ".eliminar-producto"
        );


    botones.forEach((boton) => {

        boton.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        boton.dataset.indice
                    );


                eliminarProducto(indice);

            }
        );

    });
}


function eliminarProducto(indice) {

    const carrito =
        obtenerCarrito();


    carrito.splice(indice, 1);


    guardarCarrito(carrito);

    actualizarContadorCarrito();

    mostrarCarrito();
}


botonVaciar.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "carrito"
        );


        actualizarContadorCarrito();

        mostrarCarrito();

    }
);


mostrarCarrito();
