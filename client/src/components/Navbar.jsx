import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function claseActiva({ isActive }) {
    return isActive ? "activo" : undefined;
}

export default function Navbar() {
    const { usuario, logout } = useAuth();
    const { cantidadTotal } = useCart();

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
                        {usuario?.rol === "admin" && (
                            <NavLink to="/admin/crear-producto" className={claseActiva}>
                                Nuevo producto
                            </NavLink>
                        )}
                        {usuario ? (
                            <>
                                <NavLink to="/perfil" className={claseActiva}>
                                    Mi perfil
                                </NavLink>
                                <NavLink to="/mis-pedidos" className={claseActiva}>
                                    Mis pedidos
                                </NavLink>
                                <button
                                    type="button"
                                    className="nav-cerrar-sesion"
                                    onClick={logout}
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className={claseActiva}>
                                    Ingresar
                                </NavLink>
                                <NavLink to="/registro" className={claseActiva}>
                                    Crear cuenta
                                </NavLink>
                            </>
                        )}
                        <NavLink
                            to="/carrito"
                            className={({ isActive }) =>
                                `carrito-header${isActive ? " activo" : ""}`
                            }
                        >
                            Carrito
                            <span className="contador-carrito" aria-label="Productos en el carrito">
                                {cantidadTotal}
                            </span>
                        </NavLink>
                    </nav>
                </div>
            </header>
        </>
    );
}
