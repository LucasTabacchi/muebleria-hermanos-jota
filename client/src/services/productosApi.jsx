// In development, Vite forwards this relative path to the local API. Keeping the
// default relative also lets deployed environments serve client and API together.
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function solicitar(ruta) {
    const respuesta = await fetch(`${API_URL}${ruta}`);

    if (!respuesta.ok) {
        const error = Object.assign(new Error("La API no pudo completar la solicitud."), {
            status: respuesta.status,
        });
        error.status = respuesta.status;
        throw error;
    }

    return respuesta.json();
}

export function obtenerProductos() {
    return solicitar("/api/productos");
}

export function obtenerProducto(id) {
    return solicitar(`/api/productos/${id}`);
}
