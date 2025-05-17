import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Add Customer
router.post('/add', async (req, res) => {
  const { customer_name, email, phone, address, plan } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO customers (customer_name, email, phone, address, plan) VALUES (?, ?, ?, ?, ?)`,
      [customer_name, email, phone, address, plan]
    );
    res.json({ success: true, message: 'Customer added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
