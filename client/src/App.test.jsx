import { vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

const productos = [
    {
        id: 1,
        nombre: "Aparador Uspallata",
        categoria: "Muebles",
        precio: 1490000,
        descripcion: "Aparador de seis puertas fabricado en nogal sostenible.",
        medidas: "180 x 45 x 75 cm",
        materiales: "Nogal macizo FSC®, herrajes de latón.",
        imagen: "img/aparador Uspallata.png",
        destacado: true,
    },
    {
        id: 2,
        nombre: "Biblioteca Recoleta",
        categoria: "Bibliotecas",
        precio: 699000,
        descripcion: "Sistema modular de estantes abierto.",
        imagen: "img/biblioteca Recoleta.png",
        destacado: false,
    },
];

function respuestaJson(body, { ok = true, status = 200 } = {}) {
    return Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(body),
    });
}

function renderApp(path = "/") {
    return render(
        <MemoryRouter
            initialEntries={[path]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <App />
        </MemoryRouter>
    );
}

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
});

afterEach(() => {
    delete global.fetch;
});

test("muestra la carga y luego el catálogo obtenido desde la API", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));

    renderApp("/productos");

    expect(screen.getByRole("status")).toHaveTextContent("Cargando catálogo...");
    expect(await screen.findByText("Aparador Uspallata")).toBeInTheDocument();
    expect(screen.getByText("Biblioteca Recoleta")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/productos");
});

test("usa la variante Alabastro transparente del logo en el footer", () => {
    renderApp("/contacto");

    const footer = screen.getByRole("contentinfo");
    expect(footer.querySelector(".logo img")).toHaveAttribute("src", "/logo-alabastro.svg");
});

test("filtra el catálogo con un evento de React", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/productos");
    await screen.findByText("Aparador Uspallata");

    fireEvent.change(screen.getByRole("searchbox", { name: /buscar en la colección/i }), {
        target: { value: "biblioteca" },
    });

    expect(screen.queryByText("Aparador Uspallata")).not.toBeInTheDocument();
    expect(screen.getByText("Biblioteca Recoleta")).toBeInTheDocument();
    expect(screen.getByText("1 resultado")).toBeInTheDocument();
});

test("filtra el catálogo por categoría", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/productos");
    await screen.findByText("Aparador Uspallata");

    fireEvent.change(screen.getByLabelText("Categoría"), {
        target: { value: "Muebles" },
    });

    expect(screen.getByText("Aparador Uspallata")).toBeInTheDocument();
    expect(screen.queryByText("Biblioteca Recoleta")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado")).toBeInTheDocument();
});

test("filtra el catálogo por material", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/productos");
    await screen.findByText("Aparador Uspallata");

    fireEvent.change(screen.getByLabelText("Material"), {
        target: { value: "madera" },
    });

    expect(screen.getByText("Aparador Uspallata")).toBeInTheDocument();
    expect(screen.queryByText("Biblioteca Recoleta")).not.toBeInTheDocument();
    expect(screen.getByText("1 resultado")).toBeInTheDocument();
});

test("ordena los productos por precio menor y mayor", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/productos");
    await screen.findByText("Aparador Uspallata");

    fireEvent.change(screen.getByLabelText("Ordenar por precio"), {
        target: { value: "precio-menor" },
    });

    const titulosMenor = screen.getAllByRole("heading", { level: 3 });
    expect(titulosMenor[0]).toHaveTextContent("Biblioteca Recoleta");
    expect(titulosMenor[1]).toHaveTextContent("Aparador Uspallata");

    fireEvent.change(screen.getByLabelText("Ordenar por precio"), {
        target: { value: "precio-mayor" },
    });

    const titulosMayor = screen.getAllByRole("heading", { level: 3 });
    expect(titulosMayor[0]).toHaveTextContent("Aparador Uspallata");
    expect(titulosMayor[1]).toHaveTextContent("Biblioteca Recoleta");
});

test("limpia los filtros activos y restablece la lista completa", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/productos");
    await screen.findByText("Aparador Uspallata");

    fireEvent.change(screen.getByLabelText("Categoría"), {
        target: { value: "Bibliotecas" },
    });
    expect(screen.queryByText("Aparador Uspallata")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    expect(screen.getByText("Aparador Uspallata")).toBeInTheDocument();
    expect(screen.getByText("Biblioteca Recoleta")).toBeInTheDocument();
    expect(screen.getByText("2 productos disponibles")).toBeInTheDocument();
});

