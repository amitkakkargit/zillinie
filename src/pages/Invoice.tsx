import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getInvoice } from "../services/zillinieApi";

function Invoice() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeRows = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];
    return [];
  };

  useEffect(() => {
    const orderParam = searchParams.get("orderNumber");
    if (orderParam) {
      setOrderNumber(orderParam);
      void loadInvoice(orderParam);
    }
  }, [searchParams]);

  const loadInvoice = async (overrideOrderNumber?: string) => {
    const orderToLoad = overrideOrderNumber ?? orderNumber;
    if (!orderToLoad.trim()) {
      setError("Enter an order number to load invoice data.");
      return;
    }

    setLoading(true);
    setError("");
    setInvoiceItems([]);

    try {
      const items = normalizeRows(await getInvoice(orderToLoad.trim()));
      if (items.length === 0) {
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

  const invoiceFields = useMemo(
    () => (invoiceItems[0] ? Object.keys(invoiceItems[0]) : []),
    [invoiceItems],
  );

  const subtotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => {
      const quantity = Number(
        item.Quantity ?? item.Qty ?? item.QuantitySold ?? 1,
      );
      const price = Number(
        item.UnitPrice ?? item.Price ?? item.Amount ?? item.TotalAmount ?? 0,
      );
      const lineTotal = Number.isFinite(quantity * price)
        ? quantity * price
        : 0;
      return sum + lineTotal;
    }, 0);
  }, [invoiceItems]);

  const invoiceTitle = invoiceItems[0]?.OrderNumber ?? orderNumber;
  const customerName =
    invoiceItems[0]?.CustomerName || invoiceItems[0]?.Customer || "";
  const orderDate =
    invoiceItems[0]?.OrderDate || invoiceItems[0]?.CreatedDate || "";

  return (
    <div className="page invoice-page">
      <h1>Generate Invoice</h1>
      <div className="invoice-search-row">
        <input
          value={orderNumber}
          placeholder="Order number"
          onChange={(e) => setOrderNumber(e.target.value)}
        />
        <button onClick={() => void loadInvoice()} disabled={loading}>
          {loading ? "Loading..." : "Load invoice"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {invoiceItems.length > 0 && (
        <section className="invoice-result">
          <div className="invoice-header">
            <h2>Invoice {invoiceTitle}</h2>
            {customerName && <p>Customer: {customerName}</p>}
            {orderDate && <p>Date: {orderDate}</p>}
            <p>
              <strong>Lines:</strong> {invoiceItems.length}
            </p>
          </div>
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
