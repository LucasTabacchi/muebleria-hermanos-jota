import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { eliminarProducto, obtenerProducto } from "../services/productosApi";
import { categoriaTexto, formatearPrecio, rutaImagen } from "../utils/formato";

const CAMPOS_BASE = new Set([
    "_id",
    "__v",
    "id",
    "nombre",
    "categoria",
    "precio",
    "descripcion",
    "imagen",
    "imagenUrl",
    "createdAt",
    "updatedAt",
    "destacado",
]);

export default function ProductDetail({ onAdd }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { usuario, token } = useAuth();
    const [estado, setEstado] = useState({ tipo: "cargando", producto: null });
    const [mensaje, setMensaje] = useState("");
    const [eliminando, setEliminando] = useState(false);

    const cargar = useCallback(async () => {
        setEstado({ tipo: "cargando", producto: null });
        try {
            setEstado({ tipo: "exito", producto: await obtenerProducto(id) });
        } catch (error) {
            setEstado({ tipo: error.status === 404 ? "no-encontrado" : "error", producto: null });
        }
    }, [id]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    if (estado.tipo === "cargando")
        return (
            <div className="estado-carga" role="status">
                Cargando producto...
            </div>
        );
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
    const esAdmin = usuario?.rol === "admin";

    function agregarAlCarrito() {
        onAdd(producto);
        setMensaje(`${producto.nombre} fue añadido al carrito.`);
    }

    async function handleDelete() {
        if (!window.confirm(`¿Eliminar ${producto.nombre} del catálogo?`)) return;
        setEliminando(true);
        setMensaje("");
        try {
            await eliminarProducto(producto.id || producto._id, token);
            navigate("/productos", { replace: true });
        } catch (error) {
            setMensaje(error.message || "No se pudo eliminar el producto.");
            setEliminando(false);
        }
    }

    return (
        <>
            <article className="detalle-producto">
                <div className="detalle-imagen">
                    <img
                        src={rutaImagen(producto.imagen || producto.imagenUrl)}
                        alt={producto.nombre}
                        decoding="async"
                    />
                </div>
                <div className="detalle-info">
                    <p className="producto-categoria">{categoriaTexto(producto.categoria)}</p>
                    <h1>{producto.nombre}</h1>
                    <p className="detalle-descripcion">{producto.descripcion}</p>
                    <div className="detalle-datos">
                        {datos.map(([clave, valor]) => (
                            <div className="detalle-dato" key={clave}>
                                <strong>{clave.charAt(0).toUpperCase() + clave.slice(1)}</strong>
                                <span>{String(valor)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="detalle-precio">{formatearPrecio(producto.precio)}</div>
                    <button className="boton" type="button" onClick={agregarAlCarrito}>
                        Añadir al carrito
                    </button>
                    {esAdmin && (
                        <div className="detalle-acciones">
                            <Link
                                className="boton boton-secundario"
                                to={`/admin/editar-producto/${producto.id || producto._id}`}
                            >
                                Editar producto
                            </Link>
                            <button
                                className="boton boton-terciario"
                                type="button"
                                onClick={handleDelete}
                                disabled={eliminando}
                            >
                                {eliminando ? "Eliminando..." : "Eliminar producto"}
                            </button>
                        </div>
                    )}
                </div>
            </article>
            <p className="mensaje-carrito" aria-live="polite">
                {mensaje}
            </p>
        </>
    );
}
