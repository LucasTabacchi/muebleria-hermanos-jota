export function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(precio);
}

export function rutaImagen(imagen) {
    if (!imagen) return "";
    return imagen.startsWith("/") ? imagen : `/${imagen}`;
}
