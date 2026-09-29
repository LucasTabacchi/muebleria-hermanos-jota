import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main id="contenido">
            <section className="seccion">
                <div className="contenedor carrito-vacio">
                    <h1>Página no encontrada</h1>
                    <p>La página solicitada no existe.</p>
                    <Link className="boton" to="/">
                        Volver al inicio
                    </Link>
                </div>
            </section>
        </main>
    );
}
