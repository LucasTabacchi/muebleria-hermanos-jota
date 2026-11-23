const Categoria = require("../models/Categoria");

async function listarCategorias(req, res, next) {
    try {
        return res.json(await Categoria.find().sort({ nombre: 1 }));
    } catch (error) {
        return next(error);
    }
}

async function crearCategoria(req, res, next) {
    try {
        return res.status(201).json(await Categoria.create(req.body));
    } catch (error) {
        return next(error);
    }
}

module.exports = { crearCategoria, listarCategorias };
