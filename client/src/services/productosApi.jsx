const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function solicitar(ruta, opciones) {
    const url = `${API_URL}${ruta}`;
    const respuesta = opciones ? await fetch(url, opciones) : await fetch(url);
    const cuerpo = await respuesta.json().catch(() => null);

    if (!respuesta.ok || cuerpo === null) {
        const error = Object.assign(
            new Error(cuerpo?.error || "La API no pudo completar la solicitud."),
            { status: respuesta.status }
        );
        throw error;
    }

    return cuerpo;
}

export function obtenerProductos() {
    return solicitar("/api/productos");
}

export function obtenerProducto(id) {
    return solicitar(`/api/productos/${id}`);
}

export function crearProducto(producto) {
    return solicitar("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
    });
}
