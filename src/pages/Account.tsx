import { useState } from "react";
import { getOrder, getPayments, savePayment } from "../services/zillinieApi";

function Account() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrder = async () => {
    setError("");
    setMessage("");
    setOrderItems([]);
    setPayments([]);
    setOrderId(null);

    if (!orderNumber.trim()) {
      setError("Enter an order number.");
      return;
    }

    try {
      const data = await getOrder(orderNumber.trim());
      if (Array.isArray(data) && data.length > 0) {
        setOrderItems(data);
        // try to infer order id from first row
        const maybeOrderId = data[0].OrderId ?? data[0].Id ?? null;
        setOrderId(maybeOrderId ? Number(maybeOrderId) : null);
        if (maybeOrderId) {
          const pays = await getPayments(Number(maybeOrderId));
          setPayments(pays ?? []);
        }
      } else {
        setError("No order data found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load order.");
    }
  };

  const submitPayment = async () => {
    setError("");
    setMessage("");
    if (!orderId) {
      setError("Load an order before adding a payment.");
      return;
    }
    const amt = Number(amountPaid);
    if (!amt || amt <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    try {
      await savePayment(orderId, amt);
      setMessage("Payment saved.");
      setAmountPaid("");
      const pays = await getPayments(orderId);
      setPayments(pays ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to save payment.");
    }
  };

  return (
    <div className="page account-page">
      <h1>Account / Payments</h1>

      <div className="field-group">
        <label>Order number</label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number"
        />
        <button onClick={loadOrder}>Load order</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {orderItems.length > 0 && (
        <section>
          <h2>Order items</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(orderItems[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderItems.map((row, i) => (
                <tr key={i}>
                  {Object.keys(orderItems[0]).map((k) => (
                    <td key={k}>{String(row[k] ?? "-")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section>
        <h2>Payments</h2>
        <div className="field-group">
          <label>Amount</label>
          <input
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="Amount"
          />
          <button onClick={submitPayment}>Save payment</button>
        </div>

        {payments.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(payments[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx}>
                  {Object.keys(payments[0]).map((k) => (
                    <td key={k}>{String(p[k] ?? "-")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No payments recorded.</p>
        )}
      </section>
    </div>
  );
}

export default Account;
