const express = require("express");
const mongoose = require("mongoose");
const Pedido = require("../models/Pedido");
const Product = require("../models/Product");
const { verificarToken } = require("../middleware/auth");

const router = express.Router();

function errorDePedido(mensaje, status = 400) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function normalizarItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw errorDePedido("El pedido debe incluir al menos un producto.");
    }

    return items.map((item) => {
        const productoId = item?.productoId;
        if (!mongoose.isObjectIdOrHexString(productoId)) {
            throw errorDePedido("Uno de los productos no es válido.");
        }

        return String(productoId);
    });
}

router.post("/", verificarToken, async (req, res, next) => {
    try {
        const productosIds = normalizarItems(req.body?.items);
        const productos = await Product.find({ _id: { $in: productosIds } });
        const productosPorId = new Map(
            productos.map((producto) => [String(producto._id), producto])
        );

        const items = productosIds.map((productoId) => {
            const producto = productosPorId.get(productoId);
            if (!producto) {
                throw errorDePedido("Uno de los productos ya no está disponible.");
            }

            return {
                producto: producto._id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
            };
        });
        const total = items.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
        const pedido = await Pedido.create({ usuario: req.usuario.id, items, total });

        return res.status(201).json(pedido);
    } catch (error) {
        return next(error);
    }
});

router.get("/mis-pedidos", verificarToken, async (req, res, next) => {
    try {
        const pedidos = await Pedido.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
        return res.json(pedidos);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
