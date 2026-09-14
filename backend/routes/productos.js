const express = require("express");

const productos = require("../data/productos");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(productos);
});

router.get("/:id", (req, res, next) => {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
        const error = new Error("El ID del producto debe ser un número entero positivo.");
        error.status = 400;
        return next(error);
    }

    const producto = productos.find((item) => item.id === Number(id));

    if (!producto) {
        const error = new Error("Producto no encontrado.");
        error.status = 404;
        return next(error);
    }

    return res.json(producto);
});

module.exports = router;
