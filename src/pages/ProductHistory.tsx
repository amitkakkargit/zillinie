import { useState } from "react";
import { getProductsByOrderNumber, getProductHistory } from "../services/zillinieApi";

interface ProductRow {
  ProductId: string;
  ProductName: string;
  OrderNumber: string;
}

interface HistoryRow {
  StatusName: string;
  UpdatedAt: string;
  Remarks: string;
}

export default function ProductHistory() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [searching, setSearching] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    setHistory([]);
    setSelectedProduct(null);
    setError("");
    try {
      const data = await getProductsByOrderNumber(search.trim());
      setProducts(data);
      if (data.length === 0) setError("No products found for this order number.");
    } catch {
      setError("Failed to search products.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSelectProduct(product: ProductRow) {
    setSelectedProduct(product);
    setLoadingHistory(true);
    setError("");
    try {
      const data = await getProductHistory(product.ProductId);
      setHistory(data);
    } catch {
      setError("Failed to load product history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  return (
    <div>
      <h2>Product History</h2>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Search by order number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.length > 0 && !selectedProduct && (
        <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Order Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.ProductId}>
                <td>{p.ProductId}</td>
                <td>{p.ProductName}</td>
                <td>{p.OrderNumber}</td>
                <td>
                  <button onClick={() => handleSelectProduct(p)}>View History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedProduct && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <button onClick={() => { setSelectedProduct(null); setHistory([]); }}>← Back to list</button>
            <strong>History for: {selectedProduct.ProductName}</strong>
          </div>

          {loadingHistory ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No history records found.</p>
          ) : (
            <div style={{ position: "relative", paddingLeft: "2rem" }}>
              <div style={{ position: "absolute", left: "0.75rem", top: 0, bottom: 0, width: 2, background: "#ccc" }} />
              {history.map((h, i) => (
                <div key={i} style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <div style={{
                    position: "absolute", left: "-1.65rem", top: 4,
                    width: 14, height: 14, borderRadius: "50%",
                    background: i === history.length - 1 ? "#4caf50" : "#2196f3",
                    border: "2px solid white", boxShadow: "0 0 0 2px #ccc"
                  }} />
                  <div style={{ background: "#f5f5f5", padding: "0.5rem 0.75rem", borderRadius: 4 }}>
                    <strong>{h.StatusName}</strong>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {new Date(h.UpdatedAt).toLocaleString()}
                    </div>
                    {h.Remarks && <div style={{ marginTop: 2 }}>{h.Remarks}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
