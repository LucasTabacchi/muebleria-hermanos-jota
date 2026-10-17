const assert = require("node:assert/strict");
const { after, afterEach, before, describe, test } = require("node:test");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const { connectDatabase, disconnectDatabase } = require("../config/database");
const Product = require("../models/Product");

const originalLog = console.log;
const logEntries = [];
let mongoServer;

before(async () => {
    console.log = (...args) => logEntries.push(args.join(" "));
    mongoServer = await MongoMemoryServer.create();
    await connectDatabase(mongoServer.getUri());
});

after(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
    console.log = originalLog;
});

afterEach(async () => {
    await Product.deleteMany({});
});

const app = require("../app");

describe("Products API", () => {
    test("GET /api/productos responds with JSON", async () => {
        const response = await request(app).get("/api/productos").expect(200);

        assert.equal(response.type, "application/json");
        assert.ok(Array.isArray(response.body));
    });

    test("GET /api/productos/:id returns the requested product", async () => {
        const response = await request(app).get("/api/productos/4").expect(200);

        assert.equal(response.body.id, 4);
        assert.equal(response.body.nombre, "Sillón Copacabana");
    });

    for (const invalidId of ["0", "-1", "1.5", "abc"]) {
        test(`GET /api/productos/${invalidId} rejects a non-positive-integer id`, async () => {
            const response = await request(app).get(`/api/productos/${invalidId}`).expect(400);

            assert.deepEqual(response.body, {
                error: "El ID del producto debe ser un número entero positivo.",
            });
        });
    }

    test("GET /api/productos/:id returns 404 when the product is missing", async () => {
        const response = await request(app).get("/api/productos/999").expect(404);

        assert.deepEqual(response.body, { error: "Producto no encontrado." });
    });
});

describe("Product persistence harness", () => {
    test("persists rubric fields and serializes catalog-compatible aliases", async () => {
        const product = await Product.create({
            nombre: "Mesa Andina",
            descripcion: "Mesa de prueba.",
            precio: 250000,
            stock: 3,
            imagen: "img/mesa-andina.png",
            categoria: "Mesas",
            destacado: true,
        });

        const serializedProduct = product.toJSON();

        assert.equal(serializedProduct.id, product._id.toString());
        assert.equal(serializedProduct.imagenUrl, "img/mesa-andina.png");
        assert.equal(serializedProduct.imagen, "img/mesa-andina.png");
        assert.equal(serializedProduct.stock, 3);
        assert.equal(serializedProduct.destacado, true);
        assert.equal(await Product.countDocuments(), 1);
    });

    test("requires the Product fields mandated by the sprint", async () => {
        const product = new Product({ descripcion: "Sin datos requeridos." });

        await assert.rejects(product.validate(), (error) => {
            assert.ok(error.errors.nombre);
            assert.ok(error.errors.precio);
            assert.ok(error.errors.imagenUrl);
            return true;
        });
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

    test("logs the HTTP method and URL", async () => {
        logEntries.length = 0;

        await request(app).get("/api/productos/1").expect(200);

        assert.ok(logEntries.some((entry) => entry.includes("GET /api/productos/1")));
    });

    test("returns a JSON 404 response for unknown routes", async () => {
        const response = await request(app).get("/api/desconocida").expect(404);

        assert.deepEqual(response.body, { error: "Ruta no encontrada." });
    });

    test("parses JSON bodies before handling an unknown route", async () => {
        const response = await request(app)
            .post("/api/desconocida")
            .send({ nombre: "Mesa" })
            .expect(404);

        assert.equal(response.type, "application/json");
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

    test("logs requests even when their JSON body is malformed", async () => {
        logEntries.length = 0;

        await request(app)
            .post("/api/desconocida")
            .set("Content-Type", "application/json")
            .send('{"nombre":')
            .expect(400);

        assert.ok(logEntries.some((entry) => entry.includes("POST /api/desconocida")));
    });
});
