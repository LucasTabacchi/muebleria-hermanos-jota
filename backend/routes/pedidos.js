const express = require("express");
const { crearPedido, listarMisPedidos } = require("../controllers/pedidosController");
const { verificarToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", verificarToken, crearPedido);
router.get("/mis-pedidos", verificarToken, listarMisPedidos);

module.exports = router;
