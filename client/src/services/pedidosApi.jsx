const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function solicitar(ruta, token, opciones = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...opciones.headers,
        },
    });
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

export function crearPedido(productos, token) {
    return solicitar("/api/pedidos", token, {
        method: "POST",
        body: JSON.stringify({
            items: productos.map((producto) => ({ productoId: producto.id || producto._id })),
        }),
    });
}

export function obtenerMisPedidos(token) {
    return solicitar("/api/pedidos/mis-pedidos", token);
}
