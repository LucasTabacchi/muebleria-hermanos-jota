const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        nombre: { type: String, required: true, trim: true },
        precio: { type: Number, required: true, min: 0 },
        cantidad: { type: Number, required: true, min: 1, default: 1 },
    },
    { _id: false }
);

const pedidoSchema = new mongoose.Schema(
    {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
        items: {
            type: [itemSchema],
            required: true,
            validate: [(items) => items.length > 0, "El pedido debe tener productos."],
        },
        total: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Pedido || mongoose.model("Pedido", pedidoSchema);
