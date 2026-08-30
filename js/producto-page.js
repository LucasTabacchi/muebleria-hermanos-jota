const detalle =
    document.querySelector(
        "#detalle-producto"
    );


const estadoCarga =
    document.querySelector(
        "#estado-carga"
    );


const mensajeCarrito =
    document.querySelector(
        "#mensaje-carrito"
    );


function obtenerIdProducto() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    return Number(
        parametros.get("id")
    );

}


function mostrarProducto(producto) {

    const datosProducto =
        Object.entries(producto)
            .filter(([clave]) =>
                ![
                    "id",
                    "nombre",
                    "categoria",
                    "precio",
                    "descripcion",
                    "imagen",
                    "destacado"
                ].includes(clave)
            )
            .map(([clave, valor]) => {

                const etiqueta =
                    clave.charAt(0).toUpperCase() +
                    clave.slice(1);

                return `
                    <div class="detalle-dato">

                        <strong>
                            ${etiqueta}
                        </strong>

                        <span>
                            ${valor}
                        </span>

                    </div>
                `;

            })
            .join("");


    detalle.innerHTML = `

        <article class="detalle-producto">

            <div class="detalle-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    decoding="async">

            </div>


            <div class="detalle-info">

                <p class="producto-categoria">
                    ${producto.categoria}
                </p>


                <h1>
                    ${producto.nombre}
                </h1>


                <p class="detalle-descripcion">
                    ${producto.descripcion}
                </p>


                <div class="detalle-datos">

                    ${datosProducto}

                </div>


                <div class="detalle-precio">

                    ${formatearPrecio(
                        producto.precio
                    )}

                </div>


                <button
                    id="boton-agregar"
                    class="boton"
                    type="button">

                    Añadir al carrito

                </button>

            </div>

        </article>

    `;


    const botonAgregar =
        document.querySelector(
            "#boton-agregar"
        );


    botonAgregar.addEventListener(
        "click",
        () => {

            agregarProductoAlCarrito(
                producto
            );


            mensajeCarrito.textContent =
                `${producto.nombre} fue añadido al carrito.`;


            setTimeout(() => {

                mensajeCarrito.textContent =
                    "";

            }, 2500);

        }
    );

}


async function cargarDetalleProducto() {

    const id =
        obtenerIdProducto();


    try {

        const productos =
            await obtenerProductos();


        const producto =
            productos.find(
                producto =>
                    producto.id === id
            );


        estadoCarga.style.display =
            "none";


        if (!producto) {

            detalle.innerHTML = `

                <div>

                    <h1>
                        Producto no encontrado
                    </h1>

                    <p>
                        El producto solicitado
                        no existe.
                    </p>

                </div>

            `;

            return;

        }


        document.title =
            `${producto.nombre} | Hermanos Jota`;


        mostrarProducto(
            producto
        );

    }

    catch (error) {

        estadoCarga.textContent =
            "No fue posible cargar el producto.";

        console.error(error);

    }

}


cargarDetalleProducto();
