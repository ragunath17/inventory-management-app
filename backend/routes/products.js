const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const upload = multer({ dest: 'uploads/' });

// Get all products (with optional search & filter)
router.get('/', (req, res) => {
    const { name, category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (name || category) {
        query += ' WHERE ';
        const conditions = [];
        if (name) { conditions.push('name LIKE ?'); params.push(`%${name}%`); }
        if (category) { conditions.push('category = ?'); params.push(category); }
        query += conditions.join(' AND ');
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add new product
router.post('/',
    body('name').notEmpty(),
    body('stock').isInt(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, unit, category, brand, stock, status } = req.body;
        db.run(
            'INSERT INTO products (name, unit, category, brand, stock, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, unit, category, brand, stock, stock > 0 ? 'In Stock' : 'Out of Stock'],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID, message: 'Product added' });
            }
        );
    }
);

// Update product
router.put('/:id',
    body('stock').isInt(),
    body('name').notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { id } = req.params;
        const { name, stock, unit, category, brand, status } = req.body;

        db.get('SELECT * FROM products WHERE id=?', [id], (err, product) => {
            if (err || !product) return res.status(404).json({ error: 'Product not found' });

            if (product.stock !== stock) {
                db.run(
                    'INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date) VALUES (?, ?, ?, ?)',
                    [id, product.stock, stock, new Date().toISOString()]
                );
            }

            db.run(
                'UPDATE products SET name=?, stock=?, unit=?, category=?, brand=?, status=? WHERE id=?',
                [name, stock, unit, category, brand, stock > 0 ? 'In Stock' : 'Out of Stock', id],
                function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Product updated' });
                }
            );
        });
    }
);

// Delete product
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM products WHERE id=?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted' });
    });
});

// Get inventory history
router.get('/:id/history', (req, res) => {
    const { id } = req.params;
    db.all(
        'SELECT * FROM inventory_history WHERE product_id=? ORDER BY change_date DESC',
        [id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Import CSV
router.post('/import', upload.single('csvFile'), (req, res) => {
    const results = [];
    const added = [];
    const skipped = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', data => results.push(data))
        .on('end', () => {
            results.forEach(p => {
                db.get('SELECT id FROM products WHERE name=?', [p.name], (err, row) => {
                    if (row) skipped.push(p.name);
                    else db.run(
                        'INSERT INTO products (name, unit, category, brand, stock, status) VALUES (?, ?, ?, ?, ?, ?)',
                        [p.name, p.unit, p.category, p.brand, parseInt(p.stock || 0), p.stock > 0 ? 'In Stock' : 'Out of Stock'],
                        () => added.push(p.name)
                    );
                });
            });
            res.json({ added, skipped });
        });
});

// Export CSV
router.get('/export', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        let csvData = 'id,name,unit,category,brand,stock,status\n';
        rows.forEach(r => csvData += `${r.id},${r.name},${r.unit},${r.category},${r.brand},${r.stock},${r.status}\n`);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
        res.send(csvData);
    });
});

module.exports = router;
