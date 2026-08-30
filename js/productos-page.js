const catalogo =
    document.querySelector(
        "#catalogo-productos"
    );


const buscador =
    document.querySelector(
        "#buscador"
    );


const resultadoBusqueda =
    document.querySelector(
        "#resultado-busqueda"
    );


const estadoCarga =
    document.querySelector(
        "#estado-carga"
    );


let productosDisponibles = [];


function crearTarjeta(producto) {

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

                ${formatearPrecio(
                    producto.precio
                )}

            </strong>


            <a
                class="producto-enlace"
                href="producto.html?id=${producto.id}">

                Ver detalle →

            </a>

        </div>

    `;


    return articulo;

}


function renderizarProductos(productos) {

    catalogo.innerHTML = "";


    if (productos.length === 0) {

        catalogo.innerHTML = `

            <p>
                No encontramos productos
                con ese nombre.
            </p>

        `;

        return;

    }


    productos.forEach(
        producto => {

            const tarjeta =
                crearTarjeta(producto);


            catalogo.appendChild(
                tarjeta
            );

        }
    );

}


async function iniciarCatalogo() {

    try {

        productosDisponibles =
            await obtenerProductos();


        estadoCarga.style.display =
            "none";


        renderizarProductos(
            productosDisponibles
        );


        resultadoBusqueda.textContent =
            `${productosDisponibles.length} productos disponibles`;

    }

    catch (error) {

        estadoCarga.textContent =
            "Error al cargar productos.";

        console.error(error);

    }

}


buscador.addEventListener(
    "input",
    (evento) => {

        const texto =
            evento.target.value
                .trim()
                .toLowerCase();


        const productosFiltrados =
            productosDisponibles.filter(
                producto => {

                    return (
                        producto.nombre
                            .toLowerCase()
                            .includes(texto)

                        ||

                        producto.categoria
                            .toLowerCase()
                            .includes(texto)
                    );

                }
            );


        renderizarProductos(
            productosFiltrados
        );


        const cantidad = productosFiltrados.length;

        resultadoBusqueda.textContent =
            `${cantidad} ${cantidad === 1 ? "resultado" : "resultados"}`;

    }
);


iniciarCatalogo();
