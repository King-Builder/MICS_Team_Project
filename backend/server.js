import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; // Your MySQL pool connection file

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// GET /customers - List all customers
app.get('/customers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.email, c.phone, c.address, c.plan_id, p.name AS plan_name, c.status, c.balance
      FROM customers c
      LEFT JOIN plans p ON c.plan_id = p.id
      ORDER BY c.id ASC
    `);
    res.json({ success: true, customers: rows });
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
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, address, plan_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, address, plan_id]
    );
    res.json({ success: true, message: 'Customer added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /customers/update/:id - Update customer by ID
app.put('/customers/update/:id', async (req, res) => {
  const { id } = req.params;
  const { phone, address, plan_id, status } = req.body;

  if (!phone || !address || !plan_id || !status) {
    return res.status(400).json({ success: false, message: 'Phone, address, and plan are required' });
  }

  try {
    // Check if customer exists
    const [existing] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await pool.query(
      'UPDATE customers SET phone = ?, address = ?, plan_id = ?, status = ? WHERE id = ?',
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
    const [existing] = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/customers/payment', async (req, res) => {
  const { customerId, amount } = req.body;
    console.log('Received payment data:', req.body);

  if (!customerId || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const conn = await pool.getConnection(); // Get a dedicated connection
  try {
    await conn.beginTransaction();

    await conn.query(
      'UPDATE customers SET balance = balance - ? WHERE id = ?',
      [amount, customerId]
    );

    await conn.query(
      `INSERT INTO payments (customer_id, amount, payment_date)
       VALUES (?, ?, CURRENT_DATE)`,
      [customerId, amount]
    );

    await conn.commit(); // Commit only if both queries succeed
    res.json({ success: true });
  } catch (error) {
    await conn.rollback(); // Revert changes if any error
    console.error("Payment failed:", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  } finally {
    conn.release(); // Always release the connection
  }
});



app.post('/customers/monthly-billing', async (req, res) => {
  try {
    await pool.query(`
      UPDATE customers c
      JOIN plans p ON c.plan_id = p.id
      SET c.balance = c.balance + p.price
      WHERE c.status = 'active'
    `);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
