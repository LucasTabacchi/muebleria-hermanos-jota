import ContactForm from "../components/ContactForm";

export default function ContactPage() {
    return (
        <main id="contenido">
            <section className="encabezado-pagina encabezado-contacto">
                <div className="contenedor encabezado-pagina-contenido">
                    <div>
                        <p>Conversemos</p>
                        <h1>Tu próximo espacio empieza con una buena charla.</h1>
                    </div>
                    <span>
                        Te asesoramos con cercanía sobre materiales, medidas, disponibilidad y
                        cuidados.
                    </span>
                </div>
            </section>
            <section className="seccion">
                <div className="contenedor contacto-contenedor">
                    <div className="contacto-info">
                        <p className="eyebrow">Hermanos Jota · Casa Taller</p>
                        <h2>Vení a conocer cada pieza de cerca.</h2>
                        <p>
                            En nuestro showroom podés descubrir las texturas, terminaciones y
                            detalles que hacen único a cada mueble.
                        </p>
                        <address className="datos-contacto">
                            <div className="dato-contacto">
                                <strong>Showroom y taller</strong>
                                <span>
                                    Av. San Juan 2847
                                    <br />
                                    C1232AAB · San Cristóbal, CABA
                                </span>
                            </div>
                            <div className="dato-contacto">
                                <strong>Horarios</strong>
                                <span>
                                    Lunes a viernes: 10:00 — 19:00
                                    <br />
                                    Sábados: 10:00 — 14:00
                                </span>
                            </div>
                            <div className="dato-contacto">
                                <strong>Contacto directo</strong>
                                <a href="mailto:ventas@hermanosjota.com.ar">
                                    ventas@hermanosjota.com.ar
                                </a>
                                <a href="tel:+541145678900">+54 11 4567-8900</a>
                            </div>
                            <div className="dato-contacto">
                                <strong>Instagram</strong>
                                <a
                                    href="https://www.instagram.com/hermanosjota_ba"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @hermanosjota_ba
                                </a>
                            </div>
                        </address>
                    </div>
                    <ContactForm />
                </div>
            </section>
        </main>
    );
}
