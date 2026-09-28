import { useCallback, useEffect, useMemo, useState } from "react";
import ProductList from "../components/ProductList";
import { obtenerProductos } from "../services/productosApi";

export default function ProductsPage() {
    const [estado, setEstado] = useState({ tipo: "cargando", productos: [] });
    const [busqueda, setBusqueda] = useState("");

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

    const filtrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return estado.productos.filter(
            (producto) =>
                producto.nombre.toLowerCase().includes(texto) ||
                producto.categoria.toLowerCase().includes(texto)
        );
    }, [busqueda, estado.productos]);

    const mensajeCantidad = busqueda
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
                        <div className="buscador-contenedor">
                            <label htmlFor="buscador">Buscar en la colección</label>
                            <div className="buscador-campo">
                                <span aria-hidden="true">⌕</span>
                                <input
                                    id="buscador"
                                    type="search"
                                    placeholder="Sillón, mesa, escritorio..."
                                    autoComplete="off"
                                    value={busqueda}
                                    onChange={(evento) => setBusqueda(evento.target.value)}
                                />
                            </div>
                        </div>
                        {estado.tipo === "exito" && (
                            <div id="resultado-busqueda" aria-live="polite">
                                {mensajeCantidad}
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
                            <ProductList productos={filtrados} />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
