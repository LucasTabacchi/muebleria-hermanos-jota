import ProductCard from "./ProductCard";
import type { Producto } from "../types";

export default function ProductList({ productos, linkText = "Ver detalle →" }: { productos: Producto[]; linkText?: string }) {
    if (productos.length === 0) {
        return <p>No encontramos productos con ese nombre.</p>;
    }

    return (
        <div className="productos-contenedor">
            {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} linkText={linkText} />
            ))}
        </div>
    );
}



