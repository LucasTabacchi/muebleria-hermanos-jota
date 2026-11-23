import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, soloAdmin = false }) {
    const { usuario } = useAuth();
    const location = useLocation();

    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
    }

    if (soloAdmin && usuario.rol !== "admin") {
        return (
            <main id="contenido" className="seccion">
                <div className="contenedor">
                    <p className="error" role="alert">
                        Necesitás ser administrador para ver esta página.
                    </p>
                </div>
            </main>
        );
    }

    return children;
}
