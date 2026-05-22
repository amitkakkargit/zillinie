import { useState } from "react";
import { getPayments, savePayment } from "../services/zillinieApi";

function Payments() {
  const [orderId, setOrderId] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const loadPayments = async () => {
    setMessage("");
    try {
      const data = await getPayments(orderId);
      setPayments(data);
    } catch {
      setMessage("Could not load payments.");
    }
  };

  const submitPayment = async () => {
    setMessage("");
    try {
      await savePayment(orderId, amountPaid);
      setMessage("Payment saved.");
      await loadPayments();
    } catch {
      setMessage("Could not save payment.");
    }
  };

  return (
    <div className="page payments-page">
      <h1>Payments</h1>
      <div className="form-row">
        <label>
          Order ID
          <input
            type="number"
            value={orderId || ""}
            onChange={(e) => setOrderId(Number(e.target.value))}
          />
        </label>
        <label>
          Amount Paid
          <input
            type="number"
            value={amountPaid || ""}
            onChange={(e) => setAmountPaid(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="button-row">
        <button onClick={loadPayments}>Load payments</button>
        <button onClick={submitPayment}>Save payment</button>
      </div>
      {message && <p className="info-message">{message}</p>}
      {payments.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(payments[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                {Object.values(payment).map((value, valueIndex) => (
                  <td key={valueIndex}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Payments;
