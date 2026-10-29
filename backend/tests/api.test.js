const assert = require("node:assert/strict");
const { after, afterEach, before, describe, test } = require("node:test");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const { connectDatabase, disconnectDatabase } = require("../config/database");
const Product = require("../models/Product");
const app = require("../app");

let mongoServer;
const productData = {
    nombre: "Mesa Andina",
    descripcion: "Mesa de madera maciza.",
    precio: 250000,
    stock: 3,
    imagenUrl: "img/mesa-andina.png",
    categoria: "Mesas",
};

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDatabase(mongoServer.getUri());
});
after(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
});
afterEach(async () => Product.deleteMany({}));

describe("Products API", () => {
    test("GET /api/productos returns MongoDB products with frontend-compatible aliases", async () => {
        const created = await Product.create(productData);
        const response = await request(app).get("/api/productos").expect(200);
        assert.equal(response.type, "application/json");
        assert.equal(response.body.length, 1);
        assert.equal(response.body[0].id, created.id);
        assert.equal(response.body[0].imagenUrl, productData.imagenUrl);
        assert.equal(response.body[0].imagen, productData.imagenUrl);
    });

    test("GET /api/productos/:id returns a product by Mongo ObjectId", async () => {
        const created = await Product.create(productData);
        const response = await request(app).get(`/api/productos/${created.id}`).expect(200);
        assert.equal(response.body.id, created.id);
        assert.equal(response.body.nombre, productData.nombre);
    });

    test("POST /api/productos creates a product with status 201", async () => {
        const response = await request(app).post("/api/productos").send(productData).expect(201);
        assert.equal(response.body.nombre, productData.nombre);
        assert.ok(response.body.id);
        assert.equal(await Product.countDocuments(), 1);
    });

    test("PUT /api/productos/:id validates, updates and returns the new product", async () => {
        const created = await Product.create(productData);
        const response = await request(app)
            .put(`/api/productos/${created.id}`)
            .send({ precio: 275000, stock: 7 })
            .expect(200);
        assert.equal(response.body.precio, 275000);
        assert.equal(response.body.stock, 7);
        assert.equal((await Product.findById(created.id)).precio, 275000);
    });

    test("DELETE /api/productos/:id removes a product with status 204", async () => {
        const created = await Product.create(productData);
        await request(app).delete(`/api/productos/${created.id}`).expect(204);
        assert.equal(await Product.countDocuments(), 0);
    });

    for (const method of ["get", "put", "delete"]) {
        test(`${method.toUpperCase()} rejects an invalid Mongo ObjectId`, async () => {
            const api = request(app);
            const response = await api[method]("/api/productos/no-es-un-id")
                .send(productData)
                .expect(400);
            assert.deepEqual(response.body, { error: "El ID del producto no es válido." });
        });
    }

    for (const method of ["get", "put", "delete"]) {
        test(`${method.toUpperCase()} returns 404 for a valid but missing product id`, async () => {
            const api = request(app);
            const response = await api[method]("/api/productos/507f1f77bcf86cd799439011")
                .send(productData)
                .expect(404);
            assert.deepEqual(response.body, { error: "Producto no encontrado." });
        });
    }

    test("POST /api/productos accepts the required course payload without imagenUrl", async () => {
        const response = await request(app)
            .post("/api/productos")
            .send({ nombre: "Cómoda", precio: 300000 })
            .expect(201);

        assert.equal(response.body.nombre, "Cómoda");
        assert.equal(response.body.precio, 300000);
        assert.equal(response.body.imagenUrl, undefined);
    });
    test("POST returns a safe 400 for Mongoose validation errors", async () => {
        const response = await request(app)
            .post("/api/productos")
            .send({ nombre: "Sin precio" })
            .expect(400);
        assert.deepEqual(response.body, { error: "Los datos del producto no son válidos." });
    });

    test("PUT returns a safe 400 when Mongoose validation fails", async () => {
        const created = await Product.create(productData);
        const response = await request(app)
            .put(`/api/productos/${created.id}`)
            .send({ precio: -1 })
            .expect(400);
        assert.deepEqual(response.body, { error: "Los datos del producto no son válidos." });
    });
});

describe("Application middleware", () => {
    test("allows requests from the local React client", async () => {
        const response = await request(app)
            .get("/api/productos")
            .set("Origin", "http://localhost:3000")
            .expect(200);
        assert.equal(response.headers["access-control-allow-origin"], "http://localhost:3000");
    });

    test("returns a JSON 404 response for unknown routes", async () => {
        const response = await request(app).get("/api/desconocida").expect(404);
        assert.deepEqual(response.body, { error: "Ruta no encontrada." });
    });

    test("the centralized error handler serializes invalid JSON errors", async () => {
        const response = await request(app)
            .post("/api/desconocida")
            .set("Content-Type", "application/json")
            .send('{"nombre":')
            .expect(400);
        assert.deepEqual(response.body, { error: "JSON inválido." });
    });
});
