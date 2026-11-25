const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function solicitar(ruta, opciones) {
    const url = `${API_URL}${ruta}`;
    const respuesta = opciones ? await fetch(url, opciones) : await fetch(url);

    if (respuesta.status === 204) {
        return null;
    }

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

function headersAutorizados(token, incluirJson = true) {
    return {
        ...(incluirJson ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
    };
}

export function obtenerProductos() {
    return solicitar("/api/productos");
}

export function obtenerProducto(id) {
    return solicitar(`/api/productos/${id}`);
}

export function crearProducto(producto, token) {
    return solicitar("/api/productos", {
        method: "POST",
        headers: headersAutorizados(token),
        body: JSON.stringify(producto),
    });
}

export function actualizarProducto(id, producto, token) {
    return solicitar(`/api/productos/${id}`, {
        method: "PUT",
        headers: headersAutorizados(token),
        body: JSON.stringify(producto),
    });
}

export function eliminarProducto(id, token) {
    return solicitar(`/api/productos/${id}`, {
        method: "DELETE",
        headers: headersAutorizados(token, false),
    });
}
