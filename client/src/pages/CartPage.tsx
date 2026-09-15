import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formato";

export default function CartPage({ cart, onRemove, onClear }) {
    const total = cart.reduce((suma, producto) => suma + producto.precio, 0);

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
                        {cart.length === 0 ? (
                            <div className="carrito-vacio">
                                <h2>Tu carrito está vacío</h2>
                                <p>Todavía no agregaste ningún producto.</p>
                                <Link to="/productos" className="boton">
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            cart.map((producto, indice) => (
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
                                        onClick={() => onRemove(indice)}
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
                        <Link to="/contacto" className="boton">
                            Consultar disponibilidad
                        </Link>
                        <button className="boton boton-terciario" type="button" onClick={onClear}>
                            Vaciar carrito
                        </button>
                    </aside>
                </div>
            </section>
        </main>
    );
}

