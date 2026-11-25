import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
    const { registrar } = useAuth();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setEnviando(true);
        try {
            await registrar(nombre, email, password);
            navigate("/", { replace: true });
        } catch (registroError) {
            setError(registroError.message);
            setEnviando(false);
        }
    }

    return (
        <main id="contenido">
            <section className="seccion">
                <div className="contenedor">
                    <form className="formulario" onSubmit={handleSubmit}>
                        <div className="formulario-encabezado">
                            <p className="eyebrow">Cuenta</p>
                            <h1>Crear cuenta</h1>
                            <p>Registrate para guardar tu sesión y consultar tu perfil.</p>
                        </div>
                        <div className="campo">
                            <label htmlFor="register-name">Nombre</label>
                            <input
                                id="register-name"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="register-email">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="register-password">Contraseña</label>
                            <input
                                id="register-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={8}
                                pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}"
                                title="Usá al menos 8 caracteres, una mayúscula y un carácter especial."
                                required
                            />
                            <small>
                                Usá al menos 8 caracteres, una mayúscula y un carácter especial.
                            </small>
                        </div>
                        {error && (
                            <p className="error" role="alert">
                                {error}
                            </p>
                        )}
                        <button className="boton" type="submit" disabled={enviando}>
                            {enviando ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                        <p>
                            ¿Ya tenés una cuenta? <Link to="/login">Ingresar</Link>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
}
