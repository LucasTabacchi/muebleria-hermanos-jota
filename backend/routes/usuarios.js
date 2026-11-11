const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { verificarToken } = require("../middleware/auth");
const Usuario = require("../models/Usuario");

const router = express.Router();

function datosInvalidos(res) {
    return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios." });
}

function usuarioPublico(usuario) {
    return {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
    };
}

router.post("/registro", async (req, res, next) => {
    const { nombre, email, password } = req.body ?? {};

    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password.trim()
    ) {
        return datosInvalidos(res);
    }

    try {
        const usuario = await Usuario.create({
            nombre,
            email,
            password: await bcrypt.hash(password, 10),
        });

        return res.status(201).json(usuarioPublico(usuario));
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ error: "El email ya existe." });
        }

        return next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password.trim()
    ) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    try {
        const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() });
        const credencialesValidas = usuario && (await bcrypt.compare(password, usuario.password));

        if (!credencialesValidas) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.json({ token, usuario: usuarioPublico(usuario) });
    } catch (error) {
        return next(error);
    }
});

router.get("/perfil", verificarToken, async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);

        if (!usuario) {
            return res.status(401).json({ error: "No autorizado." });
        }

        return res.json(usuarioPublico(usuario));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
