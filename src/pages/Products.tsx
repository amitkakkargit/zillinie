import { useEffect, useState } from "react";
import {
  getProducts,
  getProductStock,
  getLookupData,
  saveProduct,
  updateProductStock,
} from "../services/zillinieApi";

interface Product {
  ProductID: number;
  ProductName: string;
  Unit: string;
  PurchaseRate: number;
  SaleRate: number;
  CurrentStock?: number;
}

interface LookupData {
  productTypes: any[];
  units: any[];
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lookupData, setLookupData] = useState<LookupData>({
    productTypes: [],
    units: [],
  });
  const [selectedStock, setSelectedStock] = useState<any[]>([]);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    SubcategoryID: 0,
    ProductName: "",
    Unit: "",
    PurchaseRate: "",
    SaleRate: "",
    NewStock: "",
    Remarks: "",
  });
  const [useStockForm, setUseStockForm] = useState({
    UsedQuantity: "",
    OrderNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stockUpdating, setStockUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getProducts(), getLookupData()])
      .then(([productList, lookupResult]) => {
        setProducts(productList);
        setLookupData({
          productTypes: lookupResult.productTypes ?? [],
          units: lookupResult.units ?? [],
        });
      })
      .catch(() => setError("Could not load products or lookup data."))
      .finally(() => setLoading(false));
  }, []);

  const viewStock = async (product: Product) => {
    setSelectedProduct(product);
    setSelectedStock([]);
    setSelectedProductName(product.ProductName);
    try {
      const stock = await getProductStock(product.ProductID);
      setSelectedStock(stock);
    } catch {
      setError("Could not load stock details.");
    }
  };

  const saveNewProduct = async () => {
    setError("");
    setMessage("");

    if (
      !newProduct.ProductName ||
      !newProduct.Unit ||
      !newProduct.PurchaseRate ||
      !newProduct.SaleRate
    ) {
      setError(
        "Product name, unit, purchase rate, and sale rate are required.",
      );
      return;
    }

    setSaving(true);
    try {
      await saveProduct({
        SubcategoryID: Number(newProduct.SubcategoryID) || 0,
        ProductName: newProduct.ProductName,
        Unit: newProduct.Unit,
        PurchaseRate: Number(newProduct.PurchaseRate),
        SaleRate: Number(newProduct.SaleRate),
        NewStock: Number(newProduct.NewStock) || 0,
        Remarks: newProduct.Remarks,
      });
      setMessage("Product saved successfully.");
      setNewProduct({
        SubcategoryID: 0,
        ProductName: "",
        Unit: "",
        PurchaseRate: "",
        SaleRate: "",
        NewStock: "",
        Remarks: "",
      });
      await loadProducts();
    } catch {
      setError("Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const submitUseStock = async () => {
    if (!selectedProduct) {
      setError("Select a product before using stock.");
      return;
    }
    if (!useStockForm.UsedQuantity || !useStockForm.OrderNumber) {
      setError("Used quantity and order number are required.");
      return;
    }

    setStockUpdating(true);
    setError("");
    setMessage("");
    try {
      await updateProductStock(
        selectedProduct.ProductID,
        Number(useStockForm.UsedQuantity),
        useStockForm.OrderNumber,
      );
      setMessage("Stock updated successfully.");
      setUseStockForm({ UsedQuantity: "", OrderNumber: "" });
      if (selectedProduct) {
        await viewStock(selectedProduct);
      }
      await loadProducts();
    } catch {
      setError("Unable to update stock.");
    } finally {
      setStockUpdating(false);
    }
  };

  return (
    <div className="page products-page">
      <h1>Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Purchase</th>
            <th>Sale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.ProductID}>
              <td>{product.ProductID}</td>
              <td>{product.ProductName}</td>
              <td>{product.Unit}</td>
              <td>{product.PurchaseRate}</td>
              <td>{product.SaleRate}</td>
              <td>
                <button onClick={() => viewStock(product)}>View stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="product-add-section">
        <h2>Add new stock item</h2>
        <div className="form-grid">
          <div className="field-group">
            <label>Product type</label>
            <select
              value={newProduct.SubcategoryID}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  SubcategoryID: Number(e.target.value),
                }))
              }
            >
              <option value={0}>Select product type</option>
              {lookupData.productTypes.map((item) => (
                <option
                  key={item.ProductId ?? item.Id ?? item.ProductTypeId}
                  value={item.ProductId ?? item.Id ?? item.ProductTypeId}
                >
                  {item.ProductName ?? item.Name ?? item.ProductType}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Product name</label>
            <input
              value={newProduct.ProductName}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  ProductName: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-group">
            <label>Unit</label>
            <select
              value={newProduct.Unit}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  Unit: e.target.value,
                }))
              }
            >
              <option value="">Select unit</option>
              {lookupData.units.map((unit) => (
                <option
                  key={unit.UnitId ?? unit.Id}
                  value={unit.UnitName ?? unit.Name ?? unit.Unit}
                >
                  {unit.UnitName ?? unit.Name ?? unit.Unit}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Purchase rate</label>
            <input
              type="number"
              min="0"
              value={newProduct.PurchaseRate}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  PurchaseRate: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-group">
            <label>Sale rate</label>
            <input
              type="number"
              min="0"
              value={newProduct.SaleRate}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  SaleRate: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-group">
            <label>Initial stock</label>
            <input
              type="number"
              min="0"
              value={newProduct.NewStock}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  NewStock: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-group full-width">
            <label>Remarks</label>
            <textarea
              value={newProduct.Remarks}
              onChange={(e) =>
                setNewProduct((current) => ({
                  ...current,
                  Remarks: e.target.value,
                }))
              }
              rows={2}
            />
          </div>
        </div>
        <button type="button" onClick={saveNewProduct} disabled={saving}>
          {saving ? "Saving product..." : "Save product"}
        </button>
      </section>

      {selectedProduct && (
        <section className="stock-update-section">
          <h2>Use stock for {selectedProduct.ProductName}</h2>
          <div className="form-grid">
            <div className="field-group">
              <label>Used quantity</label>
              <input
                type="number"
                min="1"
                value={useStockForm.UsedQuantity}
                onChange={(e) =>
                  setUseStockForm((current) => ({
                    ...current,
                    UsedQuantity: e.target.value,
                  }))
                }
              />
            </div>
            <div className="field-group">
              <label>Order number</label>
              <input
                value={useStockForm.OrderNumber}
                onChange={(e) =>
                  setUseStockForm((current) => ({
                    ...current,
                    OrderNumber: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            onClick={submitUseStock}
            disabled={stockUpdating}
          >
            {stockUpdating ? "Updating stock..." : "Update stock"}
          </button>
        </section>
      )}

      {selectedStock.length > 0 && (
        <section className="stock-details">
          <h2>Stock details for {selectedProductName}</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(selectedStock[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedStock.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((value, valueIndex) => (
                    <td key={valueIndex}>{String(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Products;
