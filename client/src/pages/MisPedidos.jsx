import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerMisPedidos } from "../services/pedidosApi";
import { formatearPrecio } from "../utils/formato";

export default function MisPedidos() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [estado, setEstado] = useState({ tipo: "cargando", pedidos: [] });

    useEffect(() => {
        let activo = true;

        async function cargarPedidos() {
            try {
                const pedidos = await obtenerMisPedidos(token);
                if (activo) setEstado({ tipo: "exito", pedidos });
            } catch (error) {
                if (!activo) return;
                if (error.status === 401) {
                    logout();
                    navigate("/login", { replace: true, state: { desde: "/mis-pedidos" } });
                    return;
                }
                setEstado({ tipo: "error", mensaje: error.message, pedidos: [] });
            }
        }

        cargarPedidos();
        return () => {
            activo = false;
        };
    }, [logout, navigate, token]);

    if (estado.tipo === "cargando") {
        return (
            <main id="contenido" className="estado-carga" role="status">
                Cargando pedidos...
            </main>
        );
    }
    if (estado.tipo === "error") {
        return (
            <main id="contenido" className="estado-carga" role="alert">
                {estado.mensaje}
            </main>
        );
    }

    return (
        <main id="contenido">
            <section className="seccion">
                <div className="contenedor">
                    <div className="formulario-encabezado">
                        <p className="eyebrow">Cuenta</p>
                        <h1>Mis pedidos</h1>
                    </div>
                    {estado.pedidos.length === 0 ? (
                        <div className="carrito-vacio">
                            <p>Todavía no realizaste ningún pedido.</p>
                            <Link to="/productos" className="boton">
                                Ver productos
                            </Link>
                        </div>
                    ) : (
                        <div className="lista-productos">
                            {estado.pedidos.map((pedido) => (
                                <article className="producto-carrito" key={pedido._id || pedido.id}>
                                    <div>
                                        <h2>Pedido #{String(pedido._id || pedido.id).slice(-6)}</h2>
                                        <p>
                                            {new Date(pedido.createdAt).toLocaleDateString("es-AR")}
                                        </p>
                                        <p>{pedido.items.map((item) => item.nombre).join(", ")}</p>
                                    </div>
                                    <strong>{formatearPrecio(pedido.total)}</strong>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
