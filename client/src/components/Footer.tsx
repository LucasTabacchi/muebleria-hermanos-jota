import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="contenedor footer-contenido">
                <div className="footer-marca">
                    <Link to="/" className="logo logo-invertido" aria-label="Hermanos Jota, inicio">
                        <img src="/logo.png" alt="" width="72" height="72" />
                        <span className="logo-texto">
                            <span>Hermanos</span>
                            <strong>Jota</strong>
                        </span>
                    </Link>
                    <p>Muebles que honran el pasado y abrazan el futuro.</p>
                </div>
                <div>
                    <h3>Explorar</h3>
                    <Link to="/">Inicio</Link>
                    <Link to="/productos">Productos</Link>
                    <Link to="/contacto">Contacto</Link>
                    <Link to="/carrito">Carrito</Link>
                </div>
                <div>
                    <h3>Casa Taller</h3>
                    <p>Av. San Juan 2847</p>
                    <p>San Cristóbal, CABA</p>
                    <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>
                    <a href="tel:+541145678900">+54 11 4567-8900</a>
                </div>
                <div>
                    <h3>Horarios</h3>
                    <p>
                        Lunes a viernes
                        <br />
                        10:00 — 19:00
                    </p>
                    <p>
                        Sábados
                        <br />
                        10:00 — 14:00
                    </p>
                </div>
            </div>
            <div className="contenedor footer-copy">
                <span>© 2026 Hermanos Jota. Todos los derechos reservados.</span>
                <a
                    href="https://www.instagram.com/hermanosjota_ba"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Instagram · @hermanosjota_ba
                </a>
            </div>
        </footer>
    );
}

