const catalogo = document.querySelector("#catalogo-productos");
const buscador = document.querySelector("#buscador");
const buscadorLimpiar = document.querySelector("#buscador-limpiar");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroMaterial = document.querySelector("#filtro-material");
const ordenPrecio = document.querySelector("#orden-precio");
const resultadoBusqueda = document.querySelector("#resultado-busqueda");
const botonLimpiar = document.querySelector("#boton-limpiar-filtros");
const estadoCarga = document.querySelector("#estado-carga");

let productosDisponibles = [];

function crearTarjeta(producto) {
    const articulo = document.createElement("article");
    articulo.classList.add("producto-card");
    articulo.innerHTML = `
        <img
            class="producto-imagen"
            src="${producto.imagen}"
            alt="${producto.nombre}"
            loading="lazy"
            decoding="async">
        <div class="producto-info">
            <p class="producto-categoria">${producto.categoria}</p>
            <h3>${producto.nombre}</h3>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <strong class="producto-precio">${formatearPrecio(producto.precio)}</strong>
            <a class="producto-enlace" href="producto.html?id=${producto.id}">Ver detalle →</a>
        </div>
    `;
    return articulo;
}

function coincideMaterial(producto, materialFiltro) {
    if (!materialFiltro) return true;
    const textoCompleto =
        `${producto.materiales || ""} ${producto.estructura || ""} ${producto.tapizado || ""} ${producto.descripcion || ""}`.toLowerCase();

    switch (materialFiltro) {
        case "madera":
            return /madera|nogal|roble|caldén|calden|algarrobo|guatambú|guatambu|quebracho|eucalipto|bambú|bambu/.test(
                textoCompleto
            );
        case "cuero":
            return /cuero/.test(textoCompleto);
        case "tapizado":
            return /tapizado|textil|lino|bouclé|boucle|malla|tela/.test(textoCompleto);
        case "metal":
            return /acero|latón|laton|metal/.test(textoCompleto);
        case "marmol":
            return /mármol|marmol/.test(textoCompleto);
        default:
            return textoCompleto.includes(materialFiltro.toLowerCase());
    }
}

function renderizarProductos(productos) {
    catalogo.innerHTML = "";

    if (productos.length === 0) {
        catalogo.innerHTML = `
            <div class="catalogo-vacio">
                <p>No encontramos productos que coincidan con los filtros seleccionados.</p>
                <button type="button" class="boton" onclick="restablecerFiltros()">Restablecer filtros</button>
            </div>
        `;
        return;
    }

    productos.forEach((producto) => {
        catalogo.appendChild(crearTarjeta(producto));
    });
}

function poblarCategorias() {
    if (!filtroCategoria) return;
    const categorias = Array.from(
        new Set(productosDisponibles.map((p) => p.categoria).filter(Boolean))
    ).sort();
    categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        filtroCategoria.appendChild(option);
    });
}

function aplicarFiltros() {
    const texto = (buscador ? buscador.value : "").trim().toLowerCase();
    const categoria = filtroCategoria ? filtroCategoria.value : "todas";
    const material = filtroMaterial ? filtroMaterial.value : "";
    const orden = ordenPrecio ? ordenPrecio.value : "destacados";

    if (buscadorLimpiar) {
        buscadorLimpiar.style.display = texto ? "block" : "none";
    }

    const hayFiltros =
        texto !== "" || categoria !== "todas" || material !== "" || orden !== "destacados";
    if (botonLimpiar) {
        botonLimpiar.style.display = hayFiltros ? "inline-block" : "none";
    }

    let filtrados = productosDisponibles.filter((producto) => {
        const coincideTexto =
            !texto ||
            producto.nombre.toLowerCase().includes(texto) ||
            producto.categoria.toLowerCase().includes(texto) ||
            (producto.materiales && producto.materiales.toLowerCase().includes(texto)) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(texto));

        const coincideCat = !categoria || categoria === "todas" || producto.categoria === categoria;
        const coincideMat = coincideMaterial(producto, material);

        return coincideTexto && coincideCat && coincideMat;
    });

    if (orden === "precio-menor") {
        filtrados.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-mayor") {
        filtrados.sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(filtrados);

    if (resultadoBusqueda) {
        const cantidad = filtrados.length;
        resultadoBusqueda.textContent = hayFiltros
            ? `${cantidad} ${cantidad === 1 ? "resultado" : "resultados"}`
            : `${productosDisponibles.length} productos disponibles`;
    }
}

window.restablecerFiltros = function () {
    if (buscador) buscador.value = "";
    if (filtroCategoria) filtroCategoria.value = "todas";
    if (filtroMaterial) filtroMaterial.value = "";
    if (ordenPrecio) ordenPrecio.value = "destacados";
    aplicarFiltros();
};

if (buscador) buscador.addEventListener("input", aplicarFiltros);
if (buscadorLimpiar)
    buscadorLimpiar.addEventListener("click", () => {
        buscador.value = "";
        aplicarFiltros();
    });
if (filtroCategoria) filtroCategoria.addEventListener("change", aplicarFiltros);
if (filtroMaterial) filtroMaterial.addEventListener("change", aplicarFiltros);
if (ordenPrecio) ordenPrecio.addEventListener("change", aplicarFiltros);
if (botonLimpiar) botonLimpiar.addEventListener("click", window.restablecerFiltros);

async function iniciarCatalogo() {
    try {
        productosDisponibles = await obtenerProductos();
        if (estadoCarga) estadoCarga.style.display = "none";
        poblarCategorias();
        aplicarFiltros();
    } catch (error) {
        if (estadoCarga) estadoCarga.textContent = "Error al cargar productos.";
        console.error(error);
    }
}

iniciarCatalogo();
