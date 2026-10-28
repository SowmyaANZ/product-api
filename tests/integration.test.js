const request = require('supertest');
const { app, resetProducts } = require('../src/app');

/**
 * Integration tests for Product API
 */
describe('Product API Integration Tests', () => {
  beforeEach(() => {
    resetProducts();
  });

  describe('GET /products', () => {
    /**
     * Tests that all active products are returned
     */
    it('should return a list of active products', async () => {
      const res = await request(app).get('/products');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    /**
     * Tests returning a product by valid ID
     */
    it('should return a product for a valid ID', async () => {
      const res = await request(app).get('/products/1');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name');
    });

    /**
     * Tests returning 404 for invalid ID
     */
    it('should return 404 for a non-existent ID', async () => {
      const res = await request(app).get('/products/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('POST /products', () => {
    /**
     * Tests successful product creation
     */
    it('should create a new product with valid data', async () => {
      const newProduct = { name: 'Test Product', price: 10.99 };
      const res = await request(app).post('/products').send(newProduct);
      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toBe(newProduct.name);
    });

    /**
     * Tests validation error for empty name
     */
    it('should return 400 for invalid name', async () => {
      const invalidProduct = { name: '', price: 10.99 };
      const res = await request(app).post('/products').send(invalidProduct);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    /**
     * Tests validation error for invalid price
     */
    it('should return 400 for invalid price', async () => {
      const invalidProduct = { name: 'Valid Name', price: -1 };
      const res = await request(app).post('/products').send(invalidProduct);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /products/:id', () => {
    /**
     * Tests successful product update
     */
    it('should update a product for a valid ID', async () => {
      const updateData = { name: 'Updated Laptop', price: 1099.99 };
      const res = await request(app).put('/products/1').send(updateData);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(updateData.name);
    });

    /**
     * Tests 404 for non-existent product update
     */
    it('should return 404 when updating a non-existent product', async () => {
      const res = await request(app).put('/products/999').send({ name: 'Fail', price: 10 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });

    /**
     * Tests 400 for invalid update data
     */
    it('should return 400 for invalid update data', async () => {
      const res = await request(app).put('/products/1').send({ name: '', price: 10 });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PATCH /products/:id/archive', () => {
    /**
     * Tests soft archiving
     */
    it('should archive a product', async () => {
      const res = await request(app).patch('/products/2/archive');
      expect(res.statusCode).toEqual(200);
      expect(res.body.archived).toBe(true);
    });

    /**
     * Tests 404 for non-existent product archive
     */
    it('should return 404 when archiving a non-existent product', async () => {
      const res = await request(app).patch('/products/999/archive');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('DELETE /products/:id', () => {
    /**
     * Tests successful deletion
     */
    it('should delete a product', async () => {
      const res = await request(app).delete('/products/3');
      expect(res.statusCode).toEqual(204);
    });

    /**
     * Tests 404 for non-existent product deletion
     */
    it('should return 404 when deleting a non-existent product', async () => {
      const res = await request(app).delete('/products/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });
});
