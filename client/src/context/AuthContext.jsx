import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

function sesionInicial() {
    try {
        const sesion = JSON.parse(localStorage.getItem("sesion") || "null");
        return sesion?.token && sesion?.usuario ? sesion : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(sesionInicial);

    const login = useCallback(async (email, password) => {
        const respuesta = await fetch("/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const datos = await respuesta.json().catch(() => null);

        if (!respuesta.ok || !datos?.token || !datos?.usuario) {
            throw new Error(datos?.error || "No se pudo iniciar sesión.");
        }

        localStorage.setItem("sesion", JSON.stringify(datos));
        setSesion(datos);
    }, []);

    const registrar = useCallback(
        async (nombre, email, password) => {
            const respuesta = await fetch("/api/usuarios/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password }),
            });
            const datos = await respuesta.json().catch(() => null);

            if (!respuesta.ok) {
                throw new Error(datos?.error || "No se pudo crear la cuenta.");
            }

            await login(email, password);
        },
        [login]
    );

    const logout = useCallback(() => {
        localStorage.removeItem("sesion");
        setSesion(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario: sesion?.usuario ?? null,
                token: sesion?.token ?? null,
                login,
                registrar,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
    }
    return contexto;
}
