const mongoose = require("mongoose");

require("dotenv").config();

let connectionPromise;

async function connectDatabase(uri = process.env.MONGODB_URI) {
    if (!uri) {
        throw new Error("MONGODB_URI es obligatoria para conectar a MongoDB.");
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(uri, { serverSelectionTimeoutMS: 5000 })
            .then(() => mongoose.connection)
            .catch((error) => {
                connectionPromise = undefined;
                throw error;
            });
    }

    return connectionPromise;
}

async function disconnectDatabase() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    connectionPromise = undefined;
}

module.exports = { connectDatabase, disconnectDatabase };
