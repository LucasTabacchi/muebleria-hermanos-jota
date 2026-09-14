const cors = require("cors");
const express = require("express");

const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/logger");
const notFoundHandler = require("./middleware/notFound");
const productosRouter = require("./routes/productos");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(requestLogger);
app.use(express.json());

app.use("/api/productos", productosRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
