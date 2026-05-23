import { useEffect, useState } from "react";
import {
  getStockUsageList,
  getProducts,
  getLookupData,
  deductStock,
  saveProduct,
} from "../services/zillinieApi";

interface StockRecord {
  ProductID: number;
  ProductName: string;
  CurrentStock: number;
  Unit: string;
  Remarks?: string;
}

interface Product {
  ProductID: number;
  ProductName: string;
}

export default function StockUsage() {
  const [stocks, setStocks] = useState<StockRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [lookups, setLookups] = useState<any>(null);
  const [view, setView] = useState<"list" | "deduct" | "add">("list");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Deduct stock form
  const [deductForm, setDeductForm] = useState({
    productId: "",
    usedQuantity: "",
    orderNumber: "",
    remark: "",
  });

  // Add stock form
  const [addForm, setAddForm] = useState({
    categoryId: "",
    subcategoryId: "",
    unitId: "",
    productName: "",
    purchaseRate: "",
    saleRate: "",
    totalStock: "",
    remarks: "",
  });

  useEffect(() => {
    loadList();
    getProducts().then(setProducts);
    getLookupData().then(setLookups);
  }, []);

  async function loadList() {
    setLoading(true);
    try {
      const data = await getStockUsageList();
      setStocks(data);
    } finally {
      setLoading(false);
    }
  }

  const filtered = stocks.filter((s) =>
    s.ProductName?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDeduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      await deductStock(
        Number(deductForm.productId),
        Number(deductForm.usedQuantity),
        deductForm.orderNumber
      );
      setMessage("Stock deducted successfully.");
      setDeductForm({ productId: "", usedQuantity: "", orderNumber: "", remark: "" });
      setView("list");
      loadList();
    } catch {
      setMessage("Failed to deduct stock.");
    }
  }

  async function handleAddStock(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveProduct({
        SubcategoryID: Number(addForm.subcategoryId),
        ProductName: addForm.productName,
        Unit: addForm.unitId,
        PurchaseRate: Number(addForm.purchaseRate),
        SaleRate: Number(addForm.saleRate),
        NewStock: Number(addForm.totalStock),
        Remarks: addForm.remarks,
        ProductID: 0,
        dbQrPath: "",
      });
      setMessage("Product added with stock successfully.");
      setAddForm({ categoryId: "", subcategoryId: "", unitId: "", productName: "", purchaseRate: "", saleRate: "", totalStock: "", remarks: "" });
      setView("list");
      loadList();
    } catch {
      setMessage("Failed to add product.");
    }
  }

  const subcategories = lookups?.subcategories ?? lookups?.categories ?? [];
  const units = lookups?.units ?? [];

  return (
    <div>
      <h2>Stock Usage Details</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {view === "list" && (
        <>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={() => { setView("deduct"); setMessage(""); }}>Use Stock</button>
            <button onClick={() => { setView("add"); setMessage(""); }}>Add New Product</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Unit</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center" }}>No records found.</td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.ProductID}>
                      <td>{s.ProductID}</td>
                      <td>{s.ProductName}</td>
                      <td>{s.CurrentStock}</td>
                      <td>{s.Unit}</td>
                      <td>{s.Remarks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {view === "deduct" && (
        <form onSubmit={handleDeduct} style={{ maxWidth: 400 }}>
          <h3>Use / Deduct Stock</h3>
          <div>
            <label>Product</label>
            <select
              required
              value={deductForm.productId}
              onChange={(e) => setDeductForm({ ...deductForm, productId: e.target.value })}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Used Quantity</label>
            <input
              type="number"
              required
              value={deductForm.usedQuantity}
              onChange={(e) => setDeductForm({ ...deductForm, usedQuantity: e.target.value })}
            />
          </div>
          <div>
            <label>Order Number</label>
            <input
              type="text"
              required
              value={deductForm.orderNumber}
              onChange={(e) => setDeductForm({ ...deductForm, orderNumber: e.target.value })}
            />
          </div>
          <div>
            <label>Remark</label>
            <input
              type="text"
              value={deductForm.remark}
              onChange={(e) => setDeductForm({ ...deductForm, remark: e.target.value })}
            />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setView("list")}>Back</button>
          </div>
        </form>
      )}

      {view === "add" && (
        <form onSubmit={handleAddStock} style={{ maxWidth: 400 }}>
          <h3>Add New Product to Stock</h3>
          <div>
            <label>Category</label>
            <select
              required
              value={addForm.categoryId}
              onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value, subcategoryId: "" })}
            >
              <option value="">-- Select Category --</option>
              {(lookups?.categories ?? []).map((c: any) => (
                <option key={c.CategoryId ?? c.CategoryID} value={c.CategoryId ?? c.CategoryID}>
                  {c.CategoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Subcategory</label>
            <select
              required
              value={addForm.subcategoryId}
              onChange={(e) => setAddForm({ ...addForm, subcategoryId: e.target.value })}
            >
              <option value="">-- Select Subcategory --</option>
              {(lookups?.subcategories ?? subcategories).map((s: any) => (
                <option key={s.SubcategoryId ?? s.SubcategoryID} value={s.SubcategoryId ?? s.SubcategoryID}>
                  {s.SubcategoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Product Name</label>
            <input required value={addForm.productName} onChange={(e) => setAddForm({ ...addForm, productName: e.target.value })} />
          </div>
          <div>
            <label>Unit</label>
            <select required value={addForm.unitId} onChange={(e) => setAddForm({ ...addForm, unitId: e.target.value })}>
              <option value="">-- Select Unit --</option>
              {units.map((u: any) => (
                <option key={u.UnitId ?? u.UnitID} value={u.UnitId ?? u.UnitID}>{u.UnitName ?? u.Unit}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Purchase Rate</label>
            <input type="number" required value={addForm.purchaseRate} onChange={(e) => setAddForm({ ...addForm, purchaseRate: e.target.value })} />
          </div>
          <div>
            <label>Sale Rate</label>
            <input type="number" required value={addForm.saleRate} onChange={(e) => setAddForm({ ...addForm, saleRate: e.target.value })} />
          </div>
          <div>
            <label>Total Stock</label>
            <input type="number" required value={addForm.totalStock} onChange={(e) => setAddForm({ ...addForm, totalStock: e.target.value })} />
          </div>
          <div>
            <label>Remarks</label>
            <input value={addForm.remarks} onChange={(e) => setAddForm({ ...addForm, remarks: e.target.value })} />
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setView("list")}>Back</button>
          </div>
        </form>
      )}
    </div>
  );
}
