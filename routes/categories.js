// routes/categories.js
const express = require('express');
const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
  const db = req.app.locals.db;  
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a single category by ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const categoryId = req.params.id;
  
  db.query('SELECT * FROM categories WHERE category_id = ?', [categoryId], (err, results) => {
    if (err) {
      console.error('Error fetching category:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(results[0]);
  });
});

// Create a new category
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { category_name, description } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  db.query(
    'INSERT INTO categories (category_name, description) VALUES (?, ?)',
    [category_name, description],
    (err, result) => {
      if (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.status(201).json({
        id: result.insertId,
        category_name,
        description
      });
    }
  );
});

// Update a category
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const categoryId = req.params.id;
  const { category_name, description } = req.body;
  
  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  db.query(
    'UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?',
    [category_name, description, categoryId],
    (err, result) => {
      if (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({
        id: categoryId,
        category_name,
        description
      });
    }
  );
});

// Delete a category
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const categoryId = req.params.id;
  
  db.query('DELETE FROM categories WHERE category_id = ?', [categoryId], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  });
});

module.exports = router;