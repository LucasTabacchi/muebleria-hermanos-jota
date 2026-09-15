import { useState } from "react";

const VACIO = { nombre: "", email: "", mensaje: "" };

function validar(valores: { nombre: string; email: string; mensaje: string }): Record<string, string> {
    const errores: Record<string, string> = {};
    if (valores.nombre.trim().length < 2) errores.nombre = "Ingresá un nombre válido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())) {
        errores.email = "Ingresá un email válido.";
    }
    if (valores.mensaje.trim().length < 10) {
        errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    }
    return errores;
}

export default function ContactForm() {
    const [valores, setValores] = useState(VACIO);
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [exito, setExito] = useState("");

    function cambiarCampo(evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = evento.target;
        setValores((actuales) => ({ ...actuales, [name]: value }));
    }

    function enviar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const nuevosErrores = validar(valores);
        setErrores(nuevosErrores);
        setExito("");

        if (Object.keys(nuevosErrores).length > 0) return;

        setValores(VACIO);
        setExito("Mensaje enviado correctamente.");
    }

    return (
        <form className="formulario" noValidate onSubmit={enviar}>
            <div className="formulario-encabezado">
                <p className="eyebrow">Escribinos</p>
                <h2>¿Cómo podemos ayudarte?</h2>
                <p>Completá el formulario y te responderemos a la brevedad.</p>
            </div>

            <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={valores.nombre}
                    onChange={cambiarCampo}
                    aria-describedby="error-nombre"
                    aria-invalid={Boolean(errores.nombre) || undefined}
                />
                <small id="error-nombre" aria-live="polite">
                    {errores.nombre}
                </small>
            </div>

            <div className="campo">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@email.com"
                    autoComplete="email"
                    value={valores.email}
                    onChange={cambiarCampo}
                    aria-describedby="error-email"
                    aria-invalid={Boolean(errores.email) || undefined}
                />
                <small id="error-email" aria-live="polite">
                    {errores.email}
                </small>
            </div>

            <div className="campo">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={6}
                    placeholder="Contanos qué pieza o espacio tenés en mente"
                    value={valores.mensaje}
                    onChange={cambiarCampo}
                    aria-describedby="error-mensaje"
                    aria-invalid={Boolean(errores.mensaje) || undefined}
                />
                <small id="error-mensaje" aria-live="polite">
                    {errores.mensaje}
                </small>
            </div>

            <button type="submit" className="boton">
                Enviar consulta
            </button>
            <p className="mensaje-exito" role="status" aria-live="polite">
                {exito}
            </p>
        </form>
    );
}



