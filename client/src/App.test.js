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
    jest.restoreAllMocks();
    global.fetch = jest.fn();
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
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3001/api/productos");
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
