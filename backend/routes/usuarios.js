const bcrypt = require("bcrypt");
const express = require("express");
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

module.exports = router;
