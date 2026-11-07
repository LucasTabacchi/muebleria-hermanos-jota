const path = require("node:path");
const dotenv = require("dotenv");

// Resolve backend environment file even when the script runs from repository root.
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const { connectDatabase, disconnectDatabase } = require("../config/database");
const PRODUCTOS = require("../data/productos");
const Categoria = require("../models/Categoria");
const Product = require("../models/Product");

function mapLegacyProduct(product, categoriasPorNombre) {
    return {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: Number.isFinite(product.stock) ? product.stock : 0,
        imagenUrl: product.imagenUrl || product.imagen,
        categoria: product.categoria ? categoriasPorNombre.get(product.categoria) : undefined,
        medidas: product.medidas,
        materiales: product.materiales || product.estructura,
        acabado: product.acabado,
        peso: product.peso,
        capacidad: product.capacidad,
        modulares: product.modulares,
        tapizado: product.tapizado,
        destacado: product.destacado,
    };
}

async function seed() {
    await connectDatabase();

    const nombresCategoria = [
        ...new Set(PRODUCTOS.map((product) => product.categoria).filter(Boolean)),
    ];
    await Categoria.bulkWrite(
        nombresCategoria.map((nombre) => ({
            updateOne: {
                filter: { nombre },
                update: { $set: { nombre } },
                upsert: true,
            },
        }))
    );

    const categorias = await Categoria.find({ nombre: { $in: nombresCategoria } });
    const categoriasPorNombre = new Map(
        categorias.map((categoria) => [categoria.nombre, categoria._id])
    );
    const operations = PRODUCTOS.map((product) => ({
        updateOne: {
            filter: { nombre: product.nombre },
            update: { $set: mapLegacyProduct(product, categoriasPorNombre) },
            upsert: true,
        },
    }));

    const result = await Product.bulkWrite(operations, { ordered: true });
    console.log(
        `Catálogo sincronizado: ${result.upsertedCount} creados, ${result.modifiedCount} actualizados.`
    );
}

seed()
    .catch((error) => {
        console.error("No se pudo sincronizar el catálogo:", error.message);
        process.exitCode = 1;
    })
    .finally(disconnectDatabase);
