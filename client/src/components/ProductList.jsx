import ProductCard from "./ProductCard";

export default function ProductList({ productos, linkText = "Ver detalle →", onAdd }) {
    if (productos.length === 0) return <p>No encontramos productos con ese nombre.</p>;

    return (
        <div className="productos-contenedor">
            {productos.map((producto) => (
                <ProductCard
                    key={producto.id || producto._id}
                    producto={producto}
                    linkText={linkText}
                    onAdd={onAdd}
                />
            ))}
        </div>
    );
}
