import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarProducto, crearProducto, obtenerProducto } from "../services/productosApi";
import { useAuth } from "../context/AuthContext";

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
    if (!values.precio || Number(values.precio) < 0) errors.precio = "Ingresá un precio válido.";
    if (Number(values.stock) < 0) errors.stock = "El stock no puede ser negativo.";
    return errors;
}

function valuesFromProduct(producto) {
    return {
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: String(producto.precio ?? ""),
        stock: String(producto.stock ?? 0),
        imagenUrl: producto.imagenUrl || producto.imagen || "",
    };
}

export default function CreateProductPage() {
    const { id } = useParams();
    const editando = Boolean(id);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState(INITIAL_VALUES);
    const [errors, setErrors] = useState({});
    const [state, setState] = useState(editando ? "loading" : "idle");
    const [requestError, setRequestError] = useState("");

    useEffect(() => {
        if (!editando) {
            setValues(INITIAL_VALUES);
            setErrors({});
            setRequestError("");
            setState("idle");
            return undefined;
        }

        let activo = true;
        obtenerProducto(id)
            .then((producto) => {
                if (!activo) return;
                setValues(valuesFromProduct(producto));
                setState("idle");
            })
            .catch((error) => {
                if (!activo) return;
                setRequestError(error.message || "No se pudo cargar el producto.");
                setState("error");
            });

        return () => {
            activo = false;
        };
    }, [editando, id]);

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

        const productInput = {
            nombre: values.nombre.trim(),
            descripcion: values.descripcion.trim(),
            precio: Number(values.precio),
            stock: Number(values.stock || 0),
            ...(values.imagenUrl.trim() ? { imagenUrl: values.imagenUrl.trim() } : {}),
        };

        setState("submitting");
        try {
            const product = editando
                ? await actualizarProducto(id, productInput, token)
                : await crearProducto(productInput, token);
            navigate(`/productos/${product.id || product._id}`);
        } catch (error) {
            setRequestError(
                error.message || `No se pudo ${editando ? "actualizar" : "crear"} el producto.`
            );
            setState("idle");
        }
    }

    const accion = editando ? "Editar" : "Crear";

    return (
        <main id="contenido">
            <section className="encabezado-pagina">
                <div className="contenedor encabezado-pagina-contenido">
                    <div>
                        <p>Administración</p>
                        <h1>{editando ? "Edición de producto" : "Alta de producto"}</h1>
                    </div>
                    <span>Gestioná las piezas del catálogo de Hermanos Jota.</span>
                </div>
            </section>
            <section className="seccion">
                <div className="contenedor">
                    {state === "loading" ? (
                        <div className="estado-carga" role="status">
                            Cargando producto...
                        </div>
                    ) : (
                        <form className="formulario" noValidate onSubmit={handleSubmit}>
                            <div className="formulario-encabezado">
                                <p className="eyebrow">
                                    {editando ? "Producto existente" : "Nuevo producto"}
                                </p>
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
                            {requestError && (
                                <p role="alert" className="error">
                                    {requestError}
                                </p>
                            )}
                            <button
                                className="boton"
                                type="submit"
                                disabled={state === "submitting"}
                            >
                                {state === "submitting"
                                    ? editando
                                        ? "Guardando cambios..."
                                        : "Creando producto..."
                                    : editando
                                      ? "Guardar cambios"
                                      : "Crear producto"}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}
