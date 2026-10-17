import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerProducto } from "../services/productosApi";
import { formatearPrecio, rutaImagen } from "../utils/formato";

const CAMPOS_BASE = new Set([
    "id",
    "nombre",
    "categoria",
    "precio",
    "descripcion",
    "imagen",
    "destacado",
]);

export default function ProductDetail({ onAdd }) {
    const { id } = useParams();
    const [estado, setEstado] = useState({ tipo: "cargando", producto: null });
    const [mensaje, setMensaje] = useState("");

    const cargar = useCallback(async () => {
        setEstado({ tipo: "cargando", producto: null });
        try {
            const producto = await obtenerProducto(id);
            setEstado({ tipo: "exito", producto });
        } catch (error) {
            setEstado({ tipo: error.status === 404 ? "no-encontrado" : "error", producto: null });
        }
    }, [id]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    if (estado.tipo === "cargando") {
        return (
            <div className="estado-carga" role="status">
                Cargando producto...
            </div>
        );
    }

    if (estado.tipo === "no-encontrado") {
        return (
            <div>
                <h1>Producto no encontrado</h1>
                <p>El producto solicitado no existe.</p>
                <Link className="boton" to="/productos">
                    Ver colección
                </Link>
            </div>
        );
    }

    if (estado.tipo === "error") {
        return (
            <div className="estado-carga" role="alert">
                <p>No fue posible cargar el producto.</p>
                <button className="boton" type="button" onClick={cargar}>
                    Reintentar
                </button>
            </div>
        );
    }

    const { producto } = estado;
    const datos = Object.entries(producto).filter(([clave]) => !CAMPOS_BASE.has(clave));

    function agregar() {
        onAdd(producto);
        setMensaje(`${producto.nombre} fue añadido al carrito.`);
    }

    return (
        <>
            <article className="detalle-producto">
                <div className="detalle-imagen">
                    <img src={rutaImagen(producto.imagen)} alt={producto.nombre} decoding="async" />
                </div>
                <div className="detalle-info">
                    <p className="producto-categoria">{producto.categoria}</p>
                    <h1>{producto.nombre}</h1>
                    <p className="detalle-descripcion">{producto.descripcion}</p>
                    <div className="detalle-datos">
                        {datos.map(([clave, valor]) => (
                            <div className="detalle-dato" key={clave}>
                                <strong>{clave.charAt(0).toUpperCase() + clave.slice(1)}</strong>
                                <span>{valor}</span>
                            </div>
                        ))}
                    </div>
                    <div className="detalle-precio">{formatearPrecio(producto.precio)}</div>
                    <button className="boton" type="button" onClick={agregar}>
                        Añadir al carrito
                    </button>
                </div>
            </article>
            <p className="mensaje-carrito" aria-live="polite">
                {mensaje}
            </p>
        </>
    );
}
