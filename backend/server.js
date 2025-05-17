import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; // PostgreSQL pool connection

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// GET /customers - List all customers
app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.name, c.email, c.phone, c.address, c.plan_id, p.name AS plan_name, c.status, c.balance
      FROM customers c
      LEFT JOIN plans p ON c.plan_id = p.id
      ORDER BY c.id ASC
    `);
    res.json({ success: true, customers: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /customers/add - Add new customer
app.post('/customers/add', async (req, res) => {
  const { name, email, phone, address, plan_id } = req.body;
  if (!name || !email || !phone || !address || !plan_id) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO customers (name, email, phone, address, plan_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, phone, address, plan_id]
    );
    res.json({ success: true, message: 'Customer added', id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /customers/update/:id - Update customer by ID
app.put('/customers/update/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, address, plan_id, status } = req.body;

  if (!phone || !address || !plan_id || !status) {
    return res.status(400).json({ success: false, message: 'Phone, address, plan, and status are required' });
  }

  try {
    const existing = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await pool.query(
      'UPDATE customers SET phone = $1, address = $2, plan_id = $3, status = $4 WHERE id = $5',
      [phone, address, plan_id, status, id]
    );

    res.json({ success: true, message: 'Customer updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /customers/delete/:id - Delete customer by ID
app.delete('/customers/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /customers/payment - Record a payment
app.post('/customers/payment', async (req, res) => {
  const { customerId, amount } = req.body;
  if (!customerId || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE customers SET balance = balance - $1 WHERE id = $2',
      [amount, customerId]
    );

    await client.query(
      'INSERT INTO payments (customer_id, amount, payment_date) VALUES ($1, $2, NOW())',
      [customerId, amount]
    );

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Payment failed:', error);
    res.status(500).json({ success: false, message: 'Payment failed' });
  } finally {
    client.release();
  }
});

// POST /customers/monthly-billing - Add monthly billing amount to active customers
app.post('/customers/monthly-billing', async (req, res) => {
  try {
    await pool.query(`
      UPDATE customers
      SET balance = balance + p.price
      FROM plans p
      WHERE customers.plan_id = p.id AND customers.status = 'active'
    `);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
