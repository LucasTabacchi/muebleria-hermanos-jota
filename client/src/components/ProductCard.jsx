import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categoriaTexto, formatearPrecio, rutaImagen } from "../utils/formato";

export default function ProductCard({ producto, linkText = "Ver detalle →", onAdd }) {
    const [agregado, setAgregado] = useState(false);
    const [imagenFallida, setImagenFallida] = useState(false);
    const imagen = rutaImagen(producto.imagen || producto.imagenUrl);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => setImagenFallida(false), [imagen]);

    function agregar() {
        onAdd(producto);
        setAgregado(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAgregado(false), 2000);
    }
    const id = producto.id || producto._id;

    return (
        <article className="producto-card">
            {imagen && !imagenFallida ? (
                <img
                    className="producto-imagen"
                    src={imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImagenFallida(true)}
                />
            ) : (
                <div
                    className="producto-imagen producto-imagen-placeholder"
                    role="img"
                    aria-label="Imagen no disponible"
                >
                    Imagen no disponible
                </div>
            )}
            <div className="producto-info">
                <p className="producto-categoria">{categoriaTexto(producto.categoria)}</p>
                <h3>{producto.nombre}</h3>
                <p className="producto-descripcion">{producto.descripcion}</p>
                <strong className="producto-precio">{formatearPrecio(producto.precio)}</strong>
                <Link className="producto-enlace" to={`/productos/${id}`}>
                    {linkText}
                </Link>
                {onAdd && (
                    <button className="boton boton-terciario" type="button" onClick={agregar}>
                        Añadir al carrito
                    </button>
                )}
                {onAdd && (
                    <span className="producto-feedback" role="status">
                        {agregado ? "✓ Agregado al carrito" : ""}
                    </span>
                )}
            </div>
        </article>
    );
}
