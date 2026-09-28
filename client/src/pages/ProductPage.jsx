import { Link } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";

export default function ProductPage({ onAdd }) {
    return (
        <main id="contenido">
            <section className="seccion seccion-detalle">
                <div className="contenedor">
                    <Link to="/productos" className="volver">
                        <span aria-hidden="true">←</span> Volver a la colección
                    </Link>
                    <ProductDetail onAdd={onAdd} />
                </div>
            </section>
            <section className="confianza-producto" aria-label="Beneficios de compra">
                <div className="contenedor confianza-lista">
                    <div>
                        <strong>10 años</strong>
                        <span>de garantía en estructura</span>
                    </div>
                    <div>
                        <strong>Materiales trazables</strong>
                        <span>origen certificado</span>
                    </div>
                    <div>
                        <strong>Restauración</strong>
                        <span>servicio Herencia Viva</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
