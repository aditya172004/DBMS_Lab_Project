// routes/products.js
const express = require('express');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  const db = req.app.locals.db;
//   console.log("adhasd : ",db);
  const query = `
    SELECT p.*, c.category_name, s.supplier_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a single product by ID
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const productId = req.params.id;
  
  const query = `
    SELECT p.*, c.category_name, s.supplier_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.product_id = ?
  `;
  
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(results[0]);
  });
});

// Create a new product
router.post('/', (req, res) => {
  const db = req.app.locals.db;
  const { 
    product_name, 
    category_id, 
    supplier_id, 
    sku, 
    quantity, 
    unit_price, 
    reorder_level, 
    description 
  } = req.body;
  
  if (!product_name) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  db.query(
    `INSERT INTO products 
    (product_name, category_id, supplier_id, sku, quantity, unit_price, reorder_level, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [product_name, category_id, supplier_id, sku, quantity, unit_price, reorder_level, description],
    (err, result) => {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.status(201).json({
        id: result.insertId,
        product_name,
        category_id,
        supplier_id,
        sku,
        quantity,
        unit_price,
        reorder_level,
        description
      });
    }
  );
});

// -----------------------------------------------------------------------------------------------------

router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const productId = req.params.id;
    const { 
      product_name, 
      category_id, 
      supplier_id, 
      sku, 
      quantity, 
      unit_price, 
      reorder_level, 
      description 
    } = req.body;
    
    if (!product_name) {
      return res.status(400).json({ error: 'Product name is required' });
    }
    
    // Convert empty strings to null for optional fields
    const params = [
      product_name,
      category_id || null,
      supplier_id || null,
      sku || null,
      quantity || 0,
      unit_price || 0,
      reorder_level || 0,
      description || null,
      productId
    ];
  
    db.query(
      `UPDATE products SET 
      product_name = ?, 
      category_id = ?, 
      supplier_id = ?, 
      sku = ?, 
      quantity = ?, 
      unit_price = ?, 
      reorder_level = ?, 
      description = ? 
      WHERE product_id = ?`,
      params,
      (err, result) => {
        if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({
          id: productId,
          product_name,
          category_id,
          supplier_id,
          sku,
          quantity,
          unit_price,
          reorder_level,
          description
        });
      }
    );
  });

// -------------------------------------------------------------------------------------------------------------------

// // Update a product
// router.put('/:id', (req, res) => {
//   const db = req.app.locals.db;
//   const productId = req.params.id;
//   const { 
//     product_name, 
//     category_id, 
//     supplier_id, 
//     sku, 
//     quantity, 
//     unit_price, 
//     reorder_level, 
//     description 
//   } = req.body;
  
//   if (!product_name) {
//     return res.status(400).json({ error: 'Product name is required' });
//   }
  
//   db.query(
//     `UPDATE products SET 
//     product_name = ?, 
//     category_id = ?, 
//     supplier_id = ?, 
//     sku = ?, 
//     quantity = ?, 
//     unit_price = ?, 
//     reorder_level = ?, 
//     description = ? 
//     WHERE product_id = ?`,
//     [product_name, category_id, supplier_id, sku, quantity, unit_price, reorder_level, description, productId],
//     (err, result) => {
//       if (err) {
//         console.error('Error updating product:', err);
//         return res.status(500).json({ error: 'Database error' });
//       }
      
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
      
//       res.json({
//         id: productId,
//         product_name,
//         category_id,
//         supplier_id,
//         sku,
//         quantity,
//         unit_price,
//         reorder_level,
//         description
//       });
//     }
//   );
// });

// Delete a product
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const productId = req.params.id;
  
  db.query('DELETE FROM products WHERE product_id = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

module.exports = router;