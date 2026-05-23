import { useState, useRef } from "react";
import { getInvoice } from "../services/zillinieApi";

function Invoice() {
  const [orderNumber, setOrderNumber] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    setError("");
    setRows([]);
    if (!orderNumber.trim()) {
      setError("Enter order number");
      return;
    }
    try {
      const data = await getInvoice(orderNumber.trim());
      if (Array.isArray(data) && data.length > 0) {
        setRows(data);
      } else {
        setError("No invoice data found");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load invoice");
    }
  };

  const doPrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><title>Invoice ${orderNumber}</title>`,
    );
    w.document.write(
      `<style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px}</style>`,
    );
    w.document.write("</head><body>");
    w.document.write(printRef.current.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div className="page invoice-page">
      <h1>Invoice</h1>
      <div className="field-group">
        <label>Order number</label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={load}>Load</button>
        <button onClick={doPrint} disabled={rows.length === 0}>
          Print
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      <div ref={printRef}>
        {rows.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {Object.keys(rows[0]).map((k) => (
                    <td key={k}>{String(r[k] ?? "-")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Invoice;
import { useState } from "react";
import { getInvoice } from "../services/zillinieApi";

function Invoice() {
  const [orderNumber, setOrderNumber] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInvoice = async () => {
    if (!orderNumber.trim()) {
      setError("Enter an order number to load invoice data.");
      return;
    }

    setLoading(true);
    setError("");
    setInvoiceItems([]);

    try {
      const items = await getInvoice(orderNumber.trim());
      if (!Array.isArray(items) || items.length === 0) {
        setError("No invoice data found for this order.");
      } else {
        setInvoiceItems(items);
      }
    } catch {
      setError("Failed to load invoice data.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = invoiceItems.reduce((sum, item) => {
    const amount = Number(
      item.Amount ?? item.TotalAmount ?? item.AmountDue ?? 0,
    );
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const invoiceFields = invoiceItems[0] ? Object.keys(invoiceItems[0]) : [];

  return (
    <div className="page invoice-page">
      <h1>Generate Invoice</h1>
      <div className="invoice-search-row">
        <input
          value={orderNumber}
          placeholder="Order number"
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={loadInvoice} disabled={loading}>
          {loading ? "Loading..." : "Load invoice"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {invoiceItems.length > 0 && (
        <section className="invoice-result">
          <h2>Invoice for {orderNumber}</h2>
          <table>
            <thead>
              <tr>
                {invoiceFields.map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceItems.map((item, index) => (
                <tr key={index}>
                  {invoiceFields.map((field) => (
                    <td key={field}>{String(item[field] ?? "-")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="invoice-summary">
            <strong>Approx. total:</strong> {subtotal.toFixed(2)}
          </div>
        </section>
      )}
    </div>
  );
}

export default Invoice;
