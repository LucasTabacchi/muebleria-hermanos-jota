import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function carritoInicial() {
    try {
        const guardado = JSON.parse(localStorage.getItem("carrito") || "[]");
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(carritoInicial);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    function agregar(producto) {
        setCarrito((actual) => [
            ...actual,
            { id: producto.id || producto._id, nombre: producto.nombre, precio: producto.precio },
        ]);
    }

    function eliminar(indice) {
        setCarrito((actual) => actual.filter((_, posicion) => posicion !== indice));
    }

    function vaciar() {
        setCarrito([]);
    }

    const valor = useMemo(
        () => ({
            carrito,
            agregar,
            eliminar,
            vaciar,
            cantidadTotal: carrito.length,
            total: carrito.reduce((suma, producto) => suma + producto.precio, 0),
        }),
        [carrito]
    );

    return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
    const contexto = useContext(CartContext);
    if (!contexto) {
        throw new Error("useCart debe utilizarse dentro de CartProvider.");
    }
    return contexto;
}
