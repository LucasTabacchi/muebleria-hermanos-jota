const assert = require("node:assert/strict");
const { after, before, beforeEach, describe, test } = require("node:test");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require("../config/database");
const Pedido = require("../models/Pedido");
const Product = require("../models/Product");
const Usuario = require("../models/Usuario");
const app = require("../app");

process.env.JWT_SECRET = "test-pedidos-secret";

let mongoServer;
let cliente;
let otroCliente;
let producto;
let tokenCliente;

function tokenPara(usuario) {
    return jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectDatabase(mongoServer.getUri());
});

beforeEach(async () => {
    await Promise.all([Pedido.deleteMany({}), Product.deleteMany({}), Usuario.deleteMany({})]);

    cliente = await Usuario.create({
        nombre: "Cliente de prueba",
        email: "cliente@pedidos.test",
        password: "hash-de-prueba",
    });
    otroCliente = await Usuario.create({
        nombre: "Otro cliente",
        email: "otro@pedidos.test",
        password: "hash-de-prueba",
    });
    producto = await Product.create({ nombre: "Mesa de prueba", precio: 120000, stock: 3 });
    tokenCliente = tokenPara(cliente);
});

after(async () => {
    await disconnectDatabase();
    await mongoServer.stop();
});

describe("Pedidos API", () => {
    test("requires a JWT to create an order", async () => {
        await request(app)
            .post("/api/pedidos")
            .send({ items: [{ productoId: producto._id }] })
            .expect(401);
    });

    test("creates an order linked to the authenticated user with server-side prices", async () => {
        const response = await request(app)
            .post("/api/pedidos")
            .set("Authorization", `Bearer ${tokenCliente}`)
            .send({ items: [{ productoId: producto._id, precio: 1, nombre: "Manipulado" }] })
            .expect(201);

        assert.equal(String(response.body.usuario), String(cliente._id));
        assert.equal(response.body.items.length, 1);
        assert.equal(String(response.body.items[0].producto), String(producto._id));
        assert.equal(response.body.items[0].nombre, producto.nombre);
        assert.equal(response.body.items[0].precio, producto.precio);
        assert.equal(response.body.total, producto.precio);
    });

    test("does not create an order for an empty cart", async () => {
        const response = await request(app)
            .post("/api/pedidos")
            .set("Authorization", `Bearer ${tokenCliente}`)
            .send({ items: [] })
            .expect(400);

        assert.deepEqual(response.body, { error: "El pedido debe incluir al menos un producto." });
    });

    test("returns only the authenticated user's orders", async () => {
        await Pedido.create({
            usuario: cliente._id,
            items: [{ producto: producto._id, nombre: producto.nombre, precio: producto.precio }],
            total: producto.precio,
        });
        await Pedido.create({
            usuario: otroCliente._id,
            items: [{ producto: producto._id, nombre: producto.nombre, precio: producto.precio }],
            total: producto.precio,
        });

        const response = await request(app)
            .get("/api/pedidos/mis-pedidos")
            .set("Authorization", `Bearer ${tokenCliente}`)
            .expect(200);

        assert.equal(response.body.length, 1);
        assert.equal(String(response.body[0].usuario), String(cliente._id));
    });
});
