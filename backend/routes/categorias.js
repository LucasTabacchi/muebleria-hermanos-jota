const express = require("express");
const { crearCategoria, listarCategorias } = require("../controllers/categoriasController");

const router = express.Router();

router.get("/", listarCategorias);
router.post("/", crearCategoria);

module.exports = router;
