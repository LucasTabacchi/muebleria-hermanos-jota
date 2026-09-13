const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = readFileSync(path.join(__dirname, "../js/productos.js"), "utf8");
const products = vm.runInNewContext(`${source}\nPRODUCTOS;`);

test("Uspallata materials match the supplied catalog", () => {
    const product = products.find(({ id }) => id === 1);
    assert.equal(product.materiales, "Nogal macizo FSC®, herrajes de latón.");
});

test("Recoleta distinguishes shelf load capacity from furniture weight", () => {
    const product = products.find(({ id }) => id === 2);
    assert.equal(product.capacidad, "45 kg por estante");
    assert.equal(product.modulares, "5 estantes ajustables");
    assert.equal(Object.hasOwn(product, "peso"), false);
});
