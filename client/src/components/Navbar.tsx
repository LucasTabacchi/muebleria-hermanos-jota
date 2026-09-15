import { NavLink } from "react-router-dom";

function claseActiva({ isActive }) {
    return isActive ? "activo" : undefined;
}

export default function Navbar({ cartCount }) {
    return (
        <>
            <a className="saltar-contenido" href="#contenido">
                Saltar al contenido principal
            </a>
            <header className="header">
                <div className="contenedor header-contenido">
                    <NavLink to="/" end className="logo" aria-label="Hermanos Jota, inicio">
                        <img src="/logo.png" alt="" width="72" height="72" />
                        <span className="logo-texto">
                            <span>Hermanos</span>
                            <strong>Jota</strong>
                        </span>
                    </NavLink>

                    <nav className="nav" aria-label="Navegación principal">
                        <NavLink to="/" end className={claseActiva}>
                            Inicio
                        </NavLink>
                        <NavLink to="/productos" className={claseActiva}>
                            Productos
                        </NavLink>
                        <NavLink to="/contacto" className={claseActiva}>
                            Contacto
                        </NavLink>
                        <NavLink
                            to="/carrito"
                            className={({ isActive }) =>
                                `carrito-header${isActive ? " activo" : ""}`
                            }
                        >
                            Carrito
                            <span className="contador-carrito" aria-label="Productos en el carrito">
                                {cartCount}
                            </span>
                        </NavLink>
                    </nav>
                </div>
            </header>
        </>
    );
}

