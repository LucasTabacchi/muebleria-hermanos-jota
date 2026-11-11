const jwt = require("jsonwebtoken");

function respuestaNoAutorizado(res) {
    return res.status(401).json({ error: "No autorizado." });
}

function verificarToken(req, res, next) {
    const authorization = req.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return respuestaNoAutorizado(res);
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        return respuestaNoAutorizado(res);
    }

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return respuestaNoAutorizado(res);
    }
}

module.exports = { verificarToken };
