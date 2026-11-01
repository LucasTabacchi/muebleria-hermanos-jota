import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearProducto } from "../services/productosApi";

const INITIAL_VALUES = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "0",
    imagenUrl: "",
};

function validate(values) {
    const errors = {};
    if (!values.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!values.precio || Number(values.precio) < 0) {
        errors.precio = "Ingresá un precio válido.";
    }
    if (Number(values.stock) < 0) errors.stock = "El stock no puede ser negativo.";
    return errors;
}

export default function CreateProductPage() {
    const navigate = useNavigate();
    const [values, setValues] = useState(INITIAL_VALUES);
    const [errors, setErrors] = useState({});
    const [state, setState] = useState("idle");
    const [requestError, setRequestError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);
        setRequestError("");

        if (Object.keys(nextErrors).length > 0) return;

        setState("submitting");
        try {
            const product = await crearProducto({
                nombre: values.nombre.trim(),
                descripcion: values.descripcion.trim(),
                precio: Number(values.precio),
                stock: Number(values.stock || 0),
                ...(values.imagenUrl.trim() ? { imagenUrl: values.imagenUrl.trim() } : {}),
            });
            navigate(`/productos/${product.id || product._id}`);
        } catch (error) {
            setRequestError(error.message || "No se pudo crear el producto.");
            setState("idle");
        }
    }

    return (
        <main id="contenido">
            <section className="encabezado-pagina">
                <div className="contenedor encabezado-pagina-contenido">
                    <div>
                        <p>Administración</p>
                        <h1>Alta de producto</h1>
                    </div>
                    <span>Incorporá una nueva pieza al catálogo de Hermanos Jota.</span>
                </div>
            </section>
            <section className="seccion">
                <div className="contenedor">
                    <form className="formulario" noValidate onSubmit={handleSubmit}>
                        <div className="formulario-encabezado">
                            <p className="eyebrow">Nuevo producto</p>
                            <h2>Datos de la pieza</h2>
                            <p>Los campos nombre y precio son obligatorios.</p>
                        </div>
                        <div className="campo">
                            <label htmlFor="product-name">Nombre</label>
                            <input
                                id="product-name"
                                name="nombre"
                                value={values.nombre}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.nombre) || undefined}
                            />
                            <small>{errors.nombre}</small>
                        </div>
                        <div className="campo">
                            <label htmlFor="product-description">Descripción</label>
                            <textarea
                                id="product-description"
                                name="descripcion"
                                rows={4}
                                value={values.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="campo">
                            <label htmlFor="product-price">Precio</label>
                            <input
                                id="product-price"
                                name="precio"
                                type="number"
                                min="0"
                                value={values.precio}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.precio) || undefined}
                            />
                            <small>{errors.precio}</small>
                        </div>
                        <div className="campo">
                            <label htmlFor="product-stock">Stock</label>
                            <input
                                id="product-stock"
                                name="stock"
                                type="number"
                                min="0"
                                value={values.stock}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.stock) || undefined}
                            />
                            <small>{errors.stock}</small>
                        </div>
                        <div className="campo">
                            <label htmlFor="product-image">URL de imagen</label>
                            <input
                                id="product-image"
                                name="imagenUrl"
                                type="url"
                                value={values.imagenUrl}
                                onChange={handleChange}
                            />
                            <small>Opcional.</small>
                        </div>
                        {requestError && <p role="alert">{requestError}</p>}
                        <button className="boton" type="submit" disabled={state === "submitting"}>
                            {state === "submitting" ? "Creando producto..." : "Crear producto"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
