import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";

test("shows a placeholder when the product image fails", () => {
    render(
        <MemoryRouter>
            <ProductCard
                producto={{ id: "1", nombre: "Mesa", precio: 10, imagen: "img/mesa.png" }}
            />
        </MemoryRouter>
    );
    fireEvent.error(screen.getByRole("img", { name: "Mesa" }));
    expect(screen.getByRole("img", { name: "Imagen no disponible" })).toBeInTheDocument();
});

test("shows a placeholder when no image is provided", () => {
    render(
        <MemoryRouter>
            <ProductCard producto={{ id: "1", nombre: "Mesa", precio: 10 }} />
        </MemoryRouter>
    );
    expect(screen.getByRole("img", { name: "Imagen no disponible" })).toBeInTheDocument();
});
