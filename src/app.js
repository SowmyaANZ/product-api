const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const app = express();

const products = [
  { id: 1, name: 'Laptop', price: 999.99, archived: false },
  { id: 2, name: 'Smartphone', price: 499.99, archived: false },
  { id: 3, name: 'Headphones', price: 149.99, archived: false },
];

/**
 * Resets the in-memory product data to its initial state
 * @returns {void}
 */
const resetProducts = () => {
  products.length = 0;
  products.push(
    { id: 1, name: 'Laptop', price: 999.99, archived: false },
    { id: 2, name: 'Smartphone', price: 499.99, archived: false },
    { id: 3, name: 'Headphones', price: 149.99, archived: false },
  );
};

/**
 * Validates product data
 * @param {Object} product - The product data to validate
 * @returns {string|null} Error message or null if valid
 */
const validateProduct = (product) => {
  const { name, price } = product;
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Name must be a non-empty string';
  }
  if (typeof price !== 'number' || price <= 0) {
    return 'Price must be a positive number';
  }
  return null;
};

app.use(express.json());

/**
 * Serves OpenAPI documentation via Swagger UI
 */
const openapiSpec = yaml.parse(fs.readFileSync(path.join(__dirname, '../openapi.yaml'), 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

/**
 * GET /products - Returns a list of all non-archived products
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.get('/products', async (req, res) => {
  try {
    const activeProducts = products.filter((p) => !p.archived);
    res.json(activeProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /products/:id - Returns a product by id
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /products - Adds a new product
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.post('/products', async (req, res) => {
  try {
    const validationError = validateProduct(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, price } = req.body;
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      archived: false,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * PUT /products/:id - Updates an existing product
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const validationError = validateProduct(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { name, price } = req.body;
    const updatedProduct = { id, name, price, archived: products[productIndex].archived };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * PATCH /products/:id/archive - Soft archives a product
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.patch('/products/:id/archive', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.archived = true;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /products/:id - Permanently deletes a product
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
app.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { app, resetProducts };
