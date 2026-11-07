const express = require("express");
const Categoria = require("../models/Categoria");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const categorias = await Categoria.find().sort({ nombre: 1 });
        return res.json(categorias);
    } catch (error) {
        return next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const categoria = await Categoria.create(req.body);
        return res.status(201).json(categoria);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
