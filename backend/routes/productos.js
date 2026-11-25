const express = require("express");
const {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    listarProductos,
    obtenerProducto,
} = require("../controllers/productosController");
const { soloAdmin, verificarToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", listarProductos);
router.get("/:id", obtenerProducto);
router.post("/", verificarToken, soloAdmin, crearProducto);
router.put("/:id", verificarToken, soloAdmin, actualizarProducto);
router.delete("/:id", verificarToken, soloAdmin, eliminarProducto);

module.exports = router;
