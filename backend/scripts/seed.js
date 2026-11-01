const path = require("node:path");
const dotenv = require("dotenv");

// Resolve the backend environment file even when this script is run from the repository root.
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const { connectDatabase, disconnectDatabase } = require("../config/database");
const PRODUCTOS = require("../data/productos");
const Product = require("../models/Product");

function mapLegacyProduct(product) {
    return {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        // The legacy catalog has no inventory data, so new records begin at zero.
        stock: Number.isFinite(product.stock) ? product.stock : 0,
        imagenUrl: product.imagenUrl || product.imagen,
        categoria: product.categoria,
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

    const operations = PRODUCTOS.map((product) => ({
        updateOne: {
            filter: { nombre: product.nombre },
            update: { $set: mapLegacyProduct(product) },
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
