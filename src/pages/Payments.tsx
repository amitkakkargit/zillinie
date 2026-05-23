import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPayments, savePayment } from "../services/zillinieApi";

function Payments() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [payments, setPayments] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const orderParam = Number(searchParams.get("orderId") ?? 0);
    if (orderParam > 0) {
      setOrderId(orderParam);
      void loadPayments(orderParam);
    }
  }, [searchParams]);

  const loadPayments = async (id: number = orderId) => {
    setMessage("");
    if (!id || id <= 0) {
      setMessage("Enter a valid order ID to load payments.");
      return;
    }
    try {
      const data = await getPayments(id);
      setPayments(data);
    } catch {
      setMessage("Could not load payments.");
    }
  };

  const submitPayment = async () => {
    setMessage("");
    if (!orderId || orderId <= 0) {
      setMessage("Enter a valid order ID before saving payment.");
      return;
    }
    if (!amountPaid || amountPaid <= 0) {
      setMessage("Enter a valid payment amount.");
      return;
    }
    try {
      await savePayment(orderId, amountPaid);
      setMessage("Payment saved.");
      await loadPayments(orderId);
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
        <button onClick={() => void loadPayments()}>Load payments</button>
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
