const contenedorDestacados =
    document.querySelector(
        "#productos-destacados"
    );


const estadoCarga =
    document.querySelector(
        "#estado-carga"
    );


function crearTarjetaProducto(producto) {

    const articulo =
        document.createElement("article");


    articulo.classList.add(
        "producto-card"
    );


    articulo.innerHTML = `

        <img
            class="producto-imagen"
            src="${producto.imagen}"
            alt="${producto.nombre}"
            loading="lazy"
            decoding="async">


        <div class="producto-info">

            <p class="producto-categoria">
                ${producto.categoria}
            </p>

            <h3>
                ${producto.nombre}
            </h3>

            <p class="producto-descripcion">
                ${producto.descripcion}
            </p>

            <strong class="producto-precio">
                ${formatearPrecio(producto.precio)}
            </strong>

            <a
                class="producto-enlace"
                href="producto.html?id=${producto.id}">

                Ver producto →

            </a>

        </div>

    `;


    return articulo;

}


async function cargarDestacados() {

    try {

        const productos =
            await obtenerProductos();


        const destacados =
            productos
                .filter(
                    producto =>
                        producto.destacado
                )
                .slice(0, 4);


        estadoCarga.style.display =
            "none";


        destacados.forEach(
            producto => {

                const tarjeta =
                    crearTarjetaProducto(
                        producto
                    );


                contenedorDestacados
                    .appendChild(tarjeta);

            }
        );

    }

    catch (error) {

        estadoCarga.textContent =
            "No se pudieron cargar los productos.";

        console.error(error);

    }

}


cargarDestacados();
