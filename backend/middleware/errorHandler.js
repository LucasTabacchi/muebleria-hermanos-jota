function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({ error: "JSON inválido." });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ error: "Los datos del producto no son válidos." });
    }

    if (error.name === "CastError") {
        return res.status(400).json({ error: "El ID del producto no es válido." });
    }

    const status = error.status ?? 500;
    const message = status === 500 ? "Ocurrió un error interno." : error.message;

    return res.status(status).json({ error: message });
}

module.exports = errorHandler;
