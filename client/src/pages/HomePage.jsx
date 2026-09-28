import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import { obtenerProductos } from "../services/productosApi";

export default function HomePage() {
    const [estado, setEstado] = useState({ tipo: "cargando", productos: [] });

    const cargar = useCallback(async () => {
        setEstado({ tipo: "cargando", productos: [] });
        try {
            const productos = await obtenerProductos();
            setEstado({
                tipo: "exito",
                productos: productos.filter((producto) => producto.destacado).slice(0, 4),
            });
        } catch {
            setEstado({ tipo: "error", productos: [] });
        }
    }, []);

    useEffect(() => {
        cargar();
    }, [cargar]);

    return (
        <main id="contenido">
            <section className="hero">
                <div className="contenedor hero-contenido">
                    <div className="hero-texto">
                        <p className="hero-etiqueta">Diseño argentino · Oficio contemporáneo</p>
                        <h1>Muebles que alimentan el alma.</h1>
                        <p>
                            Piezas atemporales creadas con manos expertas, materiales nobles y una
                            mirada responsable hacia el futuro.
                        </p>
                        <div className="hero-acciones">
                            <Link to="/productos" className="boton">
                                Explorar la colección
                            </Link>
                            <a href="#filosofia" className="enlace-claro">
                                Conocé nuestra filosofía <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="seccion seccion-destacados" aria-labelledby="titulo-destacados">
                <div className="contenedor">
                    <div className="titulo-seccion titulo-seccion-dividido">
                        <div>
                            <p>Selección Hermanos Jota</p>
                            <h2 id="titulo-destacados">Piezas con carácter</h2>
                        </div>
                        <span>
                            Diseños pensados para acompañarte durante años y ganar belleza con el
                            paso del tiempo.
                        </span>
                    </div>
                    {estado.tipo === "cargando" && (
                        <div className="estado-carga" role="status">
                            Cargando productos...
                        </div>
                    )}
                    {estado.tipo === "error" && (
                        <div className="estado-carga" role="alert">
                            <p>No se pudieron cargar los productos.</p>
                            <button className="boton" type="button" onClick={cargar}>
                                Reintentar
                            </button>
                        </div>
                    )}
                    {estado.tipo === "exito" && (
                        <div id="productos-destacados">
                            <ProductList productos={estado.productos} linkText="Ver producto →" />
                        </div>
                    )}
                    <div className="centrar">
                        <Link to="/productos" className="boton boton-secundario">
                            Ver colección completa
                        </Link>
                    </div>
                </div>
            </section>

            <section className="filosofia" id="filosofia" aria-labelledby="titulo-filosofia">
                <div className="contenedor filosofia-contenido">
                    <div className="filosofia-imagen">
                        <img
                            src="/img/aparador Uspallata.png"
                            alt="Aparador Uspallata de Hermanos Jota en un ambiente cálido"
                            loading="lazy"
                            decoding="async"
                        />
                        <span>Hecho para convertirse en legado</span>
                    </div>
                    <div className="filosofia-texto">
                        <p className="eyebrow">Nuestra esencia</p>
                        <h2 id="titulo-filosofia">Entre la herencia y la innovación.</h2>
                        <p className="texto-grande">
                            Redescubrimos un arte olvidado: crear muebles que no solo cumplen una
                            función, sino que transforman la forma de habitar.
                        </p>
                        <p>
                            La calidez y el optimismo del diseño de los años 60 se encuentran con la
                            conciencia sustentable de hoy. Cada detalle honra el pasado mientras
                            abraza el futuro.
                        </p>
                        <Link to="/contacto" className="enlace-texto">
                            Visitá nuestra Casa Taller <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="seccion sustentabilidad" aria-labelledby="titulo-sustentabilidad">
                <div className="contenedor">
                    <div className="titulo-seccion titulo-seccion-centrado">
                        <p>Materiales con propósito</p>
                        <h2 id="titulo-sustentabilidad">Belleza que respeta su origen</h2>
                        <span>
                            Nuestro compromiso ambiental guía cada decisión del proceso creativo y
                            productivo.
                        </span>
                    </div>
                    <div className="beneficios-contenedor">
                        <article className="beneficio">
                            <span className="beneficio-numero">01</span>
                            <h3>Maderas responsables</h3>
                            <p>
                                Madera certificada FSC de bosques argentinos, con prioridad para
                                especies nativas y proveedores locales.
                            </p>
                        </article>
                        <article className="beneficio">
                            <span className="beneficio-numero">02</span>
                            <h3>Acabados naturales</h3>
                            <p>
                                Aceite de lino, cera de abejas y tintes vegetales de bajo COV que
                                cuidan la pieza y tu hogar.
                            </p>
                        </article>
                        <article className="beneficio">
                            <span className="beneficio-numero">03</span>
                            <h3>Diseño circular</h3>
                            <p>
                                Un mínimo de 30% de materiales recuperados o reciclados y cero
                                plásticos de un solo uso.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="herencia" aria-labelledby="titulo-herencia">
                <div className="contenedor herencia-contenido">
                    <div className="herencia-intro">
                        <p className="eyebrow">Programa Herencia Viva</p>
                        <h2 id="titulo-herencia">Una pieza para toda la vida.</h2>
                        <p>
                            Comprar Hermanos Jota es invertir en un legado. Te acompañamos para que
                            cada mueble envejezca con gracia.
                        </p>
                    </div>
                    <div className="herencia-lista">
                        <div>
                            <strong>10 años</strong>
                            <span>de garantía en estructura</span>
                        </div>
                        <div>
                            <strong>Restauración</strong>
                            <span>para recuperar piezas antiguas</span>
                        </div>
                        <div>
                            <strong>Trazabilidad</strong>
                            <span>del origen de cada material</span>
                        </div>
                        <div>
                            <strong>Recompra</strong>
                            <span>de hasta 40% en piezas cuidadas</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="visita" aria-labelledby="titulo-visita">
                <div className="contenedor visita-contenido">
                    <div>
                        <p className="eyebrow">Showroom y taller · San Cristóbal</p>
                        <h2 id="titulo-visita">Vení a conocer la historia detrás de cada pieza.</h2>
                    </div>
                    <div className="visita-accion">
                        <p>Av. San Juan 2847, Ciudad Autónoma de Buenos Aires</p>
                        <Link to="/contacto" className="boton">
                            Planificar mi visita
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
