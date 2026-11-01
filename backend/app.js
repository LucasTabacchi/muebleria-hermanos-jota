const cors = require("cors");
const express = require("express");

const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/logger");
const notFoundHandler = require("./middleware/notFound");
const productosRouter = require("./routes/productos");

const allowedOrigins = new Set(
    [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://muebleria-hermanosjota.netlify.app",
        process.env.FRONTEND_URL,
    ].filter(Boolean)
);

const app = express();

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origen no permitido por CORS."));
        },
    })
);
app.use(requestLogger);
app.use(express.json());

app.use("/api/productos", productosRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
