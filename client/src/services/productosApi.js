const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3001").replace(/\/$/, "");

async function solicitar(ruta) {
    const respuesta = await fetch(`${API_URL}${ruta}`);

    if (!respuesta.ok) {
        const error = new Error("La API no pudo completar la solicitud.");
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
