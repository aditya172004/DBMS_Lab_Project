// routes/suppliers.js
const express = require('express');
const router = express.Router();

// Get all suppliers
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  
  db.query('SELECT * FROM suppliers', (err, results) => {
    if (err) {
      console.error('Error fetching suppliers:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a single supplier by ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const supplierId = req.params.id;
  
  db.query('SELECT * FROM suppliers WHERE supplier_id = ?', [supplierId], (err, results) => {
    if (err) {
      console.error('Error fetching supplier:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(results[0]);
  });
});

// Create a new supplier
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { 
    supplier_name, 
    contact_person, 
    phone, 
    email, 
    address 
  } = req.body;
  
  if (!supplier_name) {
    return res.status(400).json({ error: 'Supplier name is required' });
  }
  
  db.query(
    'INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)',
    [supplier_name, contact_person, phone, email, address],
    (err, result) => {
      if (err) {
        console.error('Error creating supplier:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.status(201).json({
        id: result.insertId,
        supplier_name,
        contact_person,
        phone,
        email,
        address
      });
    }
  );
});

// Update a supplier
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const supplierId = req.params.id;
  const { 
    supplier_name, 
    contact_person, 
    phone, 
    email, 
    address 
  } = req.body;
  
  if (!supplier_name) {
    return res.status(400).json({ error: 'Supplier name is required' });
  }
  
  db.query(
    'UPDATE suppliers SET supplier_name = ?, contact_person = ?, phone = ?, email = ?, address = ? WHERE supplier_id = ?',
    [supplier_name, contact_person, phone, email, address, supplierId],
    (err, result) => {
      if (err) {
        console.error('Error updating supplier:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      
      res.json({
        id: supplierId,
        supplier_name,
        contact_person,
        phone,
        email,
        address
      });
    }
  );
});

// Delete a supplier
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const supplierId = req.params.id;
  
  db.query('DELETE FROM suppliers WHERE supplier_id = ?', [supplierId], (err, result) => {
    if (err) {
      console.error('Error deleting supplier:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  });
});

module.exports = router;