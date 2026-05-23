import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getInvoice } from "../services/zillinieApi";

function Print2() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const normalizeRows = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];
    return [];
  };

  useEffect(() => {
    const orderParam = searchParams.get("orderNumber");
    if (orderParam) {
      setOrderNumber(orderParam);
      void loadReceipt(orderParam);
    }
  }, [searchParams]);

  const loadReceipt = async (overrideOrderNumber?: string) => {
    const orderToLoad = overrideOrderNumber ?? orderNumber;
    if (!orderToLoad.trim()) {
      setError("Enter an order number to load receipt.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const items = normalizeRows(await getInvoice(orderToLoad.trim()));
      if (items.length === 0) {
        setInvoiceItems([]);
        setError("No receipt data found for this order.");
      } else {
        setInvoiceItems(items);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load receipt data.");
    } finally {
      setLoading(false);
    }
  };

  const doPrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "_blank", "width=700,height=800");
    if (!w) return;
    w.document.write("<!doctype html><html><head><title>Receipt</title>");
    w.document.write(
      `<style>body{font-family:sans-serif;padding:20px}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px dashed #ccc;padding:4px;text-align:left}h1,h2{margin:0 0 10px 0}</style>`,
    );
    w.document.write("</head><body>");
    w.document.write(printRef.current.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  };

  const headers = useMemo(
    () => (invoiceItems[0] ? Object.keys(invoiceItems[0]) : []),
    [invoiceItems],
  );

  const totalAmount = useMemo(
    () =>
      invoiceItems.reduce((sum, item) => {
        const amount = Number(
          item.UnitPrice ?? item.Amount ?? item.TotalAmount ?? item.Price ?? 0,
        );
        const qty = Number(item.Quantity ?? item.Qty ?? 1);
        return sum + (Number.isFinite(amount * qty) ? amount * qty : 0);
      }, 0),
    [invoiceItems],
  );

  const customerName =
    invoiceItems[0]?.CustomerName || invoiceItems[0]?.Customer || "";
  const orderDate =
    invoiceItems[0]?.OrderDate || invoiceItems[0]?.CreatedDate || "";

  return (
    <div className="page print-page">
      <h1>Receipt Print Preview</h1>
      <div className="field-group">
        <label>Order number</label>
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number"
        />
        <button onClick={() => void loadReceipt()} disabled={loading}>
          {loading ? "Loading..." : "Load Receipt"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {invoiceItems.length > 0 && (
        <>
          <div ref={printRef}>
            <h2>Receipt {orderNumber}</h2>
            {customerName && <p>Customer: {customerName}</p>}
            {orderDate && <p>Date: {orderDate}</p>}
            <table>
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={index}>
                    {headers.map((header) => (
                      <td key={header}>{String(item[header] ?? "-")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              <strong>Total:</strong> {totalAmount.toFixed(2)}
            </p>
          </div>
          <button onClick={doPrint}>Print Receipt</button>
        </>
      )}
    </div>
  );
}

export default Print2;
