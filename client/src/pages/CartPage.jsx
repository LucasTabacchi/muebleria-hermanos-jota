import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { crearPedido } from "../services/pedidosApi";
import { formatearPrecio } from "../utils/formato";

export default function CartPage() {
    const { carrito, eliminar, vaciar, total } = useCart();
    const { usuario, token, logout } = useAuth();
    const navigate = useNavigate();
    const [estado, setEstado] = useState({ tipo: "inicial", mensaje: "" });

    async function finalizarCompra() {
        setEstado({ tipo: "cargando", mensaje: "" });
        try {
            await crearPedido(carrito, token);
            vaciar();
            setEstado({ tipo: "exito", mensaje: "Tu pedido fue registrado correctamente." });
        } catch (error) {
            if (error.status === 401) {
                logout();
                navigate("/login", { state: { desde: "/carrito" } });
                return;
            }
            setEstado({ tipo: "error", mensaje: error.message });
        }
    }

    return (
        <main id="contenido">
            <section className="encabezado-pagina encabezado-carrito">
                <div className="contenedor encabezado-pagina-contenido">
                    <div>
                        <p>Tu selección</p>
                        <h1>Piezas elegidas para tu espacio.</h1>
                    </div>
                    <span>Revisá los productos que agregaste antes de continuar.</span>
                </div>
            </section>
            <section className="seccion seccion-carrito">
                <div className="contenedor carrito-layout">
                    <div id="carrito-productos" aria-live="polite">
                        {carrito.length === 0 ? (
                            <div className="carrito-vacio">
                                <h2>Tu carrito está vacío</h2>
                                <p>Todavía no agregaste ningún producto.</p>
                                <Link to="/productos" className="boton">
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            carrito.map((producto, indice) => (
                                <article
                                    className="producto-carrito"
                                    key={`${producto.id}-${indice}`}
                                    aria-label={producto.nombre}
                                >
                                    <div>
                                        <h3>{producto.nombre}</h3>
                                        <p>{formatearPrecio(producto.precio)}</p>
                                    </div>
                                    <button
                                        className="eliminar-producto"
                                        type="button"
                                        aria-label={`Eliminar ${producto.nombre} del carrito`}
                                        onClick={() => eliminar(indice)}
                                    >
                                        Eliminar
                                    </button>
                                </article>
                            ))
                        )}
                    </div>
                    <aside className="carrito-resumen" aria-labelledby="titulo-resumen">
                        <p className="eyebrow">Resumen</p>
                        <h2 id="titulo-resumen">Total</h2>
                        <strong>{formatearPrecio(total)}</strong>
                        <p>
                            Esta es una experiencia de compra simulada. No se realizará ningún
                            cobro.
                        </p>
                        {usuario ? (
                            <button
                                className="boton"
                                type="button"
                                onClick={finalizarCompra}
                                disabled={carrito.length === 0 || estado.tipo === "cargando"}
                            >
                                {estado.tipo === "cargando"
                                    ? "Registrando pedido..."
                                    : "Finalizar compra"}
                            </button>
                        ) : (
                            <Link to="/login" state={{ desde: "/carrito" }} className="boton">
                                Ingresar para finalizar compra
                            </Link>
                        )}
                        {estado.mensaje && (
                            <p
                                className={estado.tipo === "error" ? "error" : "exito"}
                                role={estado.tipo === "error" ? "alert" : "status"}
                            >
                                {estado.mensaje}
                            </p>
                        )}
                        <button className="boton boton-terciario" type="button" onClick={vaciar}>
                            Vaciar carrito
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
}
