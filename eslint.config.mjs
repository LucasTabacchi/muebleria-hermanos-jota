import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
    {
        ignores: ["node_modules/**", "coverage/**", "dist/**", "client/build/**"],
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
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
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
    {
        files: ["backend/**/*.js"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
    {
        files: ["client/src/**/*.js"],
        ...eslint.configs.recommended,
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                process: "readonly",
            },
        },
        plugins: {
            react,
        },
        rules: {
            ...eslint.configs.recommended.rules,
            "react/jsx-uses-vars": "error",
        },
    },
    {
        files: ["client/src/**/*.test.js", "client/src/setupTests.js"],
        languageOptions: {
            globals: {
                ...globals.jest,
                global: "readonly",
            },
        },
    },
];
