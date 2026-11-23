import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import CreateProductPage from "./pages/CreateProductPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";

function carritoInicial() {
    try {
        const guardado = JSON.parse(localStorage.getItem("carrito") || "[]");
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

export default function App() {
    const [cart, setCart] = useState(carritoInicial);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(cart));
    }, [cart]);

    function agregar(producto) {
        setCart((actual) => [
            ...actual,
            { id: producto.id || producto._id, nombre: producto.nombre, precio: producto.precio },
        ]);
    }

    function eliminar(indice) {
        setCart((actual) => actual.filter((_, posicion) => posicion !== indice));
    }

    return (
        <>
            <ScrollToTop />
            <Navbar cartCount={cart.length} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/productos/:id" element={<ProductPage onAdd={agregar} />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin/crear-producto"
                    element={
                        <ProtectedRoute soloAdmin>
                            <CreateProductPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/editar-producto/:id"
                    element={
                        <ProtectedRoute soloAdmin>
                            <CreateProductPage />
                        </ProtectedRoute>
                    }
                />
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
