# Product API

A simple RESTful API for managing a product catalog, built with Node.js and Express.

## Features
- Full CRUD operations for products.
- Soft-archiving capability to hide products without deleting them.
- Input validation for product names and prices.
- Integration test suite using Jest and Supertest.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd product-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Running the Server
To start the server in development mode:
```bash
npm start
```
The server will start on `http://localhost:3000` by default.

### Running Tests
To execute the integration test suite:
```bash
npm test
```

## API Reference

| Method | Path | Description | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/products` | List all non-archived products | `200` | `500` |
| `GET` | `/products/:id` | Get a specific product by ID | `200` | `404`, `500` |
| `POST` | `/products` | Create a new product | `201` | `400`, `500` |
| `PUT` | `/products/:id` | Update an existing product | `200` | `400`, `404`, `500` |
| `PATCH` | `/products/:id/archive` | Soft-archive a product | `200` | `404`, `500` |
| `DELETE` | `/products/:id` | Permanently delete a product | `204` | `404`, `500` |

### Error Response Format
All API errors return a JSON body in the following shape:
```json
{
  "error": "Detailed error message"
}
```
