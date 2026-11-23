import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setEnviando(true);
        try {
            await login(email, password);
            navigate(location.state?.desde || "/", { replace: true });
        } catch (loginError) {
            setError(loginError.message);
            setEnviando(false);
        }
    }

    return (
        <main id="contenido">
            <section className="seccion">
                <div className="contenedor">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="formulario-encabezado">
                            <p className="eyebrow">Acceso</p>
                            <h1>Ingresar</h1>
                            <p>Iniciá sesión para administrar el catálogo.</p>
                        </div>
                        <div className="campo">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="login-password">Contraseña</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p className="error" role="alert">
                                {error}
                            </p>
                        )}
                        <button className="boton" type="submit" disabled={enviando}>
                            {enviando ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
