const express = require('express');
const app = express();

/**
 * In-memory array of sample products
 */
const products = [
  { id: 1, name: 'Laptop', price: 999.99, archived: false },
  { id: 2, name: 'Smartphone', price: 499.99, archived: false },
  { id: 3, name: 'Headphones', price: 149.99, archived: false },
];

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
 * GET /products - Returns a list of all non-archived products
 * @returns {Array} List of products
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
 * @returns {Object} The product
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
 * @returns {Object} The created product
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
 * @returns {Object} The updated product
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
 * @returns {Object} The archived product
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
 * @returns {void} 204 No Content
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

module.exports = app;
