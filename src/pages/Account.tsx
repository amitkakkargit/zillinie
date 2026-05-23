import { useState } from "react";
import { getOrder, getPayments, savePayment } from "../services/zillinieApi";

function Account() {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const normalizeRows = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];
    return [];
  };

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
      const apiResult = await getOrder(orderNumber.trim());
      const rows = normalizeRows(apiResult);
      if (rows.length > 0) {
        setOrderItems(rows);
        const maybeOrderId = rows[0].OrderId ?? rows[0].Id ?? null;
        setOrderId(maybeOrderId ? Number(maybeOrderId) : null);
        const maybeBalance = Number(
          rows[0].RemainingAmount ?? rows[0].Balance ?? 0,
        );
        setBalance(Number.isFinite(maybeBalance) ? maybeBalance : null);
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
      const paymentResult = await savePayment(orderId, amt);
      setMessage("Payment saved.");
      setAmountPaid("");
      if (paymentResult?.RemainingAmount != null) {
        setBalance(Number(paymentResult.RemainingAmount));
      }
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
          <div className="order-meta">
            <span>Order ID: {orderId ?? "n/a"}</span>
            {balance != null && (
              <span>Remaining balance: {balance.toFixed(2)}</span>
            )}
            {orderNumber.trim() && (
              <span className="order-actions">
                <button
                  onClick={() =>
                    window.open(
                      `/invoice?orderNumber=${encodeURIComponent(orderNumber)}`,
                      "_blank",
                    )
                  }
                >
                  View Invoice
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `/print2?orderNumber=${encodeURIComponent(orderNumber)}`,
                      "_blank",
                    )
                  }
                >
                  Print Receipt
                </button>
              </span>
            )}
          </div>
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
