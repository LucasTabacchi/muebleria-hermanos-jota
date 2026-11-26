import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export default function Perfil() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [estado, setEstado] = useState({ tipo: "cargando", usuario: null });

    useEffect(() => {
        let activo = true;

        async function cargarPerfil() {
            try {
                const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const datos = await respuesta.json().catch(() => null);

                if (!activo) return;

                if (respuesta.status === 401) {
                    logout();
                    navigate("/login", { replace: true, state: { desde: "/perfil" } });
                    return;
                }
                if (!respuesta.ok || !datos) {
                    throw new Error(datos?.error || "No se pudo cargar el perfil.");
                }
                if (activo) setEstado({ tipo: "exito", usuario: datos });
            } catch (error) {
                if (activo) setEstado({ tipo: "error", mensaje: error.message });
            }
        }

        cargarPerfil();
        return () => {
            activo = false;
        };
    }, [logout, navigate, token]);

    if (estado.tipo === "cargando")
        return (
            <main id="contenido" className="estado-carga" role="status">
                Cargando perfil...
            </main>
        );
    if (estado.tipo === "error")
        return (
            <main id="contenido" className="estado-carga" role="alert">
                {estado.mensaje}
            </main>
        );

    const { usuario } = estado;
    return (
        <main id="contenido">
            <section className="seccion">
                <div className="contenedor">
                    <article className="formulario">
                        <div className="formulario-encabezado">
                            <p className="eyebrow">Cuenta</p>
                            <h1>Mi perfil</h1>
                        </div>
                        <p>
                            <strong>Nombre:</strong> {usuario.nombre}
                        </p>
                        <p>
                            <strong>Email:</strong> {usuario.email}
                        </p>
                        <p>
                            <strong>Rol:</strong> {usuario.rol}
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}
