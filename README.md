# Hermanos Jota Furniture Store

Sprint 2 frontend-only ecommerce project for Hermanos Jota, a furniture brand.
The site simulates a shopping experience entirely in the browser; there is no
backend, real checkout, payment processing, or message delivery service.

## Features

- Home page with brand presentation and four dynamically loaded featured products.
- Searchable catalog with 11 products and links to individual product pages.
- Product details with images, descriptions, specifications, prices, and cart actions.
- Simulated cart with a header counter, item removal, and browser persistence.
- Contact form with client-side validation and an on-page success message.
- Responsive layouts, semantic HTML, and simulated asynchronous catalog loading.

## Technologies

- HTML5, external CSS3 stylesheets, and Flexbox.
- Vanilla JavaScript, DOM updates, events, and arrays of product objects.
- Promises and `setTimeout` to simulate data loading.
- `localStorage` for the simulated cart.

No framework, package installation, or build step is required to run the site.

## Run locally

From the repository root, with Python 3 installed:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open [the local site](http://127.0.0.1:8000) in a browser. Stop the server with
`Ctrl+C`. Keep the same address and port when checking cart persistence.

## Repository structure

```text
index.html             Home page
productos.html         Product catalog
producto.html          Product details (selected by URL parameter)
contacto.html          Contact form
carrito.html           Simulated cart
css/styles.css         Shared styles and responsive layouts
js/productos.js        Local catalog and price formatting
js/                    Page behavior and cart logic
img/                   Product and brand images
tests/productos.test.cjs Catalog regression tests
```

## Verification

Optional development tests require Node.js 18 or later, with no dependencies:

```sh
node --test tests/productos.test.cjs
```

Manual browser checks:

1. At widths of 320, 375, 600, 768, and 1440 pixels, check every page for horizontal
   overflow and confirm that all navigation links and the cart counter are visible.
2. Check featured products, catalog search, and links to product details.
3. Confirm that detail images show the whole product without cropping.
4. Check Uspallata materials and Recoleta load capacity and adjustable shelves.
5. Add products, navigate between pages, reload, and remove products from the cart.
6. Submit invalid and valid contact data; confirm validation and simulated success.

## Team

The sprint requires five members. The complete five-member roster is awaiting
confirmation and must be added before delivery. Each member must contribute real
work recorded in the repository history; this documentation does not certify that
the contribution requirement is already satisfied.

## Deployment status

A verified public deployment URL is pending. Before delivery, publish the static
site to a hosting service, add its URL here, and repeat the browser checks there.
Deployment and complete team participation remain delivery tasks.
