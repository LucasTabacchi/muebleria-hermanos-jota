const path = require("node:path");
const dotenv = require("dotenv");

// Load backend configuration regardless of the directory used to start Node.
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = require("./app");
const { connectDatabase } = require("./config/database");

const port = process.env.PORT || 3001;
const host = "0.0.0.0";

async function startServer() {
    await connectDatabase();

    return app.listen(port, host, () => {
        console.log(`API disponible en http://${host}:${port}`);
    });
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("No se pudo iniciar la API:", error.message);
        process.exitCode = 1;
    });
}

module.exports = { startServer };
