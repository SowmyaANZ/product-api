const express = require('express');
const app = express();

/**
 * In-memory array of sample products
 */
const products = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 499.99 },
  { id: 3, name: 'Headphones', price: 149.99 },
];

app.use(express.json());

/**
 * GET /products - Returns a list of all products
 * @returns {Array} List of products
 */
app.get('/products', async (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
