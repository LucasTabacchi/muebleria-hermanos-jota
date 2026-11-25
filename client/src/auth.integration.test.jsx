import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

function promesaDiferida() {
    let resolver;
    const promesa = new Promise((resolve) => {
        resolver = resolve;
    });
    return { promesa, resolver };
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
    test("registers an account and starts its session", async () => {
        global.fetch
            .mockResolvedValueOnce(
                respuestaJson(
                    {
                        _id: "cliente-1",
                        nombre: "Lucía",
                        email: "lucia@example.com",
                        rol: "cliente",
                    },
                    { status: 201 }
                )
            )
            .mockResolvedValueOnce(
                respuestaJson({
                    token: "token-cliente",
                    usuario: {
                        _id: "cliente-1",
                        nombre: "Lucía",
                        email: "lucia@example.com",
                        rol: "cliente",
                    },
                })
            );

        renderApp("/registro");
        fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Lucía" } });
        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "lucia@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secreto123" } });
        fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

        expect(await screen.findByText("Hola, Lucía")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenNthCalledWith(
            1,
            "/api/usuarios/registro",
            expect.objectContaining({ method: "POST" })
        );
        expect(global.fetch).toHaveBeenNthCalledWith(
            2,
            "/api/usuarios/login",
            expect.objectContaining({ method: "POST" })
        );
    });

    test("loads the protected profile with the bearer token and logs out after a 401", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" })
        );

        renderApp("/perfil");
        expect(await screen.findByRole("heading", { name: "Mi perfil" })).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/api/usuarios/perfil", {
            headers: { Authorization: "Bearer token-cliente" },
        });
    });

    test("clears the session and returns to login when profile responds 401", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-vencido",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ error: "No autorizado." }, { ok: false, status: 401 })
        );

        renderApp("/perfil");

        expect(await screen.findByRole("heading", { name: "Ingresar" })).toBeInTheDocument();
        expect(localStorage.getItem("sesion")).toBeNull();
    });

    test("ignores a stale profile 401 after leaving the page", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-vencido",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        const respuestaPendiente = promesaDiferida();
        global.fetch.mockReturnValueOnce(respuestaPendiente.promesa);

        const { unmount } = renderApp("/perfil");
        unmount();

        const nuevaSesion = {
            token: "token-nuevo",
            usuario: { nombre: "Nueva sesión", email: "nueva@jota.com", rol: "cliente" },
        };
        localStorage.setItem("sesion", JSON.stringify(nuevaSesion));
        await act(async () => {
            respuestaPendiente.resolver(
                await respuestaJson({ error: "No autorizado." }, { ok: false, status: 401 })
            );
        });

        expect(JSON.parse(localStorage.getItem("sesion"))).toEqual(nuevaSesion);
    });

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

    test("redirects an anonymous customer away from order history", () => {
        renderApp("/mis-pedidos");

        expect(screen.getByRole("heading", { name: "Ingresar" })).toBeInTheDocument();
    });

    test("creates an authenticated order and clears the cart only after success", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        localStorage.setItem(
            "carrito",
            JSON.stringify([{ id: "producto-1", nombre: "Mesa", precio: 300000 }])
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ _id: "pedido-1", total: 300000, items: [] }, { status: 201 })
        );

        renderApp("/carrito");
        fireEvent.click(screen.getByRole("button", { name: "Finalizar compra" }));

        expect(await screen.findByRole("status")).toHaveTextContent(
            "Tu pedido fue registrado correctamente."
        );
        expect(global.fetch).toHaveBeenCalledWith("/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token-cliente",
            },
            body: JSON.stringify({ items: [{ productoId: "producto-1" }] }),
        });
        expect(screen.getByRole("heading", { name: "Tu carrito está vacío" })).toBeInTheDocument();
    });

    test("keeps the cart when order creation fails", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        localStorage.setItem(
            "carrito",
            JSON.stringify([{ id: "producto-1", nombre: "Mesa", precio: 300000 }])
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson({ error: "No se pudo registrar el pedido." }, { ok: false, status: 400 })
        );

        renderApp("/carrito");
        fireEvent.click(screen.getByRole("button", { name: "Finalizar compra" }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "No se pudo registrar el pedido."
        );
        expect(screen.getByRole("heading", { name: "Mesa" })).toBeInTheDocument();
    });

    test("loads the authenticated user's order history", async () => {
        localStorage.setItem(
            "sesion",
            JSON.stringify({
                token: "token-cliente",
                usuario: { nombre: "Cliente Jota", email: "cliente@jota.com", rol: "cliente" },
            })
        );
        global.fetch.mockResolvedValueOnce(
            respuestaJson([
                {
                    _id: "pedido-1",
                    createdAt: "2026-11-23T00:00:00.000Z",
                    total: 300000,
                    items: [{ nombre: "Mesa" }],
                },
            ])
        );

        renderApp("/mis-pedidos");

        expect(await screen.findByRole("heading", { name: "Mis pedidos" })).toBeInTheDocument();
        expect(screen.getByText("Mesa")).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledWith("/api/pedidos/mis-pedidos", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token-cliente",
            },
        });
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