test("muestra un error accionable y reintenta cargar el catálogo", async () => {
    global.fetch
        .mockRejectedValueOnce(new Error("sin conexión"))
        .mockReturnValueOnce(respuestaJson(productos));

    renderApp("/productos");

    expect(await screen.findByText("No se pudo cargar el catálogo.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Aparador Uspallata")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("carga un detalle, agrega el producto al carrito y persiste el estado", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos[0]));
    renderApp("/productos/1");

    expect(screen.getByRole("status")).toHaveTextContent("Cargando producto...");
    expect(await screen.findByRole("heading", { name: "Aparador Uspallata" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));

    expect(screen.getByLabelText("Productos en el carrito")).toHaveTextContent("1");
    expect(screen.getByText("Aparador Uspallata fue añadido al carrito.")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([
        { id: 1, nombre: "Aparador Uspallata", precio: 1490000 },
    ]);
});

test("muestra producto no encontrado cuando la API responde 404", async () => {
    global.fetch.mockReturnValueOnce(
        respuestaJson({ error: "Producto no encontrado" }, { ok: false, status: 404 })
    );
    renderApp("/productos/999");

    expect(
        await screen.findByRole("heading", { name: "Producto no encontrado" })
    ).toBeInTheDocument();
});

test("muestra un error y reintenta cargar el detalle", async () => {
    global.fetch
        .mockRejectedValueOnce(new Error("sin conexión"))
        .mockReturnValueOnce(respuestaJson(productos[0]));
    renderApp("/productos/1");

    expect(await screen.findByText("No fue posible cargar el producto.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByRole("heading", { name: "Aparador Uspallata" })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
});

test("valida y envía localmente el formulario controlado", () => {
    renderApp("/contacto");

    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));
    expect(screen.getByText("Ingresá un nombre válido.")).toBeInTheDocument();
    expect(screen.getByText("Ingresá un email válido.")).toBeInTheDocument();
    expect(screen.getByText("El mensaje debe tener al menos 10 caracteres.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Lucas" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "lucas@example.com" } });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
        target: { value: "Quisiera conocer la disponibilidad." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar consulta" }));

    expect(screen.getByText("Mensaje enviado correctamente.")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre")).toHaveValue("");
});

test("inicializa el carrito desde localStorage y permite eliminar productos", async () => {
    localStorage.setItem(
        "carrito",
        JSON.stringify([{ id: 1, nombre: "Aparador Uspallata", precio: 1490000 }])
    );
    renderApp("/carrito");

    expect(screen.getByLabelText("Productos en el carrito")).toHaveTextContent("1");
    const item = screen.getByRole("article", { name: "Aparador Uspallata" });
    expect(within(item).getByText("Aparador Uspallata")).toBeInTheDocument();
    fireEvent.click(within(item).getByRole("button", { name: /eliminar/i }));

    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem("carrito"))).toEqual([]));
});

test("muestra una vista de ruta no encontrada", () => {
    renderApp("/una-ruta-inexistente");
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
});

test("resetea el scroll al inicio de la página en la navegación", () => {
    window.scrollTo = vi.fn();
    renderApp("/contacto");
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
});

test("el botón Planificar mi visita redirige directamente al formulario de contacto", async () => {
    global.fetch.mockReturnValueOnce(respuestaJson(productos));
    renderApp("/");
    const botonVisita = screen.getByRole("link", { name: "Planificar mi visita" });
    expect(botonVisita).toHaveAttribute("href", "/contacto#formulario-contacto");
    await screen.findByText("Aparador Uspallata");
});

test("crea un producto desde la ruta de alta y navega a su detalle", async () => {
    const productoCreado = {
        id: "nuevo-1",
        nombre: "Cómoda",
        precio: 300000,
        descripcion: "Cómoda artesanal.",
        imagen: "img/comoda.png",
    };
    global.fetch
        .mockReturnValueOnce(respuestaJson(productoCreado, { status: 201 }))
        .mockReturnValueOnce(respuestaJson(productoCreado));

    renderApp("/admin/crear-producto");

    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Cómoda" } });
    fireEvent.change(screen.getByLabelText("Precio"), { target: { value: "300000" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }));

    await waitFor(() =>
        expect(global.fetch).toHaveBeenCalledWith(
            "/api/productos",
            expect.objectContaining({ method: "POST" })
        )
    );
    expect(await screen.findByRole("heading", { name: "Cómoda" })).toBeInTheDocument();
});

test("shows a recoverable error when the API returns a non-JSON payload", async () => {
    global.fetch.mockReturnValueOnce(
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(null) })
    );

    renderApp("/productos");

    expect(await screen.findByText("No se pudo cargar el catálogo.")).toBeInTheDocument();
});

test("hides MongoDB metadata from the product detail", async () => {
    const productoConMetadata = {
        ...productos[0],
        _id: "6ad40765e800c0b6c7b75f56",
        __v: 0,
        createdAt: "2026-10-17T23:40:20.482Z",
        updatedAt: "2026-10-17T23:40:20.482Z",
        imagenUrl: "img/aparador Uspallata.png",
        acabado: "Aceite natural ecológico",
    };
    global.fetch.mockReturnValueOnce(respuestaJson(productoConMetadata));

    renderApp("/productos/1");

    expect(await screen.findByText("Aceite natural ecológico")).toBeInTheDocument();
    expect(screen.queryByText("_id")).not.toBeInTheDocument();
    expect(screen.queryByText("__v")).not.toBeInTheDocument();
    expect(screen.queryByText("2026-10-17T23:40:20.482Z")).not.toBeInTheDocument();
    expect(screen.queryByText("img/aparador Uspallata.png")).not.toBeInTheDocument();
});
