const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        descripcion: { type: String, trim: true, default: "" },
        precio: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
        imagenUrl: { type: String, trim: true, alias: "imagen" },
        categoria: { type: String, trim: true },
        medidas: { type: String, trim: true },
        materiales: { type: String, trim: true },
        acabado: { type: String, trim: true },
        peso: { type: String, trim: true },
        capacidad: { type: String, trim: true },
        modulares: { type: String, trim: true },
        tapizado: { type: String, trim: true },
        destacado: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
