import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { eliminarProducto } from "./services/productosApi";

function respuestaJson(body, { ok = true, status = 200 } = {}) {
    return Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(body),
    });
}

function renderApp(path) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </MemoryRouter>
    );
}

beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
});

describe("authentication flow", () => {
    test("redirects an anonymous user to login and returns to the requested admin page", async () => {
        global.fetch.mockResolvedValueOnce(
            respuestaJson({
                token: "token-admin",
                usuario: {
                    _id: "admin-1",
                    nombre: "Admin Jota",
                    email: "admin@jota.com",
                    rol: "admin",
                },
            })
        );

        renderApp("/admin/crear-producto");

        expect(screen.getByRole("heading", { name: "Ingresar" })).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@jota.com" } });
        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "admin123" } });
        fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

        expect(
            await screen.findByRole("heading", { name: "Alta de producto" })
        ).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith(
            "/api/usuarios/login",
            expect.objectContaining({ method: "POST" })
        );
    });

    test("shows the backend credential error and clears the stored session on logout", async () => {
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ error: "Credenciales inválidas" }, { ok: false, status: 401 })
        );

        renderApp("/login");
        fireEvent.change(screen.getByLabelText("Email"), { target: { value: "cliente@jota.com" } });
        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "incorrecta" } });
        fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

        expect(await screen.findByRole("alert")).toHaveTextContent("Credenciales inválidas");

        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", rol: "cliente" },
            })
        );
        renderApp("/");
        fireEvent.click(screen.getAllByRole("button", { name: "Cerrar sesión" })[0]);

        expect(screen.getAllByRole("link", { name: "Ingresar" }).length).toBeGreaterThan(0);
        expect(localStorage.getItem("sesion")).toBeNull();
    });

    test("does not allow a customer to enter the product administration route", () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", rol: "cliente" },
            })
        );

        renderApp("/admin/crear-producto");

        expect(screen.getByRole("alert")).toHaveTextContent(
            "Necesitás ser administrador para ver esta página."
        );
    });

    test("resets the form when an administrator returns from edit to create", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-admin",
                usuario: { nombre: "Admin Jota", rol: "admin" },
            })
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ id: "mesa-1", nombre: "Mesa editada", precio: 200000, stock: 1 })
        );

        renderApp("/admin/editar-producto/mesa-1");
        expect(await screen.findByDisplayValue("Mesa editada")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("link", { name: "Nuevo producto" }));

        expect(
            await screen.findByRole("heading", { name: "Alta de producto" })
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Nombre")).toHaveValue("");
    });

    test("sends the bearer token on delete and accepts an empty 204 response", async () => {
        global.fetch.mockResolvedValueOnce({ ok: true, status: 204 });

        await expect(eliminarProducto("producto-1", "token-admin")).resolves.toBeNull();
        expect(global.fetch).toHaveBeenCalledWith("/api/productos/producto-1", {
            method: "DELETE",
            headers: { Authorization: "Bearer token-admin" },
        });
    });

    test("adds a product from the catalog to the cart context", async () => {
        global.fetch.mockResolvedValueOnce(
            respuestaJson([
                {
                    id: "producto-1",
                    nombre: "Mesa",
                    categoria: { nombre: "Mesas" },
                    precio: 300000,
                },
            ])
        );

        renderApp("/productos");
        await screen.findByRole("heading", { name: "Mesa" });
        fireEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));

        await waitFor(() => {
            expect(screen.getByLabelText("Productos en el carrito")).toHaveTextContent("1");
        });
    });

    test("preserves the existing madera filter for bambú products", async () => {
        global.fetch.mockResolvedValueOnce(
            respuestaJson([
                {
                    id: "escritorio-1",
                    nombre: "Escritorio",
                    categoria: { nombre: "Mesas" },
                    materiales: "Bambú laminado, herrajes ocultos",
                    precio: 400000,
                },
            ])
        );

        renderApp("/productos");
        expect(await screen.findByRole("heading", { name: "Escritorio" })).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText("Material"), { target: { value: "madera" } });

        expect(screen.getByRole("heading", { name: "Escritorio" })).toBeInTheDocument();
    });
});
