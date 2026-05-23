import { useEffect, useState } from "react";
import {
  getProducts,
  getLookupData,
  saveProduct,
} from "../services/zillinieApi";

function ProductEdit() {
  const [products, setProducts] = useState<any[]>([]);
  const [lookupData, setLookupData] = useState({
    productTypes: [] as any[],
    units: [] as any[],
  });
  const [selected, setSelected] = useState<any | null>(null);
  const [form, setForm] = useState({
    ProductID: 0,
    SubcategoryID: 0,
    ProductName: "",
    Unit: "",
    PurchaseRate: "",
    SaleRate: "",
    NewStock: "",
    Remarks: "",
  });

  useEffect(() => {
    (async () => {
      const [productList, lookupResult] = await Promise.all([
        getProducts(),
        getLookupData(),
      ]);
      setProducts(productList ?? []);
      setLookupData({
        productTypes: lookupResult.productTypes ?? [],
        units: lookupResult.units ?? [],
      });
    })();
  }, []);

  const pick = (p: any) => {
    setSelected(p);
    setForm({
      ProductID: Number(p.ProductID ?? p.Id ?? 0),
      SubcategoryID: Number(
        p.SubcategoryID ?? p.ProductTypeId ?? p.ProductType ?? 0,
      ),
      ProductName: p.ProductName ?? p.Name ?? "",
      Unit: p.Unit ?? p.UnitName ?? "",
      PurchaseRate: String(p.PurchaseRate ?? p.PurchaseRate ?? ""),
      SaleRate: String(p.SaleRate ?? p.SaleRate ?? ""),
      NewStock: String(p.NewStock ?? p.Stock ?? 0),
      Remarks: p.Remarks ?? "",
    });
  };

  const save = async () => {
    try {
      await saveProduct({
        ProductID: Number(form.ProductID),
        SubcategoryID: Number(form.SubcategoryID),
        ProductName: form.ProductName,
        Unit: form.Unit,
        PurchaseRate: Number(form.PurchaseRate),
        SaleRate: Number(form.SaleRate),
        NewStock: Number(form.NewStock) || 0,
        Remarks: form.Remarks,
      });
      alert("Saved product.");
      const updated = await getProducts();
      setProducts(updated ?? []);
    } catch (e) {
      console.error(e);
      alert("Failed to save product");
    }
  };

  return (
    <div className="page product-edit">
      <h1>Product Edit</h1>
      <div className="field-group">
        <label>Products</label>
        <select onChange={(e) => pick(products[Number(e.target.value)])}>
          <option value="">--select--</option>
          {products.map((p, i) => (
            <option key={i} value={i}>
              {p.ProductName ?? p.Name ?? p.ProductName}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div>
          <div className="field-group">
            <label>Product type</label>
            <select
              value={form.SubcategoryID}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  SubcategoryID: Number(e.target.value),
                }))
              }
            >
              <option value={0}>Select type</option>
              {lookupData.productTypes.map((type) => (
                <option
                  key={type.ProductTypeId ?? type.ProductId ?? type.Id}
                  value={type.ProductTypeId ?? type.ProductId ?? type.Id}
                >
                  {type.ProductType ?? type.ProductName ?? type.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label>Name</label>
            <input
              value={form.ProductName}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  ProductName: e.target.value,
                }))
              }
            />
          </div>
          <div className="field-group">
            <label>Unit</label>
            <select
              value={form.Unit}
              onChange={(e) =>
                setForm((current) => ({ ...current, Unit: e.target.value }))
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
              value={form.PurchaseRate}
              onChange={(e) =>
                setForm((current) => ({
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
              value={form.SaleRate}
              onChange={(e) =>
                setForm((current) => ({ ...current, SaleRate: e.target.value }))
              }
            />
          </div>
          <div className="field-group">
            <label>Stock</label>
            <input
              type="number"
              value={form.NewStock}
              onChange={(e) =>
                setForm((current) => ({ ...current, NewStock: e.target.value }))
              }
            />
          </div>
          <div className="field-group full-width">
            <label>Remarks</label>
            <textarea
              value={form.Remarks}
              onChange={(e) =>
                setForm((current) => ({ ...current, Remarks: e.target.value }))
              }
              rows={3}
            />
          </div>
          <button onClick={save}>Save</button>
        </div>
      )}
    </div>
  );
}

export default ProductEdit;
