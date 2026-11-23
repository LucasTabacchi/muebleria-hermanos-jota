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
import MisPedidos from "./pages/MisPedidos";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import ProductsPage from "./pages/ProductsPage";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/productos/:id" element={<ProductPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute>
                            <Perfil />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mis-pedidos"
                    element={
                        <ProtectedRoute>
                            <MisPedidos />
                        </ProtectedRoute>
                    }
                />
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
                <Route path="/carrito" element={<CartPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
        </>
    );
}
