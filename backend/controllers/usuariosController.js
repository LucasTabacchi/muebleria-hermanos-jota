const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

function datosInvalidos(res) {
    return res.status(400).json({ error: "Nombre, email y contraseña son obligatorios." });
}

function passwordSegura(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9\s]/.test(password);
}

function passwordInsegura(res) {
    return res
        .status(400)
        .json({
            error: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.",
        });
}

function usuarioPublico(usuario) {
    return { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
}

async function registrarUsuario(req, res, next) {
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
    if (!passwordSegura(password)) return passwordInsegura(res);
    try {
        const usuario = await Usuario.create({
            nombre,
            email,
            password: await bcrypt.hash(password, 10),
        });
        return res.status(201).json(usuarioPublico(usuario));
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ error: "El email ya existe." });
        return next(error);
    }
}

async function iniciarSesion(req, res, next) {
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
        if (!credencialesValidas) return res.status(401).json({ error: "Credenciales inválidas" });
        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({ token, usuario: usuarioPublico(usuario) });
    } catch (error) {
        return next(error);
    }
}

async function obtenerPerfil(req, res, next) {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        if (!usuario) return res.status(401).json({ error: "No autorizado." });
        return res.json(usuarioPublico(usuario));
    } catch (error) {
        return next(error);
    }
}

module.exports = { iniciarSesion, obtenerPerfil, registrarUsuario };
