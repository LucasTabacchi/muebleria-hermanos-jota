const express = require("express");
const {
    iniciarSesion,
    obtenerPerfil,
    registrarUsuario,
} = require("../controllers/usuariosController");
const { verificarToken } = require("../middleware/auth");

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);
router.get("/perfil", verificarToken, obtenerPerfil);

module.exports = router;
