import eslint from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**", "coverage/**", "dist/**"],
    },
    {
        files: ["*.mjs"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.node,
        },
    },
    {
        files: ["*.cjs"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
    {
        files: ["js/**/*.js"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: globals.browser,
        },
    },
    {
        files: ["js/app.js"],
        languageOptions: {
            globals: {
                formatearPrecio: "readonly",
                obtenerProductos: "readonly",
            },
        },
    },
    {
        files: ["js/carrito-page.js"],
        languageOptions: {
            globals: {
                actualizarContadorCarrito: "readonly",
                formatearPrecio: "readonly",
                guardarCarrito: "readonly",
                obtenerCarrito: "readonly",
            },
        },
    },
    {
        files: ["js/carrito.js"],
        rules: {
            "no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^agregarProductoAlCarrito$",
                },
            ],
        },
    },
    {
        files: ["js/producto-page.js"],
        languageOptions: {
            globals: {
                agregarProductoAlCarrito: "readonly",
                formatearPrecio: "readonly",
                obtenerProductos: "readonly",
            },
        },
    },
    {
        files: ["js/productos-page.js"],
        languageOptions: {
            globals: {
                formatearPrecio: "readonly",
                obtenerProductos: "readonly",
            },
        },
    },
    {
        files: ["js/productos.js"],
        rules: {
            "no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^(obtenerProductos|formatearPrecio)$",
                },
            ],
        },
    },
    {
        files: ["tests/**/*.cjs"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
];
