const express = require("express");
const mongoose = require("mongoose");
const Categoria = require("../models/Categoria");
const Product = require("../models/Product");
const { soloAdmin, verificarToken } = require("../middleware/auth");

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

async function ensureValidCategoria(categoria) {
    if (categoria === undefined || categoria === null) {
        return;
    }

    if (!mongoose.isObjectIdOrHexString(categoria)) {
        const error = new Error("La categoría no es válida.");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await Categoria.exists({ _id: categoria });
    if (!categoriaExiste) {
        const error = new Error("La categoría no existe.");
        error.status = 400;
        throw error;
    }
}

router.get("/", async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.categoria !== undefined) {
            ensureValidObjectId(req.query.categoria);
            filtro.categoria = req.query.categoria;
        }

        const productos = await Product.find(filtro)
            .sort({ createdAt: -1 })
            .populate("categoria", "_id nombre");
        return res.json(productos);
    } catch (error) {
        return next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        ensureValidObjectId(req.params.id);
        const producto = await Product.findById(req.params.id).populate("categoria", "_id nombre");
        if (!producto) {
            throw notFoundError();
        }
        return res.json(producto);
    } catch (error) {
        return next(error);
    }
});

router.post("/", verificarToken, soloAdmin, async (req, res, next) => {
    try {
        await ensureValidCategoria(req.body.categoria);
        const producto = await Product.create(req.body);
        return res.status(201).json(producto);
    } catch (error) {
        return next(error);
    }
});

router.put("/:id", verificarToken, soloAdmin, async (req, res, next) => {
    try {
        ensureValidObjectId(req.params.id);
        await ensureValidCategoria(req.body.categoria);
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

router.delete("/:id", verificarToken, soloAdmin, async (req, res, next) => {
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
