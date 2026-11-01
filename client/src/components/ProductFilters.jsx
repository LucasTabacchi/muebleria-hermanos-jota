export default function ProductFilters({
    busqueda,
    categoria,
    material,
    orden,
    categoriasDisponibles,
    hayFiltrosActivos,
    isLoaded,
    mensajeCantidad,
    onBusquedaChange,
    onCategoriaChange,
    onMaterialChange,
    onOrdenChange,
    onClearFilters,
}) {
    return (
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
                            onChange={(evento) => onBusquedaChange(evento.target.value)}
                        />
                        {busqueda && (
                            <button
                                type="button"
                                className="buscador-limpiar"
                                onClick={() => onBusquedaChange("")}
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
                            onChange={(e) => onCategoriaChange(e.target.value)}
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
                            onChange={(e) => onMaterialChange(e.target.value)}
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
                            onChange={(e) => onOrdenChange(e.target.value)}
                        >
                            <option value="destacados">Destacados</option>
                            <option value="precio-menor">Menor precio</option>
                            <option value="precio-mayor">Mayor precio</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoaded && (
                <div className="herramientas-barra-inferior">
                    <div id="resultado-busqueda" aria-live="polite">
                        {mensajeCantidad}
                    </div>
                    {hayFiltrosActivos && (
                        <button
                            type="button"
                            className="boton-limpiar-filtros"
                            onClick={onClearFilters}
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
