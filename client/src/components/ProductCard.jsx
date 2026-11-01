import { Link } from "react-router-dom";
import { formatearPrecio, rutaImagen } from "../utils/formato";

export default function ProductCard({ producto, linkText = "Ver detalle →" }) {
    return (
        <article className="producto-card">
            <img
                className="producto-imagen"
                src={rutaImagen(producto.imagen)}
                alt={producto.nombre}
                loading="lazy"
                decoding="async"
            />
            <div className="producto-info">
                <p className="producto-categoria">{producto.categoria}</p>
                <h3>{producto.nombre}</h3>
                <p className="producto-descripcion">{producto.descripcion}</p>
                <strong className="producto-precio">{formatearPrecio(producto.precio)}</strong>
                <Link className="producto-enlace" to={`/productos/${producto.id}`}>
                    {linkText}
                </Link>
            </div>
        </article>
    );
}
