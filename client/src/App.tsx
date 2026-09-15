import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import type { ItemCarrito, Producto } from "./types";

function carritoInicial() {
    try {
        const guardado = JSON.parse(localStorage.getItem("carrito") || "[]");
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

export default function App() {
    const [cart, setCart] = useState<ItemCarrito[]>(carritoInicial);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(cart));
    }, [cart]);

    function agregar(producto: Producto) {
        setCart((actual) => [
            ...actual,
            { id: producto.id, nombre: producto.nombre, precio: producto.precio },
        ]);
    }

    function eliminar(indice: number) {
        setCart((actual) => actual.filter((_, posicion) => posicion !== indice));
    }

    return (
        <>
            <Navbar cartCount={cart.length} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/productos/:id" element={<ProductPage onAdd={agregar} />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route
                    path="/carrito"
                    element={
                        <CartPage cart={cart} onRemove={eliminar} onClear={() => setCart([])} />
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
}


