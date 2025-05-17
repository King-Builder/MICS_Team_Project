import React, { useEffect, useState } from "react";
import '../style/style.css'


const CustomerDashboard = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    plan_id: "",
  });
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://mics-backend.onrender.com/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      } else {
        setMessage("Failed to load customers.");
      }
    } catch {
      setMessage("Error fetching customers.");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("https://mics-backend.onrender.com/customers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Customer added successfully!");
        setForm({ name: "", email: "", phone: "", address: "", plan_id: "" });
        fetchCustomers();
      } else {
        setMessage(`Add failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`Add error: ${err.message}`);
    }
  };

  const openUpdateModal = (customer) => {
    setUpdateId(customer.id);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      plan_id: customer.plan_id,
      status: customer.status,
    });
    setIsUpdateOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateOpen(false);
    setUpdateId(null);
    setForm({ name: "", email: "", phone: "", address: "", plan_id: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`https://mics-backend.onrender.com/customers/update/${updateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Customer updated successfully!");
        closeUpdateModal();
        fetchCustomers();
      } else {
        setMessage(`Update failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`Update error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setMessage(null);
    try {
      const res = await fetch(`https://mics-backend.onrender.com/customers/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Customer deleted.");
        fetchCustomers();
      } else {
        setMessage(`Delete failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setMessage(`Delete error: ${err.message}`);
    }
  };



const [paymentForm, setPaymentForm] = useState({
  customerId: "",
  amount: "",
});

const handlePaymentChange = (e) => {
  setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
};



const handlePaymentSubmit = async (e) => {
  e.preventDefault();

  const data = {
    customerId: paymentForm.customerId,
    amount: Number(paymentForm.amount),
  };

  const res = await fetch('https://mics-backend.onrender.com/customers/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!json.success) {
    alert("Payment failed: " + json.message);
  } else {
    alert("Payment successful!");
    setPaymentForm({ customerId: "", amount: "" });
    setSelectedCustomer(null);
    setSearchText("");
  }
};

const handleMonthlyBilling = async () => {
  if (!window.confirm("Apply monthly bills to all customers?")) return;
  try {
    const res = await fetch("https://mics-backend.onrender.com/customers/monthly-billing", {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Monthly bills applied.");
      fetchCustomers();
    } else {
      setMessage("Billing failed.");
    }
  } catch (err) {
    setMessage("Error applying billing.");
  }
};



const [searchText, setSearchText] = React.useState('');
const [filteredCustomers, setFilteredCustomers] = React.useState(customers);
const [selectedCustomer, setSelectedCustomer] = React.useState(null);
const [showDropdown, setShowDropdown] = React.useState(false);
function handleSearchChange(e) {
  const text = e.target.value;
  setSearchText(text);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(text.toLowerCase())
  );
  setFilteredCustomers(filtered);
  setShowDropdown(true);
}
function handleSelectCustomer(customer) {
  setSelectedCustomer(customer);
  setSearchText(customer.name);
  setShowDropdown(false);
  setPaymentForm((prev) => ({
    ...prev,
    customerId: customer.id.toString(),
  }));
}





 const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('https://mics-backend.onrender.com/customers/payments');
        const data = await response.json();

        if (data.success) {
          setPayments(data.payments);
        } else {
          setError('Failed to fetch payments');
        }
      } catch (err) {
        console.error(err);
        setError('Server error while fetching payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);




  return (

    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a href="#add-customer">Add Customer</a>
          <a href="#customer-records">Customer Records</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        {/* Add Customer Section */}
        <section id="add-customer" className="section-add-customer">
          <h2 className="section-title">Add Customer</h2>
          <form onSubmit={handleAdd} className="customer-form">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />
            <select name="plan_id" value={form.plan_id} onChange={handleChange} required>
              <option value="">Select a plan</option>
              <option value="1">Starter Plan</option>
              <option value="2">Family Plan</option>
              <option value="3">Pro Plan</option>
              <option value="4">Elite Plan</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </section>

        {/* Customer Records Section */}
        <section id="customer-records" className="section-customer-records" style={{ marginTop: "50px" }}>
          <h2 className="section-title">Customer Records</h2>
          <div className="records-container">
            {customers.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic" }}>
                List of customers will appear here.
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Balance</th> 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td>{c.address}</td>
                      <td>{c.plan_name}</td>
                      <td>{c.status}</td>
                        <td>{c.balance}</td> 
                      <td className="action-buttons">
                        <button
                          onClick={() => openUpdateModal(c)}
                          className="edit-btn"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="delete-btn"
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>


<section id="payment-form">
  <h2>Record Payment</h2>
  <form onSubmit={handlePaymentSubmit} className="payment-form">
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Customer"
        value={searchText}
        onChange={handleSearchChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        required={!selectedCustomer}
        className="search-input"
      />
      {showDropdown && filteredCustomers.length > 0 && (
        <ul className="dropdown-list">
          {filteredCustomers.map((c) => (
            <li
              key={c.id}
              onClick={() => handleSelectCustomer(c)}
              className={
                selectedCustomer?.id === c.id
                  ? "dropdown-item selected"
                  : "dropdown-item"
              }
              onMouseDown={(e) => e.preventDefault()} // prevent blur on click
            >
              {c.name} (₱{Number(c.balance).toFixed(2)})
            </li>
          ))}
        </ul>
      )}
    </div>

    <input class="amount-input"
      type="number"
      step="0.01"
      name="amount"
      placeholder="Amount (positive or negative)"
      value={paymentForm.amount}
      onChange={handlePaymentChange}
      required
    />
    <button type="submit"  class="amount-button">Submit Payment</button>
  </form>

  <button
    onClick={handleMonthlyBilling}
    style={{
      marginTop: "20px",
      backgroundColor: "#700B97",
      color: "white",
      padding: "10px 20px",
      border: "none",
      cursor: "pointer",
    }}
  >
    Apply Monthly Billing
  </button>




    <div className="payments-section">
      <h2 className="payments-title">Customer Payments</h2>

      {loading ? (
        <p className="payments-loading">Loading payments...</p>
      ) : error ? (
        <p className="payments-error">{error}</p>
      ) : payments.length === 0 ? (
        <p className="payments-empty">No payments found.</p>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.customer_name}</td>
                  <td>${payment.amount}</td>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td>{payment.method}</td>
                  <td>{payment.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
</section>

      </main>

      {/* Update Modal */}
      {isUpdateOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Update Customer</h2>
      <form onSubmit={handleUpdate}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled
        />
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <label>Plan</label>
        <select name="plan_id" value={form.plan_id} onChange={handleChange} required>
          <option value="">Select a plan</option>
          <option value="1">Starter Plan</option>
          <option value="2">Family Plan</option>
          <option value="3">Pro Plan</option>
          <option value="4">Elite Plan</option>
        </select>
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="">Select status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="modal-buttons">
          <button type="button" onClick={closeUpdateModal} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="update-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      


      




      {/* Message */}
      {message && <div className="message-toast">{message}</div>}
    </div>
  );
};

export default CustomerDashboard;
