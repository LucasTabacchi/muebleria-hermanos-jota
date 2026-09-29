import { useCallback, useEffect, useMemo, useState } from "react";
import ProductList from "../components/ProductList";
import { obtenerProductos } from "../services/productosApi";

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

export default function ProductsPage() {
    const [estado, setEstado] = useState({ tipo: "cargando", productos: [] });
    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("todas");
    const [material, setMaterial] = useState("");
    const [orden, setOrden] = useState("destacados");

    const cargar = useCallback(async () => {
        setEstado({ tipo: "cargando", productos: [] });
        try {
            setEstado({ tipo: "exito", productos: await obtenerProductos() });
        } catch {
            setEstado({ tipo: "error", productos: [] });
        }
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    const categoriasDisponibles = useMemo(() => {
        const setCategorias = new Set(
            estado.productos.map((producto) => producto.categoria).filter(Boolean)
        );
        return Array.from(setCategorias).sort();
    }, [estado.productos]);

    const filtrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        let resultado = estado.productos.filter((producto) => {
            const coincideTexto =
                !texto ||
                producto.nombre.toLowerCase().includes(texto) ||
                producto.categoria.toLowerCase().includes(texto) ||
                (producto.materiales && producto.materiales.toLowerCase().includes(texto)) ||
                (producto.descripcion && producto.descripcion.toLowerCase().includes(texto));

            const coincideCat =
                !categoria || categoria === "todas" || producto.categoria === categoria;

            const coincideMat = coincideMaterial(producto, material);

            return coincideTexto && coincideCat && coincideMat;
        });

        if (orden === "precio-menor") {
            resultado = [...resultado].sort((a, b) => a.precio - b.precio);
        } else if (orden === "precio-mayor") {
            resultado = [...resultado].sort((a, b) => b.precio - a.precio);
        }

        return resultado;
    }, [busqueda, categoria, material, orden, estado.productos]);

    const hayFiltrosActivos =
        busqueda.trim() !== "" ||
        categoria !== "todas" ||
        material !== "" ||
        orden !== "destacados";

    const limpiarFiltros = () => {
        setBusqueda("");
        setCategoria("todas");
        setMaterial("");
        setOrden("destacados");
    };

    const mensajeCantidad = hayFiltrosActivos
        ? `${filtrados.length} ${filtrados.length === 1 ? "resultado" : "resultados"}`
        : `${estado.productos.length} productos disponibles`;

    return (
        <main id="contenido">
            <section className="encabezado-pagina encabezado-catalogo">
                <div className="contenedor encabezado-pagina-contenido">
                    <div>
                        <p>Nuestra colección</p>
                        <h1>Objetos para habitar mejor.</h1>
                    </div>
                    <span>
                        Cada pieza reúne oficio, funcionalidad y materiales elegidos para durar.
                    </span>
                </div>
            </section>
            <section className="seccion seccion-catalogo" aria-label="Catálogo de productos">
                <div className="contenedor">
                    <div className="herramientas-catalogo">
                        <div className="filtros-fila-superior">
                            <div className="buscador-contenedor">
                                <label htmlFor="buscador">Buscar en la colección</label>
                                <div className="buscador-campo">
                                    <span aria-hidden="true">⌕</span>
                                    <input
                                        id="buscador"
                                        type="search"
                                        placeholder="Sillón, mesa, nogal, cuero..."
                                        autoComplete="off"
                                        value={busqueda}
                                        onChange={(evento) => setBusqueda(evento.target.value)}
                                    />
                                    {busqueda && (
                                        <button
                                            type="button"
                                            className="buscador-limpiar"
                                            onClick={() => setBusqueda("")}
                                            aria-label="Limpiar búsqueda"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="filtro-campo">
                                <label htmlFor="filtro-categoria">Categoría</label>
                                <div className="select-contenedor">
                                    <select
                                        id="filtro-categoria"
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <option value="todas">Todas las categorías</option>
                                        {categoriasDisponibles.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="filtro-campo">
                                <label htmlFor="filtro-material">Material</label>
                                <div className="select-contenedor">
                                    <select
                                        id="filtro-material"
                                        value={material}
                                        onChange={(e) => setMaterial(e.target.value)}
                                    >
                                        <option value="">Todos los materiales</option>
                                        <option value="madera">Madera maciza</option>
                                        <option value="cuero">Cuero natural</option>
                                        <option value="tapizado">Tapizado / Textil</option>
                                        <option value="metal">Metal / Acero</option>
                                        <option value="marmol">Mármol</option>
                                    </select>
                                </div>
                            </div>

                            <div className="filtro-campo">
                                <label htmlFor="orden-precio">Ordenar por precio</label>
                                <div className="select-contenedor">
                                    <select
                                        id="orden-precio"
                                        value={orden}
                                        onChange={(e) => setOrden(e.target.value)}
                                    >
                                        <option value="destacados">Destacados</option>
                                        <option value="precio-menor">Menor precio</option>
                                        <option value="precio-mayor">Mayor precio</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {estado.tipo === "exito" && (
                            <div className="herramientas-barra-inferior">
                                <div id="resultado-busqueda" aria-live="polite">
                                    {mensajeCantidad}
                                </div>
                                {hayFiltrosActivos && (
                                    <button
                                        type="button"
                                        className="boton-limpiar-filtros"
                                        onClick={limpiarFiltros}
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {estado.tipo === "cargando" && (
                        <div className="estado-carga" role="status">
                            Cargando catálogo...
                        </div>
                    )}
                    {estado.tipo === "error" && (
                        <div className="estado-carga" role="alert">
                            <p>No se pudo cargar el catálogo.</p>
                            <button type="button" className="boton" onClick={cargar}>
                                Reintentar
                            </button>
                        </div>
                    )}
                    {estado.tipo === "exito" && (
                        <div id="catalogo-productos">
                            {filtrados.length > 0 ? (
                                <ProductList productos={filtrados} />
                            ) : (
                                <div className="catalogo-vacio">
                                    <p>
                                        No encontramos productos que coincidan con los filtros
                                        seleccionados.
                                    </p>
                                    <button
                                        type="button"
                                        className="boton"
                                        onClick={limpiarFiltros}
                                    >
                                        Restablecer filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
