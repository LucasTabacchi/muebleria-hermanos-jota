const assert = require("node:assert/strict");
const { after, before, describe, test } = require("node:test");
const request = require("supertest");

const originalLog = console.log;
const logEntries = [];

before(() => {
    console.log = (...args) => logEntries.push(args.join(" "));
});

after(() => {
    console.log = originalLog;
});

const app = require("../app");

describe("Products API", () => {
    test("GET /api/productos returns the complete catalog", async () => {
        const response = await request(app).get("/api/productos").expect(200);

        assert.equal(response.type, "application/json");
        assert.equal(response.body.length, 11);
        assert.deepEqual(response.body[0], {
            id: 1,
            nombre: "Aparador Uspallata",
            categoria: "Muebles",
            precio: 1490000,
            descripcion:
                "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
            medidas: "180 x 45 x 75 cm",
            materiales: "Nogal macizo FSC®, herrajes de latón.",
            acabado: "Aceite natural ecológico",
            peso: "68 kg",
            capacidad: "6 compartimientos interiores",
            imagen: "img/aparador Uspallata.png",
            destacado: true,
        });
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
