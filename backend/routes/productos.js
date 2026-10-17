const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");

const router = express.Router();

function invalidProductIdError() {
    const error = new Error("El ID del producto no es válido.");
    error.status = 400;
    return error;
}

function notFoundError() {
    const error = new Error("Producto no encontrado.");
    error.status = 404;
    return error;
}

function ensureValidObjectId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) {
        throw invalidProductIdError();
    }
}

router.get("/", async (req, res, next) => {
    try {
        const productos = await Product.find().sort({ createdAt: -1 });
        return res.json(productos);
    } catch (error) {
        return next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        ensureValidObjectId(req.params.id);
        const producto = await Product.findById(req.params.id);

        if (!producto) {
            throw notFoundError();
        }

        return res.json(producto);
    } catch (error) {
        return next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const producto = await Product.create(req.body);
        return res.status(201).json(producto);
    } catch (error) {
        return next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        ensureValidObjectId(req.params.id);
        const producto = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!producto) {
            throw notFoundError();
        }

        return res.json(producto);
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        ensureValidObjectId(req.params.id);
        const producto = await Product.findByIdAndDelete(req.params.id);

        if (!producto) {
            throw notFoundError();
        }

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
