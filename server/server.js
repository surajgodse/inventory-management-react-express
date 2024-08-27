const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root@2140',
  database: 'inventory'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Fetch all products
app.get('/api/products', (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';

  if (search) {
    sql += ` AND (name LIKE '%${search}%' OR description LIKE '%${search}%')`;
  }

  if (category) {
    sql += ` AND category = '${category}'`;
  }

  if (minPrice) {
    sql += ` AND price >= ${minPrice}`;
  }

  if (maxPrice) {
    sql += ` AND price <= ${maxPrice}`;
  }

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Fetch products by search query
app.get('/api/products/search', (req, res) => {
  const { query } = req.query;
  const sql = 'SELECT * FROM products WHERE name LIKE ?';
  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Fetch all categories
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Fetch categories by search query
app.get('/api/categories/search', (req, res) => {
  const { query } = req.query;
  const sql = 'SELECT * FROM categories WHERE name LIKE ?';
  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Add new category
app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  const checkSql = 'SELECT * FROM categories WHERE name = ?';

  db.query(checkSql, [name], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.status(400).send('Category already exists');
    } else {
      const insertSql = 'INSERT INTO categories (name) VALUES (?)';
      db.query(insertSql, [name], (err, result) => {
        if (err) throw err;
        res.send(result);
      });
    }
  });
});

// Fetch product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.send(results[0]);
  });
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, quantity, price, description, category } = req.body;
  const sql = 'INSERT INTO products (name, quantity, price, description, category) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, quantity, price, description, category], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, description, category } = req.body;
  const sql = 'UPDATE products SET name = ?, quantity = ?, price = ?, description = ?, category = ? WHERE id = ?';
  db.query(sql, [name, quantity, price, description, category, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
